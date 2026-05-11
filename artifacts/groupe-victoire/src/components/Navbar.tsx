import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun, Menu, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, profile, role, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const getDashboardLink = () => {
    if (role === "admin") return "/admin";
    if (role === "instructor") return "/instructor";
    return "/dashboard";
  };

  const fullName = profile?.full_name || user?.user_metadata?.full_name || "";

  const NavLinks = () => (
    <>
      <Link href="/" className="text-sm font-medium hover:text-[#C9A227] transition-colors">
        Accueil
      </Link>
      <a href="/#formations" className="text-sm font-medium hover:text-[#C9A227] transition-colors">
        Formations
      </a>
      <a href="/#tarifs" className="text-sm font-medium hover:text-[#C9A227] transition-colors">
        Tarifs
      </a>
      {!user && (
        <Link href="/auth/login" className="text-sm font-medium hover:text-[#C9A227] transition-colors">
          Connexion
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className="font-serif text-xl font-bold text-foreground">
              Groupe Victoire<span className="text-[#C9A227]">.</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Changer le thème"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </Button>

          {user && (profile || user.user_metadata) ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-[#C9A227]/10 text-[#C9A227] font-bold text-sm">
                      {fullName?.charAt(0)?.toUpperCase() || <UserIcon className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{fullName || "Candidat"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{profile?.email || user.email}</p>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="capitalize text-xs">{role}</Badge>
                    {(profile?.is_premium) && (
                      <Badge className="bg-[#C9A227] text-black text-xs">Premium</Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="w-full flex items-center cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Tableau de bord</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#C9A227] hover:bg-[#b8911f] text-black font-semibold rounded-lg">
                <Link href="/auth/signup/candidate">S'inscrire</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-4">
              <div className="flex flex-col space-y-4 mt-8">
                <NavLinks />
                {!user && (
                  <Button asChild className="w-full bg-[#C9A227] hover:bg-[#b8911f] text-black font-semibold mt-4 rounded-xl">
                    <Link href="/auth/signup/candidate">S'inscrire maintenant</Link>
                  </Button>
                )}
                {user && (
                  <Button asChild className="w-full" variant="outline">
                    <Link href={getDashboardLink()}>Tableau de bord</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
