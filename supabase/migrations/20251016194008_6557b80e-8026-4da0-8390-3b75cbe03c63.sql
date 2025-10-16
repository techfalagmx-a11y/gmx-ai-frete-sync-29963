-- Tabela para configurações de regras de rankeamento
CREATE TABLE public.ranking_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  rule_type TEXT NOT NULL, -- 'distance', 'availability', 'acceptance_rate', 'last_freight', 'rating'
  rule_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para templates de mensagens
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL, -- 'offer', 'confirmation', 'status_request', 'delivery_confirmation'
  message_text TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- Lista de variáveis disponíveis: {nome_motorista}, {valor_frete}, etc
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ranking_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para ranking_rules (apenas admins podem modificar)
CREATE POLICY "Todos podem visualizar regras de rankeamento"
ON public.ranking_rules
FOR SELECT
USING (true);

CREATE POLICY "Apenas admins podem criar regras"
ON public.ranking_rules
FOR INSERT
WITH CHECK (true); -- TODO: Adicionar verificação de admin quando sistema de auth estiver implementado

CREATE POLICY "Apenas admins podem atualizar regras"
ON public.ranking_rules
FOR UPDATE
USING (true);

CREATE POLICY "Apenas admins podem deletar regras"
ON public.ranking_rules
FOR DELETE
USING (true);

-- Políticas para message_templates
CREATE POLICY "Todos podem visualizar templates"
ON public.message_templates
FOR SELECT
USING (true);

CREATE POLICY "Apenas admins podem criar templates"
ON public.message_templates
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Apenas admins podem atualizar templates"
ON public.message_templates
FOR UPDATE
USING (true);

CREATE POLICY "Apenas admins podem deletar templates"
ON public.message_templates
FOR DELETE
USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ranking_rules_updated_at
BEFORE UPDATE ON public.ranking_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_message_templates_updated_at
BEFORE UPDATE ON public.message_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir regras padrão
INSERT INTO public.ranking_rules (name, description, priority, rule_type, rule_config) VALUES
('Proximidade do Local de Coleta', 'Prioriza motoristas próximos ao local de coleta', 1, 'distance', '{"max_distance_km": 100, "weight": 5}'),
('Taxa de Aceitação', 'Prioriza motoristas com maior taxa de aceitação histórica', 2, 'acceptance_rate', '{"min_rate": 70, "weight": 3}'),
('Tempo Disponível', 'Prioriza motoristas disponíveis há mais tempo', 3, 'availability', '{"weight": 2}'),
('Avaliação do Motorista', 'Prioriza motoristas com melhor avaliação', 4, 'rating', '{"min_rating": 4.0, "weight": 4}'),
('Tempo desde Último Frete', 'Prioriza motoristas que não fazem frete há mais tempo', 5, 'last_freight', '{"weight": 1}');

-- Inserir templates padrão
INSERT INTO public.message_templates (name, description, template_type, message_text, variables) VALUES
('Oferta de Frete', 'Mensagem enviada ao motorista com oferta de frete', 'offer', 
'Olá {nome_motorista}! 🚛

Temos uma nova oferta de frete disponível para você:

📦 *Carga:* {tipo_carga}
📍 *Origem:* {cidade_origem}, {estado_origem}
📍 *Destino:* {cidade_destino}, {estado_destino}
💰 *Valor:* R$ {valor_frete}
📅 *Coleta:* {data_coleta}
🎯 *Entrega prevista:* {data_entrega}

Deseja aceitar este frete?
Digite *SIM* para aceitar ou *NÃO* para recusar.', 
'["nome_motorista", "tipo_carga", "cidade_origem", "estado_origem", "cidade_destino", "estado_destino", "valor_frete", "data_coleta", "data_entrega"]'),

('Lista de Embarques Disponíveis', 'Mensagem com lista de múltiplos fretes disponíveis', 'offer',
'Olá {nome_motorista}! 🚛

Temos os seguintes fretes disponíveis para você:

{lista_fretes}

Para aceitar um frete, responda com o *número* do embarque.
Para ver mais opções, digite *MAIS*.', 
'["nome_motorista", "lista_fretes"]'),

('Confirmação de Aceite', 'Mensagem de confirmação após motorista aceitar frete', 'confirmation',
'✅ *Frete Confirmado!*

Obrigado, {nome_motorista}!

Seu aceite foi registrado. Estamos validando com o cliente e em breve você receberá a confirmação final com todos os detalhes e documentos necessários.

📋 *Resumo:*
Origem: {cidade_origem}
Destino: {cidade_destino}
Valor: R$ {valor_frete}', 
'["nome_motorista", "cidade_origem", "cidade_destino", "valor_frete"]'),

('Solicitação de Status', 'Mensagem automática para verificar disponibilidade', 'status_request',
'Olá {nome_motorista}! 👋

Como está sua disponibilidade hoje?

Digite:
*DISPONÍVEL* - Se está livre para novos fretes
*OCUPADO* - Se está com carga no momento
*LOCALIZAÇÃO* - Para atualizar sua localização atual', 
'["nome_motorista"]');
