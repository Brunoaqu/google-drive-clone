import mongoose from 'mongoose';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => { console.log('Connection with mongo database was successful'); })
  .catch((err) => console.log(err));
