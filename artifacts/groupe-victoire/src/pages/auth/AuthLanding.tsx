import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, LogIn, GraduationCap, BookOpen, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 text-center shadow-sm">
        <Link href="/">
          <span className="font-serif text-2xl font-bold text-gray-900">
            Groupe Victoire<span className="text-primary">.</span>
          </span>
        </Link>
        <p className="text-gray-400 text-xs mt-0.5 tracking-widest uppercase">
          Travail – Rigueur – Compétence
        </p>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-white mb-5 shadow-lg shadow-orange-200">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              Bienvenue sur Groupe Victoire
            </h1>
            <p className="text-gray-500 text-base">
              Connectez-vous ou créez votre compte pour accéder à votre espace de préparation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          >
            {/* Login card */}
            <Link href="/auth/login">
              <div className="group bg-white border-2 border-gray-200 hover:border-primary rounded-2xl p-7 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 text-center h-full flex flex-col items-center justify-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-all">
                  <LogIn className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                    Se connecter
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    J'ai déjà un compte
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Signup card */}
            <Link href="/auth/signup/candidate">
              <div className="group bg-primary border-2 border-primary rounded-2xl p-7 cursor-pointer transition-all hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1 text-center h-full flex flex-col items-center justify-center gap-4 shadow-md shadow-orange-200">
                <div className="h-14 w-14 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                  <UserPlus className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Créer un compte
                  </h2>
                  <p className="text-sm text-white/80 mt-1">
                    Je m'inscris pour la première fois
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-white/60 transition-all group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>

          {/* Features reminder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
          >
            <p className="text-xs text-gray-400 text-center font-semibold uppercase tracking-wider mb-4">
              Ce que vous obtenez
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: BookOpen, label: "Cours structurés", color: "text-primary bg-orange-50" },
                { icon: Award, label: "Annales corrigées", color: "text-green-600 bg-green-50" },
                { icon: GraduationCap, label: "8 concours", color: "text-blue-600 bg-blue-50" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Vous êtes enseignant ?{" "}
            <Link href="/auth/signup/instructor" className="text-primary font-semibold hover:underline">
              Inscription instructeur
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
