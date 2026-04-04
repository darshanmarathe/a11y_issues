using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using TodoApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString;
        // Handle circular references
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Configure SQLite Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=todos.db"));

// Enable file logging to _logs.txt
var logFilePath = Path.Combine(AppContext.BaseDirectory, "_logs.txt");
builder.Logging.ClearProviders();
builder.Logging.AddProvider(new FileLoggerProvider(logFilePath));
builder.Logging.SetMinimumLevel(LogLevel.Debug);

var app = builder.Build();

// Request logging middleware
app.Use(async (context, next) =>
{
    var logger = app.Services.CreateScope().ServiceProvider.GetRequiredService<ILogger<Program>>();
    logger.LogInformation(">>> REQUEST: {Method} {Path}", context.Request.Method, context.Request.Path);
    
    if (context.Request.Method == "POST" || context.Request.Method == "PUT")
    {
        context.Request.EnableBuffering();
        using var reader = new StreamReader(context.Request.Body, leaveOpen: true);
        var body = await reader.ReadToEndAsync();
        context.Request.Body.Position = 0;
        logger.LogInformation(">>> REQUEST BODY: {Body}", body);
    }
    
    try
    {
        await next(context);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, ">>> UNHANDLED EXCEPTION: {Message}", ex.Message);
        throw;
    }
    
    logger.LogInformation("<<< RESPONSE: {StatusCode}", context.Response.StatusCode);
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Logger.LogInformation("========================================");
app.Logger.LogInformation("  Todo App Starting on {Url}", "http://localhost:5000");
app.Logger.LogInformation("  Logs writing to: {LogPath}", logFilePath);
app.Logger.LogInformation("========================================");

app.Run();

// Simple File Logger
public class FileLoggerProvider : ILoggerProvider
{
    private readonly string _logFilePath;

    public FileLoggerProvider(string logFilePath)
    {
        _logFilePath = logFilePath;
    }

    public ILogger CreateLogger(string categoryName)
    {
        return new FileLogger(_logFilePath);
    }

    public void Dispose() { }
}

public class FileLogger : ILogger
{
    private readonly string _logFilePath;
    private static readonly object _lock = new object();

    public FileLogger(string logFilePath)
    {
        _logFilePath = logFilePath;
    }

    public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

    public bool IsEnabled(LogLevel logLevel) => true;

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        var message = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] [{logLevel}] {formatter(state, exception)}";
        
        lock (_lock)
        {
            File.AppendAllText(_logFilePath, message + Environment.NewLine);
        }
    }
}
