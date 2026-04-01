using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TodoApp.Models;

public class Todo
{
    public int Id { get; set; }
    
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    public DateTime? CompletionDate { get; set; }
    
    [Required, StringLength(50)]
    public string Status { get; set; } = "Backlog"; // Backlog/Linedup/Wip/Done/Stuck
    
    public DateTime? TargetCompletionDate { get; set; }
    
    public bool IsCompleted { get; set; } = false;
    
    [StringLength(500)]
    public string? Link { get; set; }
    
    [Required, StringLength(50)]
    public string Priority { get; set; } = "Medium"; // Urgent/High/Medium/Low
    
    [StringLength(100)]
    public string? User { get; set; }
    
    public int? ProjectId { get; set; }
    
    [ForeignKey("ProjectId")]
    public Project? Project { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    
    public DateTime? ModifiedDate { get; set; }
}
