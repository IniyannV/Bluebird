import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import CourseTable from "../table/CourseTable";
import GPADisplay from "./GPADisplay";
import YearTabs from "./YearTabs";
import { useAuth } from "../../hooks/useAuth";
import { useFirestore } from "../../hooks/useFirestore";
import { useGPAData } from "../../hooks/useGPAData";
import { exportCoursesToCSV, importCoursesFromCSV } from "../../utils/csvHandler";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { loadTabs, saveTabs, saving } = useFirestore(user);
  const { tabs, activeTab, activeTabId, actions, resetTabs, createCourse } = useGPAData();
  const [bootstrapped, setBootstrapped] = useState(false);
  const [deleteTabId, setDeleteTabId] = useState(null);
  const [toast, setToast] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const remoteTabs = await loadTabs();
        if (!mounted) return;
        if (remoteTabs) actions.setTabs(remoteTabs);
      } catch (error) {
        if (mounted) {
          setToast(error.message || "Unable to load saved GPA data");
        }
      } finally {
        if (mounted) setBootstrapped(true);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [loadTabs, actions]);

  useEffect(() => {
    if (!bootstrapped || !user) return undefined;
    const timeout = setTimeout(() => {
      saveTabs(tabs).catch((error) => {
        setToast(error.message || "Unable to save changes");
      });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [tabs, bootstrapped, user, saveTabs]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  async function handleLogout() {
    resetTabs();
    await logout();
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file || !activeTab) return;
    try {
      const courses = await importCoursesFromCSV(file, createCourse);
      actions.appendCourses(activeTab.id, courses);
      setToast(`Imported ${courses.length} courses successfully`);
    } catch (error) {
      setToast(error.message || "Unable to import CSV");
    } finally {
      event.target.value = "";
    }
  }

  const pendingDeleteTab = tabs.find((tab) => tab.id === deleteTabId);

  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg text-app-muted">
        Loading saved GPA data...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-app-bg">
      <header className="border-b border-app-border bg-app-bg/95 px-4 py-4 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-app-text">CHS GPA Calculator</h1>
            <p className="text-sm text-app-muted">Spreadsheet-style weighted GPA tracking</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-app-muted">{user.email}</span>
            <span className={saving ? "text-app-accent" : "text-app-success"}>{saving ? "Saving..." : "Saved ✓"}</span>
            <Button aria-label="Log out" variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 md:px-6">
        <GPADisplay tabs={tabs} activeTab={activeTab} />
        <YearTabs
          tabs={tabs}
          activeTabId={activeTabId}
          onSelect={actions.setActiveTab}
          onAdd={actions.addTab}
          onRename={actions.renameTab}
          onDuplicate={actions.duplicateTab}
          onDelete={setDeleteTabId}
          onReorder={actions.reorderTabs}
        />
        <section className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-app-text">{activeTab?.name}</h2>
            <p className="text-sm text-app-muted">{activeTab?.courses.length || 0} courses in this year</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              aria-label="Import CSV file"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleImport}
            />
            <Button aria-label="Import CSV" onClick={() => fileInputRef.current?.click()}>
              Import CSV
            </Button>
            <Button aria-label="Export CSV" onClick={() => activeTab && exportCoursesToCSV(activeTab)}>
              Export CSV
            </Button>
            <Button aria-label="Add course" variant="primary" onClick={() => actions.addCourse(activeTab.id)}>
              Add Course
            </Button>
          </div>
        </section>
        {activeTab && (
          <CourseTable
            tab={activeTab}
            onAddCourse={actions.addCourse}
            onUpdateCourse={actions.updateCourse}
            onDeleteCourse={actions.deleteCourse}
          />
        )}
      </div>

      <Modal
        open={Boolean(pendingDeleteTab)}
        title="Delete school year?"
        confirmLabel="Delete"
        onClose={() => setDeleteTabId(null)}
        onConfirm={() => {
          actions.deleteTab(deleteTabId);
          setDeleteTabId(null);
        }}
      >
        Deleting {pendingDeleteTab?.name} removes all courses in that tab. This cannot be undone after the change is saved.
      </Modal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-toast-in rounded-md border border-app-border bg-app-surface px-4 py-3 text-sm font-semibold text-app-text shadow-xl">
          {toast}
        </div>
      )}
    </main>
  );
}
