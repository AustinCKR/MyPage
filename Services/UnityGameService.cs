using MyPage.Models;

namespace MyPage.Services
{
    public interface IUnityGameService
    {
        List<UnityGameConfig> GetAllGames();
        UnityGameConfig? GetGameByName(string gameName);
    }

    public class UnityGameService : IUnityGameService
    {
        // In a real application, this could come from a database or configuration file
        private readonly List<UnityGameConfig> _games = new()
        {
            new UnityGameConfig
            {
                GameName = "MyProject",
                DisplayName = "MyProject",
                Description = "A simple parkour game",
                BuildBaseName = "MyProject",
                CompanyName = "DefaultCompany",
                ProductVersion = "1.0.0",
                CompressionFormat = "br",
                CanvasWidth = 1280,
                CanvasHeight = 720,
                IsActive = true
            }
        };

        public List<UnityGameConfig> GetAllGames()
        {
            return _games.Where(g => g.IsActive).ToList();
        }

        public UnityGameConfig? GetGameByName(string gameName)
        {
            return _games.FirstOrDefault(g => 
                g.GameName.Equals(gameName, StringComparison.OrdinalIgnoreCase) && 
                g.IsActive);
        }
    }
}