import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRotues from './routes/user';
import loanRoutes from './routes/loan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRotues);
app.use('/api/loans', loanRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});