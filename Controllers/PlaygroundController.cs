using Microsoft.AspNetCore.Mvc;
using MyPage.Services;

namespace MyPage.Controllers
{
    public class PlaygroundController : Controller
    {
        private readonly ILogger<PlaygroundController> _logger;
        private readonly IUnityGameService _unityGameService;

        public PlaygroundController(ILogger<PlaygroundController> logger, IUnityGameService unityGameService)
        {
            _logger = logger;
            _unityGameService = unityGameService;
        }

        public IActionResult Index()
        {
            var games = _unityGameService.GetAllGames();
            return View(games);
        }

        public IActionResult UnityGame(string gameName)
        {
            var gameConfig = _unityGameService.GetGameByName(gameName);
            
            if (gameConfig == null)
            {
                _logger.LogWarning($"Game '{gameName}' not found");
                return NotFound($"Game '{gameName}' not found");
            }

            return View(gameConfig);
        }
    }
}
