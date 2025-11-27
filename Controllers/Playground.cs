using Microsoft.AspNetCore.Mvc;

namespace MyPage.Controllers
{
    public class Playground : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
