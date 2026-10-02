import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Outlet } from "react-router-dom";
import { Menu, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { CallbackDialog } from "@/components/CallbackDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { PortalUser } from "@/lib/types";
import { CONTACT } from "@/data/content";

const NAV = [
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/calculators", label: "Calculators" },
  { to: "/careers", label: "Careers" },
  { to: "/resources", label: "Resources" },
  { to: "/blog", label: "Blog" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const me = useQuery({ queryKey: ["auth-me"], queryFn: () => apiGet<PortalUser>("/auth/me"), retry: false });
  const dashboard = me.data
    ? me.data.role === "admin"
      ? "/admin"
      : me.data.role === "partner"
        ? "/partner-portal"
        : "/portal"
    : null;

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.11 });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollToTop />
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `rounded-md px-2 py-2 text-[13px] whitespace-nowrap transition-colors ${
                    isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={CONTACT.phoneHref}
              data-testid="nav-call"
              className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex"
            >
              <Phone className="h-4 w-4" /> {CONTACT.phone}
            </a>
            {me.data ? (
              <Link to={dashboard ?? "/portal"} data-testid="nav-dashboard" className={`${buttonVariants({ variant: "outline", size: "sm" })} hidden sm:inline-flex`}>
                My Portal
              </Link>
            ) : (
              <Link to="/login" data-testid="nav-login" className={`${buttonVariants({ variant: "outline", size: "sm" })} hidden sm:inline-flex`}>
                Login
              </Link>
            )}
            <Button data-testid="nav-callback" size="sm" onClick={() => setCallbackOpen(true)} className="hidden sm:inline-flex">
              Request Callback
            </Button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                data-testid="nav-mobile-menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="mt-8 grid gap-1">
                  <Link to="/" onClick={() => setMobileOpen(false)} data-testid="mobile-nav-home" className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">Home</Link>
                  {NAV.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link to="/founders" onClick={() => setMobileOpen(false)} data-testid="mobile-nav-founders" className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">Our Founders</Link>
                  <Link to={dashboard ?? "/login"} onClick={() => setMobileOpen(false)} data-testid="mobile-nav-login" className="rounded-md px-3 py-2.5 text-sm font-semibold text-blue-800">
                    {me.data ? "My Portal" : "Login / Sign Up"}
                  </Link>
                  <Button data-testid="mobile-nav-callback" className="mt-4" onClick={() => { setMobileOpen(false); setCallbackOpen(true); }}>
                    Request Callback
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer onCallback={() => setCallbackOpen(true)} />
      <CallbackDialog open={callbackOpen} onOpenChange={setCallbackOpen} />
      <Toaster />
    </div>
  );
}
