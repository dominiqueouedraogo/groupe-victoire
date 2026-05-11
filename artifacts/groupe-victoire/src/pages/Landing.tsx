import Navbar from "@/components/Navbar";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGetPlatformStats, useListCycles, useListNews } from "@workspace/api-client-react";
import { BookOpen, Award, Users, Lightbulb, Star, ChevronRight, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  const { data: stats } = useGetPlatformStats();
  const { data: cycles } = useListCycles();
  const { data: news } = useListNews();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 md:py-32 lg:py-40 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary/80"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, staggerChildren: 0.2 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
              Préparez l'ENA avec <span className="text-[#D4AF37]">les Meilleurs</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              La plateforme d'excellence pour le concours d'entrée à l'École Nationale d'Administration. Accédez à des cours structurés et des annales corrigées.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-[#D4AF37] text-primary hover:bg-[#D4AF37]/90 text-base h-12 px-8">
                <Link href="/auth/signup/candidate">Commencer gratuitement</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:text-white text-base h-12 px-8">
                <Link href="#features">En savoir plus</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <h3 className="text-4xl font-bold text-primary font-serif">{stats?.total_candidates || "2000"}+</h3>
              <p className="text-muted-foreground font-medium">Candidats</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-4xl font-bold text-[#D4AF37] font-serif">95%</h3>
              <p className="text-muted-foreground font-medium">Taux de réussite</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-4xl font-bold text-primary font-serif">{stats?.total_resources || "150"}+</h3>
              <p className="text-muted-foreground font-medium">Ressources</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-4xl font-bold text-[#D4AF37] font-serif">{stats?.total_instructors || "50"}+</h3>
              <p className="text-muted-foreground font-medium">Instructeurs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Pourquoi choisir Groupe Victoire ?</h2>
            <p className="text-muted-foreground">Une méthodologie éprouvée et des ressources de qualité pour maximiser vos chances de réussite.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle>Cours structurés</CardTitle>
                <CardDescription>Des programmes complets couvrant l'ensemble du syllabus de l'ENA.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4 text-[#D4AF37]">
                  <Award className="h-6 w-6" />
                </div>
                <CardTitle>Annales corrigées</CardTitle>
                <CardDescription>Accès aux sujets des années précédentes avec des corrigés détaillés.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <CardTitle>Conseils d'experts</CardTitle>
                <CardDescription>Bénéficiez de l'expérience d'anciens lauréats et d'instructeurs qualifiés.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Communauté active</CardTitle>
                <CardDescription>Échangez avec d'autres candidats et créez des groupes de travail.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Rejoignez Groupe Victoire aujourd'hui</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Ne laissez pas votre préparation au hasard. Mettez toutes les chances de votre côté avec la meilleure plateforme.</p>
          <Button asChild size="lg" className="bg-[#D4AF37] text-primary hover:bg-[#D4AF37]/90 h-14 px-10 text-lg font-medium">
            <Link href="/auth/signup/candidate">Créer mon compte <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
