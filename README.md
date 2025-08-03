# GISMapApp

A simple GIS web application built with **ASP.NET Core MVC** and **ArcGIS Maps SDK for JavaScript**.  
It allows users to submit and visualize geographic points within a 10km radius of Dubai.  
The frontend is rendered using **Razor Views** (`.cshtml`), and the map uses ArcGIS JS SDK.


---

## 📌 Features

- 🗺️ Interactive map centered on Dubai (25.276987, 55.296249)
- 🟢 Draws a 10 km radius circle on the map
- 🧾 Form to submit new points (name, latitude, longitude)
- ✅ Validates points to ensure they fall within the circle (frontend + backend)
- 📍 Displays submitted points on the map with popup showing:
  - Point name
  - Coordinates
  - Distance from center

---

## 🛠️ Technologies Used

- ASP.NET Core MVC (API Controllers)
- ArcGIS Maps SDK for JavaScript (v4.33)
- HTML / Bootstrap 5
- Vanilla JavaScript
- In-memory storage (no database used)
- Dependency Injection 
- Postman (for API testing)


---

## 🚀 How to Run the Application

### 🔹 Backend (ASP.NET Core API)

1. Make sure you have **.NET 6 SDK or later** installed.
2. Open the solution (`GISMapApp.sln`) in Visual Studio or run from terminal:

```bash
dotnet run
```

3. Once the application is running, open the browser at the address shown in the terminal 
or let Visual Studio open it automatically (e.g., `https://localhost:5001/`).


---

## 📬 API Endpoints

### `GET /api/Point`
Returns all saved points as JSON.

### `POST /api/Point`
Accepts a new point in JSON format. Validates input and whether the point is within the 10km circle.

#### Example request:
```json
{
  "pointName": "Sample Location",
  "latitude": 25.278,
  "longitude": 55.292
}
```

#### Possible error response:
```json
{
  "messages": [
    "Latitude must be between -90 and 90",
    "Point is outside the allowed circle."
  ]
}
```

---

## 📁 Project Structure

```
GISMapApp/
├── Controllers/ --> API Controller (PointController)
├── DTOs/ --> PointDto with validation attributes
├── Models/ --> Point class
├── Services/ --> Business logic (distance, validation)
├── Views/ --> Razor views (Index.cshtml, Layout, Shared)
├── wwwroot/ --> Static assets (JavaScript, CSS, favicon)
│ └── js/
│ ├── script.js
│ └── site.js
├── Program.cs
├── appsettings.json
└── README.md
```

---



## ⚠️ Known Limitations

- Data is stored in memory only — restarting the app will clear all saved points.
- No database or persistent storage is used.
- No user authentication or access control is implemented.
- Only supports geographic points within the Dubai area (10km radius).

---

## 📄 Task Source

This project was developed as part of the hiring process for a Developer position at **GIS Software House**.

---

## 👨‍💻 Author

**Omar Sarhan**  
Email: [omar.kh.sarhan@gmail.com]  
GitHub: [https://github.com/omar-sarhan](https://github.com/omar-sarhan)