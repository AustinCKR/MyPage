using Microsoft.AspNetCore.Mvc;

namespace MyPage.Models
{
    public class UnityGameConfig 
    {
        public string GameName { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string BuildBaseName { get; set; } = "WebGLBuilds";
        public string CompanyName { get; set; } = "DefaultCompany";
        public string ProductVersion { get; set; } = "1.0.0";
        public int CanvasWidth { get; set; } = 960;
        public int CanvasHeight { get; set; } = 600;
        public bool IsActive { get; set; } = true;
    }
}
