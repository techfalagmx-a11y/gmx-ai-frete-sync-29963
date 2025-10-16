import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, RefreshCw, AlertTriangle, Clock, MessageSquare, DollarSign } from "lucide-react";

const mockShipments = [
  {
    id: "FRT-001",
    driver: "João Silva",
    origin: "São Paulo, SP",
    destination: "Rio de Janeiro, RJ",
    status: "em_rota",
    progress: 65,
    estimatedDelivery: "16/01/2024 18:00",
    lastUpdate: "Há 15 min",
    comments: ["Estou a caminho", "Tráfego normal"],
    risk: "baixo",
    waitingAtDestination: false,
  },
  {
    id: "FRT-002",
    driver: "Carlos Lima",
    origin: "Campinas, SP",
    destination: "Belo Horizonte, MG",
    status: "em_rota",
    progress: 40,
    estimatedDelivery: "17/01/2024 10:00",
    lastUpdate: "Há 30 min",
    comments: ["Haverá atraso de 2h devido à chuva"],
    risk: "medio",
    waitingAtDestination: false,
  },
  {
    id: "FRT-003",
    driver: "Pedro Santos",
    origin: "Santos, SP",
    destination: "Curitiba, PR",
    status: "aguardando_descarga",
    progress: 100,
    estimatedDelivery: "16/01/2024 08:00",
    lastUpdate: "Há 2h",
    comments: ["Cheguei no destino", "Aguardando descarga há 2 horas"],
    risk: "alto",
    waitingAtDestination: true,
  },
];

export const RealTimeTracking = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");

  const getRiskBadge = (risk: string) => {
    const riskMap = {
      baixo: { label: "Baixo Risco", className: "bg-success text-success-foreground" },
      medio: { label: "Risco Médio", className: "bg-warning text-warning-foreground" },
      alto: { label: "Alto Risco", className: "bg-danger text-danger-foreground" },
    };
    const config = riskMap[risk as keyof typeof riskMap];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      em_rota: { label: "Em Rota", className: "bg-primary text-primary-foreground" },
      aguardando_descarga: { label: "Aguardando Descarga", className: "bg-warning text-warning-foreground" },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Rastreamento em Tempo Real
        </h2>
        <p className="text-muted-foreground">
          Acompanhe todos os embarques ativos no momento
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Controles e Filtros</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Label htmlFor="auto-refresh" className="text-sm cursor-pointer">
                  Auto-atualizar (30s)
                </Label>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Agora
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Regiões</SelectItem>
                <SelectItem value="sudeste">Sudeste</SelectItem>
                <SelectItem value="sul">Sul</SelectItem>
                <SelectItem value="nordeste">Nordeste</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Riscos</SelectItem>
                <SelectItem value="baixo">Baixo Risco</SelectItem>
                <SelectItem value="medio">Risco Médio</SelectItem>
                <SelectItem value="alto">Alto Risco</SelectItem>
              </SelectContent>
            </Select>

            <Input type="date" placeholder="Data de Entrega" />

            <Button variant="outline" className="w-full">
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "map" | "list")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="map">Mapa</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-6">
          <Card className="shadow-card">
            <CardContent className="p-0">
              <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-lg font-medium">Mapa Interativo</p>
                  <p className="text-sm text-muted-foreground">
                    Integração com Google Maps / Mapbox
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Visualize todos os motoristas em tempo real no mapa
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6 space-y-4">
          {mockShipments.map((shipment) => (
            <Card
              key={shipment.id}
              className={`shadow-card transition-all hover:shadow-hover ${
                shipment.waitingAtDestination ? "border-warning border-2" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold">{shipment.id}</h3>
                      {getStatusBadge(shipment.status)}
                      {getRiskBadge(shipment.risk)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Motorista: <span className="font-medium text-foreground">{shipment.driver}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      <span>{shipment.lastUpdate}</span>
                    </div>
                    {shipment.waitingAtDestination && (
                      <Badge className="bg-danger text-danger-foreground gap-1">
                        <DollarSign className="h-3 w-3" />
                        Diária Necessária
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-success mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Origem</p>
                      <p className="text-sm font-medium">{shipment.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-danger mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Destino</p>
                      <p className="text-sm font-medium">{shipment.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progresso da Viagem</span>
                    <span className="text-sm font-bold text-primary">{shipment.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all"
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Previsão de entrega: {shipment.estimatedDelivery}
                  </p>
                </div>

                {shipment.comments.length > 0 && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1">Últimas Atualizações:</p>
                        {shipment.comments.map((comment, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            • {comment}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {shipment.risk === "alto" && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-danger/10 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-danger" />
                    <p className="text-sm text-danger font-medium">
                      Risco de atraso na entrega - Monitoramento necessário
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
