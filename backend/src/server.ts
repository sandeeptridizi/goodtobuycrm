import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import propertiesRoutes from './routes/properties.js';
import buyersRoutes from './routes/buyers.js';
import sellersRoutes from './routes/sellers.js';
import enquiriesRoutes from './routes/enquiries.js';
import employeesRoutes from './routes/employees.js';
import dashboardRoutes from './routes/dashboard.js';
import { initDatabase } from './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/buyers', buyersRoutes);
app.use('/api/sellers', sellersRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
