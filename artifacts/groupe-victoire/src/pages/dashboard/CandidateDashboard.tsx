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
  BookMarked, Library
} from "lucide-react";
import { useListResources } from "@workspace/api-client-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Subject mapping per concours/cycle
const CONCOURS_SUBJECTS: Record<string, string[]> = {
  ENA_CS: ["Aptitude Verbale", "Culture Générale", "Logique", "Anglais", "Sujet d'ordre général", "Note de Synthèse", "Problèmes éco et sociaux", "Droit Administratif"],
  ENA_CMS: ["Aptitude Verbale", "Culture Générale", "Logique", "Anglais", "Sujet d'ordre général", "Contraction de Texte", "Problèmes éco et sociaux", "Droit Constitutionnel"],
  ENA_CM: ["Aptitude Verbale", "Culture Générale", "Logique", "Anglais", "Sujet d'ordre général", "Connaissance du Monde Contemporain"],
  ENS: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Pédagogie", "Histoire-Géographie"],
  INFAS: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Biologie", "Chimie"],
  INFS: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Droit Social", "Économie"],
  EAUX_FORETS: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Sciences Naturelles", "Géographie"],
  POLICE: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Droit", "Éducation Physique"],
  GENDARMERIE: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Droit", "Instruction Civique"],
  ARMEE: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Histoire", "Géographie"],
};

const CONCOURS_LABELS: Record<string, string> = {
  ENA_CS: "ENA — Cycle Supérieur",
  ENA_CMS: "ENA — Cycle Moyen Supérieur",
  ENA_CM: "ENA — Cycle Moyen",
  ENS: "ENS",
  INFAS: "INFAS",
  INFS: "INFS",
  EAUX_FORETS: "Eaux et Forêts",
  POLICE: "Police Nationale",
  GENDARMERIE: "Gendarmerie Nationale",
  ARMEE: "Armée Ivoirienne",
};

export default function CandidateDashboard() {
  const { user, profile, isPremium, role, signOut, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [contentType, setContentType] = useState<string>("all");
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedConcours, setSelectedConcours] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) setLocation("/auth/login");
    else if (!authLoading && role !== "candidate") setLocation("/");
  }, [user, role, authLoading, setLocation]);

  // Get enrolled concours from user metadata
  const enrolledConcours: Array<{ type: string; cycle: string | null }> =
    user?.user_metadata?.enrolled_concours || [];

  // Build list of concours IDs the user is enrolled in
  const concoursIds: string[] = enrolledConcours.map((e) => {
    if (e.type === "ENA" && e.cycle) return e.cycle;
    return e.type;
  });

  // Set initial selected concours
  useEffect(() => {
    if (concoursIds.length > 0 && !selectedConcours) {
      setSelectedConcours(concoursIds[0]);
    }
  }, [concoursIds.length]);

  const { data: resources, isLoading: resourcesLoading } = useListResources({
    search: search || undefined,
    content_type: contentType !== "all" ? contentType : undefined,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  const handleResourceClick = (resource: any) => {
    if (!resource.is_free && !isPremium) {
      setIsPremiumModalOpen(true);
    } else {
      setLocation(`/dashboard/resource/${resource.id}`);
    }
  };

  const currentSubjects = selectedConcours ? (CONCOURS_SUBJECTS[selectedConcours] || []) : [];
  const userLocation = user?.user_metadata?.location || "";
  const paymentType = user?.user_metadata?.payment_type || "";

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-xl font-bold text-white">
            Groupe Victoire<span className="text-[#C9A227]">.</span>
          </span>
        </Link>
        <p className="text-white/40 text-xs mt-0.5">Travail – Rigueur – Compétence</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg" onClick={() => setContentType("all")}>
          <Home className="mr-3 h-4 w-4" /> Tableau de bord
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg" onClick={() => setContentType("lesson")}>
          <BookOpen className="mr-3 h-4 w-4" /> Mes Cours
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg" onClick={() => setContentType("annal")}>
          <FileText className="mr-3 h-4 w-4" /> Annales
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg" onClick={() => setContentType("tip")}>
          <Lightbulb className="mr-3 h-4 w-4" /> Conseils
        </Button>
        <Button asChild variant="ghost" className={`w-full justify-start rounded-lg ${isPremium ? "text-[#C9A227]" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
          <Link href="/premium">
            <Star className="mr-3 h-4 w-4" /> Premium
          </Link>
        </Button>
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Mes concours</p>
          <div className="space-y-1 mt-2">
            {concoursIds.length > 0 ? concoursIds.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedConcours(id)}
                className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${selectedConcours === id ? "bg-[#C9A227]/20 text-[#C9A227]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
              >
                <ChevronRight className="inline h-3 w-3 mr-1" />{CONCOURS_LABELS[id] || id}
              </button>
            )) : (
              <p className="text-white/30 text-xs italic">Aucun concours sélectionné</p>
            )}
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-white/50 hover:text-red-400 hover:bg-white/5 rounded-lg text-sm" onClick={signOut}>
          <LogOut className="mr-3 h-4 w-4" /> Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0D0D0D] text-white border-r border-white/5 shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-[#0D0D0D] text-white border-r-0">
                <div className="flex flex-col h-full">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-base font-semibold hidden sm:block">
                Bonjour, {profile?.full_name || user?.user_metadata?.full_name || "Candidat"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {concoursIds.length > 0 ? `${concoursIds.length} concours en préparation` : "Bienvenue sur votre espace"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end max-w-sm">
            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-9 bg-muted h-9 text-sm rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="relative shrink-0">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#C9A227]"></span>
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Premium banner */}
            {!isPremium && (
              <div className="bg-gradient-to-r from-[#0D0D0D] to-[#1a1a1a] rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227] rounded-full blur-[60px] opacity-20"></div>
                <div className="z-10">
                  <h3 className="font-bold font-serif text-lg text-[#C9A227]">Devenez Premium</h3>
                  <p className="text-white/60 text-sm mt-1">Accédez à toutes les annales corrigées et ressources exclusives.</p>
                </div>
                <Button asChild className="z-10 bg-[#C9A227] hover:bg-[#b8911f] text-black font-bold whitespace-nowrap rounded-xl shrink-0">
                  <Link href="/premium">Voir les offres</Link>
                </Button>
              </div>
            )}

            {/* My concours overview */}
            {concoursIds.length > 0 && (
              <div>
                <h2 className="text-lg font-bold font-serif mb-4">Mes concours en préparation</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {concoursIds.map((id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedConcours(id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${selectedConcours === id ? "border-[#C9A227] bg-[#C9A227]/5" : "border-border bg-card hover:border-[#C9A227]/40"}`}
                    >
                      <GraduationCap className={`h-5 w-5 mb-2 ${selectedConcours === id ? "text-[#C9A227]" : "text-muted-foreground"}`} />
                      <p className="font-semibold text-sm leading-snug">{CONCOURS_LABELS[id] || id}</p>
                      <p className="text-xs text-muted-foreground mt-1">{(CONCOURS_SUBJECTS[id] || []).length} matières</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected concours subjects */}
            {selectedConcours && currentSubjects.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold font-serif">
                    Programme — {CONCOURS_LABELS[selectedConcours] || selectedConcours}
                  </h2>
                  <Badge className="bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/30">
                    {currentSubjects.length} matières
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {currentSubjects.map((subject, i) => (
                    <Card key={subject} className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-border hover:border-[#C9A227]/40">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <BookMarked className="h-4 w-4 text-[#C9A227]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-snug">{subject}</p>
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progression</span>
                                <span>{Math.floor(Math.random() * 40)}%</span>
                              </div>
                              <Progress value={Math.floor(Math.random() * 40)} className="h-1.5" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No concours enrolled */}
            {concoursIds.length === 0 && (
              <div className="text-center py-16 bg-card border rounded-2xl">
                <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Aucun concours sélectionné</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Votre sélection de concours n'est pas encore enregistrée dans votre profil.
                </p>
              </div>
            )}

            {/* Resources section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold font-serif">Ressources disponibles</h2>
              </div>

              <Tabs value={contentType} onValueChange={setContentType}>
                <TabsList className="mb-5 rounded-xl">
                  <TabsTrigger value="all">Tout</TabsTrigger>
                  <TabsTrigger value="lesson">Cours</TabsTrigger>
                  <TabsTrigger value="annal">Annales</TabsTrigger>
                  <TabsTrigger value="tip">Conseils</TabsTrigger>
                </TabsList>

                <TabsContent value={contentType}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {resourcesLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="h-36 w-full rounded-none" />
                          <CardHeader className="p-4"><Skeleton className="h-4 w-2/3 mb-2" /><Skeleton className="h-4 w-1/3" /></CardHeader>
                        </Card>
                      ))
                    ) : resources?.length === 0 ? (
                      <div className="col-span-full text-center py-16 text-muted-foreground">
                        <Library className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>Aucune ressource trouvée.</p>
                      </div>
                    ) : (
                      resources?.map((resource) => (
                        <Card
                          key={resource.id}
                          className="overflow-hidden cursor-pointer hover:shadow-lg transition-all group border hover:border-[#C9A227]/40 hover:-translate-y-1"
                          onClick={() => handleResourceClick(resource)}
                        >
                          <div className="h-36 bg-muted relative overflow-hidden">
                            {resource.thumbnail_url ? (
                              <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#C9A227]/10 to-[#C9A227]/5 flex items-center justify-center">
                                {resource.content_type === "lesson" && <BookOpen className="h-10 w-10 text-[#C9A227]/40" />}
                                {resource.content_type === "annal" && <FileText className="h-10 w-10 text-[#C9A227]/40" />}
                                {resource.content_type === "tip" && <Lightbulb className="h-10 w-10 text-[#C9A227]/40" />}
                              </div>
                            )}
                            {!resource.is_free && !isPremium && (
                              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                <div className="bg-background/90 rounded-full p-3 shadow">
                                  <Lock className="h-5 w-5 text-[#C9A227]" />
                                </div>
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              <Badge className={resource.is_free ? "bg-white/90 text-black text-xs" : "bg-[#C9A227] text-black text-xs"}>
                                {resource.is_free ? "Gratuit" : "Premium"}
                              </Badge>
                            </div>
                          </div>
                          <CardHeader className="p-4">
                            <Badge variant="outline" className="text-xs w-fit mb-2">
                              {resource.content_type === "lesson" ? "Cours" : resource.content_type === "annal" ? "Annale" : "Conseil"}
                            </Badge>
                            <CardTitle className="line-clamp-2 text-sm">{resource.title}</CardTitle>
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
      </main>

      <PremiumModal open={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
}
