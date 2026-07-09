using System.Text.Json;
using Exam.API.Models;

namespace Exam.API.Services;

public class CareerDataStore
{
    public CareerData Data { get; }

    public CareerDataStore(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "Data", "careerdata.json");
        var json = File.ReadAllText(path);
        Data = JsonSerializer.Deserialize<CareerData>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? throw new InvalidOperationException("Could not load careerdata.json");
    }
}
