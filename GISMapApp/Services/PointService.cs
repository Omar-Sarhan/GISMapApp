using GISMapApp.Models;

namespace GISMapApp.Services
{
    public class PointService:IPointService
    {
        private static List<Point> points = new List<Point>();
        private const double centerLat = 25.276987;
        private const double centerLng = 55.296249;
        public List<Point> GetAllPoints()
        {
            return points;
        }

        public void AddPoint(Point point)
        {
            points.Add(point);
        }

       
           public bool IsPointInsideCircle(double pointLat, double pointLng, double radiusKm = 10)
            {
                double distance = CalculateDistance(centerLat, centerLng, pointLat, pointLng);
                return distance <= radiusKm;
            }
        //Using Haversine Formula
        public double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
            {
                const double R = 6371;
                double dLat = DegreesToRadians(lat2 - lat1);
                double dLon = DegreesToRadians(lon2 - lon1);

                double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                           Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                           Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

                double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
                return R * c;
            }

            private double DegreesToRadians(double deg) => deg * (Math.PI / 180);
        

    }
}
