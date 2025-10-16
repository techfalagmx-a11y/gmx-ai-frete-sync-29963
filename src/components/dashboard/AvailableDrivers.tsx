import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, MapPin, Clock, Truck, List, Grid } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DriverProfileDialog } from "@/components/driver/DriverProfileDialog";

const mockAvailableDrivers = [
  {
    id: 1,
    name: "João Silva",
    plate: "ABC-1234",
    vehicle: "Carreta 3 eixos",
    location: "São Paulo, SP",
    availableSince: "2h",
    lastConfirmed: "14:30",
  },
  {
    id: 2,
    name: "Carlos Lima",
    plate: "DEF-5678",
    vehicle: "Truck 2 eixos",
    location: "Campinas, SP",
    availableSince: "5h",
    lastConfirmed: "11:00",
  },
  {
    id: 3,
    name: "Roberto Alves",
    plate: "JKL-3456",
    vehicle: "Carreta 4 eixos",
    location: "Jundiaí, SP",
    availableSince: "1h",
    lastConfirmed: "15:15",
  },
];

export const AvailableDrivers = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const itemsPerPage = 20;
  
  const totalPages = Math.ceil(mockAvailableDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDrivers = mockAvailableDrivers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Motoristas Disponíveis
          </h2>
          <p className="text-muted-foreground">
            {mockAvailableDrivers.length} motoristas prontos para aceitar fretes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4 mr-2" />
              Cards
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4 mr-2" />
              Tabela
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={(checked) => setAutoRefresh(checked as boolean)}
            />
            <label
              htmlFor="auto-refresh"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Auto-refresh
            </label>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentDrivers.map((driver) => (
            <Card
              key={driver.id}
              className="shadow-card transition-all hover:shadow-md border-success/20 cursor-pointer"
              onClick={() => {
                setSelectedDriver(driver.name);
                setIsProfileOpen(true);
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm">{driver.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {driver.plate}
                    </p>
                  </div>
                  <Badge className="bg-success text-success-foreground text-xs">
                    Disponível
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Truck className="h-3 w-3 text-muted-foreground" />
                  <span>{driver.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>{driver.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Há {driver.availableSince}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Tipo Veículo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Disponível há</TableHead>
                <TableHead>Última Confirmação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDrivers.map((driver) => (
                <TableRow 
                  key={driver.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedDriver(driver.name);
                    setIsProfileOpen(true);
                  }}
                >
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.plate}</TableCell>
                  <TableCell>{driver.vehicle}</TableCell>
                  <TableCell>{driver.location}</TableCell>
                  <TableCell>{driver.availableSince}</TableCell>
                  <TableCell>{driver.lastConfirmed}</TableCell>
                  <TableCell>
                    <Badge className="bg-success text-success-foreground">Disponível</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => setCurrentPage(pageNum)}
                  isActive={currentPage === pageNum}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <DriverProfileDialog
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        driverName={selectedDriver}
      />
    </div>
  );
};
