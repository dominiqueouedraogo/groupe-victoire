import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun, Menu, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center shrink-0">
            <span className="font-serif text-xl font-bold text-gray-900">
              Groupe Victoire<span className="text-primary">.</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/#formations" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Formations
            </a>
            <a href="/#tarifs" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Tarifs
            </a>
            <Link href="/premium" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Nos offres
            </Link>
            {!user && (
              <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                Connexion
              </Link>
            )}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-xl hover:bg-gray-100"
            aria-label="Changer le thème"
          >
            <Sun className="h-4 w-4 dark:hidden text-gray-500" />
            <Moon className="hidden h-4 w-4 dark:block text-gray-400" />
          </Button>

          {user && (profile || user.user_metadata) ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9 border-2 border-orange-100">
                    <AvatarFallback className="bg-primary text-white font-bold text-sm">
                      {fullName?.charAt(0)?.toUpperCase() || <UserIcon className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl shadow-lg border-gray-100" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-gray-900">{fullName || "Candidat"}</p>
                    <p className="text-xs leading-none text-gray-500">{profile?.email || user.email}</p>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="capitalize text-xs bg-gray-100">{role}</Badge>
                    {profile?.is_premium && (
                      <Badge className="bg-primary text-white text-xs">Premium</Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem asChild className="rounded-lg mx-1 cursor-pointer">
                  <Link href={getDashboardLink()} className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                    <span>Tableau de bord</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  onClick={signOut}
                  className="rounded-lg mx-1 mb-1 text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-sm text-gray-600 hover:text-gray-900 rounded-xl">
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-orange-600 text-white font-semibold rounded-xl shadow-sm shadow-orange-200 px-5">
                <Link href="/auth/signup/candidate">S'inscrire</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl hover:bg-gray-100">
                <Menu className="h-5 w-5 text-gray-600" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white border-l border-gray-100">
              <div className="flex flex-col gap-2 mt-8">
                <Link href="/" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  Accueil
                </Link>
                <a href="/#formations" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  Formations
                </a>
                <a href="/#tarifs" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  Tarifs
                </a>
                <Link href="/premium" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  Nos offres
                </Link>
                {user ? (
                  <>
                    <div className="border-t border-gray-100 pt-2 mt-2" />
                    <Link href={getDashboardLink()} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                      Tableau de bord
                    </Link>
                    <button onClick={signOut} className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-100 pt-2 mt-2" />
                    <Link href="/auth/login" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Connexion
                    </Link>
                    <Button asChild className="bg-primary hover:bg-orange-600 text-white font-semibold rounded-xl mt-2">
                      <Link href="/auth/signup/candidate">S'inscrire maintenant</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
