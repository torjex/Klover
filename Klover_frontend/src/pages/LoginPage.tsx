import { useState } from "react";
import { ApiError } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { Alert, Button, TextField, Wordmark } from "../components/ui";
import "./LoginPage.css";

export function LoginPage() {
  const { signIn } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await signIn(password);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Unexpected error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <div className="login__hero">
        <p className="login__tagline">
          Thoughtful care.
          <br />
          Healthier gardens.
        </p>
        <p className="login__attribution">Klover · test build · single zone</p>
      </div>

      <div className="login__panel">
        <form className="login__form" onSubmit={submit} noValidate>
          <div className="login__brand">
            <Wordmark size={30} />
          </div>

          <h1 className="login__title">Welcome back</h1>
          <p className="login__subtitle">Enter the shared password to control the sprinkler.</p>

          <div className="login__fields">
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="login__error">
              <Alert tone="error">{error}</Alert>
            </div>
          ) : null}

          <div className="login__submit">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              block
              loading={busy}
              iconAfter="arrow-right"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
