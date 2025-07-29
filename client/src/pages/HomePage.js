import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  FaCarSide,
  FaHandshake,
  FaWhatsapp,
  FaCheckCircle,
  FaCar,
  FaSearch,
  FaDollarSign,
  FaCalendarAlt,
  FaRoad,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  // Move useState & useEffect inside component
   const [cars, setCars] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
  axios
    .get('https://mikeautomotors-backend.onrender.com/api/cars')
    .then((res) => {
      console.log('Fetched cars:', res.data);  // Debug log
      setCars(res.data);
    })
    .catch((err) => {
      console.error('Failed to fetch cars:', err);
    });
}, []);



  const [modalOpen, setModalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);


  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [mileageFilter, setMileageFilter] = useState('');
  const [makeFilter, setMakeFilter] = useState('');


 const [filteredCars, setFilteredCars] = useState([]);

const fetchFilteredCars = () => {
  const query = new URLSearchParams({
    search,
    price: priceFilter,
    year: yearFilter,
    mileage: mileageFilter,
    make: makeFilter
  }).toString();

  fetch(`https://mikeautomotors-backend.onrender.com/cars/search?${query}`)
    .then(res => res.json())
    .then(data => setFilteredCars(data))
    .catch(err => console.error('Search failed', err));
};

// Trigger search when any filter changes
useEffect(() => {
  fetchFilteredCars();
}, [search, priceFilter, yearFilter, mileageFilter, makeFilter]);


  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        setContactOpen(false);
        setSelectedCar(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <h1>Mike Auto Motors Zim</h1>
        <p>Your Trusted Car Dealership in Zimbabwe</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '30px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setContactOpen(true)}
            style={{
              padding: '10px 22px',
              fontSize: '0.92rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e40af')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            Contact Us
          </button>
        </div>
      </header>

      {/* Featured Cars */}
<section className="section cars">
  <h2 style={{ color: '#065f46' }}>
    <FaCar style={{ marginRight: '8px' }} /> Featured Cars
  </h2>
 <div
  className="car-grid"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    padding: '0 10px',
  }}
>

    {cars.filter(car => car.featured).length === 0 && (
      <p>No featured cars available</p>
    )}
    {cars
      .filter(car => car.featured)
      .slice(0, 3)
      .map((car, index) => (
        <div
          key={index}
          className="car-card"
          onClick={() => setSelectedCar(car)}
          style={{ cursor: 'pointer', 
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        padding: '10px',
        textAlign: 'center',
          }}
        >
                 <img
          src={car.image}
          alt={car.name || 'Car Image'}
        
        />
            <h3 style={{ fontSize: '1rem', color: '#065f46', margin: 0 }}>
        {car.name || 'Unknown Car'}
      </h3>
           <p style={{ fontSize: '0.9rem', margin: 0 }}>
        {car.make || 'Unknown Make'} • ${car.price || 'N/A'}
      </p>
        </div>
      ))}
  </div>
</section>
      {/* Browse Stock Button */}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            backgroundColor: '#065f46',
            color: '#fff',
            padding: '12px 32px',
            fontSize: '1rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 14px rgba(6,95,70,0.3)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0b7255')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#065f46')}
        >
          Browse Our Stock
        </button>
      </div>

      {/* Why Choose Us Section */}
      <section className="section about">
        <h2 style={{ color: '#065f46' }}>
          <FaHandshake style={{ marginRight: '8px' }} /> Why Choose Us
        </h2>
        <div className="about-grid">
          <div className="feature-box">
            <FaCheckCircle className="icon" style={{ color: '#065f46' }} />
            <h3>Trusted & Transparent</h3>
            <p>We deliver what we promise. 100% satisfaction from import to handover.</p>
          </div>
          <div className="feature-box">
            <FaCar className="icon" style={{ color: '#065f46' }} />
            <h3>Top Car Selections</h3>
            <p>Carefully selected cars from Japan, UK & South Africa with full inspection.</p>
          </div>
          <div className="feature-box">
            <FaHandshake className="icon" style={{ color: '#065f46' }} />
            <h3>Affordable Deals</h3>
            <p>Fair prices, no hidden fees, with flexible payment options for all buyers.</p>
          </div>
        </div>
      </section>

      {cars.length > 0 ? (
  <div style={{ marginTop: '2rem' }}>
    <h3 style={{ color: '#065f46' }}>Your Cars:</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {cars.map((car) => (
        <li
          key={car._id}
          style={{
            background: '#fff',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            boxShadow: '0 0 8px rgba(0,0,0,0.05)',
          }}
        >
          <strong>{car.name}</strong> — ${car.price} — {car.year}
        </li>
      ))}
    </ul>
  </div>
) : (
  <p style={{ marginTop: '2rem', color: '#999' }}>
    No cars found. Use "Manage Cars" to upload your first car.
  </p>
)}


      {/* Contact Modal */}
      {contactOpen && (
        <div className="modal-overlay" onClick={() => setContactOpen(false)}>
          <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setContactOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                fontSize: '1.5rem',
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1100,
              }}
            >
              ×
            </button>

            <h2 style={{ color: '#065f46' }}>Contact Us</h2>
            <p>
              <FaWhatsapp style={{ color: '#25D366', marginRight: '8px' }} />
              WhatsApp:{' '}
              <a href="https://wa.me/263775801410" target="_blank" rel="noopener noreferrer">
                263 775801410
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Car Detail Modal */}
      {selectedCar && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCar(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '600px',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedCar(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                fontSize: '1.5rem',
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ×
            </button>

            <img
              src={selectedCar.image}
              alt={selectedCar.name}
              style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }}
            />
            <h2 style={{ color: '#065f46' }}>
              {selectedCar.name} ({selectedCar.year})
            </h2>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>${selectedCar.price}</p>
            <p>Mileage: {selectedCar.mileage.toLocaleString()} km</p>
            <p>Location: {selectedCar.location}</p>

            {/* WhatsApp Chat Button */}
            <a
              href={`https://wa.me/263775801410?text=${encodeURIComponent(
                `Hi, I'm interested in the ${selectedCar.year} ${selectedCar.name} listed on Mike Auto Motors. Is it still available?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '24px',
                padding: '12px 24px',
                backgroundColor: '#25D366',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1rem',
                textAlign: 'center',
              }}
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Browse Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content browse-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                fontSize: '1.5rem',
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1100,
              }}
            >
              ×
            </button>

            {/* Filters */}
            <div
              className="filters-box"
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: '16px',
                marginBottom: '24px',
                overflowX: 'auto',
                paddingBottom: '8px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              {/* Search box */}
              <div
                className="filter-input"
                style={{ flex: '1 1 180px', minWidth: '180px', position: 'relative' }}
              >
                <FaSearch
                  className="filter-icon"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#111827',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Price filter */}
              <div
                className="filter-input"
                style={{ flex: '1 1 180px', minWidth: '180px', position: 'relative' }}
              >
                <FaDollarSign
                  className="filter-icon"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#111827',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Price</option>
                  <option value="under6000">Under $6,000</option>
                  <option value="6000to10000">$6,000 – $10,000</option>
                  <option value="over10000">Over $10,000</option>
                </select>
              </div>

              {/* Year filter */}
              <div
                className="filter-input"
                style={{ flex: '1 1 140px', minWidth: '140px', position: 'relative' }}
              >
                <FaCalendarAlt
                  className="filter-icon"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                />
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#111827',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Year</option>
                  <option value="2014plus">2014 & Newer</option>
                </select>
              </div>

              {/* Mileage filter */}
              <div
                className="filter-input"
                style={{ flex: '1 1 140px', minWidth: '140px', position: 'relative' }}
              >
                <FaRoad
                  className="filter-icon"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                />
                <select
                  value={mileageFilter}
                  onChange={(e) => setMileageFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#111827',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Mileage</option>
                  <option value="under100k">Under 100,000km</option>
                </select>
              </div>

              {/* Make filter */}
              <div
                className="filter-input"
                style={{ flex: '1 1 140px', minWidth: '140px', position: 'relative' }}
              >
                <FaCarSide
                  className="filter-icon"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                />
                <select
                  value={makeFilter}
                  onChange={(e) => setMakeFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#111827',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Mercedes">Mercedes</option>
                </select>
              </div>
            </div>

            {/* Cars grid */}
            {filteredCars.length === 0 && (search || priceFilter || yearFilter || mileageFilter || makeFilter) ? (
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>
                ❌ No cars match your filters. Try adjusting your search.
              </p>
            ) : filteredCars.length > 0 ? (

              <div
                className="car-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px',
                }}
              >
                {filteredCars.map((car, index) => (

                  <div
                    className="car-card"
                    key={index}
                    onClick={() => {
                      setModalOpen(false); // Close browse modal
                      setSelectedCar(car); // Open car popup
                    }}
                    style={{
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      padding: '12px',
                      background: '#fff',
                      fontFamily: "'Poppins', sans-serif",
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <img
                      src={car.image}
                      alt={car.name}
                      style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
                    />
                    <h3 style={{ marginBottom: '6px', color: '#065f46' }}>{car.name}</h3>
                    <p style={{ color: '#065f46', fontWeight: '600', marginBottom: '4px' }}>
                      {car.make} · {car.year} · ${car.price}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      Mileage: {car.mileage.toLocaleString()} km
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Location: {car.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#9ca3af' }}>
                👆 Use the filters above to search available cars
              </p>
            )}
          </div>
        </div>
      )}

      <footer>
        <p>© 2025 Mike Auto Motors Zim • All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default HomePage;
