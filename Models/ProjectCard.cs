namespace MyPage.Models
{
    public class ProjectCard
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string GradientColors { get; set; } = string.Empty;
        public List<string> Technologies { get; set; } = new();
        public string LiveUrl { get; set; } = "#";
        public string GitHubUrl { get; set; } = "#";
        public string BadgeColor { get; set; } = "primary";
    }
}