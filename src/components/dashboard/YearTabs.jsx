import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState(tab.name);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  function commitRename() {
    setEditing(false);
    onRename(tab.id, draft);
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative shrink-0 ${isDragging ? "z-20 opacity-80" : ""}`}>
      <div
        className={`flex items-center gap-1 rounded-full border px-3 py-2 transition-all duration-150 ${
          active
            ? "border-app-accent bg-app-accent text-white"
            : "border-app-border bg-app-surface text-app-muted hover:border-app-accent hover:text-white"
        }`}
        onContextMenu={(event) => {
          event.preventDefault();
          setMenuOpen(true);
        }}
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
            className="cursor-grab text-sm font-semibold"
            onClick={() => onSelect(tab.id)}
            onDoubleClick={() => setEditing(true)}
            {...attributes}
            {...listeners}
          >
            {tab.name}
          </button>
        )}
        <button
          aria-label={`Open menu for ${tab.name}`}
          className="rounded-full px-1 text-sm transition-all duration-150 hover:bg-white/10"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ...
        </button>
      </div>
      {menuOpen && (
        <div className="absolute right-0 top-11 z-30 w-36 rounded-md border border-app-border bg-app-surface p-1 shadow-xl">
          <button
            aria-label={`Rename ${tab.name}`}
            className="block w-full rounded px-3 py-2 text-left text-sm text-app-text transition-all duration-150 hover:bg-white/5"
            onClick={() => {
              setMenuOpen(false);
              setEditing(true);
            }}
          >
            Rename
          </button>
          <button
            aria-label={`Duplicate ${tab.name}`}
            className="block w-full rounded px-3 py-2 text-left text-sm text-app-text transition-all duration-150 hover:bg-white/5"
            onClick={() => {
              setMenuOpen(false);
              onDuplicate(tab.id);
            }}
          >
            Duplicate
          </button>
          <button
            aria-label={`Delete ${tab.name}`}
            className="block w-full rounded px-3 py-2 text-left text-sm text-app-danger transition-all duration-150 hover:bg-app-danger/10"
            onClick={() => {
              setMenuOpen(false);
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
              disabled={disableAdd}
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
