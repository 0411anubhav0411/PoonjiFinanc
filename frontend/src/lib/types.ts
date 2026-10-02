export interface PortalUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  partner_status?: string | null;
  email_verified?: boolean | null;
  profile?: Record<string, string>;
  created_at?: string;
}

export interface PortalDoc {
  id: string;
  customer_id: string;
  category: string;
  doc_type: string;
  filename: string;
  content_type?: string;
  size?: number;
  status: string;
  note?: string | null;
  created_at: string;
}

export interface PortalApp {
  id: string;
  customer_id: string;
  product: string;
  amount?: string | null;
  tenure?: string | null;
  employment?: string | null;
  income?: string | null;
  city?: string | null;
  notes?: string | null;
  status: string;
  note?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface Rate {
  id: string;
  institution: string;
  category: string;
  product: string;
  rate_text: string;
  amount_text?: string | null;
  tenure_text?: string | null;
  fee_text?: string | null;
  eligibility_text?: string | null;
  notes?: string | null;
  source?: string | null;
  published: boolean;
  updated_at: string;
}

export interface FinanceUpdate {
  id: string;
  title: string;
  category: string;
  body: string;
  source?: string | null;
  important: boolean;
  published: boolean;
  created_at: string;
}

export interface PartnerPublic {
  id: string;
  name: string;
  partner_status?: string;
  email?: string;
  mobile?: string;
  profile?: Record<string, string>;
  created_at?: string;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  author: string;
  read_time: string;
  image?: string | null;
  published: boolean;
  created_at: string;
}
