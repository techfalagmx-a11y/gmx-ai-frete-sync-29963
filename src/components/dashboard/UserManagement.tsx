import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, User } from "lucide-react";

const mockUsers = [
  {
    id: 1,
    name: "Admin Sistema",
    email: "admin@gmx.com.br",
    role: "Administrador",
    lastAccess: "Há 1 hora",
  },
  {
    id: 2,
    name: "Maria Operacional",
    email: "maria@gmx.com.br",
    role: "Operacional",
    lastAccess: "Há 2 horas",
  },
  {
    id: 3,
    name: "João Financeiro",
    email: "joao@gmx.com.br",
    role: "Financeiro",
    lastAccess: "Há 5 horas",
  },
];

const permissions = [
  { id: "cadastros", label: "Cadastros" },
  { id: "disponiveis", label: "Disponíveis" },
  { id: "embarques", label: "Embarques" },
  { id: "historico", label: "Histórico" },
  { id: "dashboard", label: "Dashboard" },
  { id: "faq", label: "FAQ IA" },
  { id: "usuarios", label: "Usuários" },
];

const roleColors = {
  Administrador: "bg-primary text-primary-foreground",
  Operacional: "bg-success text-success-foreground",
  Financeiro: "bg-warning text-warning-foreground",
};

export const UserManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Usuários e Permissões
          </h2>
          <p className="text-muted-foreground">
            Gerencie o acesso ao sistema
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Cadastrar/Editar Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input placeholder="Nome completo" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <Input type="email" placeholder="email@gmx.com.br" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nível de Acesso</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option>Selecione...</option>
                <option>Administrador</option>
                <option>Operacional</option>
                <option>Financeiro</option>
                <option>Visualizador</option>
              </select>
            </div>
          </div>

          <Button className="w-full bg-gradient-success">Salvar Usuário</Button>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Matriz de Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Permissão
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium">
                    Administrador
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium">
                    Operacional
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium">
                    Financeiro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {permission.label}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox checked disabled />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        checked={permission.id !== "faq" && permission.id !== "usuarios"}
                        disabled
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        checked={permission.id === "dashboard" || permission.id === "historico"}
                        disabled
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockUsers.map((user) => (
          <Card key={user.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{user.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
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
            <CardContent className="space-y-2">
              <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                {user.role}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Último acesso: {user.lastAccess}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
