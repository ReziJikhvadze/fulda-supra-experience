using Exam.API.Models;
using Exam.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddSingleton<CareerDataStore>();
builder.Services.AddSingleton<ScoringService>();
builder.Services.AddSingleton<EmailSender>();

var app = builder.Build();

// Load data eagerly so startup fails fast if the data file is missing.
_ = app.Services.GetRequiredService<CareerDataStore>();

app.UseDefaultFiles();

app.UseStaticFiles();

// Diagnostic: reports whether email config reached the app (no secret values exposed).
app.MapGet("/api/diag", (Microsoft.Extensions.Options.IOptions<EmailSettings> opt) =>
{
    var s = opt.Value;
    return Results.Ok(new
    {
        smtpHostSet = !string.IsNullOrWhiteSpace(s.SmtpHost),
        smtpHost = s.SmtpHost,
        smtpPort = s.SmtpPort,
        useSsl = s.UseSsl,
        usernameSet = !string.IsNullOrWhiteSpace(s.Username),
        passwordSet = !string.IsNullOrWhiteSpace(s.Password),
        passwordLength = s.Password?.Length ?? 0,
        passwordHasSpaces = (s.Password ?? "").Contains(' '),
        fromAddressSet = !string.IsNullOrWhiteSpace(s.FromAddress),
        recipient = s.Recipient
    });
});

// Diagnostic: actually attempts to send a test email and returns the real SMTP outcome.
app.MapGet("/api/testemail", async (EmailSender email) =>
{
    var dummy = new ResultResponse
    {
        FirstName = "Test",
        LastName = "Email",
        Email = "test@futurenavigator",
        PrimaryClusterId = "C01",
        PrimaryClusterName = "Technology & AI",
        Top3 = new List<CareerMatch>
        {
            new() { Profession = "Software Engineer", ClusterName = "Technology & AI", Score = 93.6 }
        }
    };
    var outcome = await email.TrySendAsync(dummy);
    return Results.Ok(new { outcome });
});

// Returns the questions (+ factors/clusters) for the quiz UI.
app.MapGet("/api/questions", (CareerDataStore store) => Results.Ok(new
{
    questions = store.Data.Questions,
    factors = store.Data.Factors,
    clusters = store.Data.Clusters
}));

// Accepts the filled quiz, computes the result, emails it and returns it to the UI.
app.MapPost("/api/submit", async (SubmitRequest request, ScoringService scoring, EmailSender email, CareerDataStore store) =>
{
    if (string.IsNullOrWhiteSpace(request.FirstName) ||
        string.IsNullOrWhiteSpace(request.LastName) ||
        string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(new { error = "გთხოვთ შეავსოთ სახელი, გვარი და ელ. ფოსტა." });
    }

    int total = store.Data.Questions.Count;
    int answered = store.Data.Questions.Count(q => request.Answers.ContainsKey(q.Id) && request.Answers[q.Id] >= 1);
    if (answered < total)
    {
        return Results.BadRequest(new { error = $"გთხოვთ უპასუხოთ ყველა კითხვას. პასუხგაცემულია {answered}/{total}." });
    }

    var result = scoring.Calculate(request);

    // Send the email in the background so the student gets results instantly,
    // regardless of how slow the SMTP server is. Errors are handled inside the sender.
    _ = Task.Run(() => email.SendResultAsync(result));

    return Results.Ok(result);
});

app.Run();
