const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const helmet = require("helmet");
const userRoutes = require('./routes/userRoutes');
const emotionRoutes = require('./routes/emotionRoutes');
<<<<<<< Updated upstream
const cookieParser = require('cookie-parser');
=======
const { errorHandler } = require('./middlewares/errorHandler');
>>>>>>> Stashed changes

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(useragent.express()); // for getting client device info

app.set('trust proxy', 1)
app.use(session({
  secret: 'your-secret-key',
  name: 'cookieName',
  cookie: { secure: true, httpOnly: true, path: '/user', sameSite: true }
}));

const health = {
  version: process.env.npm_package_version || config.version || 'dev',
  service: `${config.name}-service`,
};
app.get('/health', (req, res) => res.json(health));

// Database connection
// TODO: Move this to a separate config file
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emotionaltracker';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/emotions', emotionRoutes);

// Unprotected test route
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

// Error handling middleware
// TODO: Implement proper error handling middleware

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));