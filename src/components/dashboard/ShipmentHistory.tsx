import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye } from "lucide-react";

const mockHistory = [
  {
    id: "FRT-2024-001",
    date: "15/01/2024",
    origin: "São Paulo, SP",
    destination: "Rio de Janeiro, RJ",
    driver: "João Silva",
    value: 8500,
    status: "Concluído",
  },
  {
    id: "FRT-2024-002",
    date: "14/01/2024",
    origin: "Campinas, SP",
    destination: "Belo Horizonte, MG",
    driver: "Carlos Lima",
    value: 12000,
    status: "Concluído",
  },
  {
    id: "FRT-2024-003",
    date: "13/01/2024",
    origin: "Santos, SP",
    destination: "Curitiba, PR",
    driver: "Pedro Santos",
    value: 6500,
    status: "Concluído",
  },
];

export const ShipmentHistory = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Histórico de Embarques
          </h2>
          <p className="text-muted-foreground">
            Consulte todos os embarques realizados
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, motorista, origem ou destino..."
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Número
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Origem
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Destino
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Motorista
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockHistory.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">
                      {shipment.id}
                    </td>
                    <td className="px-4 py-3 text-sm">{shipment.date}</td>
                    <td className="px-4 py-3 text-sm">{shipment.origin}</td>
                    <td className="px-4 py-3 text-sm">{shipment.destination}</td>
                    <td className="px-4 py-3 text-sm">{shipment.driver}</td>
                    <td className="px-4 py-3 text-sm font-medium text-success">
                      R$ {shipment.value.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className="bg-success text-success-foreground">
                        {shipment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
