import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import PremiumModal from "@/components/PremiumModal";
import {
  Home, BookOpen, FileText, Lightbulb, Star, LogOut,
  Search, Bell, Lock, Menu, ChevronRight, GraduationCap,
  BookMarked, Library, TrendingUp, Award, ChevronDown
} from "lucide-react";
import { useListResources } from "@workspace/api-client-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CONCOURS_SUBJECTS: Record<string, string[]> = {
  ENA_CS:       ["Aptitude Verbale", "Culture Générale", "Logique", "Anglais", "Sujet d'ordre général", "Note de Synthèse", "Problèmes éco et sociaux", "Droit Administratif"],
  ENA_CMS:      ["Aptitude Verbale", "Culture Générale", "Logique", "Anglais", "Sujet d'ordre général", "Contraction de Texte", "Problèmes éco et sociaux", "Droit Constitutionnel"],
  ENA_CM:       ["Aptitude Verbale", "Culture Générale", "Logique", "Anglais", "Sujet d'ordre général", "Connaissance du Monde Contemporain"],
  ENS:          ["Culture Générale", "Français", "Mathématiques", "Anglais", "Pédagogie", "Histoire-Géographie"],
  INFAS:        ["Culture Générale", "Français", "Mathématiques", "Anglais", "Biologie", "Chimie"],
  INFS:         ["Culture Générale", "Français", "Mathématiques", "Anglais", "Droit Social", "Économie"],
  EAUX_FORETS:  ["Culture Générale", "Français", "Mathématiques", "Anglais", "Sciences Naturelles", "Géographie"],
  POLICE:       ["Culture Générale", "Français", "Mathématiques", "Anglais", "Droit", "Éducation Physique"],
  GENDARMERIE:  ["Culture Générale", "Français", "Mathématiques", "Anglais", "Droit", "Instruction Civique"],
  ARMEE:        ["Culture Générale", "Français", "Mathématiques", "Anglais", "Histoire", "Géographie"],
};

const CONCOURS_LABELS: Record<string, string> = {
  ENA_CS: "ENA — Cycle Supérieur", ENA_CMS: "ENA — Cycle Moyen Supérieur",
  ENA_CM: "ENA — Cycle Moyen", ENS: "ENS", INFAS: "INFAS", INFS: "INFS",
  EAUX_FORETS: "Eaux et Forêts", POLICE: "Police Nationale",
  GENDARMERIE: "Gendarmerie Nationale", ARMEE: "Armée Ivoirienne",
};

const NAV_ITEMS = [
  { icon: Home, label: "Tableau de bord", type: "" },
  { icon: BookOpen, label: "Mes Cours", type: "lesson" },
  { icon: FileText, label: "Annales", type: "annal" },
  { icon: Lightbulb, label: "Conseils", type: "tip" },
];

export default function CandidateDashboard() {
  const { user, profile, isPremium, role, signOut, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [contentType, setContentType] = useState("all");
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedConcours, setSelectedConcours] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) setLocation("/auth/login");
    else if (!authLoading && role !== "candidate") setLocation("/");
  }, [user, role, authLoading, setLocation]);

  const enrolledConcours: Array<{ type: string; cycle: string | null }> =
    user?.user_metadata?.enrolled_concours || [];

  const concoursIds: string[] = enrolledConcours.map((e) =>
    e.type === "ENA" && e.cycle ? e.cycle : e.type
  );

  useEffect(() => {
    if (concoursIds.length > 0 && !selectedConcours) setSelectedConcours(concoursIds[0]);
  }, [concoursIds.length]);

  const { data: resources, isLoading: resourcesLoading } = useListResources({
    search: search || undefined,
    content_type: contentType !== "all" ? contentType : undefined,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleResourceClick = (resource: any) => {
    if (!resource.is_free && !isPremium) setIsPremiumModalOpen(true);
    else setLocation(`/dashboard/resource/${resource.id}`);
  };

  const handleNavClick = (type: string) => {
    setContentType(type || "all");
    setActiveNav(type || "all");
  };

  const currentSubjects = selectedConcours ? (CONCOURS_SUBJECTS[selectedConcours] || []) : [];
  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Candidat";

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/" onClick={onClose}>
          <span className="font-serif text-xl font-bold text-gray-900">
            Groupe Victoire<span className="text-primary">.</span>
          </span>
        </Link>
        <p className="text-gray-400 text-xs mt-0.5">Travail – Rigueur – Compétence</p>
      </div>

      {/* User card */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
          <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          {isPremium && <Badge className="bg-primary text-white text-xs shrink-0">PRO</Badge>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-3 py-2 mt-1">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === (item.type || "all");
          return (
            <button
              key={item.type}
              onClick={() => { handleNavClick(item.type); onClose?.(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm shadow-orange-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
        <Button
          asChild
          variant="ghost"
          className={`w-full justify-start text-sm font-medium rounded-xl h-10 px-3 ${isPremium ? "text-primary bg-orange-50" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <Link href="/premium" onClick={onClose}>
            <Star className="mr-3 h-4 w-4 shrink-0" />
            {isPremium ? "Compte Premium" : "Passer Premium"}
          </Link>
        </Button>

        {/* Enrolled concours */}
        {concoursIds.length > 0 && (
          <div className="pt-3">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-3 py-2">Mes concours</p>
            {concoursIds.map((id) => (
              <button
                key={id}
                onClick={() => { setSelectedConcours(id); onClose?.(); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedConcours === id
                    ? "bg-orange-50 text-primary border border-orange-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{CONCOURS_LABELS[id] || id}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm shrink-0">
        <SidebarContent />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100 rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white border-r border-gray-100">
                <SidebarContent onClose={() => {}} />
              </SheetContent>
            </Sheet>
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold text-gray-900">Bonjour, {displayName.split(" ")[0]} 👋</h1>
              <p className="text-xs text-gray-500">
                {concoursIds.length > 0 ? `${concoursIds.length} concours en préparation` : "Bienvenue sur votre espace"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end max-w-sm">
            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher une ressource..."
                className="pl-9 bg-gray-50 border-gray-200 h-9 text-sm rounded-xl focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-xl shrink-0">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Premium banner */}
            {!isPremium && (
              <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-orange-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                    <span className="font-bold text-base">Devenez Premium</span>
                  </div>
                  <p className="text-white/80 text-sm">Débloquez toutes les annales corrigées et ressources exclusives.</p>
                </div>
                <Button asChild className="bg-white text-primary hover:bg-orange-50 font-bold whitespace-nowrap rounded-xl shrink-0 shadow">
                  <Link href="/premium">Voir les offres</Link>
                </Button>
              </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: GraduationCap, label: "Concours", val: concoursIds.length || 0, color: "text-primary bg-orange-50" },
                { icon: BookOpen, label: "Cours disponibles", val: resources?.filter(r => r.content_type === "lesson").length || 0, color: "text-blue-600 bg-blue-50" },
                { icon: FileText, label: "Annales", val: resources?.filter(r => r.content_type === "annal").length || 0, color: "text-green-600 bg-green-50" },
                { icon: Award, label: "Progression", val: "12%", color: "text-purple-600 bg-purple-50" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="border-0 shadow-sm bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                          <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enrolled concours */}
            {concoursIds.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">Mes concours en préparation</h2>
                <div className="flex gap-3 flex-wrap">
                  {concoursIds.map((id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedConcours(id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        selectedConcours === id
                          ? "bg-primary text-white border-primary shadow-sm shadow-orange-200"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                      }`}
                    >
                      <GraduationCap className="h-4 w-4" />
                      {CONCOURS_LABELS[id] || id}
                      <Badge variant="secondary" className="text-xs ml-1 bg-white/20 text-inherit border-0">
                        {(CONCOURS_SUBJECTS[id] || []).length}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subjects for selected concours */}
            {selectedConcours && currentSubjects.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">
                    Programme — <span className="text-primary">{CONCOURS_LABELS[selectedConcours]}</span>
                  </h2>
                  <Badge variant="outline" className="border-primary text-primary text-xs">
                    {currentSubjects.length} matières
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {currentSubjects.map((subject) => {
                    const progress = Math.floor(Math.random() * 45 + 5);
                    return (
                      <Card key={subject} className="border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer bg-white group">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-9 w-9 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                              <BookMarked className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 leading-snug">{subject}</p>
                              <div className="mt-2 space-y-1">
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>Progression</span>
                                  <span className="font-medium text-gray-600">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1.5 bg-gray-100" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No concours */}
            {concoursIds.length === 0 && (
              <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Aucun concours sélectionné</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Vos concours ne sont pas encore enregistrés. Reconnectez-vous ou contactez le support.
                </p>
                <Button asChild className="bg-primary hover:bg-orange-600 text-white rounded-xl">
                  <Link href="/auth/login">Se reconnecter</Link>
                </Button>
              </div>
            )}

            {/* Resources */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">Ressources disponibles</h2>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <Tabs value={contentType} onValueChange={(v) => { setContentType(v); setActiveNav(v); }}>
                  <TabsList className="mb-5 bg-gray-100 rounded-xl p-1">
                    <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm">Tout</TabsTrigger>
                    <TabsTrigger value="lesson" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm">Cours</TabsTrigger>
                    <TabsTrigger value="annal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm">Annales</TabsTrigger>
                    <TabsTrigger value="tip" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm">Conseils</TabsTrigger>
                  </TabsList>

                  <TabsContent value={contentType}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {resourcesLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                          <Card key={i} className="overflow-hidden border-0 shadow-sm">
                            <Skeleton className="h-32 w-full rounded-none" />
                            <CardHeader className="p-4"><Skeleton className="h-4 w-2/3 mb-2" /><Skeleton className="h-3 w-1/2" /></CardHeader>
                          </Card>
                        ))
                      ) : resources?.length === 0 ? (
                        <div className="col-span-full text-center py-14">
                          <Library className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500 text-sm">Aucune ressource trouvée.</p>
                        </div>
                      ) : (
                        resources?.map((resource) => (
                          <Card
                            key={resource.id}
                            className="overflow-hidden cursor-pointer hover:shadow-md transition-all group border border-gray-100 hover:border-orange-200 hover:-translate-y-0.5 bg-white"
                            onClick={() => handleResourceClick(resource)}
                          >
                            <div className="h-32 bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
                              {resource.thumbnail_url ? (
                                <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {resource.content_type === "lesson" && <BookOpen className="h-10 w-10 text-primary/40" />}
                                  {resource.content_type === "annal" && <FileText className="h-10 w-10 text-primary/40" />}
                                  {resource.content_type === "tip" && <Lightbulb className="h-10 w-10 text-primary/40" />}
                                </div>
                              )}
                              {!resource.is_free && !isPremium && (
                                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                                  <div className="bg-white rounded-full p-3 shadow-md">
                                    <Lock className="h-5 w-5 text-primary" />
                                  </div>
                                </div>
                              )}
                              <div className="absolute top-2.5 right-2.5">
                                <Badge className={`text-xs shadow-sm ${resource.is_free ? "bg-green-100 text-green-700 border-green-200" : "bg-primary text-white border-0"}`}>
                                  {resource.is_free ? "Gratuit" : "Premium"}
                                </Badge>
                              </div>
                            </div>
                            <CardHeader className="p-4">
                              <Badge variant="outline" className="text-xs w-fit mb-2 border-gray-200 text-gray-500">
                                {resource.content_type === "lesson" ? "Cours" : resource.content_type === "annal" ? "Annale" : "Conseil"}
                              </Badge>
                              <CardTitle className="line-clamp-2 text-sm font-semibold text-gray-900">{resource.title}</CardTitle>
                              <CardDescription className="line-clamp-2 text-xs mt-1">{resource.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PremiumModal open={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
}
