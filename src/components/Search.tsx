"use client";

import { useState, useMemo, ChangeEvent, useCallback } from "react";
import items from "../database/db.js";

// Definimos el tipo correcto para los elementos
type Item = {
  name: string;
};

export default function Search() {
  // Estado para el valor de búsqueda
  const [query, setQuery] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  // Función que maneja el cambio en el campo de búsqueda con debounce
  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const searchQuery = e.target.value;
      setQuery(searchQuery);
    },
    []
  );

  // Debounce con un setTimeout
  useMemo(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() === "") {
        setFilteredItems(items); // Si no hay consulta, mostrar todos los elementos
        return;
      }

      // Convertimos la búsqueda a un array de palabras
      const searchWords = query
        .toLowerCase()
        .split(" ")
        .filter((word) => word.trim() !== "");

      // Filtramos los productos si alguna palabra está presente en el nombre
      const filtered = items.filter((item: Item) =>
        searchWords.every((word) => item.name.toLowerCase().includes(word))
      );

      setFilteredItems(filtered);
    }, 500); // Retraso de 500ms (ajustable)

    return () => clearTimeout(timeoutId); // Limpiar el timeout en caso de un nuevo cambio
  }, [query]);

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
