import asyncio

from lib.db import db
from lib.security import new_id, utcnow

POSTS = [
    {
        "slug": "credit-score-explained",
        "title": "What Is a Credit Score — and Why It Decides Your Loan",
        "category": "Loans",
        "excerpt": "Your CIBIL score quietly negotiates every loan before you do. Here's how it's built, and how to move it.",
        "read_time": "6 min read",
        "author": "Team Poonji",
        "image": "https://images.unsplash.com/photo-1642345584279-9810f0b1359c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBmaW5hbmNpYWwlMjBhZHZpc29yJTIwdGVhbSUyMG9mZmljZXxlbnwwfHx8fDE3OTA5MTEwMjV8MA&ixlib=rb-4.1.0&q=85",
        "body": "Your credit score is a three-digit summary of your borrowing history, typically between 300 and 900. Lenders use it as a first filter: above roughly 750, doors open quickly and rates improve; below that, approvals get slower, smaller and more expensive.\n\nThe score is built from five ingredients: repayment history (the heaviest), credit utilisation, length of credit history, credit mix, and recent enquiries. A single missed EMI can stay visible for years, while utilisation above 30–40% of your card limit drags the score even if you pay in full.\n\nImproving it is boring but reliable: pay every EMI and card bill on time, keep utilisation low, avoid applying to many lenders in a short window, and keep your oldest credit card active to lengthen your history.\n\nBefore any major application, pull your own report and dispute errors — wrong loan tagging and stale 'settled' statuses are more common than you'd think. At Poonji Finance, a score review is the first thing we do in any loan consultation, because fixing the file is often worth more than negotiating the rate.",
    },
    {
        "slug": "sip-vs-lumpsum",
        "title": "SIP vs Lump-Sum: Which Way Should You Invest?",
        "category": "Mutual Funds",
        "excerpt": "The honest answer depends less on markets and more on where your money comes from.",
        "read_time": "5 min read",
        "author": "Team Poonji",
        "image": "https://images.unsplash.com/photo-1770331373157-89d085ed7ea2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtdW1iYWklMjBza3lzY3JhcGVyJTIwZmluYW5jaWFsJTIwZGlzdHJpY3R8ZW58MHx8fHwxNzkwOTExMDI1fDA&ixlib=rb-4.1.0&q=85",
        "body": "A Systematic Investment Plan invests a fixed amount every month, buying more units when markets fall and fewer when they rise. A lump-sum invests everything at once. Mathematically, lump-sums win more often because markets rise more often than they fall — but that statistic ignores human behaviour.\n\nIf your money arrives monthly (a salary), SIP is not a compromise; it's the natural structure. It also removes the hardest question in investing — 'is now a good time?' — by making the answer irrelevant.\n\nIf you hold a large idle amount (a bonus, a property sale), investing it gradually through an STP from a liquid fund into equity over 6–12 months balances regret-risk on both sides: you're not fully exposed to a crash next week, nor fully out of a rally.\n\nWhat matters far more than the route is staying invested. A mediocre fund held for 15 years beats a perfect fund abandoned in year two. Use our SIP calculator to see what consistency alone builds over time.",
    },
    {
        "slug": "term-insurance-explained",
        "title": "Term Insurance, Explained in Plain Language",
        "category": "Insurance",
        "excerpt": "The cheapest, most honest insurance product — and the one agents talk about least.",
        "read_time": "5 min read",
        "author": "Team Poonji",
        "image": "https://images.unsplash.com/photo-1780329946888-0db2441b249c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYW1pbHklMjBob21lJTIwa2V5JTIwYnV5aW5nJTIwaG91c2V8ZW58MHx8fDE3OTAwMTEwMjZ8MA&ixlib=rb-4.1.0&q=85",
        "body": "Term insurance is a simple promise: if the insured person dies during the policy term, the nominee receives the sum assured. If they survive, nothing is paid back. That 'nothing back' is exactly why it's cheap — you pay only for protection, not for an investment the insurer manages on your behalf.\n\nA 30-year-old can typically buy ₹1 crore of cover for roughly the cost of a monthly OTT subscription. Mixing insurance with investment in traditional plans usually delivers neither good cover nor good returns.\n\nHow much cover? A common rule is 10–15× your annual income, adjusted for outstanding loans and your dependants' future expenses — children's education, household costs, parents' care.\n\nBuy early (premiums lock at entry age), disclose everything honestly (non-disclosure is the top cause of claim rejection), and choose a term that covers you until your dependants are financially independent. We facilitate term plans across insurers and will happily show you the comparison.",
    },
    {
        "slug": "fixed-vs-floating-rates",
        "title": "Fixed vs Floating Interest Rates: A Borrower's Guide",
        "category": "Loans",
        "excerpt": "The rate type you choose matters as much as the rate itself. Here's the trade-off, minus the jargon.",
        "read_time": "4 min read",
        "author": "Team Poonji",
        "image": "https://images.unsplash.com/photo-1785768699591-d0845b8e7478?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtdW1iYWklMjBza3lzY3JhcGVyJTIwZmluYW5jaWFsJTIwZGlzdHJpY3R8ZW58MHx8fHwxNzkwOTExMDI1fDA&ixlib=rb-4.1.0&q=85",
        "body": "A fixed rate stays constant through the loan; your EMI never changes. A floating rate moves with a benchmark (usually the RBI repo rate), so your EMI or tenure rises and falls with the economy.\n\nFixed rates are typically 1–2.5% higher — you're paying a premium for certainty. Floating rates are cheaper on average over long periods, but they demand the budget flexibility to absorb hikes.\n\nA practical approach: for long-tenure home loans, floating usually wins on cost, and RBI rules let you prepay floating-rate home loans without penalty. For short tenures or tight budgets where predictability matters, fixed can be worth the premium.\n\nWatch for 'teaser' fixed rates that convert to floating after 2–3 years — read what the rate resets to. When we facilitate your loan, we model both scenarios on your actual numbers so the choice is visible, not guessed.",
    },
    {
        "slug": "emergency-fund-12-months",
        "title": "How to Build an Emergency Fund in 12 Months",
        "category": "Personal Finance",
        "excerpt": "Three to six months of expenses sounds impossible until you run it as a system.",
        "read_time": "5 min read",
        "author": "Team Poonji",
        "image": "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmaW5hbmNpYWwlMjBhZHZpc29yJTIwdGVhbSUyMG9mZmljZXxlbnwwfHx8fDE3OTA5MTEwMjV8MA&ixlib=rb-4.1.0&q=85",
        "body": "An emergency fund is 3–6 months of essential expenses kept in something instantly accessible — a sweep-in FD or liquid fund. Its job is not returns; its job is to make sure a job loss or medical bill never forces you into an expensive loan or a distressed sale of investments.\n\nTwelve months is enough if you automate it. Compute your monthly essentials (rent, EMIs, groceries, school fees, insurance). Multiply by six — that's the target. Divide by twelve — that's the monthly transfer, scheduled for the day after salary arrives.\n\nWindfalls accelerate the plan: route bonuses, incentives and tax refunds straight into the fund. Most households that follow this hit a 3-month cushion within the year and the full 6-month cushion shortly after.\n\nKeep it boring and separate: a different account, no debit card attached, and never in equity. Once the fund is complete, the same monthly transfer simply becomes your SIP — the habit is already built.",
    },
    {
        "slug": "fd-vs-mutual-fund",
        "title": "FD vs Mutual Fund: Where Should Your Money Sit?",
        "category": "Investments",
        "excerpt": "It's not a fight — it's a division of labour. The trick is knowing which money does which job.",
        "read_time": "6 min read",
        "author": "Team Poonji",
        "image": "https://images.unsplash.com/photo-1642345584279-9810f0b1359c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBmaW5hbmNpYWwlMjBhZHZpc29yJTIwdGVhbSUyMG9mZmljZXxlbnwwfHx8fDE3OTA5MTEwMjV8MA&ixlib=rb-4.1.0&q=85",
        "body": "Fixed deposits guarantee a stated return and protect principal (within DICGC limits of ₹5 lakh per bank per depositor). Equity mutual funds offer no guarantee, but historically outpace inflation and FDs over long horizons. Different tools, different jobs.\n\nMoney you cannot afford to lose or need within 1–3 years — emergency funds, a near-term goal, next year's school fees — belongs in FDs, RDs or debt-oriented options. Money for goals 7+ years away fights inflation best in equity funds.\n\nTaxation differs too: FD interest is taxed at your slab every year, while equity fund gains enjoy favourable long-term capital gains treatment with an annual exemption threshold. For higher-slab investors this gap is significant.\n\nMost sound portfolios hold both. A simple frame: FDs for safety and short horizons, equity funds for growth and long horizons, reviewed once a year. Our FD and SIP calculators make the trade-off concrete with your own numbers.",
    },
]


async def main():
    if await db.blog_posts.count_documents({}) > 0:
        print("Blog posts already seeded, skipping")
        return
    for p in POSTS:
        await db.blog_posts.insert_one({"id": new_id(), **p, "published": True, "created_at": utcnow()})
    print(f"Seeded {len(POSTS)} blog posts")


if __name__ == "__main__":
    asyncio.run(main())
