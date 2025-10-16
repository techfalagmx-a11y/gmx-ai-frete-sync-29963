-- Create drivers table with comprehensive fields
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE,
  phone TEXT,
  email TEXT,
  
  -- Vehicle information
  truck_plate TEXT,
  trailer_plate_1 TEXT,
  trailer_plate_2 TEXT,
  trailer_plate_3 TEXT,
  vehicle_type TEXT,
  
  -- Location and status
  current_location TEXT,
  state TEXT,
  city TEXT,
  status TEXT DEFAULT 'active',
  availability_status TEXT DEFAULT 'available',
  
  -- Timestamps and tracking
  last_update TIMESTAMP WITH TIME ZONE,
  last_freight_date TIMESTAMP WITH TIME ZONE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Additional flexible data
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view drivers"
  ON public.drivers
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert drivers"
  ON public.drivers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can update drivers"
  ON public.drivers
  FOR UPDATE
  USING (true);

CREATE POLICY "Only admins can delete drivers"
  ON public.drivers
  FOR DELETE
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for field visibility configuration
CREATE TABLE IF NOT EXISTS public.driver_field_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  field_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  visible_in_card BOOLEAN DEFAULT false,
  visible_in_table BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  field_type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.driver_field_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for field config
CREATE POLICY "Anyone can view field config"
  ON public.driver_field_config
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage field config"
  ON public.driver_field_config
  FOR ALL
  USING (true);

-- Insert default field configurations
INSERT INTO public.driver_field_config (field_name, display_name, visible_in_card, visible_in_table, display_order, field_type) VALUES
  ('name', 'Nome', true, true, 1, 'text'),
  ('cpf', 'CPF', false, true, 2, 'text'),
  ('phone', 'Telefone', true, true, 3, 'text'),
  ('truck_plate', 'Placa Cavalo', true, true, 4, 'text'),
  ('trailer_plate_1', 'Placa Carreta 1', false, false, 5, 'text'),
  ('trailer_plate_2', 'Placa Carreta 2', false, false, 6, 'text'),
  ('trailer_plate_3', 'Placa Carreta 3', false, false, 7, 'text'),
  ('vehicle_type', 'Tipo de Veículo', true, true, 8, 'text'),
  ('current_location', 'Localização', true, true, 9, 'text'),
  ('state', 'Estado', false, true, 10, 'text'),
  ('status', 'Status Cadastral', true, true, 11, 'badge'),
  ('availability_status', 'Disponibilidade', true, true, 12, 'badge'),
  ('last_freight_date', 'Último Frete', true, true, 13, 'date')
ON CONFLICT (field_name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_availability ON public.drivers(availability_status);
CREATE INDEX IF NOT EXISTS idx_drivers_state ON public.drivers(state);
CREATE INDEX IF NOT EXISTS idx_drivers_name ON public.drivers(name);
CREATE INDEX IF NOT EXISTS idx_field_config_visible ON public.driver_field_config(visible_in_card, visible_in_table);

-- Update foreign key in driver_documents if needed
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'driver_documents' 
    AND column_name = 'driver_id'
  ) THEN
    -- Add foreign key constraint
    ALTER TABLE public.driver_documents 
    DROP CONSTRAINT IF EXISTS driver_documents_driver_id_fkey;
    
    ALTER TABLE public.driver_documents
    ADD CONSTRAINT driver_documents_driver_id_fkey 
    FOREIGN KEY (driver_id) 
    REFERENCES public.drivers(id) 
    ON DELETE CASCADE;
  END IF;
END $$;