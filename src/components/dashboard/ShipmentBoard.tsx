import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, CheckCircle, X, Mail, Maximize2, Play } from "lucide-react";
import { ShipmentDetailsDialog } from "@/components/shipment/ShipmentDetailsDialog";
import { ShipmentTimer } from "@/components/shipment/ShipmentTimer";
import { useNavigate } from "react-router-dom";

const shipmentColumns = [
  {
    title: "Novas Ofertas",
    status: "new",
    color: "border-warning/50 bg-warning/5",
    badgeColor: "bg-warning text-warning-foreground",
    shipments: [
      {
        id: 1,
        origin: "São Paulo, SP",
        destination: "Rio de Janeiro, RJ",
        cargo: "Autopeças",
        value: 8500,
        deadline: "Há 15 min",
      },
    ],
  },
  {
    title: "Ofertas Enviadas",
    status: "sent",
    color: "border-primary/50 bg-primary/5",
    badgeColor: "bg-primary text-primary-foreground",
    shipments: [
      {
        id: 2,
        origin: "Campinas, SP",
        destination: "Belo Horizonte, MG",
        cargo: "Eletrônicos",
        value: 12000,
        deadline: "Há 1h",
        driver: "João Silva",
      },
    ],
  },
  {
    title: "Aguardando Confirmação GMX",
    status: "pending",
    color: "border-success/50 bg-success/5 ring-2 ring-success/20",
    badgeColor: "bg-success text-success-foreground",
    shipments: [
      {
        id: 3,
        origin: "Santos, SP",
        destination: "Curitiba, PR",
        cargo: "Alimentos",
        value: 6500,
        deadline: "Há 30 min",
        driver: "Carlos Lima",
      },
    ],
  },
  {
    title: "Confirmados - Aguardando Adiantamento",
    status: "confirmed",
    color: "border-primary/30 bg-primary/10",
    badgeColor: "bg-primary text-primary-foreground",
    shipments: [
      {
        id: 4,
        origin: "Jundiaí, SP",
        destination: "Vitória, ES",
        cargo: "Materiais de Construção",
        value: 9500,
        deadline: "Há 2h",
        driver: "Pedro Santos",
        advancePayment: 70,
      },
    ],
  },
  {
    title: "Corridas em Andamento",
    status: "in_progress",
    color: "border-success/30 bg-success/10",
    badgeColor: "bg-gradient-success text-white",
    shipments: [
      {
        id: 5,
        origin: "Guarulhos, SP",
        destination: "Salvador, BA",
        cargo: "Produtos Químicos",
        value: 15000,
        driver: "Maria Costa",
        startedAt: "Há 3h",
      },
    ],
  },
];

export const ShipmentBoard = () => {
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (shipment: any) => {
    setSelectedShipment(shipment);
    setDialogOpen(true);
  };

  const handleDriverClick = (driverName: string) => {
    navigate("/dashboard", { state: { tab: "cadastros", searchDriver: driverName } });
  };

  return (
    <div className="space-y-6">
      <ShipmentDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shipment={selectedShipment}
      />
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Embarques - Ofertas de Fretes
        </h2>
        <p className="text-muted-foreground">
          Acompanhe o status de todas as ofertas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {shipmentColumns.map((column) => (
          <div key={column.status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <Badge className={column.badgeColor}>
                {column.shipments.length}
              </Badge>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              {column.shipments.map((shipment) => (
                <Card
                  key={shipment.id}
                  className={`shadow-card transition-all hover:shadow-hover cursor-pointer ${column.color}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium">
                        {shipment.cargo}
                      </CardTitle>
                      <ShipmentTimer deadline={shipment.deadline} className="text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{shipment.origin}</p>
                          <p className="text-xs text-muted-foreground">Origem</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-danger mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{shipment.destination}</p>
                          <p className="text-xs text-muted-foreground">Destino</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-success">
                        R$ {shipment.value.toLocaleString()}
                      </span>
                    </div>

                    {shipment.driver && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Motorista:{" "}
                          <button
                            className="font-medium text-primary hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDriverClick(shipment.driver);
                            }}
                          >
                            {shipment.driver}
                          </button>
                        </p>
                      </div>
                    )}

                    {shipment.startedAt && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-success font-medium">
                          🚛 Em rota desde {shipment.startedAt}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewDetails(shipment)}
                      >
                        <Maximize2 className="h-3 w-3 mr-1" />
                        Detalhes
                      </Button>
                    </div>

                    {column.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-gradient-success hover:opacity-90" size="sm">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Confirmar GMX
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-destructive/10">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {column.status === "confirmed" && (
                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-gradient-primary hover:opacity-90" size="sm">
                          <Play className="mr-1 h-3 w-3" />
                          Iniciar Corrida
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
