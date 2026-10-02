import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { BlogPostItem } from "@/lib/types";

const BLOG_CATEGORIES = ["Loans", "Insurance", "Investments", "Mutual Funds", "Personal Finance", "Business Finance", "Tax-saving", "Financial Awareness", "Market Education", "Company Updates"];

const EMPTY = {
  title: "", slug: "", category: BLOG_CATEGORIES[0], excerpt: "",
  body: "", author: "Team Poonji", read_time: "5 min read", image: "", published: true,
};
type BlogForm = typeof EMPTY;

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function BlogDialog({ post, onClose }: { post: BlogPostItem | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<BlogForm>(
    post
      ? { title: post.title, slug: post.slug, category: post.category, excerpt: post.excerpt, body: post.body, author: post.author, read_time: post.read_time, image: post.image ?? "", published: post.published }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, image: form.image || undefined };
      if (post) {
        await apiPatch(`/admin/blog/${post.id}`, body);
      } else {
        await apiPost("/admin/blog", body);
      }
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success(post ? "Post updated" : "Post published");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error && "status" in err && (err as { status: number }).status === 409
        ? "That slug is already taken — change it slightly"
        : "Could not save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto" data-testid="blog-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{post ? "Edit Post" : "New Blog Post"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4" data-testid="blog-form">
          <Input
            data-testid="blog-title" required placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value, slug: post ? form.slug : slugify(e.target.value) })}
            className="bg-secondary/60"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input data-testid="blog-slug" required placeholder="url-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} className="bg-secondary/60 font-mono text-xs" />
            <select data-testid="blog-category" className="pf-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {BLOG_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <Input data-testid="blog-readtime" placeholder="Read time" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} className="bg-secondary/60" />
          </div>
          <Input data-testid="blog-excerpt" required placeholder="Excerpt (shown in cards)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="bg-secondary/60" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input data-testid="blog-author" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="bg-secondary/60" />
            <Input data-testid="blog-image" placeholder="Featured image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="bg-secondary/60" />
          </div>
          <Textarea data-testid="blog-body" required rows={10} placeholder="Article body — blank line between paragraphs" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="bg-secondary/60" />
          <label className="flex items-center gap-2 text-sm">
            <Checkbox data-testid="blog-published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v === true })} />
            Published (visible on website)
          </label>
          <Button data-testid="blog-save" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Post"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BlogTab() {
  const qc = useQueryClient();
  const posts = useQuery({ queryKey: ["admin-blog"], queryFn: () => apiGet<BlogPostItem[]>("/admin/blog") });
  const [editing, setEditing] = useState<BlogPostItem | null>(null);
  const [adding, setAdding] = useState(false);

  const remove = async (id: string) => {
    await apiDelete(`/admin/blog/${id}`);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
    toast.success("Post deleted");
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button data-testid="blog-add" size="sm" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>
      <div className="grid gap-3" data-testid="admin-blog-list">
        {(posts.data ?? []).map((p) => (
          <div key={p.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5" data-testid={`admin-blog-${p.id.slice(0, 8)}`}>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="overline-tag">{p.category}</span>
                {!p.published && <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-muted-foreground">Draft</span>}
                <span>{p.author} · {p.read_time}</span>
              </div>
              <p className="mt-2 font-heading text-base font-bold">{p.title}</p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">/blog/{p.slug}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button data-testid={`blog-edit-${p.id.slice(0, 8)}`} size="icon-sm" variant="ghost" onClick={() => setEditing(p)} aria-label="Edit post"><Pencil className="h-3.5 w-3.5" /></Button>
              <Button data-testid={`blog-delete-${p.id.slice(0, 8)}`} size="icon-sm" variant="ghost" onClick={() => remove(p.id)} aria-label="Delete post"><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button>
            </div>
          </div>
        ))}
        {posts.data?.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border py-10 text-center text-muted-foreground">No posts yet.</p>
        )}
      </div>
      {adding && <BlogDialog post={null} onClose={() => setAdding(false)} />}
      {editing && <BlogDialog post={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
