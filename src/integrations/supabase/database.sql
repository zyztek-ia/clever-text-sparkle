
-- Create tables for oceanographic data storage

-- Oceanographic readings table
CREATE TABLE IF NOT EXISTS oceanographic_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    temperature DECIMAL(5,2),
    salinity DECIMAL(5,2),
    current_speed DECIMAL(5,2),
    current_direction INTEGER,
    wave_height DECIMAL(5,2),
    wind_speed DECIMAL(5,2),
    wind_direction INTEGER,
    depth DECIMAL(8,2),
    location JSONB,
    station_id TEXT,
    data_quality TEXT DEFAULT 'good',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sardine population data table
CREATE TABLE IF NOT EXISTS sardine_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    population_estimate BIGINT,
    density INTEGER,
    reproduction_rate DECIMAL(4,3),
    migration_pattern TEXT CHECK (migration_pattern IN ('north', 'south', 'stationary')),
    location JSONB,
    biomass_estimate DECIMAL(10,2),
    age_distribution JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weather data table
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    air_temperature DECIMAL(5,2),
    humidity INTEGER,
    pressure DECIMAL(7,2),
    visibility DECIMAL(5,2),
    conditions TEXT,
    wind_speed DECIMAL(5,2),
    wind_direction INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Satellite imagery metadata table
CREATE TABLE IF NOT EXISTS satellite_imagery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    image_url TEXT NOT NULL,
    image_type TEXT, -- 'thermal', 'current', 'chlorophyll', etc.
    resolution TEXT,
    coverage_area JSONB,
    source TEXT, -- 'NOAA', 'CONABIO', etc.
    processing_status TEXT DEFAULT 'processed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monitoring stations table
CREATE TABLE IF NOT EXISTS monitoring_stations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location JSONB NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline')),
    sensors TEXT[] DEFAULT '{}',
    last_reading TIMESTAMPTZ,
    installation_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data quality metrics table
CREATE TABLE IF NOT EXISTS data_quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    station_id TEXT REFERENCES monitoring_stations(id),
    metric_type TEXT NOT NULL, -- 'accuracy', 'completeness', 'timeliness'
    metric_value DECIMAL(5,4),
    threshold_min DECIMAL(5,4),
    threshold_max DECIMAL(5,4),
    status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts and notifications table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    alert_type TEXT NOT NULL, -- 'temperature', 'current', 'sardine_population', 'system'
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    station_id TEXT REFERENCES monitoring_stations(id),
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by TEXT,
    acknowledged_at TIMESTAMPTZ,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_oceanographic_readings_timestamp ON oceanographic_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_oceanographic_readings_station ON oceanographic_readings(station_id);
CREATE INDEX IF NOT EXISTS idx_sardine_data_timestamp ON sardine_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_weather_data_timestamp ON weather_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_unresolved ON alerts(resolved) WHERE resolved = FALSE;

-- Insert sample monitoring stations
INSERT INTO monitoring_stations (id, name, location, status, sensors, last_reading) VALUES
('central', 'Estación Central', '{"lat": 31.8667, "lng": -116.6000, "name": "Ensenada Central"}', 'active', 
 ARRAY['temperature', 'current', 'depth', 'salinity'], NOW()),
('north', 'Estación Norte', '{"lat": 31.9200, "lng": -116.5800, "name": "Ensenada Norte"}', 'active', 
 ARRAY['temperature', 'current', 'wave'], NOW() - INTERVAL '5 minutes'),
('south', 'Estación Sur', '{"lat": 31.8100, "lng": -116.6200, "name": "Ensenada Sur"}', 'maintenance', 
 ARRAY['temperature', 'depth'], NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE oceanographic_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sardine_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE satellite_imagery ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access" ON oceanographic_readings FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON sardine_data FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON weather_data FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON satellite_imagery FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON monitoring_stations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON data_quality_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON alerts FOR SELECT USING (true);

-- Create policies for insert (you may want to restrict this to authenticated users)
CREATE POLICY "Allow insert for service" ON oceanographic_readings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for service" ON sardine_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for service" ON weather_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for service" ON satellite_imagery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for service" ON data_quality_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for service" ON alerts FOR INSERT WITH CHECK (true);
