import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';
import waitConnection from './connection';

const { PORT } = process.env;

waitConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT} !!!`);
  });
});
