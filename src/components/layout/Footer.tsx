import { Link } from "react-router-dom";
import { Sparkles, Twitter, Instagram, Youtube, Github } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Marketplace", to: "/marketplace" },
      { label: "Pricing", to: "/pricing" },
      { label: "Wishlist", to: "/wishlist" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Log in", to: "/login" },
      { label: "Sign up", to: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/" },
      { label: "Contact", to: "/" },
      { label: "Support", to: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="container py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">DigiCools</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              One subscription. Unlimited creativity. Thousands of premium digital products for creators, freelancers and teams.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} DigiCools. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-foreground">Terms</Link>
            <Link to="/" className="hover:text-foreground">Privacy</Link>
            <Link to="/" className="hover:text-foreground">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
