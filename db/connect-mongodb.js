const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

const connectMongoDb = async () => {
  
  try {
    mongoose.set('useFindAndModify', false);
    const db = mongoose.connection;
    db.once('open', function() {
      console.log('Conneted mongoDB');
    });
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    
  } catch (error) {
    console.error('Connection Error');
    return;
  }
}

module.exports = connectMongoDb;