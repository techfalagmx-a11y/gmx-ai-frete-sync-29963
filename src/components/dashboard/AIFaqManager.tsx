import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MessageSquare } from "lucide-react";

const mockFaqs = [
  {
    id: 1,
    question: "Quanto tempo demora o pagamento?",
    answer: "O pagamento é feito em até 48h após confirmação da entrega com canhoto.",
    category: "Financeiro",
    active: true,
    usageCount: 45,
  },
  {
    id: 2,
    question: "Como aceitar uma oferta de frete?",
    answer: "Basta responder 'SIM' ou 'ACEITO' quando receber a oferta via WhatsApp.",
    category: "Processo",
    active: true,
    usageCount: 32,
  },
  {
    id: 3,
    question: "Preciso renovar minha CNH?",
    answer: "Sim, sua CNH está próxima do vencimento. Por favor, envie a nova via WhatsApp.",
    category: "Documentação",
    active: true,
    usageCount: 18,
  },
];

const categories = ["Financeiro", "Documentação", "Processo", "Localização", "Suporte"];

export const AIFaqManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">FAQ da IA</h2>
          <p className="text-muted-foreground">
            Gerencie as respostas automáticas do assistente
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Nova Resposta
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Adicionar/Editar Resposta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Pergunta/Gatilho
            </label>
            <Input placeholder="Ex: Quanto tempo demora o pagamento?" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Resposta</label>
            <Textarea
              placeholder="Digite a resposta que a IA deve dar..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Use variáveis: {"{nome_motorista}"}, {"{valor_frete}"}, {"{data}"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option>Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-gradient-success">Salvar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {mockFaqs.map((faq) => (
          <Card key={faq.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </div>
                  <Badge variant="outline">{faq.category}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {faq.answer}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                <span>Usada {faq.usageCount}x nos últimos 7 dias</span>
                <Badge className={faq.active ? "bg-success" : "bg-muted"}>
                  {faq.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
