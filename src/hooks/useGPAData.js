import { useCallback, useMemo, useReducer } from "react";

const YEAR_NAMES = ["Freshman Year", "Sophomore Year", "Junior Year", "Senior Year"];

function uuid() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createCourse(overrides = {}) {
  return {
    id: uuid(),
    name: "",
    credits: "",
    level: "Level 2",
    s1: "",
    s2: "",
    includeInGPA: true,
    ranked: true,
    ...overrides
  };
}

function createTab(name, order, courses = []) {
  return {
    id: uuid(),
    name,
    order,
    courses
  };
}

export function getDefaultTabs() {
  return [createTab("Freshman Year", 0, [createCourse({ name: "English I", level: "Level 2" })])];
}

function sortTabs(tabs) {
  return [...tabs].sort((a, b) => a.order - b.order).map((tab, index) => ({ ...tab, order: index }));
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_TABS": {
      const tabs = action.tabs?.length ? sortTabs(action.tabs) : getDefaultTabs();
      return { tabs, activeTabId: tabs[0]?.id || null };
    }
    case "ADD_TAB": {
      const name = YEAR_NAMES[state.tabs.length] || `School Year ${state.tabs.length + 1}`;
      const tab = createTab(name, state.tabs.length);
      return { tabs: [...state.tabs, tab], activeTabId: tab.id };
    }
    case "SET_ACTIVE_TAB":
      return { ...state, activeTabId: action.tabId };
    case "RENAME_TAB":
      return {
        ...state,
        tabs: state.tabs.map((tab) => (tab.id === action.tabId ? { ...tab, name: action.name.trim() || tab.name } : tab))
      };
    case "DUPLICATE_TAB": {
      const original = state.tabs.find((tab) => tab.id === action.tabId);
      if (!original) return state;
      const copy = createTab(`${original.name} Copy`, state.tabs.length, original.courses.map((course) => createCourse(course)));
      return { tabs: [...state.tabs, copy], activeTabId: copy.id };
    }
    case "DELETE_TAB": {
      if (state.tabs.length <= 1) return state;
      const tabs = sortTabs(state.tabs.filter((tab) => tab.id !== action.tabId));
      return {
        tabs,
        activeTabId: state.activeTabId === action.tabId ? tabs[0]?.id || null : state.activeTabId
      };
    }
    case "REORDER_TABS": {
      return { ...state, tabs: sortTabs(action.tabs) };
    }
    case "ADD_COURSE":
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.tabId ? { ...tab, courses: [...tab.courses, createCourse()] } : tab
        )
      };
    case "APPEND_COURSES":
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.tabId ? { ...tab, courses: [...tab.courses, ...action.courses] } : tab
        )
      };
    case "UPDATE_COURSE":
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.tabId
            ? {
                ...tab,
                courses: tab.courses.map((course) =>
                  course.id === action.courseId ? { ...course, [action.field]: action.value } : course
                )
              }
            : tab
        )
      };
    case "DELETE_COURSE":
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.tabId
            ? { ...tab, courses: tab.courses.filter((course) => course.id !== action.courseId) }
            : tab
        )
      };
    default:
      return state;
  }
}

export function useGPAData() {
  const [state, dispatch] = useReducer(reducer, { tabs: getDefaultTabs(), activeTabId: null }, (initial) => ({
    ...initial,
    activeTabId: initial.tabs[0].id
  }));

  const activeTab = useMemo(
    () => state.tabs.find((tab) => tab.id === state.activeTabId) || state.tabs[0],
    [state.tabs, state.activeTabId]
  );

  const actions = useMemo(
    () => ({
      setTabs: (tabs) => dispatch({ type: "SET_TABS", tabs }),
      addTab: () => dispatch({ type: "ADD_TAB" }),
      setActiveTab: (tabId) => dispatch({ type: "SET_ACTIVE_TAB", tabId }),
      renameTab: (tabId, name) => dispatch({ type: "RENAME_TAB", tabId, name }),
      duplicateTab: (tabId) => dispatch({ type: "DUPLICATE_TAB", tabId }),
      deleteTab: (tabId) => dispatch({ type: "DELETE_TAB", tabId }),
      reorderTabs: (tabs) => dispatch({ type: "REORDER_TABS", tabs }),
      addCourse: (tabId) => dispatch({ type: "ADD_COURSE", tabId }),
      appendCourses: (tabId, courses) => dispatch({ type: "APPEND_COURSES", tabId, courses }),
      updateCourse: (tabId, courseId, field, value) =>
        dispatch({ type: "UPDATE_COURSE", tabId, courseId, field, value }),
      deleteCourse: (tabId, courseId) => dispatch({ type: "DELETE_COURSE", tabId, courseId })
    }),
    []
  );

  const resetTabs = useCallback(() => dispatch({ type: "SET_TABS", tabs: getDefaultTabs() }), []);

  return { tabs: state.tabs, activeTab, activeTabId: state.activeTabId, actions, resetTabs, createCourse };
}
