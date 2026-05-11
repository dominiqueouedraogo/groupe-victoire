import { useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen, Award, Users, Phone, Mail, MapPin, CheckCircle,
  GraduationCap, Shield, Star, ArrowRight, Clock, ChevronRight
} from "lucide-react";

const CONCOURS = [
  {
    id: "ena",
    name: "ENA",
    full: "École Nationale d'Administration",
    description: "Formez-vous aux concours de la haute fonction publique ivoirienne. Trois cycles disponibles : Supérieur, Moyen Supérieur et Moyen.",
    levels: ["Cycle Supérieur", "Cycle Moyen Supérieur", "Cycle Moyen"],
    color: "from-[#C9A227]/20 to-[#C9A227]/5",
    border: "border-[#C9A227]/40",
  },
  {
    id: "ens",
    name: "ENS",
    full: "École Normale Supérieure",
    description: "Préparez le concours d'enseignement supérieur avec des cours spécialisés en pédagogie, français, mathématiques et culture générale.",
    levels: ["Niveau Licence", "Niveau Master"],
    color: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-400/30",
  },
  {
    id: "infas",
    name: "INFAS",
    full: "Institut National de Formation des Agents de Santé",
    description: "Accédez aux carrières de la santé publique ivoirienne avec une préparation complète aux épreuves scientifiques.",
    levels: ["Infirmier d'État", "Sage-Femme", "Technicien de Santé"],
    color: "from-green-500/10 to-green-500/5",
    border: "border-green-400/30",
  },
  {
    id: "infs",
    name: "INFS",
    full: "Institut National de Formation Sociale",
    description: "Préparez les concours du secteur social avec des cours en droit social, économie et culture générale.",
    levels: ["Assistant Social", "Éducateur Spécialisé"],
    color: "from-purple-500/10 to-purple-500/5",
    border: "border-purple-400/30",
  },
  {
    id: "eaux_forets",
    name: "Eaux et Forêts",
    full: "Corps des Eaux et Forêts",
    description: "Rejoignez le corps des Eaux et Forêts avec une préparation aux sciences naturelles, géographie et culture générale.",
    levels: ["Agent Technique", "Inspecteur"],
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-400/30",
  },
  {
    id: "police",
    name: "Police Nationale",
    full: "Police Nationale de Côte d'Ivoire",
    description: "Intégrez la Police Nationale avec notre préparation rigoureuse couvrant le droit, la culture générale et les épreuves physiques.",
    levels: ["Gardien de la Paix", "Officier de Police"],
    color: "from-sky-500/10 to-sky-500/5",
    border: "border-sky-400/30",
  },
  {
    id: "gendarmerie",
    name: "Gendarmerie Nationale",
    full: "Gendarmerie Nationale de Côte d'Ivoire",
    description: "Rejoignez la Gendarmerie Nationale avec une formation aux épreuves de droit, instruction civique et culture générale.",
    levels: ["Gendarme", "Officier"],
    color: "from-indigo-500/10 to-indigo-500/5",
    border: "border-indigo-400/30",
  },
  {
    id: "armee",
    name: "Armée Ivoirienne",
    full: "Forces Armées de Côte d'Ivoire",
    description: "Intégrez les Forces Armées avec notre préparation aux épreuves générales : histoire, géographie, mathématiques et français.",
    levels: ["Soldat", "Sous-Officier", "Officier"],
    color: "from-red-500/10 to-red-500/5",
    border: "border-red-400/30",
  },
];

const TESTIMONIALS = [
  { name: "Konan Aya", concours: "ENA Cycle Supérieur", text: "Grâce à Groupe Victoire, j'ai réussi l'ENA du premier coup. Les cours sont excellents et les formateurs sont très disponibles.", stars: 5 },
  { name: "Traoré Ibrahima", concours: "Police Nationale", text: "La méthode de préparation est très sérieuse. J'ai été admis à la Police Nationale après seulement 4 mois de formation.", stars: 5 },
  { name: "Koffi Adjoua", concours: "INFAS", text: "Les formateurs connaissent parfaitement les programmes. Je recommande Groupe Victoire à tous les candidats.", stars: 5 },
  { name: "Bamba Seydou", concours: "ENS", text: "Excellent centre de préparation. Les cours en ligne sont très pratiques et les supports de qualité.", stars: 5 },
  { name: "N'Guessan Pauline", concours: "ENA Cycle Moyen", text: "J'ai adoré la formation ! Les annales corrigées m'ont vraiment aidée à comprendre les attentes du jury.", stars: 5 },
  { name: "Coulibaly Mamadou", concours: "Gendarmerie Nationale", text: "Groupe Victoire m'a permis de bien structurer ma révision. Admis en 2024 !", stars: 5 },
  { name: "Diomandé Fatoumata", concours: "INFS", text: "Les sessions en ligne sont très interactives. Un grand merci à toute l'équipe pédagogique.", stars: 5 },
  { name: "Yao Kouassi", concours: "Eaux et Forêts", text: "Une préparation sérieuse et efficace. J'ai intégré le corps des Eaux et Forêts en 2024.", stars: 5 },
];

const PRICING = [
  {
    city: "Abidjan",
    location: "Lycée Moderne de Cocody",
    forfait: "185 000",
    mensualite: "25 000",
    icon: MapPin,
    highlight: true,
  },
  {
    city: "Bouaké",
    location: "Lycée Moderne de Nimbo",
    forfait: "160 000",
    mensualite: "20 000",
    icon: MapPin,
    highlight: false,
  },
  {
    city: "Korhogo",
    location: "Collège Moderne de Korhogo",
    forfait: "150 000",
    mensualite: "20 000",
    icon: MapPin,
    highlight: false,
  },
  {
    city: "En ligne",
    location: "Lun-Jeu 20h–22h",
    forfait: "150 000",
    mensualite: "20 000",
    icon: Clock,
    highlight: false,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Choisissez votre concours",
    desc: "Sélectionnez le(s) concours que vous préparez et votre ville. Notre équipe vous orientera vers le meilleur programme.",
  },
  {
    step: "02",
    title: "Rejoignez votre classe",
    desc: "Rejoignez votre session (présentielle ou en ligne) et accédez à tous les cours, annales et supports de révision.",
  },
  {
    step: "03",
    title: "Réussissez votre concours",
    desc: "Bénéficiez d'un accompagnement personnalisé jusqu'au jour du concours avec des simulations d'examen.",
  },
];

const FAQS = [
  {
    q: "Quels concours préparez-vous ?",
    a: "Nous préparons aux concours ENA (3 cycles), ENS, INFAS, INFS, Eaux et Forêts, Police Nationale, Gendarmerie Nationale et Armée Ivoirienne.",
  },
  {
    q: "Puis-je préparer plusieurs concours en même temps ?",
    a: "Oui, vous pouvez vous inscrire à plusieurs concours simultanément. Nos formateurs vous aideront à organiser votre planning de révision.",
  },
  {
    q: "Y a-t-il des cours en ligne ?",
    a: "Oui, nous proposons des cours en ligne du lundi au jeudi de 20h à 22h pour les candidats qui ne peuvent pas se déplacer.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Vous payez d'abord des frais d'inscription de 10 000 FCFA, puis vous choisissez entre le forfait complet ou les mensualités selon votre ville.",
  },
  {
    q: "Quel est votre taux de réussite ?",
    a: "Nous affichons un taux de réussite supérieur à 85% parmi nos candidats actifs grâce à notre méthodologie éprouvée.",
  },
  {
    q: "Comment contacter Groupe Victoire ?",
    a: "Par téléphone au 0504763249 ou 0798625467, par email à groupevictoire47@gmail.com ou via WhatsApp.",
  },
];

const fadeIn = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function Landing() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#0D0D0D] text-white py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/80 via-[#0D0D0D]/60 to-[#0D0D0D]"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.15 }} className="space-y-8">
            <motion.p variants={fadeIn} className="text-[#C9A227] font-semibold tracking-widest uppercase text-sm">
              Travail &bull; Rigueur &bull; Compétence
            </motion.p>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight">
              Réussissez votre concours avec{" "}
              <span className="text-[#C9A227]">Groupe Victoire</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Le centre de préparation de référence en Côte d'Ivoire pour les concours de la fonction publique, de la sécurité et de l'éducation nationale.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-[#C9A227] hover:bg-[#b8911f] text-black font-bold h-14 px-10 text-base rounded-xl">
                <Link href="/auth/signup/candidate">
                  S'inscrire maintenant <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-10 text-base rounded-xl">
                <a href="#formations">Nos formations</a>
              </Button>
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-6 pt-4 text-white/60 text-sm">
              <a href="tel:0504763249" className="flex items-center gap-2 hover:text-[#C9A227] transition-colors">
                <Phone className="h-4 w-4" /> 0504763249
              </a>
              <a href="tel:0798625467" className="flex items-center gap-2 hover:text-[#C9A227] transition-colors">
                <Phone className="h-4 w-4" /> 0798625467
              </a>
              <a href="mailto:groupevictoire47@gmail.com" className="flex items-center gap-2 hover:text-[#C9A227] transition-colors">
                <Mail className="h-4 w-4" /> groupevictoire47@gmail.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-[#C9A227]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-black">
            {[
              { val: "2 000+", label: "Candidats formés" },
              { val: "85%+", label: "Taux de réussite" },
              { val: "8", label: "Concours préparés" },
              { val: "4", label: "Villes & En ligne" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="text-3xl md:text-4xl font-serif font-bold">{s.val}</p>
                <p className="text-black/70 font-medium text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos formations */}
      <section id="formations" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#C9A227] font-semibold uppercase tracking-widest text-sm mb-3">Nos Formations</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              8 concours préparés avec excellence
            </h2>
            <p className="text-muted-foreground">
              Quelle que soit votre vocation, Groupe Victoire dispose du programme adapté pour vous conduire vers la réussite.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONCOURS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full border ${c.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${c.color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-serif font-bold text-[#C9A227]">{c.name}</span>
                    </div>
                    <CardTitle className="text-sm font-semibold text-muted-foreground leading-snug">{c.full}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                    <div className="space-y-1.5">
                      {c.levels.map((l) => (
                        <div key={l} className="flex items-center gap-2 text-xs">
                          <ChevronRight className="h-3 w-3 text-[#C9A227] shrink-0" />
                          <span className="text-foreground/80">{l}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild size="sm" className="w-full bg-[#C9A227] hover:bg-[#b8911f] text-black font-semibold rounded-lg mt-2">
                      <Link href="/auth/signup/candidate">S'inscrire</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#0D0D0D] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#C9A227] font-semibold uppercase tracking-widest text-sm mb-3">Comment ça marche</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Rejoignez-nous en 3 étapes simples</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
                className="relative text-center p-8 rounded-2xl border border-white/10 hover:border-[#C9A227]/50 transition-colors group"
              >
                <div className="text-5xl font-serif font-bold text-[#C9A227]/20 group-hover:text-[#C9A227]/40 transition-colors mb-4">{s.step}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#C9A227] font-semibold uppercase tracking-widest text-sm mb-3">Tarifs</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Des tarifs adaptés à votre situation
            </h2>
            <div className="inline-flex items-center gap-3 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-full px-6 py-3 mt-2">
              <Star className="h-5 w-5 text-[#C9A227]" />
              <span className="font-bold text-foreground">Frais d'inscription : <span className="text-[#C9A227]">10 000 FCFA</span></span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PRICING.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.city}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Card className={`h-full text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${p.highlight ? "border-[#C9A227] ring-2 ring-[#C9A227]/30 shadow-lg" : "border-border"}`}>
                    {p.highlight && (
                      <div className="bg-[#C9A227] text-black text-xs font-bold py-1.5 rounded-t-xl tracking-wider uppercase">
                        Le plus populaire
                      </div>
                    )}
                    <CardHeader className="pb-2 pt-6">
                      <div className="flex justify-center mb-3">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${p.highlight ? "bg-[#C9A227] text-black" : "bg-muted text-[#C9A227]"}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-serif">{p.city}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <MapPin className="h-3 w-3" /> {p.location}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-5 pb-8">
                      <div className="space-y-3 pt-2">
                        <div className="bg-muted/50 rounded-xl p-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Forfait complet</p>
                          <p className="text-2xl font-bold text-foreground">{p.forfait}</p>
                          <p className="text-xs text-muted-foreground">FCFA</p>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Mensualité</p>
                          <p className="text-2xl font-bold text-[#C9A227]">{p.mensualite}</p>
                          <p className="text-xs text-muted-foreground">FCFA / mois</p>
                        </div>
                      </div>
                      <Button asChild className={`w-full rounded-xl font-semibold ${p.highlight ? "bg-[#C9A227] hover:bg-[#b8911f] text-black" : "bg-foreground text-background hover:bg-foreground/90"}`}>
                        <Link href="/auth/signup/candidate">Choisir {p.city}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0D0D0D] text-white overflow-hidden">
        <div className="container mx-auto px-4 mb-12 text-center">
          <p className="text-[#C9A227] font-semibold uppercase tracking-widest text-sm mb-3">Témoignages</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Ce que disent nos lauréats</h2>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-6 testimonials-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="shrink-0 w-72 md:w-80 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-[#C9A227] text-xs">{t.concours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-[#C9A227] font-semibold uppercase tracking-widest text-sm mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Questions fréquentes</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-4">
                <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline hover:text-[#C9A227]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-[#C9A227]">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-black mb-6">
            Votre réussite commence maintenant
          </h2>
          <p className="text-black/70 text-lg mb-8">
            Ne laissez pas le hasard décider de votre avenir. Rejoignez les milliers de candidats qui ont fait confiance à Groupe Victoire.
          </p>
          <Button asChild size="lg" className="bg-black text-white hover:bg-black/80 h-14 px-10 text-lg font-bold rounded-xl">
            <Link href="/auth/signup/candidate">
              S'inscrire maintenant <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold">
                Groupe Victoire<span className="text-[#C9A227]">.</span>
              </h3>
              <p className="text-[#C9A227] text-sm font-semibold tracking-widest uppercase">Travail – Rigueur – Compétence</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Le centre de préparation de référence aux concours de la fonction publique en Côte d'Ivoire.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-[#C9A227] uppercase tracking-wider text-sm">Nos sites</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-[#C9A227] mt-0.5 shrink-0" /> Abidjan — Lycée Moderne de Cocody</li>
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-[#C9A227] mt-0.5 shrink-0" /> Bouaké — Lycée Moderne de Nimbo</li>
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-[#C9A227] mt-0.5 shrink-0" /> Korhogo — Collège Moderne de Korhogo</li>
                <li className="flex items-start gap-2"><Clock className="h-4 w-4 text-[#C9A227] mt-0.5 shrink-0" /> En ligne — Lun-Jeu 20h–22h</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-[#C9A227] uppercase tracking-wider text-sm">Contact</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  <a href="tel:0504763249" className="flex items-center gap-2 hover:text-[#C9A227] transition-colors">
                    <Phone className="h-4 w-4 text-[#C9A227]" /> 0504763249
                  </a>
                </li>
                <li>
                  <a href="tel:0798625467" className="flex items-center gap-2 hover:text-[#C9A227] transition-colors">
                    <Phone className="h-4 w-4 text-[#C9A227]" /> 0798625467
                  </a>
                </li>
                <li>
                  <a href="mailto:groupevictoire47@gmail.com" className="flex items-center gap-2 hover:text-[#C9A227] transition-colors">
                    <Mail className="h-4 w-4 text-[#C9A227]" /> groupevictoire47@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© {new Date().getFullYear()} Groupe Victoire. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/auth/signup/candidate" className="hover:text-[#C9A227] transition-colors">S'inscrire</Link>
              <Link href="/auth/login" className="hover:text-[#C9A227] transition-colors">Connexion</Link>
              <Link href="/premium" className="hover:text-[#C9A227] transition-colors">Tarifs</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
