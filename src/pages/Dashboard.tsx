import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DriverRegistry } from "@/components/dashboard/DriverRegistry";
import { AvailableDrivers } from "@/components/dashboard/AvailableDrivers";
import { ShipmentBoard } from "@/components/dashboard/ShipmentBoard";
import { ShipmentHistory } from "@/components/dashboard/ShipmentHistory";
import { StatsDashboard } from "@/components/dashboard/StatsDashboard";
import { AIFaqManager } from "@/components/dashboard/AIFaqManager";
import { UserManagement } from "@/components/dashboard/UserManagement";
import { RealTimeTracking } from "@/components/dashboard/RealTimeTracking";
import { RankingRulesConfig } from "@/components/dashboard/RankingRulesConfig";
import { MessageTemplatesConfig } from "@/components/dashboard/MessageTemplatesConfig";
import {
  Users,
  UserCheck,
  Package,
  History,
  BarChart3,
  MessageSquare,
  Settings,
  MapPin,
  Sliders,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">GMX</h1>
                <p className="text-sm text-muted-foreground">
                  Sistema de Gestão de Fretes
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 lg:w-auto lg:inline-grid overflow-x-auto">
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="registry" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Cadastros</span>
            </TabsTrigger>
            <TabsTrigger value="available" className="gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Disponíveis</span>
            </TabsTrigger>
            <TabsTrigger value="shipments" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Embarques</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Rastreamento</span>
            </TabsTrigger>
            <TabsTrigger value="ranking" className="gap-2">
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">Rankeamento</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Mensagens</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ IA</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <StatsDashboard />
          </TabsContent>

          <TabsContent value="registry" className="space-y-6">
            <DriverRegistry />
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <AvailableDrivers />
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            <ShipmentBoard />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <ShipmentHistory />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <RealTimeTracking />
          </TabsContent>

          <TabsContent value="ranking" className="space-y-6">
            <RankingRulesConfig />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <MessageTemplatesConfig />
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <AIFaqManager />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
