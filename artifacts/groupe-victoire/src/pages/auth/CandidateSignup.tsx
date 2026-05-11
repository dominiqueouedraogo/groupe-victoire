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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronRight } from "lucide-react";

const OTHER_CONCOURS = [
  { id: "ENS", name: "ENS — École Normale Supérieure" },
  { id: "INFAS", name: "INFAS — Institut National de Formation des Agents de Santé" },
  { id: "INFS", name: "INFS — Institut National de Formation Sociale" },
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
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      ena_selected: false,
      ena_cycles: [],
      other_concours: [],
      location: "",
      payment_type: "forfait",
    },
  });

  const enaSelected = form.watch("ena_selected");

  async function onSubmit(values: SignupForm) {
    setIsLoading(true);
    try {
      // Build enrolled concours list
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
        // Insert profile — use upsert to avoid duplicate key issues
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          city: values.location,
          role: "candidate",
          is_premium: false,
          trial_access: true,
        }, { onConflict: "id" });

        // Log profile error but don't block the signup
        if (profileError) {
          console.warn("Profile upsert:", profileError.message);
        }

        toast({
          title: "Inscription réussie",
          description: "Bienvenue dans Groupe Victoire ! Votre compte est en cours d'activation.",
        });

        setLocation("/dashboard");
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="bg-[#0D0D0D] text-white py-4 px-4 text-center">
        <Link href="/" className="font-serif text-2xl font-bold">
          Groupe Victoire<span className="text-[#C9A227]">.</span>
        </Link>
        <p className="text-white/50 text-xs mt-1 tracking-widest uppercase">Travail – Rigueur – Compétence</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 py-10">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-serif">Inscription Candidat</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Créez votre compte pour commencer votre préparation
            </p>
          </div>

          <div className="bg-card border shadow-sm rounded-2xl p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Personal info */}
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-[#C9A227] mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="full_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl><Input placeholder="Ex: Konan Aya" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse email</FormLabel>
                        <FormControl><Input placeholder="votre@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl><Input placeholder="0504763249" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="confirm_password" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Concours selection */}
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-[#C9A227] mb-4">Concours préparés</h3>
                  <p className="text-xs text-muted-foreground mb-4">Sélectionnez un ou plusieurs concours</p>

                  {/* ENA */}
                  <div className={`rounded-xl border-2 p-4 mb-3 transition-colors ${enaSelected ? "border-[#C9A227] bg-[#C9A227]/5" : "border-border"}`}>
                    <FormField control={form.control} name="ena_selected" render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0 mb-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="cursor-pointer font-bold text-base">ENA — École Nationale d'Administration</FormLabel>
                        </div>
                      </FormItem>
                    )} />

                    {enaSelected && (
                      <div className="mt-4 pl-6 space-y-2">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">Sélectionnez votre cycle :</p>
                        <FormField control={form.control} name="ena_cycles" render={() => (
                          <FormItem>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {ENA_CYCLES.map((cycle) => (
                                <FormField key={cycle.id} control={form.control} name="ena_cycles" render={({ field }) => (
                                  <FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-3 bg-background">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(cycle.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, cycle.id])
                                            : field.onChange(field.value?.filter((v) => v !== cycle.id));
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal text-sm">{cycle.name}</FormLabel>
                                  </FormItem>
                                )} />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    )}
                  </div>

                  {/* Other concours */}
                  <FormField control={form.control} name="other_concours" render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {OTHER_CONCOURS.map((concours) => (
                          <FormField key={concours.id} control={form.control} name="other_concours" render={({ field }) => {
                            const checked = field.value?.includes(concours.id);
                            return (
                              <FormItem className={`flex items-center gap-3 space-y-0 rounded-xl border-2 p-3 transition-colors cursor-pointer ${checked ? "border-[#C9A227] bg-[#C9A227]/5" : "border-border"}`}>
                                <FormControl>
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(c) => {
                                      return c
                                        ? field.onChange([...field.value, concours.id])
                                        : field.onChange(field.value?.filter((v) => v !== concours.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-medium text-sm leading-snug">{concours.name}</FormLabel>
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
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-[#C9A227] mb-4">Lieu de formation</h3>
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Choisissez votre ville / modalité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LOCATIONS.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Payment option */}
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-[#C9A227] mb-4">Mode de paiement</h3>
                  <FormField control={form.control} name="payment_type" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors ${field.value === "forfait" ? "border-[#C9A227] bg-[#C9A227]/5" : "border-border"}`}>
                            <RadioGroupItem value="forfait" className="mt-0.5" />
                            <div>
                              <p className="font-bold">Forfait complet</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Paiement unique — à partir de 150 000 FCFA</p>
                            </div>
                          </label>
                          <label className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors ${field.value === "mensualites" ? "border-[#C9A227] bg-[#C9A227]/5" : "border-border"}`}>
                            <RadioGroupItem value="mensualites" className="mt-0.5" />
                            <div>
                              <p className="font-bold">Mensualités</p>
                              <p className="text-xs text-muted-foreground mt-0.5">À partir de 20 000 FCFA / mois</p>
                            </div>
                          </label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl p-4 text-sm text-center text-muted-foreground">
                  Des frais d'inscription de <strong className="text-foreground">10 000 FCFA</strong> seront à régler lors de votre première séance.
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#C9A227] hover:bg-[#b8911f] text-black font-bold h-12 text-base rounded-xl"
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

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="text-[#C9A227] font-semibold hover:underline">
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
