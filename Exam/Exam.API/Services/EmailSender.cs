using System.Net;
using System.Net.Mail;
using System.Text;
using Exam.API.Models;
using Microsoft.Extensions.Options;

namespace Exam.API.Services;

public class EmailSender
{
    private readonly EmailSettings _settings;
    private readonly ILogger<EmailSender> _logger;
    private readonly IWebHostEnvironment _env;

    public EmailSender(IOptions<EmailSettings> settings, ILogger<EmailSender> logger, IWebHostEnvironment env)
    {
        _settings = settings.Value;
        _logger = logger;
        _env = env;
    }

    public async Task SendResultAsync(ResultResponse result)
    {
        string subject = $"Future Navigator შედეგი – {result.FirstName} {result.LastName}";
        string body = BuildHtml(result);

        // If SMTP is not configured, fall back to writing the email to disk so nothing breaks.
        if (string.IsNullOrWhiteSpace(_settings.SmtpHost))
        {
            await SaveToFileAsync(result, subject, body);
            _logger.LogWarning("SMTP not configured. Result email saved to disk instead of being sent.");
            return;
        }

        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(
                    string.IsNullOrWhiteSpace(_settings.FromAddress) ? _settings.Username : _settings.FromAddress,
                    _settings.FromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };
            message.To.Add(_settings.Recipient);
            if (!string.IsNullOrWhiteSpace(result.Email))
                message.ReplyToList.Add(new MailAddress(result.Email));

            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                EnableSsl = _settings.UseSsl,
                Credentials = new NetworkCredential(_settings.Username, _settings.Password),
                Timeout = 20000
            };
            await client.SendMailAsync(message);
            _logger.LogInformation("Result email sent to {Recipient}", _settings.Recipient);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email; saving to disk as fallback.");
            await SaveToFileAsync(result, subject, body);
        }
    }

    /// <summary>Attempts a send and returns the real outcome (for diagnostics).</summary>
    public async Task<string> TrySendAsync(ResultResponse result)
    {
        if (string.IsNullOrWhiteSpace(_settings.SmtpHost))
            return "SMTP not configured (SmtpHost empty).";
        try
        {
            string subject = $"Future Navigator TEST – {result.FirstName} {result.LastName}";
            string body = BuildHtml(result);
            using var message = new MailMessage
            {
                From = new MailAddress(
                    string.IsNullOrWhiteSpace(_settings.FromAddress) ? _settings.Username : _settings.FromAddress,
                    _settings.FromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };
            message.To.Add(_settings.Recipient);
            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                EnableSsl = _settings.UseSsl,
                Credentials = new NetworkCredential(_settings.Username, _settings.Password),
                Timeout = 20000
            };
            await client.SendMailAsync(message);
            return $"OK: sent to {_settings.Recipient}";
        }
        catch (Exception ex)
        {
            return "ERROR: " + ex.GetType().Name + " - " + ex.Message +
                   (ex.InnerException != null ? " | inner: " + ex.InnerException.Message : "");
        }
    }

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
