import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl: iconShadow,
});

function _cleanupMap(containerId) {
  const mapElement = L.DomUtil.get(containerId);
  if (mapElement && mapElement._leaflet_id) {
    mapElement._leaflet_id = null;
  }
}

export const initStoryListMap = (containerId, stories) => {
  _cleanupMap(containerId);

  const map = L.map(containerId).setView([-2.548926, 118.0148634], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  const markers = [];
  stories.forEach((story) => {
    if (story.lat && story.lon) {
      const marker = L.marker([story.lat, story.lon]);

      const popupContent = `
        <div style="width: 200px; font-family: sans-serif;">
          <img src="${story.photoUrl}" alt="${
        story.name
      }" style="width: 100%; height: auto; object-fit: cover; border-radius: 4px;">
          <h4 style="margin: 8px 0 4px 0; font-size: 1rem;">${story.name}</h4>
          <p style="font-size: 0.8rem; margin: 0;">${story.description.substring(
            0,
            50
          )}...</p>
          <a href="#/detail/${
            story.id
          }" style="font-size: 0.8rem; color: #2563eb; margin-top: 5px; display: inline-block;">
            Lihat detail
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("mouseover", function () {
        this.openPopup();
      });
      marker.on("mouseout", function () {
        this.closePopup();
      });

      markers.push(marker);
      marker.addTo(map);
    }
  });

  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.5));
  }
};

export const initDetailMap = (containerId, story) => {
  const mapContainer = document.getElementById(containerId);

  if (!story.lat || !story.lon) {
    mapContainer.innerHTML = "<p>Lokasi tidak tersedia untuk story ini.</p>";
    return;
  }

  _cleanupMap(containerId);
  const coords = [story.lat, story.lon];

  const map = L.map(containerId).setView(coords, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  L.marker(coords).addTo(map).bindPopup(story.name).openPopup();
};

export const initAddStoryMap = (containerId, latInputId, lonInputId) => {
  _cleanupMap(containerId);

  const map = L.map(containerId).setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  let marker;
  const latInput = document.getElementById(latInputId);
  const lonInput = document.getElementById(lonInputId);

  const updateMarkerAndInputs = (lat, lng) => {
    if (marker) marker.remove();
    marker = L.marker([lat, lng]).addTo(map);
    latInput.value = lat;
    lonInput.value = lng;
  };

  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    updateMarkerAndInputs(lat, lng);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 15);
        updateMarkerAndInputs(latitude, longitude);
      },
      (err) => {
        console.warn("Gagal ambil lokasi user:", err.message);
        map.setView([-6.2, 106.8], 10);
      }
    );
  } else {
    console.warn("Geolocation not supported by this browser.");
    map.setView([-6.2, 106.8], 10);
  }
};
