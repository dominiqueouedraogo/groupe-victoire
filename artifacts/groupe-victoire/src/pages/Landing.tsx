import Navbar from "@/components/Navbar";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen, Award, Users, Phone, Mail, MapPin, CheckCircle,
  ArrowRight, Clock, ChevronRight, Star, Zap, Target, TrendingUp, Shield
} from "lucide-react";

const CONCOURS = [
  { id: "ena", name: "ENA", full: "École Nationale d'Administration", levels: ["Cycle Supérieur", "Cycle Moyen Supérieur", "Cycle Moyen"], icon: "🏛️", color: "border-orange-200 hover:border-orange-400" },
  { id: "ens", name: "ENS", full: "École Normale Supérieure", levels: ["Niveau Licence", "Niveau Master"], icon: "📚", color: "border-blue-200 hover:border-blue-400" },
  { id: "infas", name: "INFAS", full: "Institut National de Formation des Agents de Santé", levels: ["Infirmier d'État", "Sage-Femme"], icon: "🏥", color: "border-green-200 hover:border-green-400" },
  { id: "infs", name: "INFS", full: "Institut National de Formation Sociale", levels: ["Assistant Social"], icon: "🤝", color: "border-purple-200 hover:border-purple-400" },
  { id: "eaux_forets", name: "Eaux & Forêts", full: "Corps des Eaux et Forêts", levels: ["Agent Technique", "Inspecteur"], icon: "🌿", color: "border-emerald-200 hover:border-emerald-400" },
  { id: "police", name: "Police Nationale", full: "Police Nationale de Côte d'Ivoire", levels: ["Gardien de la Paix", "Officier"], icon: "👮", color: "border-sky-200 hover:border-sky-400" },
  { id: "gendarmerie", name: "Gendarmerie", full: "Gendarmerie Nationale de Côte d'Ivoire", levels: ["Gendarme", "Officier"], icon: "🎖️", color: "border-indigo-200 hover:border-indigo-400" },
  { id: "armee", name: "Armée Ivoirienne", full: "Forces Armées de Côte d'Ivoire", levels: ["Soldat", "Sous-Officier"], icon: "🛡️", color: "border-red-200 hover:border-red-400" },
];

const TESTIMONIALS = [
  { name: "Konan Aya", concours: "ENA Cycle Supérieur", text: "Grâce à Groupe Victoire, j'ai réussi l'ENA du premier coup. Une méthode vraiment efficace !", stars: 5 },
  { name: "Traoré Ibrahima", concours: "Police Nationale", text: "Admis à la Police Nationale après 4 mois de formation. Je recommande vivement !", stars: 5 },
  { name: "Koffi Adjoua", concours: "INFAS", text: "Les formateurs sont excellents et très disponibles. Meilleur centre de Côte d'Ivoire.", stars: 5 },
  { name: "Bamba Seydou", concours: "ENS", text: "Les cours en ligne sont très pratiques. J'ai pu réviser depuis Bouaké sans problème.", stars: 5 },
  { name: "N'Guessan Pauline", concours: "ENA Cycle Moyen", text: "Les annales corrigées m'ont vraiment aidée. Reçue au concours dès ma première tentative !", stars: 5 },
  { name: "Coulibaly Mamadou", concours: "Gendarmerie", text: "Groupe Victoire m'a permis d'organiser mes révisions intelligemment. Admis en 2024 !", stars: 5 },
  { name: "Diomandé Fatoumata", concours: "INFS", text: "Sessions interactives et formateurs passionnés. Je suis fière d'avoir réussi.", stars: 5 },
  { name: "Yao Kouassi", concours: "Eaux et Forêts", text: "Excellente préparation ! J'ai intégré le corps des Eaux et Forêts en 2024.", stars: 5 },
];

const PRICING = [
  { city: "Abidjan", location: "Lycée Moderne de Cocody", forfait: "185 000", mensualite: "25 000", highlight: true },
  { city: "Bouaké", location: "Lycée Moderne de Nimbo", forfait: "160 000", mensualite: "20 000", highlight: false },
  { city: "Korhogo", location: "Collège Moderne de Korhogo", forfait: "150 000", mensualite: "20 000", highlight: false },
  { city: "En ligne", location: "Lun–Jeu 20h–22h", forfait: "150 000", mensualite: "20 000", highlight: false },
];

const STEPS = [
  { step: "01", icon: Target, title: "Choisissez votre concours", desc: "Sélectionnez le ou les concours que vous préparez et votre ville. Notre équipe vous oriente." },
  { step: "02", icon: BookOpen, title: "Accédez à votre formation", desc: "Rejoignez votre classe (présentielle ou en ligne) et accédez aux cours, annales et conseils d'experts." },
  { step: "03", icon: Award, title: "Réussissez votre concours", desc: "Bénéficiez d'un accompagnement personnalisé jusqu'au jour J avec des simulations d'examens." },
];

const FAQS = [
  { q: "Quels concours préparez-vous ?", a: "Nous préparons aux concours ENA (3 cycles), ENS, INFAS, INFS, Eaux et Forêts, Police Nationale, Gendarmerie Nationale et Armée Ivoirienne." },
  { q: "Puis-je préparer plusieurs concours ?", a: "Oui, vous pouvez vous inscrire à plusieurs concours simultanément. Nos formateurs organisent votre planning de révision." },
  { q: "Y a-t-il des cours en ligne ?", a: "Oui ! Nous proposons des cours en ligne du lundi au jeudi de 20h à 22h pour les candidats qui ne peuvent pas se déplacer." },
  { q: "Quel est le montant de l'inscription ?", a: "Les frais d'inscription sont de 10 000 FCFA. Vous choisissez ensuite entre le forfait complet ou les mensualités selon votre ville." },
  { q: "Quel est votre taux de réussite ?", a: "Nous affichons un taux de réussite supérieur à 85% parmi nos candidats actifs grâce à notre méthodologie éprouvée." },
  { q: "Comment vous contacter ?", a: "Par téléphone au 0504763249 ou 0798625467, par email à groupevictoire47@gmail.com ou via WhatsApp." },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 md:py-32">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-80 pointer-events-none" />
        <div className="container relative mx-auto px-4 text-center max-w-4xl">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.14 }} className="space-y-7">
            <motion.div variants={fadeUp}>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full">
                Travail · Rigueur · Compétence
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight">
              Réussissez votre concours avec{" "}
              <span className="text-primary">Groupe Victoire</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Le centre de préparation de référence en Côte d'Ivoire pour les concours de la fonction publique, de la sécurité et de l'éducation nationale.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-orange-600 text-white font-bold h-14 px-8 text-base rounded-xl shadow-lg shadow-orange-200">
                <Link href="/auth/signup/candidate">
                  S'inscrire maintenant <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-14 px-8 text-base rounded-xl">
                <a href="#formations">Voir les formations</a>
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-5 pt-2 text-sm text-gray-500">
              <a href="tel:0504763249" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" /> 0504763249
              </a>
              <a href="tel:0798625467" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" /> 0798625467
              </a>
              <a href="mailto:groupevictoire47@gmail.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary" /> groupevictoire47@gmail.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { val: "2 000+", label: "Candidats formés" },
              { val: "85%+", label: "Taux de réussite" },
              { val: "8", label: "Concours préparés" },
              { val: "4", label: "Sites de formation" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="text-3xl md:text-4xl font-serif font-bold">{s.val}</p>
                <p className="text-white/80 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-3">Pourquoi nous choisir</Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">La méthode qui fait la différence</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "Cours structurés", desc: "Programmes complets couvrant l'intégralité du syllabus de chaque concours.", color: "bg-orange-50 text-primary" },
              { icon: Award, title: "Annales corrigées", desc: "Accès aux sujets des années précédentes avec des corrigés détaillés.", color: "bg-green-50 text-green-600" },
              { icon: Zap, title: "Formateurs experts", desc: "Anciens lauréats et professeurs qualifiés qui connaissent les attentes des jurys.", color: "bg-blue-50 text-blue-600" },
              { icon: Users, title: "Communauté active", desc: "Échangez avec d'autres candidats et formez des groupes de révision.", color: "bg-purple-50 text-purple-600" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${f.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NOS FORMATIONS ── */}
      <section id="formations" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-3">Nos Formations</Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              8 concours préparés avec excellence
            </h2>
            <p className="text-gray-500">
              Quelle que soit votre vocation, Groupe Victoire a le programme adapté pour vous mener vers la réussite.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONCOURS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full border-2 ${c.color} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white`}>
                  <CardContent className="p-5 space-y-3">
                    <div className="text-2xl">{c.icon}</div>
                    <div>
                      <span className="font-serif font-bold text-lg text-gray-900">{c.name}</span>
                      <p className="text-xs text-gray-500 leading-snug mt-0.5">{c.full}</p>
                    </div>
                    <div className="space-y-1">
                      {c.levels.map((l) => (
                        <div key={l} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <ChevronRight className="h-3 w-3 text-primary shrink-0" />
                          {l}
                        </div>
                      ))}
                    </div>
                    <Button asChild size="sm" className="w-full bg-primary hover:bg-orange-600 text-white font-semibold rounded-lg mt-1">
                      <Link href="/auth/signup/candidate">S'inscrire</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-3">Comment ça marche</Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Rejoignez-nous en 3 étapes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] w-full h-0.5 bg-orange-100" />
                  )}
                  <div className="relative z-10 inline-flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-2xl bg-orange-50 border-2 border-orange-100 flex flex-col items-center justify-center gap-1">
                      <Icon className="h-7 w-7 text-primary" />
                      <span className="text-xs font-bold text-primary">{s.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-3">Tarifs</Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Des tarifs adaptés à votre situation</h2>
          </div>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-6 py-2.5 text-sm font-semibold text-orange-700">
              <Star className="h-4 w-4" /> Frais d'inscription : 10 000 FCFA
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {PRICING.map((p, i) => (
              <motion.div
                key={p.city}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full text-center transition-all hover:-translate-y-1 hover:shadow-xl ${p.highlight ? "border-2 border-primary shadow-lg shadow-orange-100 ring-2 ring-orange-100" : "border border-gray-200"}`}>
                  {p.highlight && (
                    <div className="bg-primary text-white text-xs font-bold py-1.5 rounded-t-xl tracking-wide uppercase">
                      Le plus populaire
                    </div>
                  )}
                  <CardContent className={`space-y-4 ${p.highlight ? "pt-5 pb-6" : "py-6"}`}>
                    <div>
                      <p className="text-xl font-serif font-bold text-gray-900">{p.city}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                        <MapPin className="h-3 w-3" />{p.location}
                      </p>
                    </div>
                    <div className="space-y-2.5">
                      <div className="bg-gray-50 rounded-xl p-3.5">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Forfait complet</p>
                        <p className="text-xl font-bold text-gray-900">{p.forfait} <span className="text-sm font-normal text-gray-500">FCFA</span></p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3.5">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Mensualité</p>
                        <p className="text-xl font-bold text-primary">{p.mensualite} <span className="text-sm font-normal text-gray-500">FCFA/mois</span></p>
                      </div>
                    </div>
                    <Button asChild className={`w-full rounded-xl font-semibold ${p.highlight ? "bg-primary hover:bg-orange-600 text-white" : "bg-gray-900 hover:bg-gray-700 text-white"}`}>
                      <Link href="/auth/signup/candidate">Choisir {p.city}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 mb-10 text-center">
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-3">Témoignages</Badge>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Ce que disent nos lauréats</h2>
        </div>
        <div className="relative overflow-hidden">
          <div className="testimonials-track flex gap-5">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="shrink-0 w-72 md:w-80 bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-primary text-xs font-medium">{t.concours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-3">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Questions fréquentes</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white border border-gray-200 rounded-xl px-5 shadow-sm">
                <AccordionTrigger className="text-left font-semibold py-5 text-gray-900 hover:no-underline hover:text-primary transition-colors">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 pb-5 text-sm leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-5">
            Votre réussite commence ici
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Rejoignez les 2 000+ candidats qui ont fait confiance à Groupe Victoire pour réussir leur concours.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-orange-50 h-14 px-10 text-lg font-bold rounded-xl shadow-xl">
            <Link href="/auth/signup/candidate">
              S'inscrire maintenant <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif font-bold">
                Groupe Victoire<span className="text-primary">.</span>
              </h3>
              <p className="text-primary text-xs font-bold tracking-widest uppercase">Travail – Rigueur – Compétence</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Le centre de référence pour la préparation aux concours de la fonction publique en Côte d'Ivoire.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-primary uppercase tracking-wider text-xs">Nos sites</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Abidjan — Lycée Moderne de Cocody</li>
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Bouaké — Lycée Moderne de Nimbo</li>
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Korhogo — Collège Moderne de Korhogo</li>
                <li className="flex items-start gap-2"><Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" /> En ligne — Lun–Jeu 20h–22h</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-primary uppercase tracking-wider text-xs">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="tel:0504763249" className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="h-4 w-4 text-primary" /> 0504763249</a></li>
                <li><a href="tel:0798625467" className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="h-4 w-4 text-primary" /> 0798625467</a></li>
                <li><a href="mailto:groupevictoire47@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="h-4 w-4 text-primary" /> groupevictoire47@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Groupe Victoire. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/auth/signup/candidate" className="hover:text-primary transition-colors">S'inscrire</Link>
              <Link href="/auth/login" className="hover:text-primary transition-colors">Connexion</Link>
              <Link href="/premium" className="hover:text-primary transition-colors">Tarifs</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
