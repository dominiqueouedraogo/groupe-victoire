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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronRight, CheckCircle } from "lucide-react";

const OTHER_CONCOURS = [
  { id: "ENS", name: "ENS — École Normale Supérieure" },
  { id: "INFAS", name: "INFAS — Institut de Formation des Agents de Santé" },
  { id: "INFS", name: "INFS — Institut de Formation Sociale" },
  { id: "EAUX_FORETS", name: "Eaux et Forêts" },
  { id: "POLICE", name: "Police Nationale" },
  { id: "GENDARMERIE", name: "Gendarmerie Nationale" },
  { id: "ARMEE", name: "Armée Ivoirienne" },
];

const ENA_CYCLES = [
  { id: "ENA_CS", name: "Cycle Supérieur" },
  { id: "ENA_CMS", name: "Cycle Moyen Supérieur" },
  { id: "ENA_CM", name: "Cycle Moyen" },
];

const LOCATIONS = [
  { id: "abidjan", name: "Abidjan — Lycée Moderne de Cocody" },
  { id: "bouake", name: "Bouaké — Lycée Moderne de Nimbo" },
  { id: "korhogo", name: "Korhogo — Collège Moderne de Korhogo" },
  { id: "enligne", name: "En ligne — Lun-Jeu 20h–22h" },
];

const signupSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirm_password: z.string(),
  ena_selected: z.boolean().default(false),
  ena_cycles: z.array(z.string()),
  other_concours: z.array(z.string()),
  location: z.string().min(1, "Veuillez choisir votre lieu de formation"),
  payment_type: z.enum(["forfait", "mensualites"], { required_error: "Veuillez choisir votre mode de paiement" }),
}).refine((d) => d.password === d.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
}).refine((d) => d.ena_selected || d.other_concours.length > 0, {
  message: "Veuillez sélectionner au moins un concours",
  path: ["other_concours"],
}).refine((d) => !d.ena_selected || d.ena_cycles.length > 0, {
  message: "Veuillez sélectionner au moins un cycle ENA",
  path: ["ena_cycles"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function CandidateSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "", email: "", phone: "", password: "", confirm_password: "",
      ena_selected: false, ena_cycles: [], other_concours: [],
      location: "", payment_type: "forfait",
    },
  });

  const enaSelected = form.watch("ena_selected");

  async function onSubmit(values: SignupForm) {
    setIsLoading(true);
    try {
      const enrolledConcours = [
        ...(values.ena_selected ? values.ena_cycles.map((c) => ({ type: "ENA", cycle: c })) : []),
        ...values.other_concours.map((c) => ({ type: c, cycle: null })),
      ];

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            phone: values.phone,
            role: "candidate",
            enrolled_concours: enrolledConcours,
            location: values.location,
            payment_type: values.payment_type,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        await supabase.from("profiles").upsert({
          id: authData.user.id,
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          city: values.location,
          role: "candidate",
          is_premium: false,
          trial_access: true,
        }, { onConflict: "id" });

        toast({ title: "Inscription réussie !", description: "Bienvenue dans Groupe Victoire !" });
        setLocation("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">{children}</p>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 text-center shadow-sm">
        <Link href="/">
          <span className="font-serif text-2xl font-bold text-gray-900">
            Groupe Victoire<span className="text-primary">.</span>
          </span>
        </Link>
        <p className="text-gray-400 text-xs mt-0.5 tracking-widest uppercase">Travail – Rigueur – Compétence</p>
      </div>

      <div className="flex-1 flex items-start justify-center p-4 py-10">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-serif text-gray-900">Inscription Candidat</h2>
            <p className="text-sm text-gray-500 mt-1">Créez votre compte pour commencer votre préparation</p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Personal info */}
                <div>
                  <SectionTitle>Informations personnelles</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="full_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Konan Aya" className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Adresse email</FormLabel>
                        <FormControl>
                          <Input placeholder="votre@email.com" className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="0504763249" className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="confirm_password" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-700">Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" className="h-11 rounded-xl border-gray-200 bg-gray-50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Concours */}
                <div>
                  <SectionTitle>Concours préparés</SectionTitle>
                  <p className="text-xs text-gray-500 mb-4">Sélectionnez un ou plusieurs concours</p>

                  {/* ENA block */}
                  <FormField control={form.control} name="ena_selected" render={({ field }) => (
                    <FormItem className={`rounded-xl border-2 p-4 mb-3 transition-colors ${enaSelected ? "border-primary bg-orange-50" : "border-gray-200 bg-white"}`}>
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-bold text-gray-900">ENA — École Nationale d'Administration</FormLabel>
                      </div>
                      {enaSelected && (
                        <div className="mt-4 pl-7">
                          <p className="text-xs text-gray-500 mb-3 font-medium">Sélectionnez votre cycle :</p>
                          <FormField control={form.control} name="ena_cycles" render={() => (
                            <FormItem>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {ENA_CYCLES.map((cycle) => (
                                  <FormField key={cycle.id} control={form.control} name="ena_cycles" render={({ field }) => (
                                    <FormItem className={`flex items-center gap-2 rounded-xl border p-3 cursor-pointer transition-colors ${field.value?.includes(cycle.id) ? "bg-white border-primary" : "bg-white border-gray-200"}`}>
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(cycle.id)}
                                          onCheckedChange={(c) => c
                                            ? field.onChange([...field.value, cycle.id])
                                            : field.onChange(field.value?.filter((v) => v !== cycle.id))
                                          }
                                          className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                      </FormControl>
                                      <FormLabel className="cursor-pointer font-normal text-sm text-gray-700">{cycle.name}</FormLabel>
                                    </FormItem>
                                  )} />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      )}
                    </FormItem>
                  )} />

                  {/* Other concours */}
                  <FormField control={form.control} name="other_concours" render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {OTHER_CONCOURS.map((concours) => (
                          <FormField key={concours.id} control={form.control} name="other_concours" render={({ field }) => {
                            const checked = field.value?.includes(concours.id);
                            return (
                              <FormItem className={`flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-all ${checked ? "border-primary bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                                <FormControl>
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(c) => c
                                      ? field.onChange([...field.value, concours.id])
                                      : field.onChange(field.value?.filter((v) => v !== concours.id))
                                    }
                                    className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-medium text-sm text-gray-700 leading-snug">{concours.name}</FormLabel>
                              </FormItem>
                            );
                          }} />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Location */}
                <div>
                  <SectionTitle>Lieu de formation</SectionTitle>
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50">
                            <SelectValue placeholder="Choisissez votre ville / modalité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {LOCATIONS.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id} className="rounded-lg">{loc.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Payment */}
                <div>
                  <SectionTitle>Mode de paiement</SectionTitle>
                  <FormField control={form.control} name="payment_type" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${field.value === "forfait" ? "border-primary bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                            <RadioGroupItem value="forfait" className="mt-0.5 border-gray-300 text-primary" />
                            <div>
                              <p className="font-bold text-gray-900">Forfait complet</p>
                              <p className="text-xs text-gray-500 mt-0.5">Paiement unique — à partir de 150 000 FCFA</p>
                            </div>
                          </label>
                          <label className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${field.value === "mensualites" ? "border-primary bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                            <RadioGroupItem value="mensualites" className="mt-0.5 border-gray-300 text-primary" />
                            <div>
                              <p className="font-bold text-gray-900">Mensualités</p>
                              <p className="text-xs text-gray-500 mt-0.5">À partir de 20 000 FCFA / mois</p>
                            </div>
                          </label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Reminder */}
                <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm text-gray-700">
                    Des frais d'inscription de <strong>10 000 FCFA</strong> seront à régler lors de votre première séance.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-orange-600 text-white font-bold h-12 text-base rounded-xl shadow-sm shadow-orange-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>Créer mon compte <ChevronRight className="ml-1 h-4 w-4" /></>
                  )}
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
