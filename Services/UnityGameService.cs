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
                GameName = "Test",
                DisplayName = "Test Game",
                Description = "A test Unity WebGL game",
                BuildBaseName = "WebGLBuilds",
                CompanyName = "DefaultCompany",
                ProductVersion = "1.0.0",
                CanvasWidth = 960,
                CanvasHeight = 600,
                IsActive = true
            },
            new UnityGameConfig
            {
                GameName = "PokemonSurvivor",
                DisplayName = "Pokemon Survivor",
                Description = "A rogue-like game inspired by Vampire Survivor",
                BuildBaseName = "WebGLBuilds",
                CompanyName = "DefaultCompany",
                ProductVersion = "1.0.0",
                CanvasWidth = 1280,
                CanvasHeight = 720,
                IsActive = true
            }
            // Add more games here as you upload them
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