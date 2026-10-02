import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiGet } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSeo } from "@/lib/seo";
import type { PortalUser } from "@/lib/types";
import { ProfileTab } from "@/components/portal/ProfileTab";
import { DocumentsTab } from "@/components/portal/DocumentsTab";
import { ApplicationsTab } from "@/components/portal/ApplicationsTab";
import { NotificationsTab } from "@/components/portal/NotificationsTab";

export default function Portal() {
  useSeo("My Portal — Poonji Finance", "Your Poonji Finance customer portal — profile, document vault, applications and notifications.");

  const me = useQuery({ queryKey: ["auth-me"], queryFn: () => apiGet<PortalUser>("/auth/me"), retry: false });

  if (me.isLoading) {
    return <div className="py-40 text-center text-muted-foreground">Loading your portal…</div>;
  }

  if (!me.data) {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center" data-testid="portal-login-prompt">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Your portal awaits</h1>
        <p className="mt-3 text-sm text-muted-foreground">Sign in to manage your profile, documents and applications.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" data-testid="portal-goto-login" className={buttonVariants()}>Sign In</Link>
          <Link to="/signup" data-testid="portal-goto-signup" className={buttonVariants({ variant: "outline" })}>Create Account</Link>
        </div>
      </div>
    );
  }

  if (me.data.role !== "customer") {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <h1 className="font-heading text-2xl font-bold">This is the customer portal</h1>
        <p className="mt-3 text-sm text-muted-foreground">You're signed in as {me.data.role}.</p>
        <Link
          to={me.data.role === "admin" ? "/admin" : "/partner-portal"}
          data-testid="portal-goto-own"
          className={`${buttonVariants()} mt-6 inline-flex`}
        >
          Go to your dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" data-testid="customer-portal">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="overline-tag">Customer Portal</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight">Namaste, {me.data.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your profile, documents, applications and updates — all in one place.</p>
        </div>
      </div>

      {me.data.email_verified === false && (
        <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-800" data-testid="portal-verify-banner">
          Please verify your email to secure your account — check your inbox for the 6-digit code.{" "}
          <Link to={`/verify-email?email=${encodeURIComponent(me.data.email)}`} className="font-semibold underline">Verify now</Link>
        </div>
      )}

      <Tabs defaultValue="profile" className="mt-8">
        <TabsList variant="line" className="flex h-auto w-full flex-wrap justify-start gap-x-6">
          <TabsTrigger value="profile" data-testid="portal-tab-profile">Profile</TabsTrigger>
          <TabsTrigger value="documents" data-testid="portal-tab-documents">Document Vault</TabsTrigger>
          <TabsTrigger value="applications" data-testid="portal-tab-applications">Applications</TabsTrigger>
          <TabsTrigger value="notifications" data-testid="portal-tab-notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-8"><ProfileTab user={me.data} /></TabsContent>
        <TabsContent value="documents" className="mt-8"><DocumentsTab /></TabsContent>
        <TabsContent value="applications" className="mt-8"><ApplicationsTab /></TabsContent>
        <TabsContent value="notifications" className="mt-8"><NotificationsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
