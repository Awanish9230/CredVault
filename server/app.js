const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

dotenv.config();

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use('/uploads', express.static('uploads')); // Removed in favor of GridFS

app.use((req, res, next) => {
    ['body', 'params', 'headers', 'query'].forEach(function (key) {
        if (req[key]) {
            mongoSanitize.sanitize(req[key]);
        }
    });
    next();
});
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

module.exports = app;
