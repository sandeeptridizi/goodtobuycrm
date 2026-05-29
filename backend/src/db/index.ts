import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  } as never,
});

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function initDatabase() {
  // Create users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create properties table
  await query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      address VARCHAR(255),
      city VARCHAR(100),
      country VARCHAR(100) DEFAULT 'India',
      zip_code VARCHAR(20),
      price DECIMAL(15,2) NOT NULL,
      type VARCHAR(50),
      status VARCHAR(20) DEFAULT 'Available',
      bedrooms INTEGER DEFAULT 0,
      bathrooms INTEGER DEFAULT 0,
      area INTEGER DEFAULT 0,
      land_area INTEGER,
      year_built INTEGER,
      building_age INTEGER,
      floors INTEGER DEFAULT 1,
      car_parking INTEGER DEFAULT 0,
      parking_size INTEGER,
      facing VARCHAR(50),
      water_source VARCHAR(100),
      drain_type VARCHAR(100),
      boundary_wall VARCHAR(50),
      rental_income DECIMAL(15,2),
      amenities TEXT[],
      images TEXT[],
      youtube_url VARCHAR(255),
      instagram_url VARCHAR(255),
      added_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create buyers table
  await query(`
    CREATE TABLE IF NOT EXISTS buyers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      budget_min DECIMAL(15,2),
      budget_max DECIMAL(15,2),
      property_types TEXT[],
      min_bedrooms INTEGER DEFAULT 0,
      max_bedrooms INTEGER DEFAULT 10,
      min_bathrooms INTEGER DEFAULT 0,
      max_bathrooms INTEGER DEFAULT 10,
      min_area INTEGER DEFAULT 0,
      preferred_locations TEXT[],
      avatar VARCHAR(255),
      status VARCHAR(20) DEFAULT 'Active',
      lead_source VARCHAR(100),
      assigned_agent INTEGER REFERENCES users(id),
      notes TEXT,
      timeline VARCHAR(100),
      financing VARCHAR(255),
      amenities_required TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create sellers table
  await query(`
    CREATE TABLE IF NOT EXISTS sellers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      avatar VARCHAR(255),
      address VARCHAR(255),
      status VARCHAR(20) DEFAULT 'Active',
      preferred_agent INTEGER REFERENCES users(id),
      notes TEXT,
      selling_reason VARCHAR(255),
      timeline VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create seller_properties linking table
  await query(`
    CREATE TABLE IF NOT EXISTS seller_properties (
      seller_id INTEGER REFERENCES sellers(id) ON DELETE CASCADE,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      PRIMARY KEY (seller_id, property_id)
    )
  `);

  // Create enquiries table
  await query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      property VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'New',
      source VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create employees table
  await query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      role VARCHAR(100),
      department VARCHAR(100),
      status VARCHAR(20) DEFAULT 'Active',
      join_date DATE,
      avatar VARCHAR(255),
      address VARCHAR(255),
      emergency_contact VARCHAR(50),
      skills TEXT[],
      qualifications TEXT,
      languages TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('All tables initialized');
}
