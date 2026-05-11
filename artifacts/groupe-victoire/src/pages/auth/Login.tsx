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
import { Loader2 } from "lucide-react";
import { Profile } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
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
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) throw profileError;

        const profile = profileData as Profile;
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Groupe Victoire !",
        });

        if (profile.role === "admin") {
          setLocation("/admin");
        } else if (profile.role === "instructor") {
          setLocation("/instructor");
        } else {
          setLocation("/dashboard");
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message === "Invalid login credentials" 
          ? "Email ou mot de passe incorrect." 
          : "Une erreur est survenue lors de la connexion.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="font-serif text-3xl font-bold text-primary">
              Groupe Victoire<span className="text-[#D4AF37]">.</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Bon retour parmi nous</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>

        <div className="bg-card border shadow-sm rounded-xl p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <Input placeholder="nom@exemple.com" {...field} data-testid="input-email" />
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
                      <FormLabel>Mot de passe</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white" disabled={isLoading} data-testid="button-submit">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Se connecter"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-2 text-sm">
            <p className="text-muted-foreground">
              Nouveau candidat ?{" "}
              <Link href="/auth/signup/candidate" className="text-primary font-medium hover:underline">
                Créer un compte
              </Link>
            </p>
            <p className="text-muted-foreground">
              Vous êtes enseignant ?{" "}
              <Link href="/auth/signup/instructor" className="text-primary font-medium hover:underline">
                Devenir instructeur
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
