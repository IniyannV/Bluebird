import { useEffect, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableTab({ tab, active, onSelect, onRename, onDuplicate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [menu, setMenu] = useState(null);
  const [draft, setDraft] = useState(tab.name);
  const menuRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const longPressStartRef = useRef(null);
  const longPressTriggeredRef = useRef(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const menuOpen = Boolean(menu);

  function commitRename() {
    setEditing(false);
    onRename(tab.id, draft);
  }

  function closeMenu() {
    setMenu(null);
  }

  function clearLongPressTimer() {
    if (!longPressTimerRef.current) return;
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }

  function openMenuAt(x, y) {
    const menuWidth = 144;
    const menuHeight = 124;
    setMenu({
      x: Math.max(8, Math.min(x, window.innerWidth - menuWidth - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - menuHeight - 8))
    });
  }

  function openContextMenu(event) {
    event.preventDefault();
    openMenuAt(event.clientX, event.clientY);
  }

  function handleTouchStart(event) {
    if (editing || event.touches.length !== 1) return;

    const touch = event.touches[0];
    longPressTriggeredRef.current = false;
    longPressStartRef.current = { x: touch.clientX, y: touch.clientY };
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      openMenuAt(touch.clientX, touch.clientY);
    }, 550);
  }

  function handleTouchMove(event) {
    const touch = event.touches[0];
    const start = longPressStartRef.current;
    if (!touch || !start) return;

    const distance = Math.hypot(touch.clientX - start.x, touch.clientY - start.y);
    if (distance > 10) clearLongPressTimer();
  }

  function handleTouchEnd(event) {
    clearLongPressTimer();
    longPressStartRef.current = null;
    if (!longPressTriggeredRef.current) return;

    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event) {
      if (menuRef.current?.contains(event.target)) return;
      closeMenu();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [menuOpen]);

  useEffect(() => () => clearLongPressTimer(), []);

  const menuStyle = { left: menu?.x, top: menu?.y };

  return (
    <div ref={setNodeRef} style={style} className={`relative shrink-0 ${isDragging ? "z-20 opacity-80" : ""}`}>
      <div
        className={`flex items-center gap-1 rounded-full border px-3 py-2 transition-all duration-150 ${
          active
            ? "border-app-accent bg-app-accent text-white"
            : "border-app-border bg-app-surface text-app-muted hover:border-app-accent hover:text-white"
        }`}
        onContextMenu={openContextMenu}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {editing ? (
          <input
            aria-label={`Rename ${tab.name}`}
            value={draft}
            autoFocus
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitRename();
              if (event.key === "Escape") setEditing(false);
            }}
            className="w-32 rounded bg-app-bg px-2 py-1 text-sm text-app-text outline-none focus:shadow-focus"
          />
        ) : (
          <button
            aria-label={`Open ${tab.name}`}
            className="cursor-grab select-none text-sm font-semibold"
            onClick={(event) => {
              if (longPressTriggeredRef.current) {
                event.preventDefault();
                event.stopPropagation();
                longPressTriggeredRef.current = false;
                return;
              }
              onSelect(tab.id);
            }}
            onDoubleClick={() => setEditing(true)}
            {...attributes}
            {...listeners}
          >
            {tab.name}
          </button>
        )}
      </div>
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed z-30 w-36 rounded-md border border-app-border bg-app-surface p-1 shadow-xl"
          style={menuStyle}
        >
          <button
            aria-label={`Rename ${tab.name}`}
            className="block w-full rounded px-3 py-2 text-left text-sm text-app-text transition-all duration-150 hover:bg-white/5"
            onClick={() => {
              closeMenu();
              setEditing(true);
            }}
          >
            Rename
          </button>
          <button
            aria-label={`Duplicate ${tab.name}`}
            className="block w-full rounded px-3 py-2 text-left text-sm text-app-text transition-all duration-150 hover:bg-white/5"
            onClick={() => {
              closeMenu();
              onDuplicate(tab.id);
            }}
          >
            Duplicate
          </button>
          <button
            aria-label={`Delete ${tab.name}`}
            className="block w-full rounded px-3 py-2 text-left text-sm text-app-danger transition-all duration-150 hover:bg-app-danger/10"
            onClick={() => {
              closeMenu();
              onDelete(tab.id);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function YearTabs({ tabs, activeTabId, disableAdd, onSelect, onAdd, onRename, onDuplicate, onDelete, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
    const newIndex = tabs.findIndex((tab) => tab.id === over.id);
    onReorder(arrayMove(tabs, oldIndex, newIndex).map((tab, index) => ({ ...tab, order: index })));
  }

  return (
    <div className="overflow-x-auto pb-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tabs.map((tab) => tab.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex min-w-max items-center gap-2">
            {tabs.map((tab) => (
              <SortableTab
                key={tab.id}
                tab={tab}
                active={tab.id === activeTabId}
                onSelect={onSelect}
                onRename={onRename}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            ))}
            <button
              aria-label="Add school year"
              aria-disabled={disableAdd}
              onClick={onAdd}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-app-border bg-app-surface text-lg font-bold text-app-muted transition-all duration-150 hover:border-app-accent hover:text-white ${
                disableAdd ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              +
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
