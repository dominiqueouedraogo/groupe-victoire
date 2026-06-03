import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumModal from "@/components/PremiumModal";
import { ArrowLeft, FileText, Lock, Download, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const { isPremium, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [resource, setResource] = useState<any>(null);
  const [resourceLoading, setResourceLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("resources").select("*").eq("id", id).single()
      .then(({ data, error }) => {
        if (error) setError(error);
        else setResource(data);
        setResourceLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!authLoading && !resourceLoading && resource) {
      if (resource.is_free === false && !isPremium) {
        setIsPremiumModalOpen(true);
      }
    }
  }, [resource, isPremium, authLoading, resourceLoading]);

  if (authLoading || resourceLoading) {
    return (
      <div className="min-h-screen bg-muted/30 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-muted/30 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Ressource introuvable</h2>
          <Button asChild><Link href="/dashboard">Retour au tableau de bord</Link></Button>
        </div>
      </div>
    );
  }

  const isLocked = resource.is_free === false && !isPremium;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 py-8 lg:p-8">
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="uppercase tracking-wider">
                {resource.content_type === "lesson" ? "Cours" : resource.content_type === "annal" ? "Annale" : "Conseil"}
              </Badge>
              {!resource.is_free && (
                <Badge className="bg-[#D4AF37] text-white border-none">Premium</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-4">{resource.title}</h1>
            {resource.description && <p className="text-lg text-muted-foreground">{resource.description}</p>}
          </div>

          <div className="p-6 md:p-8 min-h-[400px] relative">
            {isLocked ? (
              <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Lock className="h-10 w-10 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">Contenu Premium</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Cette ressource est exclusive à nos membres Premium.
                </p>
                <Button size="lg" className="bg-[#D4AF37] text-white" onClick={() => setIsPremiumModalOpen(true)}>
                  Devenir Premium
                </Button>
              </div>
            ) : resource.file_url ? (
              <div className="space-y-4">
                <iframe
                  src={resource.file_url}
                  className="w-full rounded-lg border"
                  style={{ height: "75vh" }}
                  title={resource.title}
                />
                <div className="flex gap-3 justify-center">
                  <Button asChild variant="outline">
                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ouvrir dans un onglet
                    </a>
                  </Button>
                  <Button asChild>
                    <a href={resource.file_url} download>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic text-center py-12">
                Aucun document disponible pour cette ressource.
              </p>
            )}
          </div>
        </div>
      </div>

      <PremiumModal open={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
}
