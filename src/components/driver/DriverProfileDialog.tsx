import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Truck, Package, DollarSign, Calendar, FileText } from "lucide-react";
import { OcrDocumentViewer } from "@/components/dashboard/OcrDocumentViewer";
import { supabase } from "@/integrations/supabase/client";

interface DriverProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverName: string | null;
  driverData?: any;
}

export const DriverProfileDialog = ({ open, onOpenChange, driverName, driverData }: DriverProfileDialogProps) => {
  const [driverDocuments, setDriverDocuments] = useState<any[]>([]);
  const [allFields, setAllFields] = useState<any[]>([]);
  
  useEffect(() => {
    if (open) {
      fetchAllFields();
      if (driverData?.id) {
        fetchDriverDocuments();
      }
    }
  }, [open, driverData]);

  const fetchAllFields = async () => {
    const { data } = await supabase
      .from("driver_field_config")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) setAllFields(data);
  };

  const fetchDriverDocuments = async () => {
    if (!driverData?.id) return;
    
    const { data, error } = await supabase
      .from("driver_documents")
      .select("*")
      .eq("driver_id", driverData.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDriverDocuments(data);
    }
  };
  
  // Mock data for fallback
  const mockData = {
    name: driverName || "",
    phone: "(11) 98765-4321",
    vehicle: "Scania R450 - Placa: ABC-1234",
    totalTrips: 47,
    totalValue: 425000,
    rating: 4.8,
    recentTrips: [
      {
        id: 1,
        date: "15/01/2025",
        origin: "São Paulo, SP",
        destination: "Rio de Janeiro, RJ",
        cargo: "Autopeças",
        value: 8500,
        status: "Concluído",
      },
      {
        id: 2,
        date: "10/01/2025",
        origin: "Campinas, SP",
        destination: "Belo Horizonte, MG",
        cargo: "Eletrônicos",
        value: 12000,
        status: "Concluído",
      },
      {
        id: 3,
        date: "05/01/2025",
        origin: "Santos, SP",
        destination: "Curitiba, PR",
        cargo: "Alimentos",
        value: 6500,
        status: "Concluído",
      },
    ],
  };

  const displayData = driverData || mockData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Motorista
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6 mt-4">
            {/* Informações Completas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Completas</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {allFields.length > 0 && driverData ? (
                  allFields.map((field) => {
                    const value = driverData[field.field_name];
                    if (!value && value !== 0 && value !== false) return null;
                    
                    return (
                      <div key={field.id} className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm text-muted-foreground">{field.display_name}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-sm text-muted-foreground">Nome:</span>
                      <span className="font-medium">{displayData.name}</span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-sm text-muted-foreground">Telefone:</span>
                      <span className="font-medium">{displayData.phone}</span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-sm text-muted-foreground">Veículo:</span>
                      <span className="font-medium">{displayData.vehicle}</span>
                    </div>
                    {displayData.rating && (
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm text-muted-foreground">Avaliação:</span>
                        <Badge variant="secondary">{displayData.rating} ⭐</Badge>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Estatísticas */}
            {displayData.totalTrips && (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Viagens</p>
                        <p className="text-2xl font-bold">{displayData.totalTrips}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-success/10">
                        <DollarSign className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Total Transportado</p>
                        <p className="text-2xl font-bold">R$ {displayData.totalValue?.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Histórico de Viagens */}
            {displayData.recentTrips && displayData.recentTrips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Histórico de Cargas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayData.recentTrips.map((trip: any) => (
                      <div
                        key={trip.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{trip.cargo}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              {trip.date}
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-success/10">
                            {trip.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            {trip.origin} → {trip.destination}
                          </p>
                          <p className="font-semibold text-success">
                            R$ {trip.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentos do Motorista
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {driverDocuments.length > 0 ? (
                  driverDocuments.map((doc) => (
                    <OcrDocumentViewer
                      key={doc.id}
                      documentId={doc.id}
                      documentType="driver_document"
                      data={{
                        image_url: doc.image_url,
                        verified: doc.verified,
                        ocr_raw_data: doc.ocr_raw_data,
                        document_number: doc.document_number,
                        issue_date: doc.issue_date,
                        expiry_date: doc.expiry_date,
                        issuing_agency: doc.issuing_agency,
                      }}
                      onUpdate={fetchDriverDocuments}
                    />
                  ))
                ) : (
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Nenhum documento processado ainda
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
