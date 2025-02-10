import { useEffect, useState, useMemo, ChangeEvent, useCallback } from "react";
import items from "../database/db.js";

export default function Search() {
  const [query, setQuery] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<{ name: string }[]>(items);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  // Debounce con un setTimeout
  const debouncedSearch = useMemo(() => {
    return () => {
      if (query.trim() === "") {
        setFilteredItems(items);
        return;
      }

      const searchWords = query
        .toLowerCase()
        .split(" ")
        .filter((word) => word.trim() !== "");

      const filtered = items.filter((item: any) =>
        searchWords.every((word) => item.name.toLowerCase().includes(word))
      );

      setFilteredItems(filtered);
    };
  }, [query]);

  // Ejecutar `debouncedSearch` después de un delay
  useEffect(() => {
    const timeoutId = setTimeout(() => debouncedSearch(), 500);
    return () => clearTimeout(timeoutId);
  }, [debouncedSearch]);

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Buscar por nombre (puedes separar palabras)"
        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
      />
      <ul>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => <li key={index}>{item.name}</li>)
        ) : (
          <li>No se encontraron resultados</li>
        )}
      </ul>
    </div>
  );
}
