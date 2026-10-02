import { ArrowRight, FileText, GraduationCap, HeartHandshake, MapPin, TrendingUp, UploadCloud, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { CONTACT } from "@/data/content";
import { ApplicationDialog } from "@/components/ApplicationDialog";
import { apiUpload, ApiError } from "@/lib/api";
import { toast } from "sonner";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function CareersApplicationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [applicationType, setApplicationType] = useState("internship");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateResume = (file: File) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return "Resume must be a PDF file.";
    }
    if (file.size > MAX_RESUME_SIZE) {
      return "Resume must be 5 MB or smaller.";
    }
    return "";
  };

  const handleSelectedFile = (file: File | null) => {
    if (!file) return;
    const fileError = validateResume(file);
    if (fileError) {
      setError(fileError);
      return;
    }
    setResumeFile(file);
    setError("");
  };

  const onFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    handleSelectedFile(event.target.files?.[0] ?? null);
    if (event.target) event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleSelectedFile(event.dataTransfer.files?.[0] ?? null);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !resumeFile) {
      setError("Please complete all required fields and upload your resume.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("email", trimmedEmail);
      formData.append("application_type", applicationType);
      formData.append("message", trimmedMessage);
      formData.append("resume", resumeFile, resumeFile.name);

      await apiUpload<{ id: string }>("/career/applications", formData);
      toast.success("Application submitted successfully. Our team will review your profile and contact you if there is a suitable opportunity.");
      setName("");
      setEmail("");
      setApplicationType("internship");
      setMessage("");
      setResumeFile(null);
    } catch (err) {
      const apiError = err as ApiError;
      const detail = apiError?.body && typeof apiError.body === "object" && "detail" in apiError.body
        ? String((apiError.body as { detail?: string }).detail)
        : "Upload or submission failed. Please try again.";
      setError(detail);
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8" data-testid="career-application-form">
      <div>
        <h3 className="font-heading text-2xl font-bold text-foreground">Apply for Opportunities</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Upload your resume/CV to be considered for internship and full-time opportunities at Poonji Finance.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-foreground">
          <span>Full Name <span className="text-destructive">*</span></span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-foreground">
          <span>Email Address <span className="text-destructive">*</span></span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>Application Type</span>
        <select
          value={applicationType}
          onChange={(e) => setApplicationType(e.target.value)}
          className="pf-select h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
          data-testid="career-application-type"
        >
          <option value="internship">Internship</option>
          <option value="full_time">Full-Time</option>
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>Message (Optional)</span>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us briefly about yourself, your experience, or the role you're interested in."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>

      <div className="space-y-2 text-sm font-medium text-foreground">
        <span>Upload Resume / CV <span className="text-destructive">*</span></span>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`rounded-2xl border border-dashed p-4 transition ${dragActive ? "border-gold bg-gold/5" : "border-border bg-secondary/20"}`}
        >
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Drag and drop your PDF here</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF only • Max size 5 MB</p>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-blue-600 hover:text-blue-700"
            >
              Browse Files
            </button>
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={onFileInput} />
          </div>
        </div>

        {resumeFile ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{resumeFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(resumeFile.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="text-xs font-medium text-gold" onClick={() => inputRef.current?.click()}>
                Re-upload
              </button>
              <button type="button" className="rounded-md border border-border p-1 text-muted-foreground hover:text-destructive" onClick={() => setResumeFile(null)} aria-label="Remove resume file">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}

const ROLES = [
  {
    title: "Relationship Manager — Loan Facilitation",
    location: "Ghaziabad, UP",
    type: "Full-time",
    desc: "Own customer relationships end-to-end: understand requirements, coordinate with partner banks and NBFCs, and shepherd applications from enquiry to disbursal.",
  },
  {
    title: "Insurance & Investment Advisor",
    location: "Ghaziabad, UP",
    type: "Full-time",
    desc: "Guide families on term, health and general insurance plus mutual fund investments — plain language, suitability first, no mis-selling. Ever.",
  },
  {
    title: "Customer Success Associate",
    location: "Ghaziabad, UP · Hybrid",
    type: "Full-time",
    desc: "Be the voice behind our 30-minute callback pledge — first response, documentation checklists, follow-ups, and turning anxious applicants into calm customers.",
  },
];

const PERKS = [
  { icon: HeartHandshake, title: "Ethics Before Targets", text: "We never push a product that doesn't fit. Your incentive is a happy customer, not a mis-sold policy." },
  { icon: GraduationCap, title: "Learn the Whole Market", text: "Loans, insurance, deposits, investments — you train across every vertical with real partner institutions." },
  { icon: TrendingUp, title: "Grow With a Young Firm", text: "Early team members shape processes, lead verticals, and grow into partnership tracks as we scale." },
];

export default function Careers() {
  useSeo("Careers — Poonji Finance", "Join Poonji Finance in Ghaziabad — roles across loan facilitation, insurance advisory and customer success. Ethics first, always.");

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <p className="overline-tag">Careers</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Build a career on <span className="bg-gradient-to-r from-blue-500 to-[#B08A1E] bg-clip-text text-transparent">honest finance</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Poonji Finance is a young, founder-led firm with one non-negotiable: the customer comes first. If that sounds like a place you'd do your best work, we should talk.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHead overline="Why Poonji" title="What working here feels like" />
        <div className="mt-14 grid gap-4 md:grid-cols-3" data-testid="careers-perks">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-border bg-card p-7">
                <p.icon className="h-7 w-7 text-gold" />
                <h3 className="mt-4 font-heading text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHead
            overline="Open Roles"
            title="Current openings"
            sub="Don't see your role but believe you'd fit? Write to us anyway — we read every application."
          />
          <div className="mt-14 grid gap-4" data-testid="careers-roles">
            {ROLES.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06}>
                <article className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-blue-600/60 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                  <div>
                    <h3 className="font-heading text-lg font-bold">{r.title}</h3>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold" />{r.location}</span>
                      <span>{r.type}</span>
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                  </div>
                  <ApplicationDialog role={r.title} index={i} />
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-14">
            <CareersApplicationForm />
          </div>

          <Reveal className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Send your CV to{" "}
              <a data-testid="careers-email" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Careers at Poonji Finance")}`} className="text-gold hover:text-gold-light">
                {CONTACT.email}
              </a>{" "}
              — tell us which role, and one financial product you'd explain to your grandmother.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
