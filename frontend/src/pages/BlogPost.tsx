import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import type { BlogPostItem } from "@/lib/types";
import { useSeo } from "@/lib/seo";

export default function BlogPost() {
  const { slug } = useParams();
  const postsQ = useQuery({ queryKey: ["blog"], queryFn: () => apiGet<BlogPostItem[]>("/blog") });
  const post = (postsQ.data ?? []).find((p) => p.slug === slug);
  useSeo(
    post ? `${post.title} — Poonji Finance Blog` : "Blog — Poonji Finance",
    post?.excerpt ?? "Plain-language financial insights from Poonji Finance."
  );

  if (postsQ.isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-32 text-center text-muted-foreground">Loading article…</div>;
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-heading text-3xl font-bold">Article not found</h1>
        <Link to="/blog" data-testid="post-back-missing" className="mt-6 inline-flex items-center gap-2 text-gold hover:text-gold-light">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const related = (postsQ.data ?? []).filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);
  const fallback = (postsQ.data ?? []).filter((p) => p.slug !== slug).slice(0, 2 - related.length);
  const relatedAll = [...related, ...fallback];

  return (
    <div>
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <Link to="/blog" data-testid="post-back" className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
          <p className="overline-tag mt-8">{post.category}</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl" data-testid="post-title">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{post.author} · {new Date(post.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} · {post.read_time}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          {post.image && (
            <img src={post.image} alt={post.title} className="aspect-[16/8] w-full rounded-3xl border border-border object-cover" />
          )}
        </Reveal>
        <Reveal delay={0.15} className="mt-10">
          <div className="grid gap-6 text-base leading-relaxed text-muted-foreground" data-testid="post-body">
            {post.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Reveal>
        <p className="mt-12 rounded-2xl border border-border bg-card p-5 text-xs leading-relaxed text-muted-foreground">
          This article is for general education only and is not investment, insurance or tax advice. Product decisions should be made after reviewing official documents and, where needed, consulting a registered advisor.
        </p>
      </article>

      {relatedAll.length > 0 && (
        <section className="border-t border-border bg-card/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-bold">Related articles</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2" data-testid="related-articles">
              {relatedAll.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} data-testid={`related-${p.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-blue-600/60">
                  <div>
                    <p className="overline-tag">{p.category}</p>
                    <h3 className="mt-2 font-heading text-base font-bold leading-snug">{p.title}</h3>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
