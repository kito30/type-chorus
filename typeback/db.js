import mongoose from 'mongoose';

let connected = false;
let connectPromise;
let missingUriLogged = false;

function isDbRequired() {
  return String(process.env.DB_REQUIRED || '').toLowerCase() === 'true';
}

function getMongoUri() {
  return (process.env.MONGODB_URI || '').trim();
}

export function isDbConnected() {
  return connected;
}

export async function connectDb() {
  if (connected) return mongoose.connection;
  if (connectPromise) return connectPromise;

  const uri = getMongoUri();
  const required = isDbRequired();

  if (!uri) {
    if (!missingUriLogged) {
      console.warn('MONGODB_URI is not set. Starting without database.');
      missingUriLogged = true;
    }
    if (required) {
      throw new Error('DB_REQUIRED=true but MONGODB_URI is missing');
    }
    return null;
  }

  mongoose.set('strictQuery', true);
  connectPromise = mongoose
    .connect(uri, { autoIndex: true })
    .then(() => {
      connected = true;
      console.log('MongoDB connected');
      return mongoose.connection;
    })
    .catch((err) => {
      connectPromise = undefined;
      if (required) {
        throw err;
      }
      console.warn('MongoDB unavailable. Continuing without database.');
      return null;
    });

  return connectPromise;
}
