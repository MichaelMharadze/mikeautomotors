import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function ManageCars() {
  const [cars, setCars] = useState([]);
  const [car, setCar] = useState({
    name: "",
    make: "",
    year: "",
    mileage: "",
    price: "",
    location: "",
    image: "",
    featured: false,
  });

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginTop: "5px",
  };

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("https://mikeautomotors-backend.onrender.com/api/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(res.data);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("https://mikeautomotors-backend.onrender.com/api/upload", formData);
      setCar((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Check console.");
    }
  };

  const addCar = async () => {
    if (
      car.name &&
      car.make &&
      car.year &&
      car.mileage &&
      car.price &&
      car.image &&
      car.location
    ) {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.post("https://mikeautomotors-backend.onrender.com/api/cars", car, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("✅ Car added successfully!");
        setCar({
          name: "",
          make: "",
          year: "",
          mileage: "",
          price: "",
          location: "",
          image: "",
          featured: false,
        });
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchCars();
      } catch (err) {
        console.error("Failed to add car:", err.response?.data || err);
        alert("Failed to add car. See console.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`https://mikeautomotors-backend.onrender.com/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars((prev) => prev.filter((car) => car._id !== id));
    } catch (err) {
      console.error("Error deleting car:", err);
      alert("Failed to delete car. See console.");
    }
  };

const [selectedCar, setSelectedCar] = useState(null);

const closePopup = () => {
  setSelectedCar(null);
};


  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>
      <h2 style={{ color: "#065f46", fontSize: "28px", marginBottom: "1rem" }}>
        Manage Cars
      </h2>

      <div
        style={{
          background: "#f1f5f9",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#333", marginBottom: "15px" }}>➕ Add New Car</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={car.name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g. Toyota Aqua"
            />
          </div>
          <div>
            <label>Make</label>
            <input
              type="text"
              name="make"
              value={car.make}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g. Toyota"
            />
          </div>
          <div>
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={car.year}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Mileage</label>
            <input
              type="number"
              name="mileage"
              value={car.mileage}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={car.price}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={car.location}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Image</label>
            <input
              type="file"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label>Featured?</label>
            <input
              type="checkbox"
              checked={car.featured}
              onChange={(e) => setCar({ ...car, featured: e.target.checked })}
            />
          </div>
        </div>

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "150px",
              marginBottom: "20px",
              borderRadius: "6px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          />
        )}

        <button
          onClick={addCar}
          style={{
            backgroundColor: "#065f46",
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          Add Car
        </button>
      </div>

      <div className="car-list" style={{ display: "grid", gap: "20px" }}>
        {cars.length === 0 ? (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>
            🚘 No cars uploaded yet.
          </p>
        ) : (
          cars.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedCar(c)}
    style={{
      cursor: 'pointer',
      border: "1px solid #ddd",
      padding: "15px",
      borderRadius: "6px",
      background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}
  >
    <img
      src={c.image}
      alt={c.name}
      style={{
        width: "100%",
        maxHeight: "180px",
        objectFit: "cover",
        borderRadius: "4px",
      }}
    />
    <p><strong>{c.name}</strong> ({c.year})</p>
    <p>Mileage: {c.mileage} km</p>
    <p>Price: ${c.price}</p>
    <p>Location: {c.location}</p>
              <button
                onClick={() => deleteCar(c._id)}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      {selectedCar && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  }}>
    <div style={{
      background: '#fff',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
    }}>
      <button
        onClick={closePopup}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#dc2626',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          cursor: 'pointer',
        }}
      >
        Close
      </button>

      <img
        src={selectedCar.image}
        alt={selectedCar.name}
        style={{
          width: '100%',
          height: '250px',
          objectFit: 'cover',
          borderRadius: '6px',
          marginBottom: '1rem',
        }}
      />

      <h3 style={{ color: '#065f46' }}>{selectedCar.name}</h3>
      <p><strong>Make:</strong> {selectedCar.make}</p>
      <p><strong>Year:</strong> {selectedCar.year}</p>
      <p><strong>Mileage:</strong> {selectedCar.mileage} km</p>
      <p><strong>Price:</strong> ${selectedCar.price}</p>
      <p><strong>Location:</strong> {selectedCar.location}</p>
      <p><strong>Featured:</strong> {selectedCar.featured ? 'Yes' : 'No'}</p>
    </div>
  </div>
)}

    </div>
  );
}

export default ManageCars;


