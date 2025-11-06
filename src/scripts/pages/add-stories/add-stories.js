import { initAddStoryMap } from "../../utils/map-helper";
import AddStoryPresenter from "./add-story-presenter";

export default class addStories {
  #presenter = null;
  #capturedPhotoFile = null;
  #cameraStream = null;

  constructor() {
    this.#presenter = new AddStoryPresenter({ view: this });
  }

  async render() {
    return `
      <section class="container add-story">
        <h1 class="page-title">Add New Story</h1>
        
        <form id="addStoryForm" class="story-form">

          <label for="map">Pilih Lokasi (opsional)</label>
          <div id="map" style="height: 400px; border-radius: 10px; margin-top: 0.5rem; z-index: 0;"></div>

          <label for="description">Description</label>
          <textarea rows="5" id="description" placeholder="Write your story..." required></textarea>

          <label for="lat">Latitude</label>
          <input type="number" id="lat" name="lat" disabled />
          <label for="lon">Longitude</label>
          <input type="number" id="lon" name="lon" disabled />
          
          <label>Image (Max 1MB)</label>
          <div class="upload-choice">
          <input type="radio" id="radio-upload" name="uploadType" value="upload" checked>
          <label for="radio-upload">Upload File</label>
          <input type="radio" id="radio-camera" name="uploadType" value="camera">
          <label for="radio-camera">Buka Kamera</label>
          </div>
          
          <label for="image">Image</label>
          <div id="upload-container">
            <input type="file" id="photo" accept="image/*" required name="image"/>
          </div>

          <div id="camera-container" style="display: none; text-align: center;">
            <video id="camera-feed" autoplay muted playsinline style="width: 100%; border-radius: 10px;"></video>
            <button type="button" id="capture-button" class="btn-secondary" style="margin-top: 1rem;">Ambil Gambar</button>
            <canvas id="photo-canvas" style="display: none; width: 100%; border-radius: 10px; margin-top: 1rem;"></canvas>
            <p id="camera-preview-text" style="display: none; margin-top: 0.5rem;">Preview Gambar</p>
          </div>

          <button type="submit" class="btn-primary" style="margin-top: 2rem;">Upload Story</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    await this.#presenter.init();
  }

  _initMap() {
    initAddStoryMap("map", "lat", "lon");
  }

  _getForm() {
    return document.getElementById("addStoryForm");
  }

  _getFormData() {
    const uploadType = document.querySelector(
      'input[name="uploadType"]:checked'
    ).value;
    let photoFile = null;

    if (uploadType === "upload") {
      photoFile = document.getElementById("photo").files[0];
    } else {
      photoFile = this.#capturedPhotoFile;
    }

    const description = document.getElementById("description").value;
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;

    return {
      description,
      photo: photoFile,
      lat: lat ? parseFloat(lat) : null,
      lon: lon ? parseFloat(lon) : null,
    };
  }

  _navigateToHome() {
    window.location.hash = "#/";
  }

  _initUploadTypeToggle() {
    const radios = document.querySelectorAll('input[name="uploadType"]');
    const uploadContainer = document.getElementById("upload-container");
    const cameraContainer = document.getElementById("camera-container");
    const fileInput = document.getElementById("photo");

    radios.forEach((radio) => {
      radio.addEventListener("change", (event) => {
        if (event.target.value === "upload") {
          uploadContainer.style.display = "block";
          cameraContainer.style.display = "none";
          fileInput.required = true;
          this._stopCamera();
        } else {
          uploadContainer.style.display = "none";
          cameraContainer.style.display = "block";
          fileInput.required = false;
          this._startCamera();
        }
      });
    });
  }

  _initCameraCapture() {
    const captureButton = document.getElementById("capture-button");
    const video = document.getElementById("camera-feed");
    const canvas = document.getElementById("photo-canvas");
    const previewText = document.getElementById("camera-preview-text");
    const ctx = canvas.getContext("2d");

    captureButton.addEventListener("click", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.style.display = "block";
      previewText.style.display = "block";
      video.style.display = "none";

      canvas.toBlob(
        (blob) => {
          this.#capturedPhotoFile = new File([blob], "capture.jpg", {
            type: "image/jpeg",
          });
        },
        "image/jpeg",
        0.9
      );

      this._stopCamera();
    });
  }

  async _startCamera() {
    try {
      if (this.#cameraStream) this._stopCamera();

      this.#capturedPhotoFile = null;
      document.getElementById("camera-feed").style.display = "block";
      document.getElementById("photo-canvas").style.display = "none";
      document.getElementById("camera-preview-text").style.display = "none";

      this.#cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const video = document.getElementById("camera-feed");
      video.srcObject = this.#cameraStream;
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      alert("Gagal mengakses kamera. Pastikan Anda memberi izin.");
      document.getElementById("radio-upload").click();
    }
  }

  _stopCamera() {
    if (this.#cameraStream) {
      this.#cameraStream.getTracks().forEach((track) => track.stop());
      this.#cameraStream = null;
      const video = document.getElementById("camera-feed");
      video.srcObject = null;
    }
  }
}
