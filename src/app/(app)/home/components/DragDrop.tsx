/** @format */

"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { Plus, GripVertical } from "lucide-react";

import { useState, useEffect } from "react";
import AddParkDialog from "./AddParkDialog";

// Define the item interface
interface Item {
  name: string;
  id: number;
  rating?: number;
  uvi?: {
    value: number;
    color: string;
  };
  psi?: {
    value: number;
    color: string;
  };
  weather?: {
    value: string;
    color: string;
  };
}

export const DragDrop = () => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null); // Track the ID of the active item being dragged
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems([
      { name: "Jurong Lake Garden", id: 1 },
      { name: "Paris Ris Park", id: 2 },
    ]);
  }, []);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    // Check if 'over' is not null before proceeding
    if (over) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems); // Update selected Items directly

        // Update id based on new order
        const updateItems = newItems.map((item, index) => ({
          ...item,
          id: index + 1, // Reassign row_id based on index
        }));
        setItems(updateItems); // Set the updated items with new ids
      }
    }
    setActiveId(null); // Reset active ID after drag ends
  }

  function handleDelete(idToDelete: number) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== idToDelete));
  }

  function handleAddPark(park: { name: string; region: string }) {
    setItems((prevItems) => [
      ...prevItems,
      { name: park.name, id: prevItems.length + 1 },
    ]);
  }

  return (
    <main className="p-4">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-24 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        <Plus size={24} />
      </button>
      <DndContext
        onDragStart={(event) => setActiveId(event.active.id)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((item) => item.name)}>
          <ul>
            {items.map((item) => (
              <SortableItem
                key={`${item.id}-${item.name}`}
                item={item}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <SortableItem
              item={items.find((item) => item.id === activeId)!}
              onDelete={handleDelete}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      <AddParkDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddPark={handleAddPark}
      />
    </main>
  );
};

// Sortable Item Component
const SortableItem = ({
  item,
  onDelete,
}: {
  item: Item;
  onDelete: (id: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      className={`mb-4 flex items-center transition-all duration-200 ease-in-out overflow-auto${
        isDragging ? " bg-white-100 shadow-lg" : " bg-white"
      }`}
    >
      <div className="p-4 border rounded-lg shadow-md w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-sm">
              2hr Weather Forecast:{" "}
              <span
                className={cn(
                  "text-sm",
                  item.weather ? item.weather.color : "text-green-500"
                )}
              >
                {item.weather ? item.weather.value : "Cloudy"}
              </span>
            </p>
            <p className="text-sm">
              PSI:{" "}
              <span
                className={cn(
                  "text-sm",
                  item.psi ? item.psi.color : "text-green-500"
                )}
              >
                {item.psi ? item.psi.value : "5"}
              </span>
            </p>
            <p className="text-sm">
              UVI:{" "}
              <span
                className={cn(
                  "text-sm",
                  item.uvi ? item.uvi.color : "text-green-500"
                )}
              >
                {item.uvi ? item.uvi.value : "5"}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-4xl ${
                item.rating === 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {item.rating ?? 5}
            </span>
            <span className="text-4xl text-yellow-500">★</span>
          </div>
        </div>
      </div>
      <GripVertical
        {...listeners} // Attach listeners to the drag handle
        className="text-gray-400 rounded cursor-move"
        aria-label="Drag"
        size={30}
      />
    </li>
  );
};
