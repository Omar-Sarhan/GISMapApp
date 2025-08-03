using GISMapApp.Models;

namespace GISMapApp.Services
{
    public interface IPointService
    {
        List<Point> GetAllPoints();

        void AddPoint(Point point);

        
        bool IsPointInsideCircle(double pointLat, double pointLng, double radiusKm = 10);
        double CalculateDistance(double lat1, double lon1, double lat2, double lon2);
        

    }
}
