-- Add tracking and delivery window fields to embarques table
ALTER TABLE public.embarques 
ADD COLUMN IF NOT EXISTS delivery_window_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivery_window_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS actual_arrival_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejected_drivers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_latitude NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS current_longitude NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMP WITH TIME ZONE;

-- Create simplified ranking rules table with fixed rules and configurable values
DROP TABLE IF EXISTS public.ranking_rules CASCADE;

CREATE TABLE public.ranking_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  weight INTEGER NOT NULL DEFAULT 1,
  enabled BOOLEAN DEFAULT true,
  parameters JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ranking_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view ranking rules"
  ON public.ranking_rules
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage ranking rules"
  ON public.ranking_rules
  FOR ALL
  USING (true);

-- Insert fixed ranking rules with configurable parameters
INSERT INTO public.ranking_rules (rule_type, name, description, weight, enabled, parameters) VALUES
(
  'proximity',
  'Proximidade Geográfica',
  'Prioriza motoristas mais próximos do local de coleta',
  5,
  true,
  '{"max_distance_km": 100, "points_per_km": 2}'::jsonb
),
(
  'availability',
  'Disponibilidade',
  'Prioriza motoristas marcados como disponíveis',
  3,
  true,
  '{"available_bonus": 10, "unavailable_penalty": -5}'::jsonb
),
(
  'recent_activity',
  'Atividade Recente',
  'Prioriza motoristas que fizeram entregas recentemente',
  2,
  true,
  '{"days_threshold": 30, "points_per_delivery": 1}'::jsonb
),
(
  'success_rate',
  'Taxa de Sucesso',
  'Prioriza motoristas com maior taxa de entregas bem-sucedidas',
  4,
  true,
  '{"min_deliveries": 5, "points_per_percent": 0.5}'::jsonb
),
(
  'rejection_penalty',
  'Penalidade por Recusas',
  'Penaliza motoristas que recusaram ofertas recentemente',
  2,
  true,
  '{"days_window": 7, "penalty_per_rejection": -3}'::jsonb
),
(
  'vehicle_compatibility',
  'Compatibilidade de Veículo',
  'Prioriza motoristas com tipo de veículo adequado',
  3,
  true,
  '{"exact_match_bonus": 5, "compatible_bonus": 2}'::jsonb
);

-- Create trigger for updated_at
CREATE TRIGGER update_ranking_rules_updated_at
  BEFORE UPDATE ON public.ranking_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_embarques_location ON public.embarques(current_latitude, current_longitude);
CREATE INDEX IF NOT EXISTS idx_embarques_delivery_window ON public.embarques(delivery_window_start, delivery_window_end);
CREATE INDEX IF NOT EXISTS idx_ranking_rules_enabled ON public.ranking_rules(enabled) WHERE enabled = true;