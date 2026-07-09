namespace Exam.API.Models;

public class CareerData
{
    public List<Cluster> Clusters { get; set; } = new();
    public List<Factor> Factors { get; set; } = new();
    public List<Question> Questions { get; set; } = new();
    public List<CareerProfile> CareerDNA { get; set; } = new();
}

public class Cluster
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
}

public class Factor
{
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
}

public class Question
{
    public string Id { get; set; } = "";
    public string Text { get; set; } = "";
    public string Factor { get; set; } = "";
    public bool Reverse { get; set; }
}

public class CareerProfile
{
    public string ClusterId { get; set; } = "";
    public string ClusterName { get; set; } = "";
    public string Profession { get; set; } = "";
    public Dictionary<string, double> Weights { get; set; } = new();
}
