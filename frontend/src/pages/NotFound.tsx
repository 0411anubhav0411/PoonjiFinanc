import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

export default function NotFound() {
  useSeo("Page Not Found — Poonji Finance", "The page you are looking for does not exist.");
  return (
    <div className="mx-auto max-w-2xl px-4 py-40 text-center">
      <p className="font-mono text-sm text-gold">404</p>
      <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight">This page took a holiday</h1>
      <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist — but your financial goals still do.</p>
      <Link to="/" data-testid="notfound-home" className={`${buttonVariants({ size: "lg" })} mt-8`}>
        Back to Home
      </Link>
    </div>
  );
}
