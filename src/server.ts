import * as dotenv from 'dotenv';
import app from './app';
import * as mongoose from 'mongoose';

dotenv.config();

const { PORT, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT} !!!`);
});
