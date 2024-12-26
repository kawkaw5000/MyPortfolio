import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api', userRoutes);

const port = process.env.PORT || 5000;;

app.use(cors({ origin: 'http://localhost:3000' }));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
