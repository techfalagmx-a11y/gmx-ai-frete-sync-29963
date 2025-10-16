import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, MapPin, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data para visualização
const mockShipments = [
  {
    id: "1",
    driver_name: "João Silva",
    origin: "São Paulo, SP",
    destination: "Rio de Janeiro, RJ",
    status: "em_transito",
    current_latitude: -23.5505,
    current_longitude: -46.6333,
    delivery_window_start: new Date(2025, 0, 20, 14, 0),
    delivery_window_end: new Date(2025, 0, 20, 18, 0),
    actual_arrival_time: null,
    progress: 45,
  },
  {
    id: "2",
    driver_name: "Maria Costa",
    origin: "Campinas, SP",
    destination: "Belo Horizonte, MG",
    status: "em_transito",
    current_latitude: -22.9068,
    current_longitude: -47.0631,
    delivery_window_start: new Date(2025, 0, 20, 16, 0),
    delivery_window_end: new Date(2025, 0, 20, 20, 0),
    actual_arrival_time: null,
    progress: 30,
  },
  {
    id: "3",
    driver_name: "Carlos Lima",
    origin: "Santos, SP",
    destination: "Curitiba, PR",
    status: "entregue",
    current_latitude: -25.4284,
    current_longitude: -49.2733,
    delivery_window_start: new Date(2025, 0, 20, 10, 0),
    delivery_window_end: new Date(2025, 0, 20, 14, 0),
    actual_arrival_time: new Date(2025, 0, 20, 12, 30),
    progress: 100,
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  em_transito: { label: "Em Trânsito", color: "#3b82f6" },
  entregue: { label: "Entregue", color: "#22c55e" },
  atrasado: { label: "Atrasado", color: "#ef4444" },
};

export const VehicleTrackingMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-46.6333, -23.5505],
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setIsMapReady(true);
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!isMapReady || !map.current) return;

    // Remove markers antigos
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Adicionar markers para cada embarque
    mockShipments.forEach((shipment) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = statusConfig[shipment.status]?.color || "#3b82f6";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([shipment.current_longitude, shipment.current_latitude])
        .addTo(map.current!);

      el.addEventListener("click", () => {
        setSelectedShipment(shipment);
      });

      markers.current.push(marker);
    });
  }, [isMapReady]);

  if (!mapboxToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rastreamento de Veículos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm mb-4">
              Para visualizar o mapa, insira seu token público do Mapbox.
              <br />
              Obtenha em: <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">account.mapbox.com</a>
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={() => setIsMapReady(false)}>
                Carregar Mapa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Rastreamento em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={mapContainer} className="h-[600px] rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Veículos Ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockShipments.map((shipment) => (
              <div
                key={shipment.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedShipment?.id === shipment.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedShipment(shipment)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{shipment.driver_name}</span>
                  </div>
                  <Badge
                    style={{
                      backgroundColor: statusConfig[shipment.status]?.color,
                      color: "white",
                    }}
                  >
                    {statusConfig[shipment.status]?.label}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    {shipment.origin} → {shipment.destination}
                  </p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Janela: {format(shipment.delivery_window_start, "HH:mm", { locale: ptBR })} -{" "}
                    {format(shipment.delivery_window_end, "HH:mm", { locale: ptBR })}
                  </div>
                  {shipment.actual_arrival_time && (
                    <div className="flex items-center gap-1 text-success">
                      ✓ Chegada: {format(shipment.actual_arrival_time, "HH:mm", { locale: ptBR })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedShipment && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhes do Embarque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Motorista</p>
                <p className="font-medium">{selectedShipment.driver_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rota</p>
                <p className="font-medium">
                  {selectedShipment.origin} → {selectedShipment.destination}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Progresso</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${selectedShipment.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{selectedShipment.progress}%</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Janela de Entrega</p>
                <p className="font-medium">
                  {format(selectedShipment.delivery_window_start, "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}{" "}
                  -{" "}
                  {format(selectedShipment.delivery_window_end, "HH:mm", { locale: ptBR })}
                </p>
              </div>
              {selectedShipment.actual_arrival_time ? (
                <div>
                  <p className="text-muted-foreground">Hora de Chegada Real</p>
                  <p className="font-medium text-success">
                    {format(selectedShipment.actual_arrival_time, "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-2 bg-muted rounded">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Aguardando chegada no destino
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
