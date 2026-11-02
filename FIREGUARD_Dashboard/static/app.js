let map;
let marker;

function initMap() {
  // Initial center is only a placeholder; it moves to the GPS coordinates.
  map = L.map("map").setView([21.1458, 79.0882], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  marker = L.marker([21.1458, 79.0882]).addTo(map)
    .bindPopup("<b>FIREGUARD</b><br>Waiting for GPS data...");
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function updateDashboard(data) {
  setText("temperature", data.temperature ?? "--");
  setText("humidity", data.humidity ?? "--");
  setText("smoke", data.smoke ?? "--");
  setText("latitude", data.latitude ?? "--");
  setText("longitude", data.longitude ?? "--");
  setText("updated", data.updated ?? "--");

  const lat = Number(data.latitude);
  const lon = Number(data.longitude);

  if (Number.isFinite(lat) && Number.isFinite(lon) &&
      lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {

    marker.setLatLng([lat, lon]);
    marker.setPopupContent(
      `<b>🔥 FIREGUARD NODE</b><br>Latitude: ${lat}<br>Longitude: ${lon}`
    );
    map.setView([lat, lon], 15);
    document.getElementById("mapStatus").textContent = "GPS FIX OK";

    const mapsUrl =
      `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    document.getElementById("googleMaps").href = mapsUrl;
  } else {
    document.getElementById("mapStatus").textContent = "GPS unavailable";
  }

  const fire = Boolean(data.fire);
  const fireCard = document.getElementById("fireCard");
  const fireStatus = document.getElementById("fireStatus");
  const alertBox = document.getElementById("alertBox");

  if (fire) {
    fireCard.classList.remove("safe");
    fireCard.classList.add("danger");
    fireStatus.textContent = "🔥 FIRE DETECTED";
    alertBox.classList.remove("hidden");
  } else {
    fireCard.classList.remove("danger");
    fireCard.classList.add("safe");
    fireStatus.textContent = "SAFE";
    alertBox.classList.add("hidden");
  }
}

async function fetchData() {
  try {
    const response = await fetch("/api/data", { cache: "no-store" });
    if (!response.ok) throw new Error("Server error");
    const data = await response.json();

    updateDashboard(data);

    const connection = document.getElementById("connection");
    connection.textContent = "● SYSTEM ONLINE";
    connection.className = "status online";
  } catch (error) {
    const connection = document.getElementById("connection");
    connection.textContent = "● SERVER OFFLINE";
    connection.className = "status offline";
  }
}

window.addEventListener("load", () => {
  initMap();
  fetchData();
  setInterval(fetchData, 2000);
});
