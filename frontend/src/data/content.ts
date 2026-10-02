import {
  Home,
  Wallet,
  Briefcase,
  Car,
  Building2,
  ShieldCheck,
  HeartPulse,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Landmark,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export const CONTACT = {
  phone: "+91 93118 28382",
  phone2: "+91 99107 97973",
  phoneHref: "tel:+919311828382",
  phone2Href: "tel:+919910799773",
  whatsapp: "https://wa.me/919311828382?text=Hi%20Poonji%20Finance%2C%20I%20have%20an%20enquiry",
  email: "info@poonjifinance.com",
  address: "703, 7th Floor, Golden Wood Tower, GH-4, Pocket-C, Madhuban Bapudham, Ghaziabad, Uttar Pradesh",
  hours: "Mon – Sat, 9:30 AM – 6:30 PM IST",
};

export const SERVICE_OPTIONS = [
  "Home Loan",
  "Personal Loan",
  "Business / MSME Loan",
  "Vehicle Loan",
  "Loan Against Property",
  "Life Insurance",
  "Health Insurance",
  "Motor / General Insurance",
  "Fixed Deposit",
  "Mutual Funds / SIP",
  "Credit Cards & Other",
  "Financial Planning",
];

export interface ServiceVertical {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  points: string[];
  span?: boolean;
}

export const SERVICE_VERTICALS: ServiceVertical[] = [
  {
    slug: "home-loans",
    title: "Home Loans",
    tagline: "New purchase, construction, improvement & balance transfer — matched across 45+ lenders.",
    icon: Home,
    points: ["New home purchase & resale", "Construction & extension", "Home improvement", "Balance transfer & top-up", "Loan against property"],
    span: true,
  },
  {
    slug: "business-msme",
    title: "Business & MSME Finance",
    tagline: "Working capital, term loans and equipment finance for growing enterprises.",
    icon: Briefcase,
    points: ["Working capital solutions", "Business term loans", "Machinery & equipment finance", "MSME & GST-based lending"],
    span: true,
  },
  {
    slug: "personal-loans",
    title: "Personal Loans",
    tagline: "Quick, documentation-light personal finance for life's planned and unplanned moments.",
    icon: Wallet,
    points: ["Salaried & self-employed", "Debt consolidation", "Medical & education needs", "Minimal documentation"],
  },
  {
    slug: "vehicle-loans",
    title: "Vehicle Finance",
    tagline: "Cars, two-wheelers and commercial fleets — new and pre-owned.",
    icon: Car,
    points: ["New & used car loans", "Two-wheeler finance", "Commercial vehicle loans", "Refinance options"],
  },
  {
    slug: "mutual-funds",
    title: "Mutual Funds & SIPs",
    tagline: "Goal-based investing across equity, debt, hybrid, index and ELSS funds.",
    icon: TrendingUp,
    points: ["SIP & lump-sum investing", "Goal-based portfolios", "ELSS tax-saving funds", "Portfolio review facilitation"],
    span: true,
  },
  {
    slug: "insurance",
    title: "Insurance Solutions",
    tagline: "Life, health, motor and general insurance from leading insurers.",
    icon: ShieldCheck,
    points: ["Term & life insurance", "Family & senior citizen health cover", "Motor insurance", "Travel & business insurance"],
  },
  {
    slug: "fixed-deposits",
    title: "Fixed Deposits & Savings",
    tagline: "Bank and corporate FDs, recurring deposits and tax-saving deposits.",
    icon: PiggyBank,
    points: ["Bank & corporate FDs", "Recurring deposits", "Tax-saving deposits", "Senior citizen rates"],
  },
  {
    slug: "credit-more",
    title: "Credit & More",
    tagline: "Credit cards, gold loans, loan against securities and emerging products.",
    icon: CreditCard,
    points: ["Credit cards", "Gold loans", "Loan against securities", "Education loans"],
  },
];

export const WHY_POINTS = [
  { title: "One Roof, Many Solutions", text: "Loans, insurance, deposits and investments — a single facilitation desk instead of ten different doors." },
  { title: "45+ Partner Institutions", text: "We compare suitable options across banks, NBFCs, insurers and fund houses before recommending." },
  { title: "Transparent Process", text: "Clear explanation of rates, fees, commissions and product terms — no fine-print surprises." },
  { title: "Simplified Documentation", text: "A guided checklist and hands-on assistance so paperwork never stalls your application." },
  { title: "End-to-End Facilitation", text: "From first conversation to disbursal or policy issuance, one team stays accountable to you." },
  { title: "Long-Term Relationships", text: "We review, rebalance and stay in touch — because financial goals are journeys, not transactions." },
];

export const STEPS = [
  { n: "01", title: "Tell Us Your Requirement", text: "Submit your requirement through a 60-second enquiry — loan, insurance, deposit or investment." },
  { n: "02", title: "We Understand Your Need", text: "Our team reviews your basic information, eligibility signals and preferences." },
  { n: "03", title: "Explore Suitable Options", text: "We shortlist relevant products and providers matched to your profile and applicable eligibility." },
  { n: "04", title: "Documentation & Processing", text: "You proceed with the chosen institution's application — we assist with the paperwork." },
  { n: "05", title: "Completion", text: "The institution processes and approves your application, subject to its own policies and criteria." },
];

export const PARTNERS = [
  "HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra",
  "Tata Capital", "Bajaj Finserv", "Aditya Birla Finance", "Punjab National Bank", "IDFC First Bank",
];

export const STATS = [
  { value: "₹500 Cr+", label: "Business Facilitated" },
  { value: "45+", label: "Banking & NBFC Partners" },
  { value: "12,000+", label: "Customers Guided" },
  { value: "4.9 / 5", label: "Customer Rating" },
];

export const FOUNDERS = [
  {
    name: "Balbir Singh Gogia",
    role: "Founder & Managing Partner",
    initials: "BG",
    image: "/founders/balbir.jpg",
    bio: "The vision behind Poonji Finance. Balbir founded the firm on a simple conviction: people who earn honestly deserve honest guidance. He leads the partner network across banks, NBFCs, insurers and investment platforms, and personally sets the transparency standard every Poonji advisor works by.",
    highlights: ["Founded Poonji Finance on a transparency-first doctrine", "Leads the banking, NBFC & insurance partner network", "Sets the firm's customer-first credit philosophy"],
  },
  {
    name: "Harshual Singh Gogia",
    role: "Partner & Chief Executive Officer",
    initials: "HG",
    bio: "Harshual drives Poonji Finance's strategy and growth — which products we facilitate, which institutions we partner with, and how the platform scales without losing its personal, accountable service. His focus is making 'One Platform. Multiple Financial Solutions.' a daily reality for customers.",
    highlights: ["Owns strategy, partnerships & platform growth", "Champions simplified, jargon-free customer journeys", "Driving Poonji's digital-first facilitation model"],
  },
  {
    name: "Harshita Singh Gogia",
    role: "Chief Operating Officer",
    initials: "HSG",
    image: "/founders/harshita.webp",
    bio: "Harshita runs the engine room: documentation checklists, application processing, follow-ups with institutions, and the service standards behind the 30-minute callback pledge. If your file moves smoothly from enquiry to approval, that's her team's design.",
    highlights: ["Architect of the 5-step facilitation pipeline", "Owns operations, documentation & service quality", "Leads customer education and plain-language communication"],
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  body: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "credit-score-explained",
    title: "What Is a Credit Score — and Why It Decides Your Loan",
    category: "Loans",
    excerpt: "Your CIBIL score quietly negotiates every loan before you do. Here's how it's built, and how to move it.",
    date: "2026-06-18",
    readTime: "6 min read",
    author: "Team Poonji",
    image: "https://images.unsplash.com/photo-1642345584279-9810f0b1359c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBmaW5hbmNpYWwlMjBhZHZpc29yJTIwdGVhbSUyMG9mZmljZXxlbnwwfHx8fDE3OTA5MTEwMjV8MA&ixlib=rb-4.1.0&q=85",
    body: [
      "Your credit score is a three-digit summary of your borrowing history, typically between 300 and 900. Lenders use it as a first filter: above roughly 750, doors open quickly and rates improve; below that, approvals get slower, smaller and more expensive.",
      "The score is built from five ingredients: repayment history (the heaviest), credit utilisation, length of credit history, credit mix, and recent enquiries. A single missed EMI can stay visible for years, while utilisation above 30–40% of your card limit drags the score even if you pay in full.",
      "Improving it is boring but reliable: pay every EMI and card bill on time, keep utilisation low, avoid applying to many lenders in a short window, and keep your oldest credit card active to lengthen your history.",
      "Before any major application, pull your own report and dispute errors — wrong loan tagging and stale 'settled' statuses are more common than you'd think. At Poonji Finance, a score review is the first thing we do in any loan consultation, because fixing the file is often worth more than negotiating the rate.",
    ],
  },
  {
    slug: "sip-vs-lumpsum",
    title: "SIP vs Lump-Sum: Which Way Should You Invest?",
    category: "Mutual Funds",
    excerpt: "The honest answer depends less on markets and more on where your money comes from.",
    date: "2026-06-02",
    readTime: "5 min read",
    author: "Team Poonji",
    image: "https://images.unsplash.com/photo-1770331373157-89d085ed7ea2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtdW1iYWklMjBza3lzY3JhcGVyJTIwZmluYW5jaWFsJTIwZGlzdHJpY3R8ZW58MHx8fHwxNzkwOTExMDI1fDA&ixlib=rb-4.1.0&q=85",
    body: [
      "A Systematic Investment Plan invests a fixed amount every month, buying more units when markets fall and fewer when they rise. A lump-sum invests everything at once. Mathematically, lump-sums win more often because markets rise more often than they fall — but that statistic ignores human behaviour.",
      "If your money arrives monthly (a salary), SIP is not a compromise; it's the natural structure. It also removes the hardest question in investing — 'is now a good time?' — by making the answer irrelevant.",
      "If you hold a large idle amount (a bonus, a property sale), investing it gradually through an STP from a liquid fund into equity over 6–12 months balances regret-risk on both sides: you're not fully exposed to a crash next week, nor fully out of a rally.",
      "What matters far more than the route is staying invested. A mediocre fund held for 15 years beats a perfect fund abandoned in year two. Use our SIP calculator to see what consistency alone builds over time.",
    ],
  },
  {
    slug: "term-insurance-explained",
    title: "Term Insurance, Explained in Plain Language",
    category: "Insurance",
    excerpt: "The cheapest, most honest insurance product — and the one agents talk about least.",
    date: "2026-05-21",
    readTime: "5 min read",
    author: "Team Poonji",
    image: "https://images.unsplash.com/photo-1780329946888-0db2441b249c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYW1pbHklMjBob21lJTIwa2V5JTIwYnV5aW5nJTIwaG91c2V8ZW58MHx8fDE3OTAwMTEwMjZ8MA&ixlib=rb-4.1.0&q=85",
    body: [
      "Term insurance is a simple promise: if the insured person dies during the policy term, the nominee receives the sum assured. If they survive, nothing is paid back. That 'nothing back' is exactly why it's cheap — you pay only for protection, not for an investment the insurer manages on your behalf.",
      "A 30-year-old can typically buy ₹1 crore of cover for roughly the cost of a monthly OTT subscription. Mixing insurance with investment in traditional plans usually delivers neither good cover nor good returns.",
      "How much cover? A common rule is 10–15× your annual income, adjusted for outstanding loans and your dependants' future expenses — children's education, household costs, parents' care.",
      "Buy early (premiums lock at entry age), disclose everything honestly (non-disclosure is the top cause of claim rejection), and choose a term that covers you until your dependants are financially independent. We facilitate term plans across insurers and will happily show you the comparison.",
    ],
  },
  {
    slug: "fixed-vs-floating-rates",
    title: "Fixed vs Floating Interest Rates: A Borrower's Guide",
    category: "Loans",
    excerpt: "The rate type you choose matters as much as the rate itself. Here's the trade-off, minus the jargon.",
    date: "2026-05-08",
    readTime: "4 min read",
    author: "Team Poonji",
    image: "https://images.unsplash.com/photo-1785768699591-d0845b8e7478?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtdW1iYWklMjBza3lzY3JhcGVyJTIwZmluYW5jaWFsJTIwZGlzdHJpY3R8ZW58MHx8fHwxNzkwOTExMDI1fDA&ixlib=rb-4.1.0&q=85",
    body: [
      "A fixed rate stays constant through the loan; your EMI never changes. A floating rate moves with a benchmark (usually the RBI repo rate), so your EMI or tenure rises and falls with the economy.",
      "Fixed rates are typically 1–2.5% higher — you're paying a premium for certainty. Floating rates are cheaper on average over long periods, but they demand the budget flexibility to absorb hikes.",
      "A practical approach: for long-tenure home loans, floating usually wins on cost, and RBI rules let you prepay floating-rate home loans without penalty. For short tenures or tight budgets where predictability matters, fixed can be worth the premium.",
      "Watch for 'teaser' fixed rates that convert to floating after 2–3 years — read what the rate resets to. When we facilitate your loan, we model both scenarios on your actual numbers so the choice is visible, not guessed.",
    ],
  },
  {
    slug: "emergency-fund-12-months",
    title: "How to Build an Emergency Fund in 12 Months",
    category: "Personal Finance",
    excerpt: "Three to six months of expenses sounds impossible until you run it as a system.",
    date: "2026-04-15",
    readTime: "5 min read",
    author: "Team Poonji",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmaW5hbmNpYWwlMjBhZHZpc29yJTIwdGVhbSUyMG9mZmljZXxlbnwwfHx8fDE3OTA5MTEwMjV8MA&ixlib=rb-4.1.0&q=85",
    body: [
      "An emergency fund is 3–6 months of essential expenses kept in something instantly accessible — a sweep-in FD or liquid fund. Its job is not returns; its job is to make sure a job loss or medical bill never forces you into an expensive loan or a distressed sale of investments.",
      "Twelve months is enough if you automate it. Compute your monthly essentials (rent, EMIs, groceries, school fees, insurance). Multiply by six — that's the target. Divide by twelve — that's the monthly transfer, scheduled for the day after salary arrives.",
      "Windfalls accelerate the plan: route bonuses, incentives and tax refunds straight into the fund. Most households that follow this hit a 3-month cushion within the year and the full 6-month cushion shortly after.",
      "Keep it boring and separate: a different account, no debit card attached, and never in equity. Once the fund is complete, the same monthly transfer simply becomes your SIP — the habit is already built.",
    ],
  },
  {
    slug: "fd-vs-mutual-fund",
    title: "FD vs Mutual Fund: Where Should Your Money Sit?",
    category: "Investments",
    excerpt: "It's not a fight — it's a division of labour. The trick is knowing which money does which job.",
    date: "2026-03-28",
    readTime: "6 min read",
    author: "Team Poonji",
    image: "https://images.unsplash.com/photo-1642345584279-9810f0b1359c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBmaW5hbmNpYWwlMjBhZHZpc29yJTIwdGVhbSUyMG9mZmljZXxlbnwwfHx8fDE3OTA5MTEwMjV8MA&ixlib=rb-4.1.0&q=85",
    body: [
      "Fixed deposits guarantee a stated return and protect principal (within DICGC limits of ₹5 lakh per bank per depositor). Equity mutual funds offer no guarantee, but historically outpace inflation and FDs over long horizons. Different tools, different jobs.",
      "Money you cannot afford to lose or need within 1–3 years — emergency funds, a near-term goal, next year's school fees — belongs in FDs, RDs or debt-oriented options. Money for goals 7+ years away fights inflation best in equity funds.",
      "Taxation differs too: FD interest is taxed at your slab every year, while equity fund gains enjoy favourable long-term capital gains treatment with an annual exemption threshold. For higher-slab investors this gap is significant.",
      "Most sound portfolios hold both. A simple frame: FDs for safety and short horizons, equity funds for growth and long horizons, reviewed once a year. Our FD and SIP calculators make the trade-off concrete with your own numbers.",
    ],
  },
];

export interface Faq {
  q: string;
  a: string;
  category: string;
}

export const FAQS: Faq[] = [
  { category: "Services", q: "What services does Poonji Finance provide?", a: "We facilitate loans (home, personal, business, vehicle, loan against property), insurance (life, health, motor, general), fixed deposits, mutual funds and other investment products through our network of banks, NBFCs, insurers and investment platforms. We help you compare, apply and process — the product itself is issued by the respective institution." },
  { category: "Services", q: "Does Poonji Finance guarantee loan approval?", a: "No, and you should be cautious of anyone who does. Final approval, rates and terms rest entirely with the lending institution, based on its policies and your eligibility. Our role is to match you with suitable options and make the process smoother and faster." },
  { category: "Services", q: "What charges are applicable for your service?", a: "For most products we are compensated by the partner institution as a distributor/facilitator, so customers usually pay us nothing directly. Where any fee applies, we disclose it upfront in writing before you proceed." },
  { category: "Loans", q: "How does loan facilitation work?", a: "You tell us your requirement; we assess basic eligibility, shortlist suitable lenders from our partner network, help with documentation, and coordinate with the institution until disbursal. One point of contact instead of visiting multiple banks." },
  { category: "Loans", q: "What documents are required for a loan?", a: "Typically: KYC (Aadhaar, PAN), income proof (salary slips / ITRs), bank statements of 6–12 months, and address proof. Home and business loans need additional property or business documents. We share an exact checklist for your chosen product." },
  { category: "Loans", q: "How long does loan processing take?", a: "Personal loans can close in 2–5 working days; home and business loans typically take 1–3 weeks depending on verification and legal/technical checks. Complete documentation is the single biggest accelerator." },
  { category: "Loans", q: "What affects loan eligibility?", a: "Income, existing EMIs, credit score, age, employment stability and the property/asset involved. A score above ~750 and total EMIs under 50% of income usually unlock the best offers." },
  { category: "Investments", q: "What is an EMI?", a: "Equated Monthly Instalment — a fixed monthly payment covering both interest and principal. Early EMIs are interest-heavy; over time more of each payment reduces the principal. Try our EMI calculator to see the split on your own numbers." },
  { category: "Investments", q: "What is a SIP?", a: "A Systematic Investment Plan invests a fixed amount into a mutual fund every month automatically. It builds discipline, averages purchase cost across market ups and downs, and harnesses compounding over long periods." },
  { category: "Investments", q: "What is a mutual fund?", a: "A pool where many investors' money is managed professionally across shares, bonds or both. You own 'units' whose value moves with the underlying investments. Mutual fund investments are subject to market risks — read scheme documents carefully." },
  { category: "Insurance", q: "How does insurance work?", a: "You pay a premium; the insurer promises a payout on a defined event (death, hospitalisation, accident, damage). The right cover depends on dependants, loans and lifestyle — not on returns. Protection first, investment separately." },
  { category: "Deposits", q: "What is a fixed deposit?", a: "A deposit locked with a bank or NBFC for a fixed tenure at a fixed interest rate. Returns are guaranteed by the institution, and bank FDs carry DICGC insurance up to ₹5 lakh per depositor per bank. Interest is taxable at your slab." },
  { category: "Process", q: "How can I contact Poonji Finance?", a: "Call us at +91 93118 28382 or +91 99107 97973, WhatsApp us, email info@poonjifinance.com, or submit any enquiry form on this website — we respond within one business day, and callback requests within 30 minutes during working hours." },
];

export const GUIDES = [
  { title: "What Is a Credit Score?", desc: "How your score is built, checked and improved.", slug: "credit-score-explained" },
  { title: "How Does an EMI Work?", desc: "Principal vs interest, amortisation, and prepayment maths.", slug: "fixed-vs-floating-rates" },
  { title: "Fixed vs Floating Rates", desc: "Choosing the right rate type for your loan.", slug: "fixed-vs-floating-rates" },
  { title: "SIP vs Lump-Sum", desc: "Two routes into mutual funds, compared honestly.", slug: "sip-vs-lumpsum" },
  { title: "Term Insurance Explained", desc: "Pure protection, plain language.", slug: "term-insurance-explained" },
  { title: "Emergency Fund Blueprint", desc: "A 12-month system to 6 months of safety.", slug: "emergency-fund-12-months" },
  { title: "FD vs Mutual Funds", desc: "Which money does which job.", slug: "fd-vs-mutual-fund" },
  { title: "Understanding Inflation", desc: "Why ₹100 today won't buy ₹100 of life tomorrow.", slug: "sip-vs-lumpsum" },
];

export const IMG = {
  hero: "https://images.unsplash.com/photo-1785768699591-d0845b8e7478?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtdW1iYWklMjBza3lzY3JhcGVyJTIwZmluYW5jaWFsJTIwZGlzdHJpY3R8ZW58MHx8fHwxNzkwOTExMDI1fDA&ixlib=rb-4.1.0&q=85",
  skyline: "https://images.unsplash.com/photo-1770331373157-89d085ed7ea2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtdW1iYWklMjBza3lzY3JhcGVyJTIwZmluYW5jaWFsJTIwZGlzdHJpY3R8ZW58MHx8fHwxNzkwOTExMDI1fDA&ixlib=rb-4.1.0&q=85",
  consult: "https://images.unsplash.com/photo-1642345584279-9810f0b1359c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBmaW5hbmNpYWwlMjBhZHZpc29yJTIwdGVhbSUyMG9mZmljZXxlbnwwfHx8fDE3OTA5MTEwMjV8MA&ixlib=rb-4.1.0&q=85",
  family: "https://images.unsplash.com/photo-1780329946888-0db2441b249c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYW1pbHklMjBob21lJTIwa2V5JTIwYnV5aW5nJTIwaG91c2V8ZW58MHx8fDE3OTAwMTEwMjZ8MA&ixlib=rb-4.1.0&q=85",
};

export { Landmark, LineChart, HeartPulse, Building2 };
