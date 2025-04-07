/** @format */

"use client";
import { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { RatingConfigObj } from "@/lib/ratingConfig";
import { Plus, GripVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleteon";
import { toast } from "sonner";

import AddParkDialog from "./AddParkDialog";

// Define the item interface
interface Item {
  name: string;
  id: number;
}

interface RatingItem extends Item {
  rating?: { value: number | null; color: string };
  uvi?: { value: number | null; color: string };
  psi?: { value: number | null; color: string };
  weather?: { value: string | null; color: string };
}

interface ParkForecast {
  uvi: { value: number | null; color: string } | null;
  psi: { value: number | null; color: string } | null;
  forecast: { value: string | null; color: string } | null;
  rating: { value: number | null; color: string } | null;
}

export const Display = () => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null); // Track the ID of the active item being dragged
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingConfigData, setRatingConfigData] = useState<{
    [key: string]: ParkForecast;
  }>({});

  // retrieve localstorage ratingConfigData
  const localRatingConfigData =
    typeof window !== "undefined"
      ? localStorage.getItem("ratingConfigData")
      : null;

  // retrieve localstorage parkList
  const localParkList =
    typeof window !== "undefined" ? localStorage.getItem("parkList") : null;

  const [parkList, setParkList] = useState<Item[]>(
    localParkList ? JSON.parse(localParkList) : []
  );

  useEffect(() => {
    setIsLoading(true);

    setItems(localParkList ? JSON.parse(localParkList) : []);

    const postData = async () => {
      const response = await fetch("/api/retrieveCurrentRating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ratingConfig: localRatingConfigData
            ? JSON.parse(localRatingConfigData)
            : RatingConfigObj,
        }),
      });

      return response.json();
    };

    postData().then((data) => {
      console.log(data);
      setRatingConfigData(data);

      if (!localParkList || JSON.parse(localParkList).length === 0) {
        // toast("No park selected", {
        //   className: cn(""),
        //   description: "Please add a park via the plus button",
        // });
      }

      if (localParkList) {
        const updatedItems = JSON.parse(localParkList).map((item: any) => {
          const parkData = data[item.name];
          return {
            ...item,
            rating: parkData?.rating,
            uvi: parkData?.uvi,
            psi: parkData?.psi,
            weather: parkData?.forecast,
          };
        });
        setItems(updatedItems);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      if (
        ratingConfigData &&
        Object.keys(ratingConfigData).length > 0 &&
        parkList
      ) {
        setIsLoading(true);

        const updatedItems = parkList.map((item: Item) => {
          const parkData = ratingConfigData[item.name];
          return {
            ...item,
            rating: parkData?.rating,
            uvi: parkData?.uvi,
            psi: parkData?.psi,
            weather: parkData?.forecast,
          };
        });
        setItems(updatedItems);
        setIsLoading(false);
      }

      if (!parkList || parkList.length === 0) {
        // toast("No park selected", {
        //   description: "Please add a park via the plus button",
        // });
      }
    }
  }, [parkList, isDialogOpen]);

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

        // Update local storage
        if (typeof window !== "undefined") {
          localStorage.setItem("parkList", JSON.stringify(updateItems));
        }
      }
    }
    setActiveId(null); // Reset active ID after drag ends
  }

  function handleDelete(idToDelete: number) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== idToDelete));

    // Update local storage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "parkList",
        JSON.stringify(items.filter((item) => item.id !== idToDelete))
      );
    }
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
                isLoading={isLoading}
              />
            ))}
          </ul>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <SortableItem
              item={items.find((item) => item.id === activeId)!}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      <AddParkDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        parkList={parkList}
        setParkList={setParkList}
      />
    </main>
  );
};

// Sortable Item Component
const SortableItem = ({
  item,
  onDelete,
  isLoading,
}: {
  item: RatingItem;
  onDelete: (id: number) => void;
  isLoading: boolean;
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
            {isLoading ? (
              <div className="space-y-2">
                <div className="text-sm flex">
                  2hr Forecast:{" "}
                  <span>
                    <Skeleton className="w-[50px] p-2 ml-2" />
                  </span>
                </div>

                <div className="text-sm flex">
                  PSI:{" "}
                  <span>
                    <Skeleton className="w-[50px] p-2 ml-2" />
                  </span>
                </div>

                <div className="text-sm flex">
                  UVI:{" "}
                  <span>
                    <Skeleton className="w-[50px] p-2 ml-2" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm">
                  2hr Forecast:{" "}
                  <span
                    className={cn(
                      "text-sm",
                      item.weather ? item.weather.color : "text-grey-500"
                    )}
                  >
                    {item.weather ? item.weather.value : "Null"}
                  </span>
                </p>
                <p className="text-sm">
                  PSI:{" "}
                  <span
                    className={cn(
                      "text-sm",
                      item.psi ? item.psi.color : "text-grey-500"
                    )}
                  >
                    {item.psi ? item.psi.value : "Null"}
                  </span>
                </p>
                <p className="text-sm">
                  UVI:{" "}
                  <span
                    className={cn(
                      "text-sm",
                      item.uvi ? item.uvi.color : "text-grey-500"
                    )}
                  >
                    {item.uvi ? item.uvi.value : "Null"}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <span>
                <Skeleton className="w-[50px] h-[30px]" />
              </span>
            ) : (
              <span
                className={`text-4xl ${item.rating ? item.rating.color : ""}`}
              >
                {item.rating ? item.rating.value : "Null"}
              </span>
            )}

            <span className="text-4xl text-yellow-500">★</span>
          </div>
        </div>
      </div>
      <GripVertical
        {...listeners} // Attach listeners to the drag handle
        className="text-gray-400 rounded cursor-move"
        aria-label="Drag"
        size={40}
      />
    </li>
  );
};
