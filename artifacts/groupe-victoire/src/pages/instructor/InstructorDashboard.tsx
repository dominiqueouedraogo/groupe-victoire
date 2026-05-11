import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListSubjects,
  useCreateResource,
  useListResources,
  useDeleteResource,
  useCreateNews,
} from "@workspace/api-client-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { Home, Upload, FileText, Newspaper, LogOut, Menu, Trash2, Loader2 } from "lucide-react";
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

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth/login");
    } else if (!authLoading && role !== "instructor") {
      setLocation("/");
    }
  }, [user, role, authLoading, setLocation]);

  const { data: subjects } = useListSubjects();
  const { data: myResources, isLoading: resourcesLoading } = useListResources(); // In a real app, we'd filter by author_id
  
  const createResource = useCreateResource();
  const deleteResource = useDeleteResource();
  const createNews = useCreateNews();

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
                        <SelectContent>
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
                        <SelectContent>
                          {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={resourceForm.control} name="file_url" render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL du fichier (PDF, etc.)</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={resourceForm.control} name="thumbnail_url" render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l'image de couverture</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
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

        </div>
      </main>
    </div>
  );
}
