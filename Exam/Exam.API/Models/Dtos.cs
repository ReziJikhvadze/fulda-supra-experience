namespace Exam.API.Models;

public class SubmitRequest
{
    public string Email { get; set; } = "";
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    // Key = question id (e.g. "Q001"), Value = answer on 1-5 scale
    public Dictionary<string, int> Answers { get; set; } = new();
}

public class CareerMatch
{
    public string Profession { get; set; } = "";
    public string ClusterId { get; set; } = "";
    public string ClusterName { get; set; } = "";
    public double Score { get; set; }
}

public class FactorScore
{
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public double Score { get; set; }
}

public class ResultResponse
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public string PrimaryClusterId { get; set; } = "";
    public string PrimaryClusterName { get; set; } = "";
    public List<CareerMatch> Top3 { get; set; } = new();
    public List<CareerMatch> AllMatches { get; set; } = new();
    public List<FactorScore> FactorScores { get; set; } = new();
}
