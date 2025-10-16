import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, DollarSign, Calendar, Mail, FileText, Upload, Eye, Download } from "lucide-react";

interface ShipmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: any;
}

export const ShipmentDetailsDialog = ({ open, onOpenChange, shipment }: ShipmentDetailsDialogProps) => {
  if (!shipment) return null;

  const routeStates = ["SP", "MG", "RJ"];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
              <span className="font-bold">Embarque #{shipment.id}</span>
              <Badge className="bg-success text-success-foreground text-xs">
                {shipment.status || "Em Processo"}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="route">Rota e Fiscal</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Carga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-success mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Origem</p>
                      <p className="font-medium">{shipment.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-danger mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Destino</p>
                      <p className="font-medium">{shipment.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Package className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Carga</p>
                      <p className="font-medium">{shipment.cargo}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-success mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="font-medium text-success">R$ {shipment.value?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {shipment.driver && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Motorista Responsável</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{shipment.driver}</p>
                      <Button variant="outline" size="sm">
                        Ver Perfil
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  E-mail Original
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Recebido:</span> {shipment.deadline}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Remetente:</span> industria@example.com
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="route" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rota e Estados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">Mapa da Rota (Integração Google Maps)</p>
                </div>

                <div className="space-y-3">
                  <p className="font-medium">Estados da Rota:</p>
                  {routeStates.map((state, index) => (
                    <div key={state} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{state}</Badge>
                        <span className="text-sm">Documentos Fiscais</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={index === 1 ? "bg-success text-success-foreground" : ""}>
                          {index === 1 ? "✓ Emitido" : "Pendente"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comprovantes de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Comprovante (70-90% Adiantamento)
                </Button>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Nenhum comprovante anexado ainda</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Canhoto de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full mb-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Manual do Canhoto
                </Button>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">OCR Automático</p>
                  <p className="text-sm text-muted-foreground">
                    Quando o motorista enviar o canhoto via WhatsApp, ele aparecerá aqui automaticamente com os dados extraídos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentos Fiscais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {routeStates.map((state) => (
                    <div key={state} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">NF - Estado {state}</span>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico do Embarque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-success rounded-full" />
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Oferta Recebida</p>
                      <p className="text-sm text-muted-foreground">{shipment.deadline}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Em Processo de Matching</p>
                      <p className="text-sm text-muted-foreground">Buscando motorista disponível...</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
