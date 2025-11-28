using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs;

public class CreateItemDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    public bool IsComplete { get; set; } = false;
}