import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Founders from "@/pages/Founders";
import Services from "@/pages/Services";
import Calculators from "@/pages/Calculators";
import HowItWorks from "@/pages/HowItWorks";
import Resources from "@/pages/Resources";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Portal from "@/pages/Portal";
import PartnerPortal from "@/pages/PartnerPortal";
import Partners from "@/pages/Partners";
import Rates from "@/pages/Rates";
import Updates from "@/pages/Updates";
import Search from "@/pages/Search";
import Legal from "@/pages/Legal";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/founders" element={<Founders />} />
        <Route path="/services" element={<Services />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/partner-portal" element={<PartnerPortal />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/search" element={<Search />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/faqs" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/disclaimer" element={<Legal kind="disclaimer" />} />
        <Route path="/privacy" element={<Legal kind="privacy" />} />
        <Route path="/terms" element={<Legal kind="terms" />} />
        <Route path="/grievance" element={<Legal kind="grievance" />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
