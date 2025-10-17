using Microsoft.AspNetCore.Mvc;

namespace BackendProject.Controllers
{
    public class ProjectController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
