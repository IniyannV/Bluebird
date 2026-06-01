import Button from "../ui/Button";

const sections = [
  {
    title: "Acceptance of Terms",
    body: "By using this app you agree to these terms. You must be at least 13 years old to create an account."
  },
  {
    title: "Description of Service",
    body: "This is an unofficial student tool for tracking weighted GPA at Coppell High School. It is not affiliated with, endorsed by, or connected to Coppell High School, Coppell ISD, or any official school system."
  },
  {
    title: "User Accounts",
    body: "You are responsible for your Google account credentials. You may not use another person's account."
  },
  {
    title: "Data and Privacy",
    body: "Your GPA data is stored in Firebase Firestore and is only accessible to you when signed in. We do not sell or share your data. See our Privacy Policy for details."
  },
  {
    title: "Disclaimer",
    body: "GPA calculations are estimates based on the CHS weighted scale. Always verify with your official school transcript. We make no guarantees of accuracy."
  },
  {
    title: "Termination",
    body: "You may delete your account at any time. We reserve the right to suspend accounts that abuse the service."
  },
  {
    title: "Changes to Terms",
    body: "We may update these terms. Continued use constitutes acceptance."
  }
];

export default function TermsOfService() {
  return (
    <main className="min-h-screen overflow-y-auto bg-app-bg px-4 py-8 text-app-text">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-app-border bg-app-surface p-6 shadow-2xl">
        <Button aria-label="Go back" variant="ghost" onClick={() => window.history.back()} className="mb-6">
          Back
        </Button>
        <h1 className="text-2xl font-bold">Terms of Service — CHS GPA Calculator</h1>
        <p className="mt-2 text-sm text-app-muted">Last updated: June 2025</p>
        <div className="mt-6 space-y-6">
          {sections.map((section, index) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-app-text">
                {index + 1}. {section.title}
              </h2>
              <p className="mt-2 leading-7 text-app-muted">{section.body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
