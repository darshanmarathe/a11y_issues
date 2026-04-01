using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Models;

namespace TodoApp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TodosController(ApplicationDbContext context)
    {
        _context = context;
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
    public async Task<IActionResult> PutTodo(int id, Todo todo)
    {
        if (id != todo.Id)
        {
            return BadRequest();
        }

        todo.ModifiedDate = DateTime.Now;
        _context.Entry(todo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TodoExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return Ok(todo);
    }

    // POST: api/Todos
    [HttpPost]
    public async Task<ActionResult<Todo>> PostTodo(Todo todo)
    {
        todo.CreatedDate = DateTime.Now;
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTodo", new { id = todo.Id }, todo);
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

    private bool TodoExists(int id)
    {
        return _context.Todos.Any(e => e.Id == id);
    }
}

public class StatusUpdateDto
{
    public string Status { get; set; } = string.Empty;
}
