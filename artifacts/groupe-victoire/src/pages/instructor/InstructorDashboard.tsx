import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Home, Upload, FileText, Newspaper, LogOut, Menu, Trash2, Loader2, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const resourceSchema = z.object({
  title: z.string().min(3, "Le titre est requis"),
  description: z.string().optional(),
  content_type: z.enum(["lesson", "annal", "tip"]),
  subject_id: z.string().min(1, "La matière est requise"),
  file_url: z.string().url("URL invalide").optional().or(z.literal("")),
  thumbnail_url: z.string().url("URL invalide").optional().or(z.literal("")),
  is_free: z.boolean().default(false),
});

const newsSchema = z.object({
  title: z.string().min(3, "Le titre est requis"),
  content: z.string().min(10, "Le contenu doit être plus long"),
});

export default function InstructorDashboard() {
  const { user, profile, role, signOut, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [premiumModal, setPremiumModal] = useState<{open: boolean, candidate: any | null}>({open: false, candidate: null});
  const [premiumLoading, setPremiumLoading] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      setCandidatesLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "candidate")
        .order("created_at", { ascending: false });
      if (!error && data) setCandidates(data);
      setCandidatesLoading(false);
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth/login");
    } else if (!authLoading && role !== null && role !== "instructor") {
      setLocation("/");
    }
  }, [user, role, authLoading, setLocation]);

  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from("subjects").select("*").order("name");
      if (data) setSubjects(data);
    };
    fetchSubjects();
  }, []);
  const [myResources, setMyResources] = useState<any[]>([]);
  const resourcesLoading = false;

  useEffect(() => {
    const fetchResources = async () => {
      if (!user?.id) return;
      const { data } = await supabase.from("resources").select("*").eq("author_id", user.id).order("created_at", { ascending: false });
      if (data) setMyResources(data);
    };
    fetchResources();
  }, [user?.id]);
  
  const [createResourcePending, setCreateResourcePending] = useState(false);
  const [createNewsPending, setCreateNewsPending] = useState(false);
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
      if (data) setNewsList(data);
    };
    fetchNews();
  }, []);

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Supprimer cette actualité ?")) return;
    await supabase.from("news").delete().eq("id", id);
    setNewsList(prev => prev.filter(n => n.id !== id));
    toast({ title: "Actualité supprimée" });
  };


  const createResource = {
    isPending: createResourcePending,
    mutate: async ({ data }: any, callbacks: any) => {
      setCreateResourcePending(true);
      try {
        const { error } = await supabase.from("resources").insert({ ...data, author_id: user?.id });
        if (error) throw error;
        callbacks?.onSuccess?.();
      } catch (err: any) {
        callbacks?.onError?.(err);
      } finally { setCreateResourcePending(false); }
    }
  };

  const deleteResource = {
    mutate: async ({ id }: any, callbacks: any) => {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (!error) callbacks?.onSuccess?.();
    }
  };

  const createNews = {
    isPending: createNewsPending,
    mutate: async ({ data }: any, callbacks: any) => {
      setCreateNewsPending(true);
      try {
        const { error } = await supabase.from("news").insert({ ...data, author_id: user?.id });
        if (error) throw error;
        callbacks?.onSuccess?.();
      } catch (err: any) {
        callbacks?.onError?.(err);
      } finally { setCreateNewsPending(false); }
    }
  };

  const handleGrantPremium = async (type: "monthly" | "annual") => {
    if (!premiumModal.candidate) return;
    setPremiumLoading(true);
    const now = new Date();
    const until = new Date(now);
    if (type === "monthly") until.setMonth(until.getMonth() + 1);
    else until.setFullYear(until.getFullYear() + 1);

    const { error } = await supabase
      .from("profiles")
      .update({
        is_premium: true,
        premium_type: type,
        premium_until: until.toISOString(),
      })
      .eq("id", premiumModal.candidate.id);

    if (!error) {
      setCandidates(prev => prev.map(c =>
        c.id === premiumModal.candidate.id
          ? { ...c, is_premium: true, premium_type: type, premium_until: until.toISOString() }
          : c
      ));
      toast({ title: "✅ Premium activé", description: `${premiumModal.candidate.full_name} est maintenant ${type === "monthly" ? "mensuel" : "annuel"}` });
      setPremiumModal({ open: false, candidate: null });
    } else {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    }
    setPremiumLoading(false);
  };

  const handleRevokePremium = async (id: string) => {
    if (!confirm("Révoquer le premium de ce candidat ?")) return;
    const { error } = await supabase
      .from("profiles")
      .update({ is_premium: false, premium_type: null, premium_until: null })
      .eq("id", id);
    if (!error) {
      setCandidates(prev => prev.map(c =>
        c.id === id ? { ...c, is_premium: false, premium_type: null, premium_until: null } : c
      ));
      toast({ title: "Premium révoqué" });
    }
  };

  const resourceForm = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      content_type: "lesson",
      subject_id: "",
      file_url: "",
      thumbnail_url: "",
      is_free: false,
    },
  });

  const newsForm = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const fileName = `${user?.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("resources").upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("resources").getPublicUrl(fileName);
      resourceForm.setValue("file_url", publicUrl);
      toast({ title: "✅ Fichier uploadé avec succès" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erreur upload", description: err.message });
    } finally { setUploadingFile(false); }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      const fileName = `${user?.id}/thumbnails/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("resources").upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("resources").getPublicUrl(fileName);
      resourceForm.setValue("thumbnail_url", publicUrl);
      toast({ title: "✅ Image uploadée avec succès" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erreur upload", description: err.message });
    } finally { setUploadingThumb(false); }
  };

  async function onResourceSubmit(values: z.infer<typeof resourceSchema>) {
    createResource.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Ressource créée avec succès" });
        resourceForm.reset();
        queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      },
      onError: (error: any) => {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      }
    });
  }

  async function onNewsSubmit(values: z.infer<typeof newsSchema>) {
    createNews.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Actualité publiée avec succès" });
        newsForm.reset();
        queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      },
      onError: (error: any) => {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      }
    });
  }

  const handleDeleteResource = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
      deleteResource.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Ressource supprimée" });
          queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
        }
      });
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-xl font-bold text-white">
            Espace Instructeur
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10" asChild>
          <a href="#upload"><Upload className="mr-3 h-5 w-5" /> Ajouter ressource</a>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10" asChild>
          <a href="#resources"><FileText className="mr-3 h-5 w-5" /> Mes ressources</a>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10" asChild>
          <a href="#news"><Newspaper className="mr-3 h-5 w-5" /> Actualités</a>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10" asChild>
          <a href="#candidates"><Users className="mr-3 h-5 w-5" /> Mes Candidats</a>
        </Button>
      </nav>
      <div className="p-4 mt-auto">
        <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-red-400 hover:bg-white/10" onClick={() => setShowSignoutModal(true)}>
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1a2b4c] text-white border-r">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-[#1a2b4c] text-white border-r-0">
                <div className="flex flex-col h-full"><SidebarContent /></div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold">Bonjour, Professeur {profile?.full_name}</h1>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-auto space-y-8">
          
          {/* Upload Section */}
          <section id="upload" className="bg-background rounded-xl border shadow-sm p-6">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center">
              <Upload className="mr-2 h-6 w-6" /> Ajouter une nouvelle ressource
            </h2>
            <Form {...resourceForm}>
              <form onSubmit={resourceForm.handleSubmit(onResourceSubmit)} className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={resourceForm.control} name="title" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Titre</FormLabel>
                      <FormControl><Input placeholder="Titre de la ressource" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={resourceForm.control} name="description" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="Description détaillée..." className="resize-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={resourceForm.control} name="content_type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de contenu</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un type" /></SelectTrigger></FormControl>
                        <SelectContent position="popper" className="z-50 bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="lesson">Cours</SelectItem>
                          <SelectItem value="annal">Annale</SelectItem>
                          <SelectItem value="tip">Conseil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={resourceForm.control} name="subject_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matière</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une matière" /></SelectTrigger></FormControl>
                        <SelectContent position="popper" className="z-50 bg-gray-900 border-gray-700 text-white">
                          {subjects?.map(s => <SelectItem key={s.id} value={s.id} className="text-white focus:bg-gray-700 focus:text-white">{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={resourceForm.control} name="file_url" render={({ field }) => (
    <FormItem>
      <FormLabel>Fichier PDF</FormLabel>
      <FormControl>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition">
            {uploadingFile ? <><Loader2 className="h-4 w-4 animate-spin" /> Upload...</> : <><Upload className="h-4 w-4" /> Choisir PDF</>}
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={uploadingFile} />
          </label>
          {field.value && <span className="text-sm text-green-600">✅ Fichier prêt</span>}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )} />

                  <FormField control={resourceForm.control} name="thumbnail_url" render={({ field }) => (
    <FormItem>
      <FormLabel>Image de couverture</FormLabel>
      <FormControl>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition">
            {uploadingThumb ? <><Loader2 className="h-4 w-4 animate-spin" /> Upload...</> : <><Upload className="h-4 w-4" /> Choisir image</>}
            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={uploadingThumb} />
          </label>
          {field.value && <img src={field.value} className="h-10 w-10 rounded object-cover" alt="preview" />}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )} />

                  <FormField control={resourceForm.control} name="is_free" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ressource Gratuite</FormLabel>
                        <div className="text-sm text-muted-foreground">Accessible à tous les inscrits</div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <Button type="submit" className="bg-primary text-white" disabled={createResource.isPending}>
                  {createResource.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Publier la ressource
                </Button>
              </form>
            </Form>
          </section>

          {/* Resources Table */}
          <section id="resources" className="bg-background rounded-xl border shadow-sm p-6 overflow-hidden">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center">
              <FileText className="mr-2 h-6 w-6" /> Mes ressources publiées
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Accès</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resourcesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                    ))
                  ) : myResources?.filter(r => r.author_id === user?.id).map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{resource.content_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={resource.is_free ? "secondary" : "default"} className={!resource.is_free ? "bg-[#D4AF37]" : ""}>
                          {resource.is_free ? "Gratuit" : "Premium"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(resource.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteResource(resource.id)} disabled={deleteResource.isPending}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {myResources?.filter(r => r.author_id === user?.id).length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucune ressource publiée.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* News Section */}
          <section id="news" className="bg-background rounded-xl border shadow-sm p-6">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center">
              <Newspaper className="mr-2 h-6 w-6" /> Publier une actualité
            </h2>
            <Form {...newsForm}>
              <form onSubmit={newsForm.handleSubmit(onNewsSubmit)} className="space-y-6 max-w-3xl">
                <FormField control={newsForm.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de l'actualité</FormLabel>
                    <FormControl><Input placeholder="Ex: Nouveaux sujets d'économie..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={newsForm.control} name="content" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu</FormLabel>
                    <FormControl><Textarea placeholder="Rédigez votre annonce..." className="min-h-[150px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="bg-primary text-white" disabled={createNews.isPending}>
                  {createNews.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Publier l'actualité
                </Button>
              </form>
            </Form>
          </section>

            {/* News List Section */}
            <section className="bg-background rounded-xl border shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center">
                <Newspaper className="mr-2 h-6 w-6" /> Actualités publiées
              </h2>
              {newsList.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucune actualité publiée.</p>
              ) : (
                <div className="space-y-3">
                  {newsList.map((item: any) => (
                    <div key={item.id} className="flex items-start justify-between bg-muted/30 rounded-xl p-4 border">
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.content}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(item.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <button onClick={() => handleDeleteNews(item.id)} className="ml-4 text-red-400 hover:text-red-600">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          {/* Candidates Section */}
          <section id="candidates" className="bg-background rounded-xl border shadow-sm p-6 overflow-hidden">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center">
              <Users className="mr-2 h-6 w-6" /> Mes Candidats
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Concours</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidatesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                    ))
                  ) : candidates.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucun candidat inscrit.</TableCell></TableRow>
                  ) : candidates.map((cand) => (
                    <TableRow key={cand.id}>
                      <TableCell className="font-medium">
                        <div>{cand.full_name || "-"}</div>
                        <div className="text-xs text-muted-foreground">{cand.email}</div>
                      </TableCell>
                      <TableCell>{cand.phone || cand.telephone || "-"}</TableCell>
                      <TableCell>{cand.city || "-"}</TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {cand.specialization || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {cand.premium_type === "monthly" ? "Mensuel" : cand.premium_type === "annual" ? "Annuel" : "Non défini"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={cand.is_premium ? "default" : "secondary"} className={cand.is_premium ? "bg-[#D4AF37] text-white" : ""}>
                            {cand.is_premium ? "Premium" : "Gratuit"}
                          </Badge>
                          {cand.is_premium && cand.premium_type && (
                            <div className="text-xs text-muted-foreground">
                              {cand.premium_type === "monthly" ? "Mensuel" : "Annuel"}
                              {cand.premium_until && ` · exp. ${new Date(cand.premium_until).toLocaleDateString("fr-FR")}`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {!cand.is_premium ? (
                          <button
                            onClick={() => setPremiumModal({ open: true, candidate: cand })}
                            className="text-xs bg-[#D4AF37] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-yellow-600 transition"
                          >
                            Rendre Premium
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRevokePremium(cand.id)}
                            className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-200 transition"
                          >
                            Révoquer
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>


        </div>
      
      {premiumModal.open && premiumModal.candidate && (
        <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'flex-end',justifyContent:'center',padding:'0 16px 40px'}}>
          <div style={{background:'white',borderRadius:16,padding:24,width:'100%',maxWidth:380}}>
            <p style={{fontWeight:'bold',fontSize:17,textAlign:'center',marginBottom:4}}>Activer Premium</p>
            <p style={{color:'#666',fontSize:14,textAlign:'center',marginBottom:20}}>Choisissez le type d&#39;abonnement pour <strong>{premiumModal.candidate.full_name}</strong></p>
            <div style={{display:'flex',gap:10,marginBottom:12}}>
              <button
                onClick={() => handleGrantPremium("monthly")}
                disabled={premiumLoading}
                style={{flex:1,padding:'14px',borderRadius:12,background:'#f97316',color:'white',fontWeight:700,border:'none',cursor:'pointer',fontSize:15}}
              >
                {premiumLoading ? "..." : "Mensuel"}
                <div style={{fontSize:11,fontWeight:400,marginTop:2}}>1 mois d&#39;accès</div>
              </button>
              <button
                onClick={() => handleGrantPremium("annual")}
                disabled={premiumLoading}
                style={{flex:1,padding:'14px',borderRadius:12,background:'#D4AF37',color:'white',fontWeight:700,border:'none',cursor:'pointer',fontSize:15}}
              >
                {premiumLoading ? "..." : "Annuel"}
                <div style={{fontSize:11,fontWeight:400,marginTop:2}}>12 mois d&#39;accès</div>
              </button>
            </div>
            <button
              onClick={() => setPremiumModal({ open: false, candidate: null })}
              style={{width:'100%',padding:'11px',borderRadius:10,border:'1px solid #ddd',fontWeight:600,background:'white',cursor:'pointer',fontSize:14}}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      {showSignoutModal && (
        <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'flex-end',justifyContent:'center',padding:'0 16px 40px'}}>
          <div style={{background:'white',borderRadius:16,padding:24,width:'100%',maxWidth:360}}>
            <p style={{fontWeight:'bold',fontSize:17,textAlign:'center',marginBottom:6}}>Déconnexion</p>
            <p style={{color:'#666',fontSize:14,textAlign:'center',marginBottom:20}}>Voulez-vous vraiment vous déconnecter ?</p>
            <div style={{display:'flex',gap:10}}>
              <button onClick={() => setShowSignoutModal(false)} style={{flex:1,padding:'11px',borderRadius:10,border:'1px solid #ddd',fontWeight:600,background:'white',cursor:'pointer',fontSize:14}}>Annuler</button>
              <button onClick={() => { setShowSignoutModal(false); signOut(); }} style={{flex:1,padding:'11px',borderRadius:10,background:'#ef4444',color:'white',fontWeight:600,border:'none',cursor:'pointer',fontSize:14}}>Se déconnecter</button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
