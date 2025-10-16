import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RankingRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  active: boolean;
  rule_type: string;
  rule_config: any;
}

export const RankingRulesConfig = () => {
  const [rules, setRules] = useState<RankingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<RankingRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ranking_rules')
      .select('*')
      .order('priority');

    if (error) {
      toast({
        title: "Erro ao carregar regras",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setRules(data || []);
    }
    setLoading(false);
  };

  const toggleRuleStatus = async (ruleId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('ranking_rules')
      .update({ active: !currentStatus })
      .eq('id', ruleId);

    if (error) {
      toast({
        title: "Erro ao atualizar regra",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Regra atualizada",
        description: "Status da regra alterado com sucesso",
      });
      fetchRules();
    }
  };

  const changePriority = async (ruleId: string, currentPriority: number, direction: 'up' | 'down') => {
    const newPriority = direction === 'up' ? currentPriority - 1 : currentPriority + 1;
    
    const { error } = await supabase
      .from('ranking_rules')
      .update({ priority: newPriority })
      .eq('id', ruleId);

    if (error) {
      toast({
        title: "Erro ao alterar prioridade",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchRules();
    }
  };

  const deleteRule = async (ruleId: string) => {
    const { error } = await supabase
      .from('ranking_rules')
      .delete()
      .eq('id', ruleId);

    if (error) {
      toast({
        title: "Erro ao deletar regra",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Regra deletada",
        description: "Regra removida com sucesso",
      });
      fetchRules();
    }
  };

  const saveRule = async (rule: Partial<RankingRule>) => {
    if (!rule.name || !rule.rule_type) {
      toast({
        title: "Erro de validação",
        description: "Nome e tipo da regra são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingRule?.id) {
      const { error } = await supabase
        .from('ranking_rules')
        .update({
          name: rule.name,
          description: rule.description,
          rule_type: rule.rule_type,
          rule_config: rule.rule_config,
          priority: rule.priority,
          active: rule.active,
        })
        .eq('id', editingRule.id);

      if (error) {
        toast({
          title: "Erro ao atualizar regra",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from('ranking_rules')
        .insert([{
          name: rule.name,
          description: rule.description,
          rule_type: rule.rule_type,
          rule_config: rule.rule_config,
          priority: rule.priority || 999,
          active: rule.active ?? true,
        }]);

      if (error) {
        toast({
          title: "Erro ao criar regra",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Regra salva",
      description: "Configuração atualizada com sucesso",
    });
    setIsDialogOpen(false);
    setEditingRule(null);
    fetchRules();
  };

  const getRuleTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      distance: "Distância",
      availability: "Disponibilidade",
      acceptance_rate: "Taxa de Aceitação",
      last_freight: "Último Frete",
      rating: "Avaliação"
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configuração de Rankeamento</h2>
          <p className="text-muted-foreground">
            Defina as regras para priorizar motoristas nas ofertas de frete
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary" onClick={() => setEditingRule(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Editar Regra' : 'Nova Regra de Rankeamento'}
              </DialogTitle>
            </DialogHeader>
            <RuleEditForm 
              rule={editingRule} 
              onSave={saveRule}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingRule(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regras Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Prioridade</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        {rule.priority}
                        <div className="flex flex-col ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => changePriority(rule.id, rule.priority, 'up')}
                            disabled={rule.priority === 1}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => changePriority(rule.id, rule.priority, 'down')}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getRuleTypeLabel(rule.rule_type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {rule.rule_config?.weight || 1}x
                      </span>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={rule.active}
                        onCheckedChange={() => toggleRuleStatus(rule.id, rule.active)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRule(rule);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const RuleEditForm = ({ 
  rule, 
  onSave, 
  onCancel 
}: { 
  rule: RankingRule | null; 
  onSave: (rule: Partial<RankingRule>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    description: rule?.description || '',
    rule_type: rule?.rule_type || 'distance',
    weight: rule?.rule_config?.weight || 1,
    max_distance_km: rule?.rule_config?.max_distance_km || 100,
    min_rate: rule?.rule_config?.min_rate || 70,
    min_rating: rule?.rule_config?.min_rating || 4.0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ruleConfig: any = { weight: formData.weight };
    
    if (formData.rule_type === 'distance') {
      ruleConfig.max_distance_km = formData.max_distance_km;
    } else if (formData.rule_type === 'acceptance_rate') {
      ruleConfig.min_rate = formData.min_rate;
    } else if (formData.rule_type === 'rating') {
      ruleConfig.min_rating = formData.min_rating;
    }

    onSave({
      name: formData.name,
      description: formData.description,
      rule_type: formData.rule_type,
      rule_config: ruleConfig,
      priority: rule?.priority || 999,
      active: rule?.active ?? true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome da Regra</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="rule_type">Tipo de Regra</Label>
        <select
          id="rule_type"
          className="w-full border rounded-md p-2"
          value={formData.rule_type}
          onChange={(e) => setFormData({ ...formData, rule_type: e.target.value })}
        >
          <option value="distance">Distância</option>
          <option value="availability">Disponibilidade</option>
          <option value="acceptance_rate">Taxa de Aceitação</option>
          <option value="rating">Avaliação</option>
          <option value="last_freight">Último Frete</option>
        </select>
      </div>

      <div>
        <Label htmlFor="weight">Peso da Regra: {formData.weight}x</Label>
        <Slider
          id="weight"
          min={1}
          max={10}
          step={1}
          value={[formData.weight]}
          onValueChange={([value]) => setFormData({ ...formData, weight: value })}
          className="mt-2"
        />
      </div>

      {formData.rule_type === 'distance' && (
        <div>
          <Label htmlFor="max_distance">Distância Máxima (km): {formData.max_distance_km} km</Label>
          <Slider
            id="max_distance"
            min={10}
            max={500}
            step={10}
            value={[formData.max_distance_km]}
            onValueChange={([value]) => setFormData({ ...formData, max_distance_km: value })}
            className="mt-2"
          />
        </div>
      )}

      {formData.rule_type === 'acceptance_rate' && (
        <div>
          <Label htmlFor="min_rate">Taxa Mínima de Aceitação: {formData.min_rate}%</Label>
          <Slider
            id="min_rate"
            min={0}
            max={100}
            step={5}
            value={[formData.min_rate]}
            onValueChange={([value]) => setFormData({ ...formData, min_rate: value })}
            className="mt-2"
          />
        </div>
      )}

      {formData.rule_type === 'rating' && (
        <div>
          <Label htmlFor="min_rating">Avaliação Mínima: {formData.min_rating.toFixed(1)} ⭐</Label>
          <Slider
            id="min_rating"
            min={0}
            max={5}
            step={0.5}
            value={[formData.min_rating]}
            onValueChange={([value]) => setFormData({ ...formData, min_rating: value })}
            className="mt-2"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-gradient-primary">
          Salvar Regra
        </Button>
      </div>
    </form>
  );
};
