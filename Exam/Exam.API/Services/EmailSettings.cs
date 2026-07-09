namespace Exam.API.Services;

public class EmailSettings
{
    /// <summary>Recipient that receives every student's result.</summary>
    public string Recipient { get; set; } = "rezijikhvadze@gmail.com";

    // HTTP email providers (work on hosts that block outbound SMTP, e.g. Render).
    // Set ONE of these; Resend takes priority, then Brevo, then SMTP.
    public string ResendApiKey { get; set; } = "";
    public string BrevoApiKey { get; set; } = "";

    // SMTP (used only locally / on hosts that allow outbound SMTP).
    public string SmtpHost { get; set; } = "";
    public int SmtpPort { get; set; } = 587;
    public bool UseSsl { get; set; } = true;
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string FromAddress { get; set; } = "";
    public string FromName { get; set; } = "Future Navigator";
}
