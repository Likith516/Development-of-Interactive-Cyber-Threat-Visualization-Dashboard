import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../api';
import { Map as MapIcon } from 'lucide-react';

// Fix for default marker icon in React-Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ThreatMapHelper = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                // Ideally this endpoints returns accumulated lat/long data
                // For now, we'll fetch recent threats and use a mock geocode map or rely on IP info if available
                // Since our backend saves countryCode but not lat/long in Threat model (oversight in model design),
                // we'll mock logical lat/longs based on country for visualization purposes 
                // OR we can fetch fresh data which includes location from IPinfo.

                // Let's assume we fetch recent threats and mocked locations for demo
                const res = await api.get('/threats?limit=50');

                // Mock coordinate mapping for demo countries
                const countryCoords = {
                    'US': [37.0902, -95.7129],
                    'CN': [35.8617, 104.1954],
                    'RU': [61.5240, 105.3188],
                    'DE': [51.1657, 10.4515],
                    'BR': [-14.2350, -51.9253],
                    'default': [20, 0]
                };

                const mapped = res.data.map(t => {
                    const coords = countryCoords[t.countryCode] || [
                        (Math.random() * 160) - 80,
                        (Math.random() * 360) - 180
                    ]; // Random separate points if unknown to show variety
                    return { ...t, lat: coords[0], lng: coords[1] };
                });

                setLocations(mapped);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLocations();
    }, []);

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <h2 className="text-2xl font-bold flex items-center gap-2 flex-shrink-0"><MapIcon className="text-accent" /> Geographic Threat Map</h2>

            <div className="glass-panel p-2 rounded-xl flex-1 overflow-hidden">
                <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {locations.map((loc, idx) => (
                        <Marker key={idx} position={[loc.lat + (Math.random() * 2), loc.lng + (Math.random() * 2)]}>
                            <Popup>
                                <div className="text-black">
                                    <strong>{loc.ip}</strong><br />
                                    Risk: {loc.riskLevel}<br />
                                    Country: {loc.countryCode}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default ThreatMapHelper;
