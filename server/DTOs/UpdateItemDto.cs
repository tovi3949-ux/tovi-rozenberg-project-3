using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs;

public class UpdateItemDto
{
    [StringLength(100)]
    public string? Name { get; set; }

    public bool IsComplete { get; set; }
}