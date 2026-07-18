import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Sparkles, User as UserIcon, Heart, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "Pricing", to: "/pricing" },
];

export function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/marketplace${search ? `?q=${encodeURIComponent(search)}` : ""}`);
  };

  const initials = (profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">DigiCools</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button key={link.to} variant="ghost" size="sm" asChild>
              <Link to={link.to}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="relative hidden flex-1 max-w-md md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts, templates, kits..."
            className="rounded-full bg-muted/50 pl-9"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" className="bg-gradient-primary shadow-glow hover:opacity-90" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-3">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="pl-9"
                  />
                </form>
                {navLinks.map((link) => (
                  <Button key={link.to} variant="ghost" className="justify-start" asChild onClick={() => setMobileOpen(false)}>
                    <Link to={link.to}>{link.label}</Link>
                  </Button>
                ))}
                {!user && (
                  <>
                    <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button className="bg-gradient-primary" asChild onClick={() => setMobileOpen(false)}>
                      <Link to="/signup">Get Started</Link>
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
