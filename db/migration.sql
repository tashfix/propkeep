-- PropKeep Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension (if not already enabled)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'landlord',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'free',
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ─── Properties ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'single-family',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS properties_user_id_idx ON properties(user_id);

-- ─── Units ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS units (
  id VARCHAR(255) PRIMARY KEY,
  property_id VARCHAR(255) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_number VARCHAR(50) NOT NULL,
  tenant_name VARCHAR(255),
  tenant_email VARCHAR(255),
  rent_amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS units_property_id_idx ON units(property_id);
CREATE INDEX IF NOT EXISTS units_user_id_idx ON units(user_id);

-- ─── Maintenance Tickets ──────────────────────────────────────────────────────
-- status: open | in-progress | resolved
-- priority: low | medium | high
-- category: plumbing | electrical | hvac | appliance | structural | other
CREATE TABLE IF NOT EXISTS maintenance_tickets (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id VARCHAR(255) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_id VARCHAR(255) REFERENCES units(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  priority VARCHAR(50) NOT NULL DEFAULT 'medium',
  category VARCHAR(100) NOT NULL DEFAULT 'other',
  cost NUMERIC(10, 2),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS tickets_user_id_idx ON maintenance_tickets(user_id);
CREATE INDEX IF NOT EXISTS tickets_property_id_idx ON maintenance_tickets(property_id);
CREATE INDEX IF NOT EXISTS tickets_status_idx ON maintenance_tickets(status);

-- ─── Recurring Tasks ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recurring_tasks (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id VARCHAR(255) REFERENCES properties(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  interval_days INTEGER NOT NULL,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  next_due_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS recurring_tasks_user_id_idx ON recurring_tasks(user_id);
CREATE INDEX IF NOT EXISTS recurring_tasks_next_due_idx ON recurring_tasks(next_due_at);
