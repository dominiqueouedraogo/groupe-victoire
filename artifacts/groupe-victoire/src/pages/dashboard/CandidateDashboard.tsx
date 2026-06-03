import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import PremiumModal from "@/components/PremiumModal";
import {
  Home, BookOpen, FileText, Lightbulb, Star, LogOut,
  Search, Bell, Lock, Menu, GraduationCap,
  BookMarked, Library, Award
} from "lucide-react";
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
  { icon: Home,       label: "Tableau de bord", tab: "all",   path: "/dashboard" },
  { icon: BookOpen,   label: "Mes Cours",        tab: "lesson", path: "/dashboard/cours" },
  { icon: FileText,   label: "Annales",           tab: "annal", path: "/dashboard/annales" },
  { icon: Lightbulb,  label: "Conseils",          tab: "tip",   path: "/dashboard/conseils" },
];

const PATH_TO_TAB: Record<string, string> = {
  "/dashboard": "all",
  "/dashboard/cours": "lesson",
  "/dashboard/annales": "annal",
  "/dashboard/conseils": "tip",
};

export default function CandidateDashboard() {
  const { user, profile, isPremium, role, signOut, loading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const search = useSearch();

  // Derive active tab from URL path or query param
  const getInitialTab = () => {
    const pathTab = PATH_TO_TAB[location];
    if (pathTab) return pathTab;
    const params = new URLSearchParams(search);
    return params.get("tab") || "all";
  };

  const [contentType, setContentType] = useState(getInitialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [selectedConcours, setSelectedConcours] = useState<string | null>(null);

  // Sync tab when URL changes
  useEffect(() => {
    const tab = getInitialTab();
    setContentType(tab);
  }, [location, search]);

  useEffect(() => {
    if (!authLoading && !user) setLocation("/auth/login");
    // role redirect removed
  }, [user, role, authLoading]);

  const enrolledConcours: Array<{ type: string; cycle: string | null }> =
    user?.user_metadata?.enrolled_concours || [];

  const concoursIds: string[] = enrolledConcours.map((e) =>
    e.type === "ENA" && e.cycle ? e.cycle : e.type
  );

  useEffect(() => {
    if (concoursIds.length > 0 && !selectedConcours) setSelectedConcours(concoursIds[0]);
  }, [concoursIds.length]);

  const [resources, setResources] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [subjects, setSubjects] = useState<any[]>([]);
  const resourcesLoading = false;
  const [news, setNews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [lastSeen, setLastSeen] = useState<string>(() => localStorage.getItem("notif_last_seen") || "");

  useEffect(() => {
    const fetchNotifs = async () => {
      const { data: resData } = await supabase.from("resources").select("id,title,content_type,created_at").order("created_at", { ascending: false }).limit(20);
      const { data: newsData } = await supabase.from("news").select("id,title,created_at").order("created_at", { ascending: false }).limit(10);
      const all = [
        ...(resData || []).map((r: any) => ({ id: r.id, label: r.content_type === "lesson" ? "Nouveau cours" : r.content_type === "annal" ? "Nouvelle annale" : "Nouveau conseil", title: r.title, created_at: r.created_at })),
        ...(newsData || []).map((n: any) => ({ id: "news_"+n.id, label: "Actualité", title: n.title, created_at: n.created_at })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setNotifications(all);
    };
    fetchNotifs();
  }, []);

  const unreadCount = notifications.filter(n => !lastSeen || n.created_at > lastSeen).length;

  const handleOpenNotifs = () => {
    setShowNotifs(!showNotifs);
    const now = new Date().toISOString();
    setLastSeen(now);
    localStorage.setItem("notif_last_seen", now);
  };

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
      if (data) setNews(data);
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      if (data) setResources(data);
    };
    fetchResources();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from("subjects").select("*").order("name");
      if (data) setSubjects(data);
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("subject_id, progress_pct")
        .eq("user_id", user.id);
      if (data) {
        const map: Record<string, number> = {};
        data.forEach((row: any) => { map[row.subject_id] = row.progress_pct; });
        setUserProgress(map);
      }
    };
    fetchProgress();
  }, [user]);

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

  const handleNavClick = (tab: string, path: string) => {
    setContentType(tab);
    setLocation(path);
  };

  const currentSubjects = selectedConcours ? (CONCOURS_SUBJECTS[selectedConcours] || []) : [];
  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Candidat";

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Link href="/" onClick={onClose}>
          <span className="font-serif text-xl font-bold text-gray-900">
            Groupe Victoire<span className="text-primary">.</span>
          </span>
        </Link>
        <p className="text-gray-400 text-xs mt-0.5">Travail – Rigueur – Compétence</p>
      </div>

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

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-3 py-2 mt-1">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = contentType === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => { handleNavClick(item.tab, item.path); onClose?.(); }}
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

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() => { onClose?.(); setTimeout(() => setShowSignoutModal(true), 100); }}
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
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm shrink-0">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Actualités ticker */}
          {news.length > 0 && (
          <div className="bg-orange-500 text-white flex items-center overflow-hidden h-9 shrink-0">
            <span className="bg-orange-700 px-3 h-full flex items-center text-xs font-bold shrink-0">📢 ACTU</span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-12 animate-marquee whitespace-nowrap">
                {[...news, ...news].map((item: any, i: number) => (
                  <span key={i} className="text-xs font-medium">{item.title} — {item.content}</span>
                ))}
              </div>
            </div>
          </div>
          )}
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
              <h1 className="text-base font-semibold text-gray-900">
                {contentType === "all" ? `Bonjour, ${displayName.split(" ")[0]} 👋` :
                 contentType === "lesson" ? "Mes Cours" :
                 contentType === "annal" ? "Annales" : "Conseils"}
              </h1>
              <p className="text-xs text-gray-500">
                {contentType === "all"
                  ? `${concoursIds.length} concours en préparation`
                  : contentType === "lesson" ? "Tous vos cours disponibles"
                  : contentType === "annal" ? "Sujets et corrigés des années précédentes"
                  : "Astuces et conseils de réussite"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end max-w-sm">
            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-9 bg-gray-50 border-gray-200 h-9 text-sm rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-xl shrink-0">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </div>
        </header>

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

            {/* Stats — only on overview tab */}
            {contentType === "all" && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: GraduationCap, label: "Concours", val: concoursIds.length || 0, color: "text-primary bg-orange-50" },
                    { icon: BookOpen, label: "Cours disponibles", val: resources?.filter(r => r.content_type === "lesson").length || 0, color: "text-blue-600 bg-blue-50" },
                    { icon: FileText, label: "Annales", val: resources?.filter(r => r.content_type === "annal").length || 0, color: "text-green-600 bg-green-50" },
                    { icon: Award, label: "Progression", val: (() => { const vals = Object.values(userProgress); return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)+"%" : "0%"; })(), color: "text-purple-600 bg-purple-50" },
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

                {/* Enrolled concours pills */}
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

                {/* Subjects */}
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
                        const subjectObj = subjects.find(s => s.name === subject);
                        const progress = subjectObj ? (userProgress[subjectObj.id] ?? 0) : 0;
                        return (
                          <Card
                            key={subject}
                            className="border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer bg-white group"
                            onClick={() => handleNavClick("lesson", "/dashboard/cours")}
                          >
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
              </>
            )}

            {/* Resources section — for cours/annales/conseils tabs + inline resource tab on overview */}
            <div>
              {contentType === "all" && (
                <h2 className="text-base font-bold text-gray-900 mb-4">Ressources disponibles</h2>
              )}

              {/* Quick tab navigation — only visible on dedicated pages */}
              {contentType !== "all" && (
                <div className="flex gap-2 mb-5 flex-wrap">
                  {NAV_ITEMS.filter(n => n.tab !== "all").map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.tab}
                        onClick={() => handleNavClick(item.tab, item.path)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          contentType === item.tab
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                {/* Tabs inside overview */}
                {contentType === "all" && (
                  <Tabs defaultValue="lesson" className="mb-2">
                    <TabsList className="mb-5 bg-gray-100 rounded-xl p-1">
                      <TabsTrigger value="lesson" onClick={() => handleNavClick("lesson", "/dashboard/cours")} className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm">
                        <BookOpen className="h-4 w-4 mr-1.5" /> Cours
                      </TabsTrigger>
                      <TabsTrigger value="annal" onClick={() => handleNavClick("annal", "/dashboard/annales")} className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm">
                        <FileText className="h-4 w-4 mr-1.5" /> Annales
                      </TabsTrigger>
                      <TabsTrigger value="tip" onClick={() => handleNavClick("tip", "/dashboard/conseils")} className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm">
                        <Lightbulb className="h-4 w-4 mr-1.5" /> Conseils
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="lesson">
                      <ResourceGrid resources={resources?.filter(r => r.content_type === "lesson")} loading={resourcesLoading} isPremium={isPremium} onResourceClick={handleResourceClick} />
                    </TabsContent>
                    <TabsContent value="annal">
                      <ResourceGrid resources={resources?.filter(r => r.content_type === "annal")} loading={resourcesLoading} isPremium={isPremium} onResourceClick={handleResourceClick} />
                    </TabsContent>
                    <TabsContent value="tip">
                      <ResourceGrid resources={resources?.filter(r => r.content_type === "tip")} loading={resourcesLoading} isPremium={isPremium} onResourceClick={handleResourceClick} />
                    </TabsContent>
                  </Tabs>
                )}

                {/* Dedicated tab pages */}
                {contentType !== "all" && (
                  <ResourceGrid resources={resources} loading={resourcesLoading} isPremium={isPremium} onResourceClick={handleResourceClick} />
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

      <PremiumModal open={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
      {showSignoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-base font-bold text-gray-900 mb-2">Confirmer la deconnexion</h3>
            <p className="text-sm text-gray-500 mb-6">Voulez-vous vraiment vous deconnecter ?</p>
            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100" onClick={() => setShowSignoutModal(false)}>Annuler</button>
              <button className="px-4 py-2 rounded-xl text-sm bg-red-500 text-white hover:bg-red-600" onClick={() => { setShowSignoutModal(false); signOut(); }}>Deconnexion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function ResourceGrid({ resources, loading, isPremium, onResourceClick }: {
  resources: any[];
  loading: boolean;
  isPremium: boolean;
  onResourceClick: (r: any) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }
  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-gray-500 text-sm">Aucune ressource disponible pour le moment.</p>
        <p className="text-gray-400 text-xs mt-1">Revenez bientôt !</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
          onClick={() => onResourceClick(resource)}
          className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              {!resource.is_free && !isPremium
                ? <span className="text-base">🔒</span>
                : <span className="text-base">📄</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{resource.title}</p>
              {resource.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{resource.description}</p>
              )}
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{resource.content_type}</span>
                {resource.is_free
                  ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Gratuit</span>
                  : <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Premium</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
