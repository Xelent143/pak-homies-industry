import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "@/pages/NotFound";

// Eager — first paint
import Home from "./pages/Home";

// Lazy marketing pages
const About = lazy(() => import("./pages/About"));
const WhyPakHomies = lazy(() => import("./pages/WhyPakHomies"));
const Process = lazy(() => import("./pages/Process"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Capabilities = lazy(() => import("./pages/Capabilities"));
const Services = lazy(() => import("./pages/Services"));
const Shop = lazy(() => import("./pages/Shop"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Inquire = lazy(() => import("./pages/Inquire"));
const GeoLanding = lazy(() => import("./pages/GeoLanding"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Preserved tools
const Customize = lazy(() => import("./pages/Customize"));
const BrandingStudio = lazy(() => import("./pages/BrandingStudio"));
const TechPackCreator = lazy(() => import("./pages/TechPackCreator"));

// Admin
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail"));
const AdminInquiries = lazy(() => import("./pages/admin/AdminInquiries"));
const AdminInquiryDetail = lazy(() => import("./pages/admin/AdminInquiryDetail"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminAIStudio = lazy(() => import("@listing-generator/client/AdminAIStudio"));
const AdminProductAutomation = lazy(() => import("@listing-generator/client/AdminProductAutomation"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#3E41B6] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#555] text-sm tracking-widest uppercase">Loading…</p>
      </div>
    </div>
  );
}

// Routes that render full-screen, no Navbar/Footer
const BARE_ROUTES = ["/admin-saad", "/customize", "/capabilities/label-studio", "/capabilities/techpack"];

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation(to); }, [to, setLocation]);
  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/why-pak-homies" component={WhyPakHomies} />
        <Route path="/process" component={Process} />
        <Route path="/certifications" component={Certifications} />
        <Route path="/products" component={Products} />
        <Route path="/products/:slug" component={ProductDetail} />
        <Route path="/capabilities" component={Capabilities} />
        <Route path="/capabilities/label-studio" component={BrandingStudio} />
        <Route path="/capabilities/techpack" component={TechPackCreator} />
        <Route path="/customize" component={Customize} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contact" component={Contact} />
        <Route path="/inquire" component={Inquire} />
        <Route path="/cities/:region" component={GeoLanding} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />

        {/* Admin */}
        <Route path="/admin-saad" component={AdminDashboard} />
        <Route path="/admin-saad/login" component={AdminLogin} />
        <Route path="/admin-saad/orders" component={AdminOrders} />
        <Route path="/admin-saad/orders/:id" component={AdminOrderDetail} />
        <Route path="/admin-saad/inquiries" component={AdminInquiries} />
        <Route path="/admin-saad/inquiries/:id" component={AdminInquiryDetail} />
        <Route path="/admin-saad/customers" component={AdminCustomers} />
        <Route path="/admin-saad/products" component={AdminProducts} />
        <Route path="/admin-saad/ai-studio" component={AdminAIStudio} />
        <Route path="/admin-saad/product-automation" component={AdminProductAutomation} />
        <Route path="/admin-saad/content" component={AdminContent} />
        <Route path="/admin-saad/settings" component={AdminSettings} />
        <Route path="/admin-saad/categories" component={AdminCategories} />

        {/* Legacy / SEO redirects */}
        <Route path="/shop" component={Shop} />
        <Route path="/shop/:slug">{(p) => <Redirect to={`/products/${(p as any).slug}`} />}</Route>
        <Route path="/services" component={Services} />
        <Route path="/branding-studio"><Redirect to="/capabilities/label-studio" /></Route>
        <Route path="/tech-pack"><Redirect to="/capabilities/techpack" /></Route>
        <Route path="/rfq"><Redirect to="/inquire" /></Route>
        <Route path="/portfolio"><Redirect to="/" /></Route>
        <Route path="/blog"><Redirect to="/" /></Route>
        <Route path="/blog/:rest*"><Redirect to="/" /></Route>
        <Route path="/checkout"><Redirect to="/inquire" /></Route>
        <Route path="/checkout/:rest*"><Redirect to="/inquire" /></Route>

        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function Layout() {
  const [location] = useLocation();
  const isBare = BARE_ROUTES.some((r) => location.startsWith(r));

  if (isBare) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Router />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-[5.75rem]">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Layout />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
