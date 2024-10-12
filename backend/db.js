const mongoose = require('mongoose');

const connectToMongo = () => {
  mongoose.connect('mongodb://localhost:27017/izBook')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));
};

module.exports = connectToMongo;
