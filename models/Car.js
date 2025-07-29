 const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true, collection: 'cars' });

module.exports = mongoose.model('Car', carSchema);
