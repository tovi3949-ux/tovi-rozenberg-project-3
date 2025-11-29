using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TodoApi;

public partial class ToDoDbContext : DbContext
{
    public ToDoDbContext(DbContextOptions<ToDoDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Item> Items { get; set; }
    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        // הגדרת Items
        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("items");
            
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsRequired();
                
            entity.Property(e => e.IsComplete)
                .HasDefaultValue(false);
                
            entity.Property(e => e.UserId)
                .IsRequired();
                
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
                
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();
            
            // הגדרת Foreign Key
            entity.HasOne(d => d.User)
                .WithMany(p => p.Items)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_items_users");
                
            // Indexes
            entity.HasIndex(e => e.UserId).HasDatabaseName("idx_userid");
            entity.HasIndex(e => e.IsComplete).HasDatabaseName("idx_iscomplete");
        });

        // הגדרת Users
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("users");
            
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .IsRequired();
                
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsRequired();
                
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            // Unique index על Username
            entity.HasIndex(e => e.Username)
                .IsUnique()
                .HasDatabaseName("idx_username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}