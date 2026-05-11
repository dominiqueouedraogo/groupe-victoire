import Navbar from "@/components/Navbar";
import { CheckCircle, Phone, Star, Shield, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-[#D4AF37] rounded-full blur-[120px] opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 mb-6 hover:bg-[#D4AF37]/30 text-sm px-4 py-1">
            Offre d'Excellence
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Mettez toutes les chances de votre côté
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 mb-8">
            Accédez à l'intégralité de nos ressources, annales corrigées et conseils d'experts avec l'abonnement Premium.
          </p>
        </div>
      </section>

      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Pricing Card */}
            <div className="bg-background rounded-2xl shadow-xl border overflow-hidden">
              <div className="p-8 border-b text-center bg-muted/30">
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">Abonnement Annuel</h3>
                <div className="text-4xl font-bold text-[#D4AF37] mb-2">25 000 FCFA</div>
                <p className="text-muted-foreground text-sm">Paiement unique, accès jusqu'au concours</p>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Accès illimité à <strong>tous les cours</strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Accès exclusif aux <strong>annales corrigées</strong> des 10 dernières années</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Méthodologie détaillée pour chaque épreuve</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Conseils et astuces des anciens lauréats</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Mises à jour des contenus en temps réel</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 dark:bg-orange-950/20 dark:border-orange-900">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">OM</div>
                  <h3 className="text-xl font-bold text-orange-900 dark:text-orange-400">Paiement Orange Money</h3>
                </div>
                <ol className="space-y-3 text-orange-800 dark:text-orange-300 ml-4 list-decimal pl-4 font-medium">
                  <li>Envoyez <strong>25 000 FCFA</strong> au <strong>+221 77 123 45 67</strong></li>
                  <li>Mettez votre adresse email en référence de transfert</li>
                  <li>Votre compte sera activé dans les 15 minutes</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 dark:bg-blue-950/20 dark:border-blue-900">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">W</div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400">Paiement Wave</h3>
                </div>
                <ol className="space-y-3 text-blue-800 dark:text-blue-300 ml-4 list-decimal pl-4 font-medium">
                  <li>Envoyez <strong>25 000 FCFA</strong> au <strong>+221 77 123 45 67</strong></li>
                  <li>Envoyez une capture d'écran sur WhatsApp</li>
                  <li>Votre compte sera activé instantanément</li>
                </ol>
              </div>

              <div className="pt-4 text-center">
                <p className="text-sm text-muted-foreground mb-4">Besoin d'aide pour le paiement ?</p>
                <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-lg">
                  <a href="https://wa.me/221XXXXXXXXX" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-5 w-5" /> Contacter le support sur WhatsApp
                  </a>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-background py-16 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="font-bold">Paiement Sécurisé</h4>
              <p className="text-sm text-muted-foreground">Transactions via opérateurs agréés au Sénégal</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h4 className="font-bold">Contenu Vérifié</h4>
              <p className="text-sm text-muted-foreground">Ressources validées par des inspecteurs et experts</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="font-bold">Accès 24/7</h4>
              <p className="text-sm text-muted-foreground">Révisez à votre rythme, où que vous soyez</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Quick Badge component just for this file since we need to import it properly
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
