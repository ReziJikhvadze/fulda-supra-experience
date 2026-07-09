using Exam.API.Models;

namespace Exam.API.Services;

/// <summary>
/// Reproduces the Future Navigator Excel model:
///  - FactorScore = average of the 5 answers for that factor, on a 1-5 scale, mapped to 0-100 (answer * 20).
///  - MatchScore(profession) = sum(weight_factor * factorScore_factor) / 100  (weights per profession sum to 100).
///  - Results = Top 3 professions by match score; primary cluster = cluster of the Top 1 profession.
/// </summary>
public class ScoringService
{
    private readonly CareerData _data;

    public ScoringService(CareerDataStore store)
    {
        _data = store.Data;
    }

    public ResultResponse Calculate(SubmitRequest request)
    {
        // 1. Factor scores (0-100)
        var factorScores = new Dictionary<string, double>();
        foreach (var factor in _data.Factors)
        {
            var qs = _data.Questions.Where(q => q.Factor == factor.Code).ToList();
            if (qs.Count == 0) { factorScores[factor.Code] = 0; continue; }

            double sum = 0;
            foreach (var q in qs)
            {
                request.Answers.TryGetValue(q.Id, out int ans);
                if (ans < 1) ans = 1;
                if (ans > 5) ans = 5;
                if (q.Reverse) ans = 6 - ans; // reverse-scored items
                sum += ans;
            }
            double avg = sum / qs.Count;      // 1..5
            factorScores[factor.Code] = avg * 20.0; // 0..100
        }

        // 2. Match score per profession
        var matches = new List<CareerMatch>();
        foreach (var career in _data.CareerDNA)
        {
            double weighted = 0;
            foreach (var w in career.Weights)
            {
                factorScores.TryGetValue(w.Key, out double fs);
                weighted += w.Value * fs;
            }
            matches.Add(new CareerMatch
            {
                Profession = career.Profession,
                ClusterId = career.ClusterId,
                ClusterName = career.ClusterName,
                Score = Math.Round(weighted / 100.0, 2)
            });
        }

        var ordered = matches
            .OrderByDescending(m => m.Score)
            .ThenBy(m => m.Profession, StringComparer.Ordinal)
            .ToList();

        var top3 = ordered.Take(3).ToList();
        var primary = top3.FirstOrDefault();

        return new ResultResponse
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PrimaryClusterId = primary?.ClusterId ?? "",
            PrimaryClusterName = primary?.ClusterName ?? "",
            Top3 = top3,
            AllMatches = ordered,
            FactorScores = _data.Factors.Select(f => new FactorScore
            {
                Code = f.Code,
                Name = f.Name,
                Score = Math.Round(factorScores.TryGetValue(f.Code, out var s) ? s : 0, 1)
            }).ToList()
        };
    }
}
