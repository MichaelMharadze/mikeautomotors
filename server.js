const multer = require('multer');
const path = require('path');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Add this line to serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const ADMIN_USERNAME = 'Automike';
const ADMIN_PASSWORD = 'Liverpool2025won';
const SECRET_KEY = 'your_secret_key'; // Change this in production

mongoose.connect('mongodb+srv://Automike:Liverpool2025won@mikeautomotorscluster.vogvm1f.mongodb.net/mikeautomotorsdb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

  // Car model
const Car = require('./models/Car'); // make sure the path is correct

// ✅ Route to get all cars (no login required)
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find(); // Show all cars
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional: route for search filters (used in your code)
app.get('/api/cars/search', async (req, res) => {
  try {
    let query = {};

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.price === 'under6000') {
      query.price = { $lt: 6000 };
    } else if (req.query.price === '6000to10000') {
      query.price = { $gte: 6000, $lte: 10000 };
    } else if (req.query.price === 'over10000') {
      query.price = { $gt: 10000 };
    }

    if (req.query.year === '2014plus') {
      query.year = { $gte: 2014 };
    }

    if (req.query.mileage === 'under100k') {
      query.mileage = { $lt: 100000 };
    }

    if (req.query.make) {
      query.make = req.query.make;
    }

    const cars = await Car.find(query);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});


// Put your multer upload setup here:
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});


// Upload image route (fixed)
app.post('/api/upload', upload.single('image'), (req, res) => {
  console.log('Upload route hit');
  console.log('File:', req.file);

  if (!req.file) {
    console.log('No file received');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const baseUrl = req.protocol + '://' + req.get('host');
  res.json({ imageUrl: `${baseUrl}/uploads/${req.file.filename}` });
}); // ← this was missing!



// Middleware to verify admin token from Authorization header
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect: 'Bearer TOKEN'

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    next();
  });
}

// LOGIN ROUTE
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// TOKEN VERIFY ROUTE
app.post('/api/admin/verify', (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role === 'admin') {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (err) {
    res.json({ valid: false });
  }
});

app.delete('/api/cars/:id', verifyAdminToken, async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get only featured cars
app.get('/api/cars/featured', async (req, res) => {
  try {
    const cars = await Car.find({ featured: true });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured cars' });
  }
});

// PUT to mark/unmark a car as featured (Admin only)
app.put('/api/cars/:id/feature', verifyAdminToken, async (req, res) => {
  try {
    const { featured } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { featured },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(updatedCar);
  } catch (error) {
    console.error('Feature car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Advanced filter for "Browse Our Stock"
app.get('/api/cars/search', async (req, res) => {
  try {
    const { search, price, year, mileage, make } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (make) {
      filter.make = { $regex: make, $options: 'i' };
    }

    if (price === 'under6000') {
      filter.price = { $lt: 6000 };
    } else if (price === '6000to10000') {
      filter.price = { $gte: 6000, $lte: 10000 };
    } else if (price === 'over10000') {
      filter.price = { $gt: 10000 };
    }

    if (year === '2014plus') {
      filter.year = { $gte: 2014 };
    }

    if (mileage === 'under100k') {
      filter.mileage = { $lt: 100000 };
    }

    const cars = await Car.find(filter);
    res.json(cars);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// ADD NEW CAR (Admin only)
app.post('/api/cars', verifyAdminToken, async (req, res) => {
  try {
    const { name, make, year, price, mileage, location, image, featured } = req.body;

    const newCar = new Car({
      name,
      make,
      year,
      price,
      mileage,
      location,
      image,
      featured: featured || false,
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    console.error('❌ Error saving car:', error);
    res.status(500).json({ message: 'Server error while saving car' });
  }
});


// Serve static frontend files
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Serve index.html for all other routes (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

