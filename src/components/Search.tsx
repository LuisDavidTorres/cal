"use client";

import { useState, useMemo, ChangeEvent, useCallback, useRef } from "react";
import { List } from "react-virtualized"; // Import the List component from react-virtualized
import items from "../database/db"; // Your data

interface Item {
  name: string;
}

export default function Search() {
  // State for search query and filtered items
  const [query, setQuery] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  // Debounce timeout reference
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle search input with debounce
  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const searchQuery = e.target.value;
      setQuery(searchQuery);
    },
    []
  );

  // Filtering logic with debounce and sorting
  useMemo(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (query.trim() === "") {
        setFilteredItems(items); // If no query, show all items
        return;
      }

      const searchWords = query
        .toLowerCase()
        .split(" ")
        .filter((word) => word.trim() !== "");

      const filtered = items.filter((item: Item) =>
        searchWords.every((word) => item.name.toLowerCase().includes(word))
      );

      // Ordenamos los resultados alfabéticamente para que los similares queden juntos
      const sortedItems = filtered.sort((a : any, b : any) => a.name.localeCompare(b.name));

      setFilteredItems(sortedItems);
    }, 500); // Debounce delay of 500ms
  }, [query]);

  // The render function for each item in the list
  const renderRow = ({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => (
    <div key={key} style={style} className="p-2 border-b border-gray-300">
      {filteredItems[index].name}
    </div>
  );

  return (
    <div className="p-20">
      <input
        className="border border-gray-300 rounded-md p-2 w-full mb-4"
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Buscar por nombre"
      />
      <div style={{ height: 400, width: "100%" }}>
        {/* Use the List component from react-virtualized */}
        <List
          height={550} // The height of the visible list area
          rowCount={filteredItems.length} // Total number of items to render
          rowHeight={50} // The height of each row
          width={1350} // The width of the list container
          rowRenderer={renderRow} // Use the renderRow function to render each item
        />
      </div>
    </div>
  );
}
