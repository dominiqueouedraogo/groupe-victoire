import Navbar from "@/components/Navbar";
import { CheckCircle, Phone, Mail, MapPin, Shield, BookOpen, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const PLANS = [
  {
    city: "Abidjan",
    location: "Lycée Moderne de Cocody",
    forfait: "185 000 FCFA",
    mensualite: "25 000 FCFA/mois",
    highlight: true,
  },
  {
    city: "Bouaké",
    location: "Lycée Moderne de Nimbo",
    forfait: "160 000 FCFA",
    mensualite: "20 000 FCFA/mois",
    highlight: false,
  },
  {
    city: "Korhogo",
    location: "Collège Moderne de Korhogo",
    forfait: "150 000 FCFA",
    mensualite: "20 000 FCFA/mois",
    highlight: false,
  },
  {
    city: "En ligne",
    location: "Lun–Jeu 20h–22h",
    forfait: "150 000 FCFA",
    mensualite: "20 000 FCFA/mois",
    highlight: false,
  },
];

const FEATURES = [
  "Accès illimité à tous les cours structurés",
  "Annales corrigées des années précédentes",
  "Supports de révision exclusifs (PDF, fiches)",
  "Conseils et astuces des anciens lauréats",
  "Sessions de questions-réponses avec formateurs",
  "Mises à jour du contenu en temps réel",
  "Accès depuis tous vos appareils",
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0D0D0D] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-[#C9A227] rounded-full blur-[120px] opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 border border-[#C9A227]/40 bg-[#C9A227]/10 text-[#C9A227] text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Star className="h-3 w-3" /> Nos Tarifs
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-5">
            Investissez dans votre réussite
          </h1>
          <p className="text-lg text-white/60 mb-6">
            Des frais d'inscription de <strong className="text-[#C9A227]">10 000 FCFA</strong> puis choisissez votre formule selon votre ville.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((p) => (
              <div
                key={p.city}
                className={`bg-card rounded-2xl shadow-lg border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${
                  p.highlight ? "border-[#C9A227] ring-2 ring-[#C9A227]/20" : "border-border"
                }`}
              >
                {p.highlight && (
                  <div className="bg-[#C9A227] text-black text-xs font-bold py-2 text-center uppercase tracking-widest">
                    Le plus populaire
                  </div>
                )}
                <div className="p-6 space-y-5">
                  <div>
                    <h3 className="text-xl font-serif font-bold">{p.city}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 shrink-0" /> {p.location}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Forfait complet</p>
                      <p className="text-2xl font-bold text-foreground">{p.forfait}</p>
                    </div>
                    <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Mensualités</p>
                      <p className="text-xl font-bold text-[#C9A227]">{p.mensualite}</p>
                    </div>
                  </div>
                  <Button asChild className={`w-full rounded-xl font-semibold ${p.highlight ? "bg-[#C9A227] hover:bg-[#b8911f] text-black" : ""}`}>
                    <Link href="/auth/signup/candidate">Choisir {p.city}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Inscription fee reminder */}
          <div className="mt-8 text-center bg-muted/50 border rounded-2xl p-6 max-w-lg mx-auto">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Frais d'inscription : 10 000 FCFA</strong> — à régler lors de votre première séance, avant de commencer la formation.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-serif font-bold text-center mb-10">Tout ce qui est inclus dans votre formation</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 bg-background border rounded-xl p-4">
                <CheckCircle className="h-5 w-5 text-[#C9A227] shrink-0" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment instructions */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-serif font-bold text-center mb-10">Comment payer ?</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 dark:bg-orange-950/20 dark:border-orange-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">OM</div>
                <h3 className="font-bold text-orange-900 dark:text-orange-400">Orange Money</h3>
              </div>
              <ol className="space-y-2 text-orange-800 dark:text-orange-300 list-decimal pl-5 text-sm font-medium">
                <li>Envoyez le montant au <strong>0504763249</strong></li>
                <li>Indiquez votre email en référence</li>
                <li>Votre accès sera activé sous 24h</li>
              </ol>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 dark:bg-blue-950/20 dark:border-blue-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">W</div>
                <h3 className="font-bold text-blue-900 dark:text-blue-400">Wave</h3>
              </div>
              <ol className="space-y-2 text-blue-800 dark:text-blue-300 list-decimal pl-5 text-sm font-medium">
                <li>Envoyez le montant au <strong>0798625467</strong></li>
                <li>Envoyez la capture sur WhatsApp</li>
                <li>Votre accès sera activé instantanément</li>
              </ol>
            </div>
          </div>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Besoin d'aide ou d'informations supplémentaires ?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 px-8 font-semibold">
                <a href="https://wa.me/2250504763249" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-4 w-4" /> WhatsApp : 0504763249
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-12 px-8 font-semibold">
                <a href="mailto:groupevictoire47@gmail.com">
                  <Mail className="mr-2 h-4 w-4" /> groupevictoire47@gmail.com
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: "Paiement Sécurisé", desc: "Via Orange Money et Wave, opérateurs agréés en Côte d'Ivoire" },
              { icon: BookOpen, title: "Contenu de Qualité", desc: "Ressources validées par des formateurs et anciens lauréats" },
              { icon: Clock, title: "Accès Illimité", desc: "Révisez à votre rythme jusqu'au jour du concours" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="font-bold">{title}</h4>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
