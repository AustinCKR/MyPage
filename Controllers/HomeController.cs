using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MyPage.Models;

namespace MyPage.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult AboutMe()
        {
            return View();
        }

        public IActionResult Projects()
        {
            return View();
        }

        public IActionResult Credits()
        {
            return View();
        }

        public IActionResult Playground(string gameName)
        {
            string iframeSrc = gameName switch
            {
                "FrogParkour" => "https://play.unity.com/api/v1/games/game/4ca09c5f-4fc7-41ac-aacc-52cd827ab6ae/build/latest/frame",
                _ => null // Default case for unknown game names
            };

            if (string.IsNullOrEmpty(iframeSrc))
            {
                // Return a view with the error message
                ViewData["Title"] = "Game Not Found";
                ViewData["GameName"] = gameName;
                return View("GameNotFound");
            }

            ViewData["IframeSrc"] = iframeSrc;
            ViewData["Title"] = $"Playground - {gameName}";
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
