using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using TodoApp.Data;
using TodoApp.Models;

namespace TodoApp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodosController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TodosController> _logger;

    public TodosController(ApplicationDbContext context, ILogger<TodosController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/Todos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
    {
        return await _context.Todos
            .Include(t => t.Project)
            .OrderByDescending(t => t.CreatedDate)
            .ToListAsync();
    }

    // GET: api/Todos/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Todo>> GetTodo(int id)
    {
        var todo = await _context.Todos
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (todo == null)
        {
            return NotFound();
        }

        return todo;
    }

    // GET: api/Todos/status/Wip
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<Todo>>> GetTodosByStatus(string status)
    {
        return await _context.Todos
            .Include(t => t.Project)
            .Where(t => t.Status == status)
            .ToListAsync();
    }

    // GET: api/Todos/project/5
    [HttpGet("project/{projectId}")]
    public async Task<ActionResult<IEnumerable<Todo>>> GetTodosByProject(int projectId)
    {
        return await _context.Todos
            .Include(t => t.Project)
            .Where(t => t.ProjectId == projectId)
            .ToListAsync();
    }

    // PUT: api/Todos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTodo(int id)
    {
        try
        {
            using var reader = new StreamReader(Request.Body);
            var json = await reader.ReadToEndAsync();
            _logger.LogInformation("PUT REQUEST: id={Id}, body={Body}", id, json);
            
            var dto = JsonSerializer.Deserialize<TodoDto>(json, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            
            if (dto == null)
            {
                return BadRequest("Invalid JSON");
            }
            
            _logger.LogInformation("DTO parsed: {Dto}", dto.ToString());
            
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            MapDtoToEntity(dto, todo);
            todo.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Todo {Id} updated successfully", id);
            return Ok(todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating todo {Id}", id);
            return BadRequest(ex.Message);
        }
    }

    // POST: api/Todos
    [HttpPost]
    public async Task<ActionResult<Todo>> PostTodo()
    {
        try
        {
            using var reader = new StreamReader(Request.Body);
            var json = await reader.ReadToEndAsync();
            _logger.LogInformation("POST REQUEST: body={Body}", json);
            
            var dto = JsonSerializer.Deserialize<TodoDto>(json, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            
            if (dto == null || string.IsNullOrEmpty(dto.Title))
            {
                return BadRequest("Title is required");
            }
            
            _logger.LogInformation("DTO parsed: {Dto}", dto.ToString());
            
            var todo = MapDtoToEntity(dto);
            todo.CreatedDate = DateTime.Now;
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Todo created with ID: {Id}", todo.Id);
            return CreatedAtAction("GetTodo", new { id = todo.Id }, todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating todo");
            return BadRequest(ex.Message);
        }
    }

    // DELETE: api/Todos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
        {
            return NotFound();
        }

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PATCH: api/Todos/5/status
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateTodoStatus(int id, [FromBody] StatusUpdateDto statusDto)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
        {
            return NotFound();
        }

        todo.Status = statusDto.Status;
        todo.ModifiedDate = DateTime.Now;

        if (statusDto.Status == "Done")
        {
            todo.IsCompleted = true;
            todo.CompletionDate = DateTime.Now;
        }

        await _context.SaveChangesAsync();

        return Ok(todo);
    }

    private Todo MapDtoToEntity(TodoDto dto, Todo? existingTodo = null)
    {
        var todo = existingTodo ?? new Todo();

        todo.Title = dto.Title ?? todo.Title ?? string.Empty;
        todo.Description = dto.Description;
        todo.Status = dto.Status ?? todo.Status ?? "Backlog";
        todo.Priority = dto.Priority ?? todo.Priority ?? "Medium";
        todo.User = dto.User;
        todo.Link = dto.Link;
        todo.IsCompleted = dto.Status == "Done" || todo.IsCompleted;

        // Handle target completion date
        if (!string.IsNullOrEmpty(dto.TargetCompletionDate))
        {
            todo.TargetCompletionDate = DateTime.Parse(dto.TargetCompletionDate);
        }
        else
        {
            todo.TargetCompletionDate = null;
        }

        // Handle projectId - use GetProjectIdAsInt() to handle int/string/null
        var parsedProjectId = dto.GetProjectIdAsInt();
        todo.ProjectId = parsedProjectId;

        // Set completion date if status is Done
        if (todo.Status == "Done" && !todo.CompletionDate.HasValue)
        {
            todo.CompletionDate = DateTime.Now;
        }

        return todo;
    }

    private bool TodoExists(int id)
    {
        return _context.Todos.Any(e => e.Id == id);
    }
}

public class StatusUpdateDto
{
    public string Status { get; set; } = string.Empty;
}
