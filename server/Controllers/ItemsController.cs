using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TodoApi;
using TodoApi.DTOs;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ItemsController : ControllerBase
{
    private readonly ToDoDbContext _db;

    public ItemsController(ToDoDbContext db)
    {
        _db = db;
    }

    // Helper function לשליפת UserId מה-Token
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) 
                       ?? User.FindFirst("userId");
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        
        return userId;
    }

    // GET: api/items - שליפת כל המשימות של המשתמש המחובר
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Item>>> GetItems()
    {
        var userId = GetUserId();
        var items = await _db.Items.Where(i => i.UserId == userId).ToListAsync();
        return Ok(items);
    }

    // GET: api/items/{id} - שליפת משימה בודדת
    [HttpGet("{id}")]
    public async Task<ActionResult<Item>> GetItem(int id)
    {
        var userId = GetUserId();
        var item = await _db.Items.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        
        if (item is null)
        {
            return NotFound();
        }
        
        return Ok(item);
    }

    // POST: api/items - הוספת משימה חדשה
    [HttpPost]
    public async Task<ActionResult<Item>> CreateItem(CreateItemDto createDto)
    {
        var userId = GetUserId();
        
        var item = new Item
        {
            Name = createDto.Name,
            IsComplete = createDto.IsComplete,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        _db.Items.Add(item);
        await _db.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
    }

    // PUT: api/items/{id} - עדכון משימה
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItem(int id, UpdateItemDto updateDto)
    {
        var userId = GetUserId();
        var item = await _db.Items.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        
        if (item is null)
        {
            return NotFound();
        }
        
        if (!string.IsNullOrEmpty(updateDto.Name))
        {
            item.Name = updateDto.Name;
        }
        
        item.IsComplete = updateDto.IsComplete;
        item.UpdatedAt = DateTime.UtcNow;
        
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/items/{id} - מחיקת משימה
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var userId = GetUserId();
        var item = await _db.Items.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        
        if (item is null)
        {
            return NotFound();
        }
        
        _db.Items.Remove(item);
        await _db.SaveChangesAsync();
        
        return NoContent();
    }
}
