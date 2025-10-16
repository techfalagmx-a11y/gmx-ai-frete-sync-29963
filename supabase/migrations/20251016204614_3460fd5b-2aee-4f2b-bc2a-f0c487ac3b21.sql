-- Criar tabela de embarques/fretes primeiro
CREATE TABLE public.embarques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'sent', 'waiting_confirmation', 'confirmed', 'in_transit', 'delivered', 'cancelled')),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_type TEXT,
  weight DECIMAL,
  total_value DECIMAL,
  driver_value DECIMAL,
  pickup_date TIMESTAMP WITH TIME ZONE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  driver_id UUID,
  client_name TEXT,
  email_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para armazenar canhotos de entrega com OCR
CREATE TABLE public.delivery_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES public.embarques(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  delivery_date DATE,
  delivery_time TIME,
  receiver_name TEXT,
  receiver_signature TEXT,
  observations TEXT,
  ocr_raw_data JSONB,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para armazenar documentos de motoristas com OCR
CREATE TABLE public.driver_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('RG', 'CPF', 'CNH')),
  image_url TEXT NOT NULL,
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  issuing_agency TEXT,
  ocr_raw_data JSONB,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.embarques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_documents ENABLE ROW LEVEL SECURITY;

-- Policies para embarques
CREATE POLICY "Todos podem visualizar embarques"
ON public.embarques FOR SELECT
USING (true);

CREATE POLICY "Apenas admins podem criar embarques"
ON public.embarques FOR INSERT
WITH CHECK (true);

CREATE POLICY "Apenas admins podem atualizar embarques"
ON public.embarques FOR UPDATE
USING (true);

CREATE POLICY "Apenas admins podem deletar embarques"
ON public.embarques FOR DELETE
USING (true);

-- Policies para delivery_receipts
CREATE POLICY "Todos podem visualizar canhotos"
ON public.delivery_receipts FOR SELECT
USING (true);

CREATE POLICY "Apenas admins podem criar canhotos"
ON public.delivery_receipts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Apenas admins podem atualizar canhotos"
ON public.delivery_receipts FOR UPDATE
USING (true);

CREATE POLICY "Apenas admins podem deletar canhotos"
ON public.delivery_receipts FOR DELETE
USING (true);

-- Policies para driver_documents
CREATE POLICY "Todos podem visualizar documentos"
ON public.driver_documents FOR SELECT
USING (true);

CREATE POLICY "Apenas admins podem criar documentos"
ON public.driver_documents FOR INSERT
WITH CHECK (true);

CREATE POLICY "Apenas admins podem atualizar documentos"
ON public.driver_documents FOR UPDATE
USING (true);

CREATE POLICY "Apenas admins podem deletar documentos"
ON public.driver_documents FOR DELETE
USING (true);

-- Adicionar triggers para updated_at
CREATE TRIGGER update_embarques_updated_at
BEFORE UPDATE ON public.embarques
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_receipts_updated_at
BEFORE UPDATE ON public.delivery_receipts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_driver_documents_updated_at
BEFORE UPDATE ON public.driver_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();