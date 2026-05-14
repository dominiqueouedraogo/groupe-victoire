import Navbar from "@/components/Navbar";
import { CheckCircle, Phone, Mail, MapPin, Shield, BookOpen, Clock, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

const PLANS = [
  { city: "Abidjan", location: "Lycée Moderne de Cocody", forfait: "185 000", mensualite: "25 000", highlight: true },
  { city: "Bouaké", location: "Lycée Moderne de Nimbo", forfait: "160 000", mensualite: "20 000", highlight: false },
  { city: "Korhogo", location: "Collège Moderne de Korhogo", forfait: "150 000", mensualite: "20 000", highlight: false },
  { city: "En ligne", location: "Lun–Jeu 20h–22h", forfait: "150 000", mensualite: "20 000", highlight: false },
];

const FEATURES = [
  "Accès illimité à tous les cours structurés",
  "Annales corrigées des années précédentes",
  "Supports de révision exclusifs (PDF, fiches)",
  "Conseils et astuces des anciens lauréats",
  "Sessions Q&R avec les formateurs",
  "Mises à jour du contenu en temps réel",
  "Accès depuis tous vos appareils",
  "Suivi personnalisé de votre progression",
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50 pointer-events-none" />
        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full">
            <Star className="h-3 w-3 mr-1.5 inline" /> Nos Tarifs
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-5">
            Investissez dans votre réussite
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Des frais d'inscription de{" "}
            <strong className="text-primary">10 000 FCFA</strong>, puis choisissez la formule adaptée à votre ville.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-16 -mt-6 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map((p) => (
              <Card
                key={p.city}
                className={`bg-white text-center transition-all hover:-translate-y-1 hover:shadow-xl ${
                  p.highlight
                    ? "border-2 border-primary shadow-lg shadow-orange-100 ring-2 ring-orange-100"
                    : "border border-gray-200 shadow-sm"
                }`}
              >
                {p.highlight && (
                  <div className="bg-primary text-white text-xs font-bold py-2 rounded-t-xl tracking-wide uppercase">
                    Le plus populaire
                  </div>
                )}
                <CardContent className={`space-y-4 ${p.highlight ? "pt-5 pb-6" : "py-6"}`}>
                  <div>
                    <p className="text-xl font-serif font-bold text-gray-900">{p.city}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" /> {p.location}
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="bg-gray-50 rounded-xl p-3.5">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Forfait complet</p>
                      <p className="text-xl font-bold text-gray-900">
                        {p.forfait} <span className="text-sm font-normal text-gray-400">FCFA</span>
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3.5">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Mensualité</p>
                      <p className="text-xl font-bold text-primary">
                        {p.mensualite} <span className="text-sm font-normal text-gray-400">FCFA/mois</span>
                      </p>
                    </div>
                  </div>
                  <Button
                    asChild
                    className={`w-full rounded-xl font-semibold ${
                      p.highlight
                        ? "bg-primary hover:bg-orange-600 text-white shadow-sm shadow-orange-200"
                        : "bg-gray-900 hover:bg-gray-700 text-white"
                    }`}
                  >
                    <Link href="/auth/signup/candidate">Choisir {p.city}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2.5 bg-orange-50 border border-orange-200 rounded-full px-6 py-3 text-sm font-semibold text-orange-700">
              <Star className="h-4 w-4" />
              Frais d'inscription : 10 000 FCFA — à régler lors de la première séance
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-serif font-bold text-gray-900 text-center mb-10">
            Tout ce qui est inclus dans votre formation
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-sm text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment instructions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-serif font-bold text-gray-900 text-center mb-10">Comment payer ?</h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">OM</div>
                <h3 className="font-bold text-gray-900">Orange Money</h3>
              </div>
              <ol className="space-y-2.5 text-gray-600 list-decimal pl-5 text-sm">
                <li>Envoyez le montant au <strong className="text-gray-900">0504763249</strong></li>
                <li>Indiquez votre adresse email en référence</li>
                <li>Votre accès sera activé sous 24h</li>
              </ol>
            </div>
            <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">W</div>
                <h3 className="font-bold text-gray-900">Wave</h3>
              </div>
              <ol className="space-y-2.5 text-gray-600 list-decimal pl-5 text-sm">
                <li>Envoyez le montant au <strong className="text-gray-900">0798625467</strong></li>
                <li>Envoyez la capture d'écran sur WhatsApp</li>
                <li>Votre accès est activé instantanément</li>
              </ol>
            </div>
          </div>
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">Des questions sur le paiement ?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 px-8 font-semibold shadow-sm">
                <a href="https://wa.me/2250504763249" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-4 w-4" /> WhatsApp : 0504763249
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-12 px-8 font-semibold border-gray-200">
                <a href="mailto:groupevictoire47@gmail.com">
                  <Mail className="mr-2 h-4 w-4" /> groupevictoire47@gmail.com
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: "Paiement Sécurisé", desc: "Via Orange Money et Wave, opérateurs agréés en Côte d'Ivoire" },
              { icon: BookOpen, title: "Contenu de Qualité", desc: "Ressources validées par des formateurs et anciens lauréats" },
              { icon: Clock, title: "Accès Illimité", desc: "Révisez à votre rythme jusqu'au jour du concours" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-primary shadow-sm">
                  <Icon className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
