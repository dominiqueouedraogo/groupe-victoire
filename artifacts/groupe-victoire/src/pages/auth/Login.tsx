import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;

      if (data.user) {
        let redirectRole = data.user.user_metadata?.role || "candidate";
        try {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();
          if (profileData?.role) redirectRole = profileData.role;
        } catch (_) {}

        toast({ title: "Connexion réussie", description: "Bienvenue sur Groupe Victoire !" });
        if (redirectRole === "admin") setLocation("/admin");
        else if (redirectRole === "instructor") setLocation("/instructor");
        else setLocation("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description:
          error.message === "Invalid login credentials"
            ? "Email ou mot de passe incorrect."
            : "Une erreur est survenue lors de la connexion.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
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

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-serif text-gray-900">Bon retour parmi nous</h2>
            <p className="text-sm text-gray-500 mt-1">
              Entrez vos identifiants pour accéder à votre compte
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Adresse email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="votre@email.com"
                          type="email"
                          autoComplete="email"
                          className="h-11 rounded-xl border-gray-200 focus:ring-primary bg-gray-50"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-gray-700 font-medium">Mot de passe</FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Mot de passe oublié ?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="h-11 rounded-xl border-gray-200 focus:ring-primary bg-gray-50 pr-11"
                            {...field}
                            data-testid="input-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg"
                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-orange-600 text-white font-bold h-12 rounded-xl shadow-sm shadow-orange-200"
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>Se connecter <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center space-y-2.5 text-sm">
              <p className="text-gray-500">
                Nouveau candidat ?{" "}
                <Link href="/auth/signup/candidate" className="text-primary font-semibold hover:underline">
                  Créer un compte
                </Link>
              </p>
              <p className="text-gray-500">
                Vous êtes enseignant ?{" "}
                <Link href="/auth/signup/instructor" className="text-primary font-semibold hover:underline">
                  Devenir instructeur
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
