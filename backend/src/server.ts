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
import workersRoutes from './routes/workers.js';
import workerAuthRoutes from './routes/workerAuth.js';
import promotionsRoutes from './routes/promotions.js';
import './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// Images arrive as base64 (up to 20 per property) and are moved to Cloud Storage
// by the routes, so requests are large even though the stored documents are not.
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/buyers', buyersRoutes);
app.use('/api/sellers', sellersRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/worker-auth', workerAuthRoutes);
app.use('/api/promotions', promotionsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Firestore is schemaless — no table setup needed, collections are created on first write
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Data store: Cloud Firestore (project: ${process.env.FIREBASE_PROJECT_ID})`);
});
