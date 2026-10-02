import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BLOG_POSTS } from "@/data/content";

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-heading text-3xl font-bold">Article not found</h1>
        <Link to="/blog" data-testid="post-back-missing" className="mt-6 inline-flex items-center gap-2 text-sky-400 hover:text-sky-300">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const related = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);
  const fallback = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2 - related.length);
  const relatedAll = [...related, ...fallback];

  return (
    <div>
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <Link to="/blog" data-testid="post-back" className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
          <p className="overline-tag mt-8">{post.category}</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl" data-testid="post-title">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{post.author} · {post.date} · {post.readTime}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <img src={post.image} alt={post.title} className="aspect-[16/8] w-full rounded-3xl border border-border object-cover" />
        </Reveal>
        <Reveal delay={0.15} className="mt-10">
          <div className="grid gap-6 text-base leading-relaxed text-muted-foreground" data-testid="post-body">
            {post.body.map((para, i) => (
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
                  <ArrowRight className="h-5 w-5 shrink-0 text-sky-400 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
