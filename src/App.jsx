import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./components/dashboard/Dashboard";
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
      </section>
    </main>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg text-app-muted">
        Loading Bluebird...
      </div>
    );
  }

  if (!user) return <AuthScreen />;
  return <Dashboard />;
}
