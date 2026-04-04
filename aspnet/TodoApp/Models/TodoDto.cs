using System.Text.Json;

namespace TodoApp.Models;

public class TodoDto
{
    public int? Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; } = "Backlog";
    public string? Priority { get; set; } = "Medium";
    public string? TargetCompletionDate { get; set; }
    public string? User { get; set; }
    public string? Link { get; set; }
    // Accept any type for projectId (int, string, or null from jqxComboBox)
    public JsonElement? ProjectId { get; set; }
    
    public int? GetProjectIdAsInt()
    {
        if (!ProjectId.HasValue) return null;
        
        var elem = ProjectId.Value;
        if (elem.ValueKind == JsonValueKind.Null) return null;
        if (elem.ValueKind == JsonValueKind.Number) return elem.GetInt32();
        if (elem.ValueKind == JsonValueKind.String)
        {
            var str = elem.GetString();
            if (int.TryParse(str, out int val)) return val;
            return null;
        }
        return null;
    }
    
    public override string ToString()
    {
        var pid = GetProjectIdAsInt()?.ToString() ?? "(null)";
        return $"Title={Title ?? "(null)"}, Description={Description ?? "(null)"}, Status={Status ?? "(null)"}, Priority={Priority ?? "(null)"}, User={User ?? "(null)"}, Link={Link ?? "(null)"}, ProjectId={pid}, TargetCompletionDate={TargetCompletionDate ?? "(null)"}";
    }
}
