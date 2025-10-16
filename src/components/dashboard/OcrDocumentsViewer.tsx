import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OcrDocumentViewer } from "./OcrDocumentViewer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, Receipt, Loader2 } from "lucide-react";

export const OcrDocumentsViewer = () => {
  const { toast } = useToast();
  const [deliveryReceipts, setDeliveryReceipts] = useState<any[]>([]);
  const [driverDocuments, setDriverDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const [receiptsResult, documentsResult] = await Promise.all([
        supabase.from("delivery_receipts").select("*").order("created_at", { ascending: false }),
        supabase.from("driver_documents").select("*").order("created_at", { ascending: false }),
      ]);

      if (receiptsResult.error) throw receiptsResult.error;
      if (documentsResult.error) throw documentsResult.error;

      setDeliveryReceipts(receiptsResult.data || []);
      setDriverDocuments(documentsResult.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar os documentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Processados com OCR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="receipts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receipts" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Canhotos de Entrega ({deliveryReceipts.length})
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos de Motoristas ({driverDocuments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="receipts" className="space-y-4 mt-6">
              {deliveryReceipts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum canhoto de entrega processado ainda.
                </div>
              ) : (
                deliveryReceipts.map((receipt) => (
                  <OcrDocumentViewer
                    key={receipt.id}
                    documentId={receipt.id}
                    documentType="delivery_receipt"
                    data={{
                      image_url: receipt.image_url,
                      verified: receipt.verified,
                      ocr_raw_data: receipt.ocr_raw_data,
                      delivery_date: receipt.delivery_date,
                      delivery_time: receipt.delivery_time,
                      receiver_name: receipt.receiver_name,
                      receiver_signature: receipt.receiver_signature,
                      observations: receipt.observations,
                    }}
                    onUpdate={fetchDocuments}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-6">
              {driverDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum documento de motorista processado ainda.
                </div>
              ) : (
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
                    onUpdate={fetchDocuments}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
