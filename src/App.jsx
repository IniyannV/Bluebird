import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { Link, Route, Routes } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import OnboardingAgreement from "./components/auth/OnboardingAgreement";
import Dashboard from "./components/dashboard/Dashboard";
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import TermsOfService from "./components/legal/TermsOfService";
import { hasAcceptedTerms, recordTermsAcceptance } from "./firebase/agreements";
import { auth } from "./firebase/config";
import { useAuth } from "./hooks/useAuth";

function AuthScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-app-bg p-4">
      <section className="w-full max-w-md rounded-lg border border-app-border bg-app-surface p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-md border border-app-accent/40 bg-app-accent/15 font-mono text-lg font-bold text-app-accent">
            B
          </div>
          <h1 className="text-2xl font-bold text-app-text">Bluebird</h1>
          <p className="mt-1 text-sm text-app-muted">Weighted GPA tracking for Bluebird.</p>
        </div>
        <LoginForm onSignInWithGoogle={signInWithGoogle} />
        <footer className="mt-6 flex justify-center gap-4">
          <Link className="text-xs text-app-muted underline hover:text-app-text" to="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs text-app-muted underline hover:text-app-text" to="/privacy">
            Privacy Policy
          </Link>
        </footer>
      </section>
    </main>
  );
}

function Home() {
  const { user, loading } = useAuth();
  const [agreementStatus, setAgreementStatus] = useState("idle");

  useEffect(() => {
    let mounted = true;

    async function checkAgreement() {
      if (!user) {
        setAgreementStatus("idle");
        return;
      }

      setAgreementStatus("checking");
      const accepted = await hasAcceptedTerms(user.uid);
      if (!mounted) return;
      setAgreementStatus(accepted ? "accepted" : "needed");
    }

    checkAgreement();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg text-app-muted">
        Loading Bluebird...
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  if (agreementStatus === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg text-app-muted">
        Checking your account...
      </div>
    );
  }

  if (agreementStatus === "needed") {
    return (
      <OnboardingAgreement
        onAccept={async () => {
          await recordTermsAcceptance(user.uid);
          setAgreementStatus("accepted");
        }}
        onDecline={async () => {
          await signOut(auth);
          setAgreementStatus("idle");
        }}
      />
    );
  }

  if (agreementStatus === "accepted") return <Dashboard />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg text-app-muted">
      Checking your account...
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  );
}
