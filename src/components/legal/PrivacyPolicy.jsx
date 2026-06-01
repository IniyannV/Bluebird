import Button from "../ui/Button";

const sections = [
  {
    title: "Information We Collect",
    body: "When you sign in with Google we receive your email address and Google account ID. We store the GPA data you enter (course names, grades, credits, year tabs) in Firebase Firestore."
  },
  {
    title: "How We Use Your Information",
    body: "Your data is used solely to provide the GPA tracking service. We do not use it for advertising, analytics, or any third party."
  },
  {
    title: "Data Storage",
    body: "Data is stored in Google Firebase Firestore. It is protected by Firebase security rules so only you can access it when authenticated."
  },
  {
    title: "Data Retention",
    body: "Your data is retained until you delete your account. You can export your data at any time using the Export CSV feature."
  },
  {
    title: "Children's Privacy",
    body: "This service is not intended for children under 13. If you are under 13, do not create an account."
  },
  {
    title: "Contact",
    body: "For questions or data deletion requests, contact the app administrator."
  },
  {
    title: "Changes",
    body: "This policy may be updated. Continued use constitutes acceptance."
  }
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen overflow-y-auto bg-app-bg px-4 py-8 text-app-text">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-app-border bg-app-surface p-6 shadow-2xl">
        <Button aria-label="Go back" variant="ghost" onClick={() => window.history.back()} className="mb-6">
          Back
        </Button>
        <h1 className="text-2xl font-bold">Privacy Policy — CHS GPA Calculator</h1>
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
