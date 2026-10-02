import asyncio

from lib.db import db, ensure_indexes
from lib.security import new_id, utcnow

RATES = [
    # home-loan
    {"institution": "State Bank of India", "category": "home-loan", "product": "Home Loan", "rate_text": "8.35% – 9.15%", "amount_text": "₹5 L – ₹10 Cr", "tenure_text": "Up to 30 yrs", "fee_text": "0.35% + GST", "eligibility_text": "Salaried / Self-employed, 700+ score", "source": "Bank website", "published": True},
    {"institution": "HDFC Bank", "category": "home-loan", "product": "Home Loan", "rate_text": "8.40% – 9.40%", "amount_text": "₹5 L – ₹10 Cr", "tenure_text": "Up to 30 yrs", "fee_text": "0.50% + GST", "eligibility_text": "Salaried / Self-employed", "source": "Bank website", "published": True},
    {"institution": "ICICI Bank", "category": "home-loan", "product": "Home Loan", "rate_text": "8.45% – 9.60%", "amount_text": "₹5 L – ₹5 Cr", "tenure_text": "Up to 30 yrs", "fee_text": "0.50% – 1% + GST", "eligibility_text": "Salaried / Self-employed", "source": "Bank website", "published": True},
    {"institution": "LIC Housing Finance", "category": "home-loan", "product": "Griha Suvidha", "rate_text": "8.50% – 10.25%", "amount_text": "₹2 L – ₹5 Cr", "tenure_text": "Up to 30 yrs", "fee_text": "0.25% – 0.50% + GST", "eligibility_text": "Salaried / Self-employed / Pensioners", "source": "HFC website", "published": True},
    # lap
    {"institution": "State Bank of India", "category": "lap", "product": "Loan Against Property", "rate_text": "9.20% – 10.75%", "amount_text": "₹10 L – ₹7.5 Cr", "tenure_text": "Up to 15 yrs", "fee_text": "1% + GST (max)", "eligibility_text": "Self-occupied residential / commercial property", "source": "Bank website", "published": True},
    {"institution": "Bajaj Finserv", "category": "lap", "product": "Loan Against Property", "rate_text": "9.50% – 12.00%", "amount_text": "₹10 L – ₹5 Cr", "tenure_text": "Up to 15 yrs", "fee_text": "Up to 2% + GST", "eligibility_text": "Property owners, salaried / self-employed", "source": "NBFC website", "published": True},
    {"institution": "Tata Capital", "category": "lap", "product": "Loan Against Property", "rate_text": "9.75% – 12.50%", "amount_text": "₹10 L – ₹5 Cr", "tenure_text": "Up to 15 yrs", "fee_text": "Up to 2% + GST", "eligibility_text": "Residential / commercial property", "source": "NBFC website", "published": True},
    # personal-loan
    {"institution": "HDFC Bank", "category": "personal-loan", "product": "Personal Loan", "rate_text": "10.50% – 16.00%", "amount_text": "₹50 K – ₹40 L", "tenure_text": "1 – 6 yrs", "fee_text": "Up to 2.5% + GST", "eligibility_text": "Salaried, 21 – 60 yrs", "source": "Bank website", "published": True},
    {"institution": "ICICI Bank", "category": "personal-loan", "product": "Personal Loan", "rate_text": "10.80% – 16.15%", "amount_text": "₹50 K – ₹50 L", "tenure_text": "1 – 6 yrs", "fee_text": "Up to 2% + GST", "eligibility_text": "Salaried / Self-employed", "source": "Bank website", "published": True},
    {"institution": "Kotak Mahindra", "category": "personal-loan", "product": "Personal Loan", "rate_text": "10.99% – 17.99%", "amount_text": "₹50 K – ₹35 L", "tenure_text": "1 – 6 yrs", "fee_text": "Up to 2.5% + GST", "eligibility_text": "Salaried, 21+", "source": "Bank website", "published": True},
    # business-loan
    {"institution": "State Bank of India", "category": "business-loan", "product": "SME Business Loan", "rate_text": "9.10% – 12.30%", "amount_text": "₹5 L – ₹5 Cr", "tenure_text": "Up to 7 yrs", "fee_text": "As applicable", "eligibility_text": "MSME with 2+ yrs vintage", "source": "Bank website", "published": True},
    {"institution": "Bajaj Finserv", "category": "business-loan", "product": "Business Loan", "rate_text": "14.00% – 22.00%", "amount_text": "₹2 L – ₹80 L", "tenure_text": "1 – 8 yrs", "fee_text": "Up to 3% + GST", "eligibility_text": "Self-employed, 3+ yrs vintage", "source": "NBFC website", "published": True},
    {"institution": "Aditya Birla Finance", "category": "business-loan", "product": "Business / MSME Loan", "rate_text": "13.50% – 21.00%", "amount_text": "₹5 L – ₹75 L", "tenure_text": "1 – 5 yrs", "fee_text": "Up to 2% + GST", "eligibility_text": "GST-registered businesses", "source": "NBFC website", "published": True},
    # vehicle-loan
    {"institution": "State Bank of India", "category": "vehicle-loan", "product": "Car Loan", "rate_text": "8.80% – 9.60%", "amount_text": "Up to 100% on-road", "tenure_text": "Up to 7 yrs", "fee_text": "0.25% + GST", "eligibility_text": "Salaried / Self-employed, 21+", "source": "Bank website", "published": True},
    {"institution": "HDFC Bank", "category": "vehicle-loan", "product": "Car Loan", "rate_text": "9.00% – 10.25%", "amount_text": "Up to 100% ex-showroom", "tenure_text": "Up to 7 yrs", "fee_text": "0.40% + GST", "eligibility_text": "Salaried / Self-employed", "source": "Bank website", "published": True},
    # education-loan
    {"institution": "State Bank of India", "category": "education-loan", "product": "Student Loan", "rate_text": "8.65% – 10.65%", "amount_text": "Up to ₹1.5 Cr", "tenure_text": "Up to 15 yrs", "fee_text": "Nil – ₹10,000", "eligibility_text": "Confirmed admission, co-applicant", "source": "Bank website", "published": True},
]

UPDATES = [
    {"title": "RBI holds repo rate — home loan EMIs stay steady for now", "category": "RBI & Policy", "body": "The Reserve Bank of India has kept the policy repo rate unchanged in its latest review, citing balanced growth and inflation dynamics. Borrowers on repo-linked floating rate loans will see no immediate change in EMIs. Watch this space for the next policy review.", "source": "RBI press release", "important": True, "published": True},
    {"title": "Festive-season lending: banks sharpen home loan pricing", "category": "Loans", "body": "Several large banks have trimmed headline home loan rates for high-credit-score borrowers as festive demand builds. Balance transfer offers with reduced processing fees are also back on the table. If your rate is well above current market levels, a review may be worthwhile.", "source": "Industry reports", "important": False, "published": True},
    {"title": "FD rates plateau — lock longer tenures if you need certainty", "category": "Deposits", "body": "With policy rates on hold, most banks have kept fixed deposit rates stable, and senior citizen premiums of around 0.50% continue at major institutions. Investors seeking certainty may consider laddering deposits across 1–5 year tenures.", "source": "Bank rate cards", "important": False, "published": True},
]


async def main():
    if await db.rates.count_documents({}) == 0:
        for r in RATES:
            await db.rates.insert_one({"id": new_id(), **r, "updated_at": utcnow()})
        print(f"Seeded {len(RATES)} rates")
    else:
        print("Rates already seeded, skipping")
    if await db.updates.count_documents({}) == 0:
        for u in UPDATES:
            await db.updates.insert_one({"id": new_id(), **u, "created_at": utcnow()})
        print(f"Seeded {len(UPDATES)} updates")
    else:
        print("Updates already seeded, skipping")


if __name__ == "__main__":
    asyncio.run(main())
