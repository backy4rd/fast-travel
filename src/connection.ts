import * as mongoose from 'mongoose';
import * as redis from 'async-redis';

const { MONGODB_URI, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

export const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
  password: REDIS_PASSWORD,
});

const mongooseConnection = mongoose.connect(MONGODB_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

export default function waitConnection(): Promise<void> {
  return new Promise((resolve, reject) => {
    redisClient.on('error', reject);

    redisClient.on('ready', () => {
      mongooseConnection.then(() => resolve()).catch(reject);
    });
  });
}
