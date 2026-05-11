import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetPlatformStats,
  useListUsers,
  useToggleUserPremium,
  useListPayments,
  useApprovePayment,
  useRejectPayment,
  useListResources,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Users, Star, BookOpen, CreditCard, LayoutDashboard, FileText,
  LogOut, Menu, CheckCircle, XCircle, Loader2, ArrowRightLeft
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminDashboard() {
  const { user, role, signOut, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) setLocation("/auth/login");
    else if (!authLoading && role !== "admin") setLocation("/");
  }, [user, role, authLoading, setLocation]);

  const { data: stats } = useGetPlatformStats();
  const { data: users, isLoading: usersLoading } = useListUsers({
    search: userSearch || undefined,
    role: userRoleFilter !== "all" ? userRoleFilter : undefined
  });
  const { data: payments, isLoading: paymentsLoading } = useListPayments();
  const { data: resources } = useListResources();

  const togglePremium = useToggleUserPremium();
  const approvePayment = useApprovePayment();
  const rejectPayment = useRejectPayment();

  const handleTogglePremium = (userId: string, currentStatus: boolean) => {
    if (confirm(`Voulez-vous ${currentStatus ? 'révoquer' : 'accorder'} l'accès Premium ?`)) {
      togglePremium.mutate({ id: userId, data: { is_premium: !currentStatus } }, {
        onSuccess: () => {
          toast({ title: "Statut Premium mis à jour" });
          queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        }
      });
    }
  };

  const handleApprovePayment = (paymentId: string) => {
    if (confirm("Approuver ce paiement et accorder l'accès Premium ?")) {
      approvePayment.mutate({ id: paymentId }, {
        onSuccess: () => {
          toast({ title: "Paiement approuvé" });
          queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
          queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
        }
      });
    }
  };

  const handleRejectPayment = (paymentId: string) => {
    if (confirm("Rejeter ce paiement ?")) {
      rejectPayment.mutate({ id: paymentId }, {
        onSuccess: () => {
          toast({ title: "Paiement rejeté" });
          queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
        }
      });
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="h-16 bg-primary text-white flex items-center justify-between px-4 lg:px-8 border-b border-primary-foreground/10">
        <div className="font-serif text-xl font-bold flex items-center">
          <LayoutDashboard className="mr-2 h-5 w-5 text-[#D4AF37]" />
          Administration Victoire
        </div>
        <Button variant="ghost" className="text-white hover:text-red-300 hover:bg-white/10" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Déconnexion
        </Button>
      </header>

      <main className="p-4 lg:p-8 max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border shadow-sm h-12 p-1">
            <TabsTrigger value="overview" className="text-sm"><LayoutDashboard className="h-4 w-4 mr-2"/> Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users" className="text-sm"><Users className="h-4 w-4 mr-2"/> Utilisateurs</TabsTrigger>
            <TabsTrigger value="payments" className="text-sm">
              <CreditCard className="h-4 w-4 mr-2"/> Paiements
              {stats?.pending_payments ? <Badge className="ml-2 bg-destructive">{stats.pending_payments}</Badge> : null}
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-sm"><BookOpen className="h-4 w-4 mr-2"/> Ressources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.total_users || 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Membres Premium</CardTitle>
                  <Star className="h-4 w-4 text-[#D4AF37]" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#D4AF37]">{stats?.premium_users || 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Candidats</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.total_candidates || 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Instructeurs</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.total_instructors || 0}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ressources</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.total_resources || 0}</div></CardContent>
              </Card>
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800">Paiements en attente</CardTitle>
                  <CreditCard className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold text-orange-700">{stats?.pending_payments || 0}</div></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Input placeholder="Rechercher (email, nom)..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="max-w-sm" />
              <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Rôle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="candidate">Candidats</SelectItem>
                  <SelectItem value="instructor">Instructeurs</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-background rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom complet</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.full_name || "-"}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                      <TableCell>
                        {u.is_premium ? <Badge className="bg-[#D4AF37]">Premium</Badge> : <Badge variant="secondary">Gratuit</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleTogglePremium(u.id, u.is_premium)} disabled={togglePremium.isPending}>
                          <ArrowRightLeft className="mr-2 h-4 w-4" /> Toggle Premium
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="bg-background rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments?.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono text-xs">{p.user_id.substring(0,8)}...</TableCell>
                      <TableCell className="font-medium">{p.amount} FCFA</TableCell>
                      <TableCell><Badge variant="outline" className="uppercase">{p.method}</Badge></TableCell>
                      <TableCell>
                        {p.status === 'pending' && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En attente</Badge>}
                        {p.status === 'approved' && <Badge variant="secondary" className="bg-green-100 text-green-800">Approuvé</Badge>}
                        {p.status === 'rejected' && <Badge variant="secondary" className="bg-red-100 text-red-800">Rejeté</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        {p.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprovePayment(p.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleRejectPayment(p.id)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="bg-background rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Accès</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources?.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium max-w-[300px] truncate">{r.title}</TableCell>
                      <TableCell><Badge variant="outline">{r.content_type}</Badge></TableCell>
                      <TableCell>{r.is_free ? <Badge variant="secondary">Gratuit</Badge> : <Badge className="bg-[#D4AF37]">Premium</Badge>}</TableCell>
                      <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
