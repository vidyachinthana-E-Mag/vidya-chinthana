import React, { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AuthModal from "./components/auth/AuthModal";
import Toast from "./components/ui/Toast";
import ScrollProgress from "./components/ui/ScrollProgress";
import SiteLoader from "./components/ui/SiteLoader";
import HomePage from "./pages/HomePage";
import MaintenanceGate from "./components/admin/MaintenanceGate";
import SkipLink from "./components/layout/SkipLink";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import BackToTop from "./components/ui/BackToTop";
import OpeningSplash from "./components/ui/OpeningSplash";
import { t } from "./lib/labels";

const ArticlesPage = React.lazy(() => import("./pages/ArticlesPage"));
const AuthorsPage = React.lazy(() => import("./pages/AuthorsPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const IssuePage = React.lazy(() => import("./pages/IssuePage"));
const CmsPage = React.lazy(() => import("./pages/CmsPage"));
const AdminStudioPage = React.lazy(() => import("./pages/AdminStudioPage"));
const AdminHubPage = React.lazy(() => import("./pages/AdminHubPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const AccountPage = React.lazy(() => import("./pages/AccountPage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const CategoryPage = React.lazy(() => import("./pages/CategoryPage"));
const IssuesPage = React.lazy(() => import("./pages/IssuesPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const CustomPageView = React.lazy(() => import("./pages/CustomPageView"));
const ArticleReader = React.lazy(() => import("./components/reader/ArticleReader"));

function RouteFallback() {
  const { lang } = useApp();
  return (
    <div className="py-24 text-center text-muted text-sm" role="status" aria-live="polite">
      {t(lang, "Loading…", "පූරණය වෙමින්…")}
    </div>
  );
}

function PageShell({
  children,
  pageKey,
}: {
  children: React.ReactNode;
  pageKey: string;
}) {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="route-transition"
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const { page, toast, dismissToast, dataReady, siteConfig, lang } = useApp();
  const [authOpen, setAuthOpen] = useState(false);

  if (page === "admin") {
    return (
      <Suspense fallback={<RouteFallback />}>
        <AdminHubPage />
        <Toast toast={toast} onClose={dismissToast} />
      </Suspense>
    );
  }

  if (page === "studio") {
    return (
      <Suspense fallback={<RouteFallback />}>
        <AdminStudioPage />
        <Toast toast={toast} onClose={dismissToast} />
      </Suspense>
    );
  }

  if (page === "login") {
    return (
      <Suspense fallback={<RouteFallback />}>
        <LoginPage />
        <Toast toast={toast} onClose={dismissToast} />
      </Suspense>
    );
  }

  if (page === "read") {
    return (
      <Suspense fallback={<RouteFallback />}>
        <ArticleReader />
        <Toast toast={toast} onClose={dismissToast} />
      </Suspense>
    );
  }

  return (
    <MaintenanceGate>
      <OpeningSplash
        siteName={t(lang, siteConfig.branding.siteNameEn, siteConfig.branding.siteNameSi)}
        reducedMotion={siteConfig.effects.reducedMotion}
      />
      <SkipLink />
      <SiteLoader show={!dataReady} />
      <ScrollProgress />
      <Header onAuthOpen={() => setAuthOpen(true)} />
      <main id="main-content" className="min-h-[70vh]">
        <AnimatePresence mode="wait">
          <PageShell pageKey={page}>
            <Suspense fallback={<RouteFallback />}>
              {page === "home" && <HomePage />}
              {page === "articles" && <ArticlesPage />}
              {page === "authors" && <AuthorsPage />}
              {page === "about" && <AboutPage />}
              {page === "dashboard" && <DashboardPage />}
              {page === "issue" && <IssuePage />}
              {page === "cms" && <CmsPage />}
              {page === "profile" && <ProfilePage />}
              {page === "account" && <AccountPage />}
              {page === "privacy" && <PrivacyPage />}
              {page === "terms" && <TermsPage />}
              {page === "category" && <CategoryPage />}
              {page === "issues" && <IssuesPage />}
              {page === "page" && <CustomPageView />}
            </Suspense>
          </PageShell>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      <Toast toast={toast} onClose={dismissToast} />
    </MaintenanceGate>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </ErrorBoundary>
  );
}
