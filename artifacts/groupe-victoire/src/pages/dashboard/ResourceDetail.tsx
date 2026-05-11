import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumModal from "@/components/PremiumModal";
import { ArrowLeft, BookOpen, FileText, Lightbulb, Lock, Download, ExternalLink } from "lucide-react";
import { useGetResource, getGetResourceQueryKey } from "@workspace/api-client-react";

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const { isPremium, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const { data: resource, isLoading: resourceLoading, error } = useGetResource(id, {
    query: {
      enabled: !!id,
      queryKey: getGetResourceQueryKey(id)
    }
  });

  useEffect(() => {
    if (!authLoading && !resourceLoading && resource) {
      if (!resource.is_free && !isPremium) {
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
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-muted/30 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Ressource introuvable</h2>
          <Button asChild>
            <Link href="/dashboard">Retour au tableau de bord</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isLocked = !resource.is_free && !isPremium;

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
          
          {/* Header Area */}
          <div className="p-6 md:p-8 border-b">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="uppercase tracking-wider">
                {resource.content_type === 'lesson' ? 'Cours' : resource.content_type === 'annal' ? 'Annale' : 'Conseil'}
              </Badge>
              {!resource.is_free && (
                <Badge className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white border-none">
                  Premium
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-4">{resource.title}</h1>
            
            {resource.description && (
              <p className="text-lg text-muted-foreground">{resource.description}</p>
            )}
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8 min-h-[400px] relative">
            {isLocked ? (
              <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Lock className="h-10 w-10 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">Contenu Premium</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Cette ressource est exclusive à nos membres Premium. Débloquez l'accès pour continuer votre préparation.
                </p>
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white" onClick={() => setIsPremiumModalOpen(true)}>
                  Devenir Premium
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {resource.thumbnail_url && (
                  <div className="aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden border bg-muted">
                    <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover" />
                  </div>
                )}
                
                {resource.file_url ? (
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/30">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Document disponible</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      Le contenu complet de cette ressource est disponible au format document.
                    </p>
                    <div className="flex gap-4">
                      <Button asChild variant="outline">
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ouvrir dans un nouvel onglet
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
                  <div className="prose prose-blue dark:prose-invert max-w-none">
                    <p className="text-muted-foreground italic text-center py-12">
                      Le contenu textuel de cette ressource sera affiché ici.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <PremiumModal open={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
}
