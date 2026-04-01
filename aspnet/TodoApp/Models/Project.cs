using System.ComponentModel.DataAnnotations;

namespace TodoApp.Models;

public class Project
{
    public int Id { get; set; }
    
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    
    public bool IsActive { get; set; } = true;
    
    // Navigation property
    public List<Todo>? Todos { get; set; }
}
