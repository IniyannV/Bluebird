import { useState } from "react";
import Button from "../ui/Button";

export default function OnboardingAgreement({ onAccept, onDecline }) {
  const [isOldEnough, setIsOldEnough] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const canContinue = isOldEnough && acceptedPolicies;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-lg border border-app-border bg-app-surface p-5 shadow-2xl">
        <h2 className="text-lg font-bold text-app-text">Before you continue</h2>
        <p className="mt-2 text-sm leading-6 text-app-muted">
          Please read and agree to the following before creating your account.
        </p>
        <div className="mt-4 rounded-md border border-app-border bg-app-bg px-3 py-3 text-sm font-semibold text-app-text">
          You must be at least 13 years old to use CHS GPA Calculator.
        </div>
        <div className="mt-5 space-y-4 text-sm text-app-muted">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isOldEnough}
              onChange={(event) => setIsOldEnough(event.target.checked)}
              className="mt-1 h-4 w-4 accent-app-accent"
            />
            <span>I am at least 13 years old.</span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={acceptedPolicies}
              onChange={(event) => setAcceptedPolicies(event.target.checked)}
              className="mt-1 h-4 w-4 accent-app-accent"
            />
            <span>
              I agree to the{" "}
              <a className="text-app-accent underline" href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-app-accent underline" href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>
        <div className="mt-6 space-y-2">
          <Button aria-label="Continue" variant="primary" disabled={!canContinue} onClick={onAccept} className="w-full">
            Continue
          </Button>
          <Button aria-label="Cancel sign-in" variant="ghost" onClick={onDecline} className="w-full">
            Cancel sign-in
          </Button>
        </div>
      </div>
    </div>
  );
}
