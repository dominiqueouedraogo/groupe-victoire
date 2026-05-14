import { useState } from "react";
import { Link } from "wouter";
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
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export default function ForgotPassword() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setSentEmail(values.email);
      setSent(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>

          {!sent ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6"
            >
              {/* Icon + Title */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-orange-50 text-primary mb-4 shadow-sm">
                  <Mail className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-gray-900">
                  Mot de passe oublié
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold h-12 rounded-xl shadow-sm shadow-orange-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...</>
                    ) : (
                      <>Envoyer le lien de réinitialisation</>
                    )}
                  </Button>
                </form>
              </Form>

              <p className="text-center text-sm text-gray-500">
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                  Se connecter
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 text-center space-y-5"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-green-50 text-green-600 mb-2 shadow-sm">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">Email envoyé !</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Un lien de réinitialisation a été envoyé à{" "}
                  <strong className="text-gray-800">{sentEmail}</strong>.
                  <br />
                  Vérifiez votre boîte de réception et vos spams.
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-gray-600">
                Le lien expire dans <strong>1 heure</strong>. Si vous ne recevez pas l'email, vérifiez votre dossier spam.
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-11 border-gray-200"
                  onClick={() => { setSent(false); form.reset(); }}
                >
                  Renvoyer l'email
                </Button>
                <Button asChild className="w-full bg-primary hover:bg-orange-600 text-white rounded-xl h-11 shadow-sm">
                  <Link href="/auth/login">Retour à la connexion</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
