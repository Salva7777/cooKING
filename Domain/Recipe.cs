using System;

namespace Domain
{
    public class Recipe
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Difficulty { get; set; }
        public TimeSpan Duration { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}