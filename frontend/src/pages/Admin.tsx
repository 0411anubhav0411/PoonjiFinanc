import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, RefreshCw } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Enquiry {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  service: string;
  requirement?: string | null;
  message?: string | null;
  created_at: string;
}

interface Callback {
  id: string;
  name: string;
  mobile: string;
  preferred_time?: string | null;
  created_at: string;
}

interface Leads {
  enquiries: Enquiry[];
  callbacks: Callback[];
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function Admin() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const me = useQuery({
    queryKey: ["admin-me"],
    queryFn: () => apiGet<AdminUser>("/auth/me"),
    retry: false,
  });

  const leads = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => apiGet<Leads>("/leads"),
    enabled: !!me.data,
    retry: false,
  });

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const user = await apiPost<AdminUser>("/auth/login", { email, password });
      queryClient.setQueryData(["admin-me"], user);
      toast.success(`Welcome, ${user.name}`);
    } catch {
      setLoginError("Invalid email or password");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    await apiPost("/auth/logout").catch(() => undefined);
    queryClient.setQueryData(["admin-me"], null);
    queryClient.removeQueries({ queryKey: ["admin-leads"] });
    queryClient.invalidateQueries({ queryKey: ["admin-me"] });
  };

  if (me.isLoading) {
    return <div className="mx-auto max-w-md px-4 py-32 text-center text-muted-foreground">Checking session…</div>;
  }

  if (!me.data) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 sm:py-32">
        <div className="glass-card rounded-3xl p-8">
          <p className="overline-tag">Admin</p>
          <h1 className="mt-3 font-heading text-2xl font-bold">Leads Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to view enquiries and callback requests.</p>
          <form onSubmit={login} className="mt-8 grid gap-4" data-testid="admin-login-form">
            <Input data-testid="admin-email" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/60" />
            <Input data-testid="admin-password" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary/60" />
            {loginError && <p data-testid="admin-login-error" className="text-sm text-red-400">{loginError}</p>}
            <Button data-testid="admin-login-submit" type="submit" disabled={loggingIn}>
              {loggingIn ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" data-testid="admin-dashboard">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="overline-tag">Admin</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">Leads Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {me.data.email}</p>
        </div>
        <div className="flex gap-2">
          <Button data-testid="admin-refresh" variant="outline" onClick={() => leads.refetch()}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button data-testid="admin-logout" variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="enquiries" className="mt-10">
        <TabsList variant="line">
          <TabsTrigger value="enquiries" data-testid="admin-tab-enquiries">
            Enquiries ({leads.data?.enquiries.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="callbacks" data-testid="admin-tab-callbacks">
            Callbacks ({leads.data?.callbacks.length ?? 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="enquiries" className="mt-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card" data-testid="admin-enquiries-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(leads.data?.enquiries ?? []).map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs text-sky-400">{e.id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="text-xs">{e.mobile}<br />{e.email}</TableCell>
                    <TableCell>{e.city}</TableCell>
                    <TableCell>{e.service}</TableCell>
                    <TableCell>{e.requirement ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fmtDate(e.created_at)}</TableCell>
                  </TableRow>
                ))}
                {leads.data && leads.data.enquiries.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No enquiries yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="callbacks" className="mt-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card" data-testid="admin-callbacks-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Preferred Time</TableHead>
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(leads.data?.callbacks ?? []).map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs text-sky-400">{c.id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.mobile}</TableCell>
                    <TableCell>{c.preferred_time ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fmtDate(c.created_at)}</TableCell>
                  </TableRow>
                ))}
                {leads.data && leads.data.callbacks.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No callback requests yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
