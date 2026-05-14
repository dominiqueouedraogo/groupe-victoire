import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

const signupSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(9, "Numéro de téléphone invalide"),
  city: z.string().min(2, "La ville est requise"),
  domain: z.string().min(2, "Le domaine est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
});

export default function InstructorSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      city: "",
      domain: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            phone: values.phone,
            city: values.city,
            role: "instructor",
            domain: values.domain,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          city: values.city,
          role: "instructor",
          domain: values.domain,
          is_premium: false,
          trial_access: false,
        });

        if (profileError) throw profileError;

        toast({
          title: "Inscription réussie",
          description: "Bienvenue sur Groupe Victoire en tant qu'instructeur !",
        });
        
        setLocation("/instructor");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-4 text-center shadow-sm">
        <Link href="/">
          <span className="font-serif text-2xl font-bold text-gray-900">
            Groupe Victoire<span className="text-primary">.</span>
          </span>
        </Link>
        <p className="text-gray-400 text-xs mt-0.5 tracking-widest uppercase">Travail – Rigueur – Compétence</p>
      </div>

      <div className="flex-1 flex items-start justify-center p-4 py-10">
        <div className="w-full max-w-xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-serif text-gray-900">Inscription Instructeur</h2>
            <p className="text-sm text-gray-500 mt-1">Rejoignez notre équipe d'experts formateurs</p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="full_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean Kouassi" className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} data-testid="input-fullname" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Adresse email</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" placeholder="votre@email.com" className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="0504763249" className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Abidjan, Bouaké..." className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} data-testid="input-city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="domain" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-gray-700">Domaine / Spécialisation</FormLabel>
                      <FormControl>
                        <Input placeholder="Droit Public, Économie, Culture Générale..." className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} data-testid="input-domain" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className="h-11 rounded-xl border-gray-200 bg-gray-50 pr-11"
                            {...field}
                            data-testid="input-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg"
                            aria-label={showPassword ? "Masquer" : "Afficher"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="confirm_password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className="h-11 rounded-xl border-gray-200 bg-gray-50 pr-11"
                            {...field}
                            data-testid="input-confirm-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg"
                            aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-orange-600 text-white font-bold h-12 rounded-xl shadow-sm shadow-orange-200 mt-2"
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Devenir instructeur"}
                </Button>
              </form>
            </Form>

            <div className="mt-5 pt-5 border-t border-gray-100 text-center text-sm">
              <p className="text-gray-500">
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}