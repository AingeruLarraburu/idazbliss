"use client"; // Esto asegura que el componente solo se ejecute en el cliente

import { useState } from "react";

const AutoCompleteInput = ({ suggestions }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // Manejar el cambio en el input
  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    // Filtrar las sugerencias según el valor del input
    if (value.length > 0) {
      const filtered = suggestions
        .filter((suggestion) => suggestion.toLowerCase().includes(value.toLowerCase())) // Filtra según el texto
        .slice(0, 5); // Limita a las 5 primeras coincidencias

      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  // Manejar la selección de una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]); // Ocultar sugerencias después de seleccionar
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="p-2 border rounded"
        placeholder="Escribe algo..."
      />
      {filteredSuggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 border bg-white rounded max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;
