import { Link, Outlet } from "@tanstack/react-router";
import { Settings, ShoppingBag } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link
              to="/"
              data-ocid="nav.link"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <ShoppingBag
                  className="w-4.5 h-4.5 text-primary-foreground"
                  strokeWidth={2}
                />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                My Shop
              </span>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                data-ocid="nav.link"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                Products
              </Link>
              <Link
                to="/admin"
                data-ocid="nav.admin_link"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                <Settings className="w-3.5 h-3.5" />
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-secondary/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <ShoppingBag
                  className="w-3 h-3 text-primary-foreground"
                  strokeWidth={2}
                />
              </div>
              <span className="font-display font-semibold text-foreground text-sm">
                My Shop
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
