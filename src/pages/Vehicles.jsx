import React, { useState, useEffect, useContext } from 'react';
import { vehicleAPI } from '../services/api';
import { AppContext } from '../context/AppContext';
import VehicleCard from '../components/VehicleCard';
import VehicleSkeleton from '../components/VehicleSkeleton';
import { useNavigate } from 'react-router-dom';

const Vehicles = () => {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoadError('');
        const res = await vehicleAPI.getVehicles();
        if (!Array.isArray(res.data)) {
          setVehicles([]);
          setLoadError('Unexpected API response while loading vehicles. Please refresh or re-login.');
          return;
        }
        setVehicles(res.data);
      } catch (err) {
        console.error("Failed to load vehicles", err);
        setVehicles([]);
        setLoadError(err.response?.data || err.message || 'Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  const handleRequestService = (vehicle) => {
    // Navigate to a new request form or open task drawer (for now we navigate to requests page with state)
    navigate('/requests', { state: { createForVehicle: vehicle } });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Fleet Vehicles</h2>
      </div>
      {loadError && (
        <div className="glass-panel" style={{ marginBottom: '1rem', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem' }}>
          {loadError}
        </div>
      )}

      <div className="grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <VehicleSkeleton key={i} />)
        ) : vehicles.length > 0 ? (
          vehicles.map(v => (
            <VehicleCard key={v.id} vehicle={v} onRequestService={() => handleRequestService(v)} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
            <h3>No vehicles found</h3>
            <p>Ensure the database is seeded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
