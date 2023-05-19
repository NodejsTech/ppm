const mongoose = require('mongoose');

// Connect to MongoDB
const db = () =>{ mongoose.connect('mongodb+srv://api:mohiuddin@cluster0.fbd4k.mongodb.net/api?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));
}
  module.exports = db