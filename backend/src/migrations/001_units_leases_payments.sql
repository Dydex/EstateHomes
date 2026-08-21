-- Migration: Create units, leases, payments tables
-- Run with: psql -h localhost -U estate_user -d estate_db -f src/migrations/001_units_leases_payments.sql

-- Add phone column to users
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE properties ADD COLUMN owner_id INTEGER REFERENCES users(id);

-- -- Units table
-- CREATE TABLE IF NOT EXISTS units (
--     id SERIAL PRIMARY KEY,
--     property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
--     unit_number VARCHAR(50) NOT NULL,
--     bedrooms INTEGER DEFAULT 0,
--     bathrooms INTEGER DEFAULT 0,
--     yearly_rent NUMERIC(12,2),
--     status VARCHAR(20) DEFAULT 'vacant',
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- -- Leases table
-- CREATE TABLE IF NOT EXISTS leases (
--     id SERIAL PRIMARY KEY,
--     tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
--     start_date DATE NOT NULL,
--     end_date DATE NOT NULL,
--     yearly_rent NUMERIC(12,2) NOT NULL,
--     installments INTEGER NOT NULL DEFAULT 1 CHECK (installments BETWEEN 1 AND 3),
--     status VARCHAR(20) DEFAULT 'active',
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- -- Payments table
-- CREATE TABLE IF NOT EXISTS payments (
--     id SERIAL PRIMARY KEY,
--     lease_id INTEGER NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
--     installment_number INTEGER NOT NULL,
--     amount NUMERIC(12,2) NOT NULL,
--     due_date DATE NOT NULL,
--     status VARCHAR(20) DEFAULT 'pending',
--     paid_at TIMESTAMP,
--     created_at TIMESTAMP DEFAULT NOW()
-- );
