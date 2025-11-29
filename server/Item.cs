using System;
using System.Collections.Generic;

namespace TodoApi;

public partial class Item
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool IsComplete { get; set; }
    
    public int UserId { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public DateTime UpdatedAt { get; set; }
    
    // Navigation property
    public virtual User User { get; set; } = null!;
}