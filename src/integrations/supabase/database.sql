
-- Create oceanographic_readings table
CREATE TABLE IF NOT EXISTS public.oceanographic_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  temperature DECIMAL(5,2),
  salinity DECIMAL(5,2),
  current_speed DECIMAL(5,2),
  current_direction DECIMAL(5,2),
  wave_height DECIMAL(5,2),
  wind_speed DECIMAL(5,2),
  wind_direction DECIMAL(5,2),
  depth DECIMAL(8,2),
  location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sardine_data table
CREATE TABLE IF NOT EXISTS public.sardine_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  population_estimate BIGINT,
  density DECIMAL(8,2),
  reproduction_rate DECIMAL(4,3),
  migration_pattern TEXT CHECK (migration_pattern IN ('north', 'south', 'stationary')),
  location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional, for future authentication)
ALTER TABLE public.oceanographic_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sardine_data ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access for now
CREATE POLICY IF NOT EXISTS "Allow public read access on oceanographic_readings" 
ON public.oceanographic_readings FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access on sardine_data" 
ON public.sardine_data FOR SELECT 
USING (true);

-- Create policies to allow public insert access for data collection
CREATE POLICY IF NOT EXISTS "Allow public insert access on oceanographic_readings" 
ON public.oceanographic_readings FOR INSERT 
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public insert access on sardine_data" 
ON public.sardine_data FOR INSERT 
WITH CHECK (true);
