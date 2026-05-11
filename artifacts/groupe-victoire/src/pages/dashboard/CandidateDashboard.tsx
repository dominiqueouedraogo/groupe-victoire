import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumModal from "@/components/PremiumModal";
import {
  Home,
  BookOpen,
  FileText,
  Lightbulb,
  Star,
  LogOut,
  Search,
  Bell,
  Lock,
  Menu,
} from "lucide-react";
import {
  useListCycles,
  useListSubjects,
  useListResources,
  useGetPlatformStats,
} from "@workspace/api-client-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function CandidateDashboard() {
  const { user, profile, isPremium, role, signOut, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [cycleId, setCycleId] = useState<string>("all");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [contentType, setContentType] = useState<string>("all");
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth/login");
    } else if (!authLoading && role !== "candidate") {
      setLocation("/");
    }
  }, [user, role, authLoading, setLocation]);

  const { data: cycles } = useListCycles();
  const { data: subjects } = useListSubjects(cycleId !== "all" ? { cycle_id: cycleId } : undefined);
  const { data: resources, isLoading: resourcesLoading } = useListResources({
    search: search || undefined,
    subject_id: subjectId !== "all" ? subjectId : undefined,
    content_type: contentType !== "all" ? contentType : undefined,
  });
  const { data: stats } = useGetPlatformStats();

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-12 w-12 rounded-full" /></div>;
  }

  const handleResourceClick = (resource: any) => {
    if (!resource.is_free && !isPremium) {
      setIsPremiumModalOpen(true);
    } else {
      setLocation(`/dashboard/resource/${resource.id}`);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-xl font-bold text-white">
            Groupe Victoire<span className="text-[#D4AF37]">.</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10" onClick={() => setContentType("all")}>
          <Home className="mr-3 h-5 w-5" />
          Tableau de bord
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10" onClick={() => setContentType("lesson")}>
          <BookOpen className="mr-3 h-5 w-5" />
          Mes Cours
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10" onClick={() => setContentType("annal")}>
          <FileText className="mr-3 h-5 w-5" />
          Annales
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10" onClick={() => setContentType("tip")}>
          <Lightbulb className="mr-3 h-5 w-5" />
          Conseils
        </Button>
        <Button asChild variant="ghost" className={`w-full justify-start ${isPremium ? 'text-[#D4AF37]' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
          <Link href="/premium">
            <Star className="mr-3 h-5 w-5" />
            Premium
          </Link>
        </Button>
      </nav>
      <div className="p-4 mt-auto">
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-red-400 hover:bg-white/10" onClick={signOut}>
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-primary text-white border-r">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-primary text-white border-r-0">
                <div className="flex flex-col h-full">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold hidden sm:block">Bonjour, {profile?.full_name}</h1>
          </div>
          
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une ressource..."
                className="pl-9 bg-muted"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Premium Banner */}
            {!isPremium && (
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full blur-[50px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                <div className="z-10 flex-1">
                  <h3 className="text-xl font-bold font-serif mb-2 text-[#D4AF37]">Devenez Premium</h3>
                  <p className="text-white/80">Accédez à toutes les annales corrigées et ressources exclusives pour maximiser vos chances de réussite.</p>
                </div>
                <Button asChild className="z-10 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-primary whitespace-nowrap">
                  <Link href="/premium">Découvrir les offres</Link>
                </Button>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-background p-4 rounded-lg border shadow-sm">
              <Tabs value={cycleId} onValueChange={setCycleId} className="w-full sm:w-auto">
                <TabsList className="w-full sm:w-auto overflow-x-auto justify-start">
                  <TabsTrigger value="all">Tous les cycles</TabsTrigger>
                  {cycles?.map(c => (
                    <TabsTrigger key={c.id} value={c.id}>{c.name}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Matière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les matières</SelectItem>
                  {subjects?.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content Tabs */}
            <Tabs value={contentType} onValueChange={setContentType}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="lesson">Cours</TabsTrigger>
                <TabsTrigger value="annal">Annales</TabsTrigger>
                <TabsTrigger value="tip">Conseils</TabsTrigger>
              </TabsList>

              {/* Resource Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resourcesLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-40 w-full rounded-none" />
                      <CardHeader className="p-4">
                        <Skeleton className="h-4 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                      </CardHeader>
                    </Card>
                  ))
                ) : resources?.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Aucune ressource trouvée pour ces critères.
                  </div>
                ) : (
                  resources?.map((resource) => (
                    <Card 
                      key={resource.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-all group"
                      onClick={() => handleResourceClick(resource)}
                    >
                      <div className="h-40 bg-muted relative overflow-hidden">
                        {resource.thumbnail_url ? (
                          <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                            {resource.content_type === 'lesson' && <BookOpen className="h-10 w-10 text-primary/40" />}
                            {resource.content_type === 'annal' && <FileText className="h-10 w-10 text-primary/40" />}
                            {resource.content_type === 'tip' && <Lightbulb className="h-10 w-10 text-primary/40" />}
                          </div>
                        )}
                        {!resource.is_free && !isPremium && (
                          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-background/90 rounded-full p-3 shadow-lg">
                              <Lock className="h-6 w-6 text-[#D4AF37]" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant={resource.is_free ? "secondary" : "default"} className={!resource.is_free ? "bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white" : ""}>
                            {resource.is_free ? "Gratuit" : "Premium"}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs uppercase">
                            {resource.content_type === 'lesson' ? 'Cours' : resource.content_type === 'annal' ? 'Annale' : 'Conseil'}
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2 text-lg">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">{resource.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      <PremiumModal open={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
}
