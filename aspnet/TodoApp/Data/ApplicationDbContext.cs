using Microsoft.EntityFrameworkCore;
using TodoApp.Models;

namespace TodoApp.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Todo> Todos { get; set; } = null!;
    public DbSet<Project> Projects { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure Todo entity
        modelBuilder.Entity<Todo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasDefaultValue("Backlog");
            entity.Property(e => e.Priority).HasDefaultValue("Medium");
            entity.Property(e => e.IsCompleted).HasDefaultValue(false);
        });
        
        // Configure Project entity
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });
        
        // Configure relationship
        modelBuilder.Entity<Todo>()
            .HasOne(t => t.Project)
            .WithMany(p => p.Todos)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
