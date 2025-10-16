-- Força regeneração dos tipos do Supabase
-- Adiciona comentários às tabelas existentes para atualizar os tipos

COMMENT ON TABLE public.message_templates IS 'Armazena templates de mensagens para comunicação com motoristas';
COMMENT ON TABLE public.ranking_rules IS 'Armazena regras de rankeamento para seleção de motoristas';

-- Garante que as tabelas têm os índices necessários
CREATE INDEX IF NOT EXISTS idx_message_templates_active ON public.message_templates(active);
CREATE INDEX IF NOT EXISTS idx_ranking_rules_active ON public.ranking_rules(active);
CREATE INDEX IF NOT EXISTS idx_ranking_rules_priority ON public.ranking_rules(priority);