import Map from "https://js.arcgis.com/4.33/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.33/@arcgis/core/views/MapView.js";
import Graphic from "https://js.arcgis.com/4.33/@arcgis/core/Graphic.js";
import Circle from "https://js.arcgis.com/4.33/@arcgis/core/geometry/Circle.js";
import * as geometryEngine from "https://js.arcgis.com/4.33/@arcgis/core/geometry/geometryEngine.js"; 
import Point from "https://js.arcgis.com/4.33/@arcgis/core/geometry/Point.js";
import Polyline from "https://js.arcgis.com/4.33/@arcgis/core/geometry/Polyline.js";



    // Main function to initialize the map and trigger all behaviors
    async function initMap() {
        
    const dubaiCenter = new Point({
        longitude: 55.296249,
    latitude: 25.276987,
    spatialReference: {wkid: 4326 }
            });




    const map = new Map({basemap: "streets-navigation-vector" });

    const view = new MapView({
        container: "mapDiv",
    map: map,
    center: dubaiCenter,
    zoom: 11,
    constraints: {
        snapToZoom: false
            }
        });

    const AppContext = {
        dubaiCenter,
        Circle,
        circle: null,
    view,
    geometryEngine,
    Point,
    Graphic,
    Polyline
            };

    AppContext.circle = addCircle(AppContext);
    handleSubmit(AppContext);
        getAllPointsAndRender(AppContext);

    }

    // Draws a circle on the map centered at the given point
    function addCircle(context) {
       const circle = new context.Circle({
        center: context.dubaiCenter,
    radius: 10,
    radiusUnit: "kilometers"
        });

    const circleSymbol = {
        type: "simple-fill",
    color: [150, 150, 255, 0.2],
    outline: {color: [0, 0, 255], width: 2 }
        };

    const graphic = new context.Graphic({
        geometry: circle,
    symbol: circleSymbol
        });

    context.view.graphics.add(graphic);
    return circle;
    }

    // Handles form submission, validates point, and sends it to the API
    function handleSubmit(context) {
        const form = document.getElementById("pointForm");

        form.addEventListener("submit", async function  (e) {
        e.preventDefault();

    const name = document.getElementById("name").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const msg = document.getElementById("message");

    const newPoint = new context.Point({
    latitude: lat,
    longitude: lng,
    spatialReference: {wkid: 4326 }
            });

    const isInside = context.geometryEngine.contains(context.circle, newPoint);
    //if (!isInside) {
    //    msg.textContent = "Point is outside the allowed circle. Please enter a valid point.";
    //    msg.classList.remove("text-success");
    //    msg.classList.add("text-danger");

    //return;
    //        }

    const data = {
        PointName: name,
        Latitude: lat,
        Longitude: lng
        };

        try {

            const response = await fetch("https://localhost:7237/api/Point", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            let resultText = await response.text();  // ← بنقرأه كنص

            if (!response.ok) {
                throw new Error(resultText); // ← ما نحاول نحولها لـ JSON إذا كانت Error
            }

            const result = JSON.parse(resultText); // ← إذا نجحت نحولها لـ JSON
            if (!response.ok) {
                throw new Error(result.messages); // trigger catch below
            }
            
            await getAllPointsAndRender(context);

            msg.textContent = result.message;
            msg.classList.remove("text-danger");
            msg.classList.add("text-success");

            form.reset();
        }
            catch (error) {
                let message = error.message;
                try {
                    const errorObj = JSON.parse(error.message);
                    if (errorObj.messages) {
                        message = errorObj.messages.join("<br>");
                    }
                } catch { }

                msg.innerHTML = message;
                msg.classList.remove("text-success");
                msg.classList.add("text-danger");
            }


        });
    }

    // Fetch all points from the API and render them on the map
    async function getAllPointsAndRender(context) {
    try {
        const response = await fetch("https://localhost:7237/api/Point");
        const points = await response.json();

        // Remove old points (except the circle)
        context.view.graphics.items
            .filter(g => g.geometry.type === "point")
            .forEach(g => context.view.graphics.remove(g));

        // Add each point
        points.forEach(p => {
            addPoint(p, context);
        });
    } catch (error) {
        console.error("Failed to fetch points:", error);
    }
}


    // Add a single point and draw its distance line
    function addPoint(p, context) {
        const pt = new context.Point({
        longitude: p.longitude,
    latitude: p.latitude,
    spatialReference: {wkid: 4326 }
        });

    const line = new context.Polyline({
        paths: [[[context.dubaiCenter.longitude, context.dubaiCenter.latitude], [pt.longitude, pt.latitude]]],
    spatialReference: {wkid: 4326 }
        });

    const distance = context.geometryEngine.geodesicLength(line, "kilometers");

    const marker = new context.Graphic({
        geometry: pt,
    symbol: {
        type: "simple-marker",
    color: "green"
            },
    attributes: {
        name: p.pointName
            },
    popupTemplate: {
        title: "{name}",
    content: `
    Latitude: ${p.latitude}<br>
        Longitude: ${p.longitude}<br>
            Distance from Dubai center: ${distance?.toFixed(2)} km
            `
            }
        });

            context.view.graphics.add(marker);
    }
// Run the main initialization function
initMap();
