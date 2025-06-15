import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getPhotos, uploadPhoto } from "../services/api";

function PhotoMapPage() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getPhotos();
        setPhotos(data);
      } catch (e) {
        console.error("Failed to fetch photos", e);
      }
    };
    fetchPhotos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("description", description);
    const saved = await uploadPhoto(form);
    setPhotos((p) => [...p, saved]);
    setFile(null);
    setDescription("");
  };

  return (
    <div>
      <h2>Ukraine Photo Map</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Upload</button>
      </form>
      <MapContainer center={[48.3794, 31.1656]} zoom={6} style={{ height: "500px" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {photos.map((p) => (
          <Marker key={p.id} position={[p.latitude || 0, p.longitude || 0]}>
            <Popup>
              <img src={"/" + p.filePath} alt="" style={{ width: "100px" }} />
              <p>{p.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default PhotoMapPage;
