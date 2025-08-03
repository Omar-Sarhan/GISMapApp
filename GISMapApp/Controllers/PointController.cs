using GISMapApp.DTOs;
using GISMapApp.Models;
using GISMapApp.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GISMapApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PointController : ControllerBase
    {
        private readonly IPointService _pointService;
        private const double CenterLat = 25.276987;
        private const double CenterLng = 55.296249;
        public PointController(IPointService pointService)
        {
            _pointService = pointService;
        }

        [HttpGet]
        public IActionResult GetPoints()
        {
            
            var points =  _pointService.GetAllPoints();

            return Ok(points);
        }

        [HttpPost]
        public IActionResult AddPoint([FromBody] PointDto pointDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                
                return BadRequest(new { messages = errors });
            }

            var point = new Point
            {
                PointName = pointDto.PointName,
                Latitude = pointDto.Latitude.Value,
                Longitude = pointDto.Longitude.Value
            };

            if (!_pointService.IsPointInsideCircle(point.Latitude, point.Longitude))
            {
                return BadRequest("Point is outside the allowed circle. Please enter a valid point.");
            }
            _pointService.AddPoint(point);
            return Created("",new { message = "Point added successfully" });
        }
    }
}
