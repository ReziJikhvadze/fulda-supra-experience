using System.Net;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using Exam.API.Models;
using Microsoft.Extensions.Options;

namespace Exam.API.Services;

public class EmailSender
{
    private readonly EmailSettings _settings;
    private readonly ILogger<EmailSender> _logger;
    private readonly IWebHostEnvironment _env;
    private readonly IHttpClientFactory _httpFactory;

    public EmailSender(IOptions<EmailSettings> settings, ILogger<EmailSender> logger,
        IWebHostEnvironment env, IHttpClientFactory httpFactory)
    {
        _settings = settings.Value;
        _logger = logger;
        _env = env;
        _httpFactory = httpFactory;
    }

    public async Task SendResultAsync(ResultResponse result)
    {
        string subject = $"Future Navigator შედეგი – {result.FirstName} {result.LastName}";
        string body = BuildHtml(result);

        var outcome = await SendCoreAsync(subject, body, result.Email);
        if (outcome.StartsWith("OK", StringComparison.Ordinal))
        {
            _logger.LogInformation("Result email {Outcome}", outcome);
        }
        else
        {
            _logger.LogWarning("Email not sent ({Outcome}); saving to disk as fallback.", outcome);
            await SaveToFileAsync(result, subject, body);
        }
    }

    /// <summary>Attempts a send and returns the real outcome (for the /api/testemail diagnostic).</summary>
    public async Task<string> TrySendAsync(ResultResponse result)
    {
        string subject = $"Future Navigator TEST – {result.FirstName} {result.LastName}";
        string body = BuildHtml(result);
        return await SendCoreAsync(subject, body, result.Email);
    }

    /// <summary>
    /// Picks the first configured provider. HTTP APIs (Resend/Brevo) work on hosts like Render
    /// that block outbound SMTP ports; SMTP is kept as a local fallback.
    /// </summary>
    private async Task<string> SendCoreAsync(string subject, string html, string? replyTo)
    {
        if (!string.IsNullOrWhiteSpace(_settings.ResendApiKey))
            return await SendResendAsync(subject, html, replyTo);
        if (!string.IsNullOrWhiteSpace(_settings.BrevoApiKey))
            return await SendBrevoAsync(subject, html, replyTo);
        if (!string.IsNullOrWhiteSpace(_settings.SmtpHost))
            return await SendSmtpAsync(subject, html, replyTo);
        return "NO_PROVIDER: no email provider configured (set ResendApiKey, BrevoApiKey, or SmtpHost).";
    }

    private async Task<string> SendResendAsync(string subject, string html, string? replyTo)
    {
        try
        {
            // In Resend test mode (no verified domain), 'from' must be onboarding@resend.dev
            // and 'to' must be the email you registered your Resend account with.
            var from = string.IsNullOrWhiteSpace(_settings.FromAddress) ? "onboarding@resend.dev" : _settings.FromAddress;
            var payload = new Dictionary<string, object?>
            {
                ["from"] = $"{_settings.FromName} <{from}>",
                ["to"] = new[] { _settings.Recipient },
                ["subject"] = subject,
                ["html"] = html
            };
            if (!string.IsNullOrWhiteSpace(replyTo)) payload["reply_to"] = replyTo;

            using var client = _httpFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(20);
            using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ResendApiKey);
            req.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var resp = await client.SendAsync(req);
            var respBody = await resp.Content.ReadAsStringAsync();
            return resp.IsSuccessStatusCode
                ? $"OK: Resend accepted (to {_settings.Recipient})"
                : $"ERROR: Resend HTTP {(int)resp.StatusCode} - {Trim(respBody)}";
        }
        catch (Exception ex)
        {
            return "ERROR: Resend " + ex.Message;
        }
    }

    private async Task<string> SendBrevoAsync(string subject, string html, string? replyTo)
    {
        try
        {
            var from = string.IsNullOrWhiteSpace(_settings.FromAddress) ? _settings.Username : _settings.FromAddress;
            var payload = new Dictionary<string, object?>
            {
                ["sender"] = new { name = _settings.FromName, email = from },
                ["to"] = new[] { new { email = _settings.Recipient } },
                ["subject"] = subject,
                ["htmlContent"] = html
            };
            if (!string.IsNullOrWhiteSpace(replyTo)) payload["replyTo"] = new { email = replyTo };

            using var client = _httpFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(20);
            using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
            req.Headers.Add("api-key", _settings.BrevoApiKey);
            req.Headers.Add("accept", "application/json");
            req.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var resp = await client.SendAsync(req);
            var respBody = await resp.Content.ReadAsStringAsync();
            return resp.IsSuccessStatusCode
                ? $"OK: Brevo accepted (to {_settings.Recipient})"
                : $"ERROR: Brevo HTTP {(int)resp.StatusCode} - {Trim(respBody)}";
        }
        catch (Exception ex)
        {
            return "ERROR: Brevo " + ex.Message;
        }
    }

    private async Task<string> SendSmtpAsync(string subject, string html, string? replyTo)
    {
        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(
                    string.IsNullOrWhiteSpace(_settings.FromAddress) ? _settings.Username : _settings.FromAddress,
                    _settings.FromName),
                Subject = subject,
                Body = html,
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };
            message.To.Add(_settings.Recipient);
            if (!string.IsNullOrWhiteSpace(replyTo))
                message.ReplyToList.Add(new MailAddress(replyTo));

            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                EnableSsl = _settings.UseSsl,
                Credentials = new NetworkCredential(_settings.Username, _settings.Password),
                Timeout = 20000
            };
            await client.SendMailAsync(message);
            return $"OK: SMTP sent (to {_settings.Recipient})";
        }
        catch (Exception ex)
        {
            return "ERROR: SMTP " + ex.GetType().Name + " - " + ex.Message +
                   (ex.InnerException != null ? " | inner: " + ex.InnerException.Message : "");
        }
    }

    private static string Trim(string s) => s.Length > 400 ? s[..400] : s;

    private async Task SaveToFileAsync(ResultResponse result, string subject, string body)
    {
        var dir = Path.Combine(_env.ContentRootPath, "sent-emails");
        Directory.CreateDirectory(dir);
        var safeName = $"{DateTime.Now:yyyyMMdd_HHmmss}_{result.FirstName}_{result.LastName}".Replace(" ", "_");
        var file = Path.Combine(dir, safeName + ".html");
        var content = $"<!-- To: {_settings.Recipient} | Subject: {subject} -->\n{body}";
        await File.WriteAllTextAsync(file, content, Encoding.UTF8);
    }

    private static string BuildHtml(ResultResponse r)
    {
        var sb = new StringBuilder();
        sb.Append("<div style='font-family:Segoe UI,Arial,sans-serif;color:#222'>");
        sb.Append($"<h2>Future Navigator – კარიერული შედეგი</h2>");
        sb.Append($"<p><b>სახელი:</b> {WebUtility.HtmlEncode(r.FirstName)} {WebUtility.HtmlEncode(r.LastName)}<br>");
        sb.Append($"<b>ელ. ფოსტა:</b> {WebUtility.HtmlEncode(r.Email)}</p>");
        sb.Append($"<p><b>ძირითადი მიმართულება (კლასტერი):</b> {WebUtility.HtmlEncode(r.PrimaryClusterName)} ({r.PrimaryClusterId})</p>");

        sb.Append("<h3>TOP 3 პროფესია</h3><ol>");
        foreach (var m in r.Top3)
            sb.Append($"<li><b>{WebUtility.HtmlEncode(m.Profession)}</b> — {m.Score}% <span style='color:#888'>({WebUtility.HtmlEncode(m.ClusterName)})</span></li>");
        sb.Append("</ol>");

        sb.Append("<h3>ფაქტორების ქულები</h3><table style='border-collapse:collapse'>");
        foreach (var f in r.FactorScores)
            sb.Append($"<tr><td style='padding:2px 10px'>{WebUtility.HtmlEncode(f.Name)} ({f.Code})</td><td style='padding:2px 10px'><b>{f.Score}</b></td></tr>");
        sb.Append("</table>");
        sb.Append("</div>");
        return sb.ToString();
    }
}
