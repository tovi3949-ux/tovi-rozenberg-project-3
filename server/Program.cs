using Microsoft.EntityFrameworkCore;
using TodoApi;
using TodoApi.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// הגדרת URLs - תומך ב-development ו-production
var port = Environment.GetEnvironmentVariable("PORT") ?? "5006";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

// הגדרת JSON serialization עם camelCase
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

// הוספת Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Add database context
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("ToDoDB"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("ToDoDB"))
    )
);

const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// הוספת שירותי CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          // הוספת כתובות מותרות ספציפיות
                          var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
                              ?? new[] { "http://localhost:3000", "https://localhost:3000" };
                          
                          policy
                              .WithOrigins(allowedOrigins)
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                       });
});

// Add JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

// מיפוי Controllers (עבור AuthController)
app.MapControllers();

// ⭐ Helper function לשליפת UserId מה-Token ⭐
int GetUserId(HttpContext context)
{
    // נסה למצוא את ה-UserId בכל האפשרויות
    var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier) 
                   ?? context.User.FindFirst("sub") 
                   ?? context.User.FindFirst("nameid");
    
    if (userIdClaim == null)
    {
        // Debug: להדפיס את כל ה-Claims
        var claims = string.Join(", ", context.User.Claims.Select(c => $"{c.Type}={c.Value}"));
        Console.WriteLine($"Available claims: {claims}");
        throw new UnauthorizedAccessException("User ID claim not found");
    }
    
    if (!int.TryParse(userIdClaim.Value, out var userId))
    {
        throw new UnauthorizedAccessException($"Invalid user ID format: {userIdClaim.Value}");
    }
    
    return userId;
}

// GET: שליפת משימות של המשתמש המחובר בלבד
app.MapGet("/items", async (HttpContext context, ToDoDbContext db) =>
{
    var userId = GetUserId(context);
    return await db.Items.Where(i => i.UserId == userId).ToListAsync();
}).RequireAuthorization();

// GET: שליפת משימה בודדת - רק אם שייכת למשתמש
app.MapGet("/items/{id}", async (int id, HttpContext context, ToDoDbContext db) =>
{
    var userId = GetUserId(context);
    var item = await db.Items.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
    
    if (item is null)
    {
        return Results.NotFound();
    }
    
    return Results.Ok(item);
}).RequireAuthorization();

// ⭐ POST: הוספת משימה חדשה - עם DTO ⭐
app.MapPost("/items", async (CreateItemDto createDto, HttpContext context, ToDoDbContext db) =>
{
    var userId = GetUserId(context);
    
    var item = new Item
    {
        Name = createDto.Name,
        IsComplete = createDto.IsComplete,
        UserId = userId
    };
    
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{item.Id}", item);
}).RequireAuthorization();

// ⭐ PUT: עדכון משימה - עם DTO ⭐
app.MapPut("/items/{id}", async (int id, UpdateItemDto updateDto, HttpContext context, ToDoDbContext db) =>
{
    var userId = GetUserId(context);
    var item = await db.Items.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
    
    if (item is null)
    {
        return Results.NotFound();
    }
    
    // עדכון שם רק אם הוא לא ריק
    if (!string.IsNullOrEmpty(updateDto.Name))
    {
        item.Name = updateDto.Name;
    }
    
    // עדכון סטטוס תמיד
    item.IsComplete = updateDto.IsComplete;
    
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

// DELETE: מחיקת משימה - רק אם שייכת למשתמש
app.MapDelete("/items/{id}", async (int id, HttpContext context, ToDoDbContext db) =>
{
    var userId = GetUserId(context);
    var item = await db.Items.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
    
    if (item is null)
    {
        return Results.NotFound();
    }
    
    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.Run();