import mongoose from 'mongoose';

let connected = false;

export async function connectDb() {
  if (connected) return mongoose.connection;
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/typechorus';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { autoIndex: true });
  console.log('MongoDB connected');
  connected = true;
  return mongoose.connection;
}
