"use client";

import { useState, useEffect } from "react";
import Symbol from "@/components/symbol";
import { useRouter } from "next/navigation";
import { quitarTildesEspaciosMinuscula } from "@/utils/textUtils";

export default function Diccionario() {
  const [refresh, setRefresh] = useState(0);
  const [symbols, setSymbols] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [category1Filter, setCategory1Filter] = useState("");
  const [category2Filter, setCategory2Filter] = useState("");
  const [symbolFilter, setSymbolFilter] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedSymbol, setEditedSymbol] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState({ es: "", eus: "" });
  const [categoryToDelete, setCategoryToDelete] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual

  const router = useRouter();

  // Funciones para cambiar de página
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredSymbols.length / 6) - 1));
  };

  // Dentro del componente Diccionario, modifica el useEffect principal:

  // Modifica el useEffect principal
  useEffect(() => {
    // Primero, tratamos de obtener los datos cacheados
    const cachedSymbols = localStorage.getItem("cachedOfficialSymbols");
    if (cachedSymbols) {
      const parsedSymbols = JSON.parse(cachedSymbols);
      setSymbols(parsedSymbols);
      setFilteredSymbols(parsedSymbols);
    }

    // Luego, realizamos el fetch a la API para obtener datos actualizados
    const fetchData = async () => {
      try {
        const response = await fetch("/api/symbols");
        const newData = await response.json();

        // Actualizamos el cache y los estados con los nuevos datos
        localStorage.setItem("cachedOfficialSymbols", JSON.stringify(newData));
        setSymbols(newData);
        setFilteredSymbols(newData);
      } catch (error) {
        console.error("Error fetching symbols:", error);
        // Si falla el fetch, ya tenemos los datos cacheados (si existían)
      }
    };

    fetchData();

    // Cargar categorías de forma paralela
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        setCategories(await response.json());
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [refresh]);

  useEffect(() => {
    // Filtrar palabras basado en los inputs
    console.log(symbols[1]);
    const filtered = symbols.filter((symbol) => {
      const matchesWord = quitarTildesEspaciosMinuscula(symbol.nameEs + " / " + symbol.nameEu).includes(
        quitarTildesEspaciosMinuscula(symbolFilter)
      );
      const matchesCategory1 =
        category1Filter === "" ||
        symbol.categories.some((cat) =>
          quitarTildesEspaciosMinuscula(cat.Category.nameEs + " / " + cat.Category.nameEu).includes(
            quitarTildesEspaciosMinuscula(category1Filter)
          )
        );
      const matchesCategory2 =
        category2Filter === "" ||
        symbol.categories.some((cat) =>
          quitarTildesEspaciosMinuscula(cat.Category.nameEs + " / " + cat.Category.nameEu).includes(
            quitarTildesEspaciosMinuscula(category2Filter)
          )
        );
      return matchesWord && matchesCategory1 && matchesCategory2;
    });
    setFilteredSymbols(filtered);
  }, [symbolFilter, category1Filter, category2Filter, symbols]);

  const openModal = (symbol) => {
    setSelectedSymbol(symbol);
    setEditedSymbol({ ...symbol });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSymbol(null);
    setEditedSymbol(null);
    setNewCategory("");
  };

  // Función para redirigir a /generador y guardar en localStorage el JSON del símbolo
  const handleRedirectToGenerador = () => {
    if (selectedSymbol) {
      if (typeof window !== "undefined") {
        const existingDataString = localStorage.getItem("targetSymbol");
        let existingData = {
          circles: [],
          lines: [],
          rectangles: [],
          arcs: [],
          curves: [],
        };

        if (existingDataString) {
          try {
            existingData = JSON.parse(existingDataString);
          } catch (e) {
            console.error("Error parsing existing targetSymbol:", e);
          }
        }

        // Fusionar los datos nuevos con los existentes
        const newData = selectedSymbol.jsonData;

        const mergedData = {
          circles: [...(existingData.circles || []), ...(newData.circles || [])],
          lines: [...(existingData.lines || []), ...(newData.lines || [])],
          rectangles: [...(existingData.rectangles || []), ...(newData.rectangles || [])],
          arcs: [...(existingData.arcs || []), ...(newData.arcs || [])],
          curves: [...(existingData.curves || []), ...(newData.curves || [])],
        };

        localStorage.setItem("targetSymbol", JSON.stringify(mergedData));
      }

      router.push("/generador");
    }
  };

  const handleEdit = async () => {
    const respuesta = await fetch(`/api/symbols/${editedSymbol.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        names: { nameEs: editedSymbol.nameEs, nameEu: editedSymbol.nameEu },
        symbol: editedSymbol.jsonData,
      }),
    });
    const mensaje = await respuesta.json();
    console.log(mensaje);
    if (mensaje && mensaje.error) {
      alert("Error al guardar: " + mensaje.error);
    }
    try {
      const respuesta = await fetch(`/api/symbols/${editedSymbol.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const mensaje = await respuesta.json();
      console.log(mensaje);
      setEditedSymbol(mensaje);
      setRefresh(refresh + 1);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    console.log(editedSymbol.id);
    try {
      const respuesta = await fetch(`/api/symbols/${editedSymbol.id}`, {
        method: "DELETE",
      });
      const mensaje = await respuesta.json();
      console.log(mensaje);
      if (mensaje && mensaje.error) {
        alert("Error al eliminar: " + mensaje.error);
      } else {
        closeModal();
        setRefresh(refresh + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryId = (categoryName) => {
    var categoryId = -1;
    for (let i = 0; i < categories.length; i++) {
      const element = categories[i].nameEs + " / " + categories[i].nameEu;
      if (element === categoryName) {
        categoryId = categories[i].id;
        break;
      }
    }
    return categoryId;
  };

  const handleAddCategory = async () => {
    console.log(editedSymbol);
    const catId = getCategoryId(newCategory);
    console.log(catId);
    // Añadir categoría al símbolo
    try {
      const respuesta = await fetch("/api/categorysymbol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbolId: editedSymbol.id,
          categoryId: catId,
        }),
      });
      const mensaje = await respuesta.json();
      console.log(mensaje);
      if (mensaje && mensaje.error) {
        alert("Error al guardar: " + mensaje.error);
      } else {
        console.log("refrescando add");
        try {
          const respuesta = await fetch(`/api/symbols/${editedSymbol.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const mensaje = await respuesta.json();
          console.log(mensaje);
          setEditedSymbol(mensaje);
        } catch (error) {
          console.log(error);
        }
        setRefresh(refresh + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveCategory = async (categoryToRemove) => {
    console.log(categoryToRemove);
    try {
      const respuesta = await fetch(`/api/categorysymbol/${categoryToRemove}`, {
        method: "DELETE",
      });
      const mensaje = await respuesta.json();
      console.log(mensaje);
      if (mensaje && mensaje.error) {
        alert("Error al eliminar: " + mensaje.error);
      } else {
        console.log("refrescando remove");
        try {
          const respuesta = await fetch(`/api/symbols/${editedSymbol.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const mensaje = await respuesta.json();
          console.log(mensaje);
          setEditedSymbol(mensaje);
        } catch (error) {
          console.log(error);
        }
        setRefresh(refresh + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openNewCategoryModal = () => {
    setIsNewCategoryModalOpen(true);
  };

  const closeNewCategoryModal = () => {
    setIsNewCategoryModalOpen(false);
    setNewCategoryName({ es: "", eus: "" });
  };

  const handleAddNewCategory = async () => {
    if (newCategoryName.es && newCategoryName.eus) {
      // Añadir categoría
      try {
        const respuesta = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            names: { nameEs: newCategoryName.es, nameEu: newCategoryName.eus },
          }),
        });
        const mensaje = await respuesta.json();
        console.log(mensaje);
        if (mensaje && mensaje.error) {
          alert("Error al guardar: " + mensaje.error);
        } else {
          setRefresh(refresh + 1);
        }
      } catch (error) {
        console.log(error);
      }
      closeNewCategoryModal();
    }
  };

  const openDeleteCategoryModal = () => {
    setIsDeleteCategoryModalOpen(true);
    setCategoryToDelete("");
  };

  const closeDeleteCategoryModal = () => {
    setIsDeleteCategoryModalOpen(false);
    setCategoryToDelete("");
  };

  const handleDeleteCategory = async () => {
    console.log(categoryToDelete);
    try {
      const respuesta = await fetch(`/api/categories/${categoryToDelete}`, {
        method: "DELETE",
      });
      const mensaje = await respuesta.json();
      console.log(mensaje);
      if (mensaje && mensaje.error) {
        alert("Error al eliminar: " + mensaje.error);
      } else {
        try {
          const respuesta = await fetch(`/api/symbols/${editedSymbol.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const mensaje = await respuesta.json();
          console.log(mensaje);
          setEditedSymbol(mensaje);
        } catch (error) {
          console.log(error);
        }
        setRefresh(refresh + 1);
      }
    } catch (error) {
      console.log(error);
    }
    closeDeleteCategoryModal();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Panel izquierdo */}
      <div className="w-1/3 p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-2">Filtros</h2>

        {/* Input de símbolo */}
        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
          Palabra:
        </label>
        <input
          list="symbolSuggestions"
          type="text"
          id="symbol"
          name="symbol"
          placeholder="Busca una palabra..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-slate-500 focus:border-slate-500"
          value={symbolFilter}
          onChange={(e) => setSymbolFilter(e.target.value)}
          autoComplete="off"
        />
        <datalist id="symbolSuggestions">
          {symbols.map((symbol, index) => (
            <option key={index} value={`${symbol.nameEs} / ${symbol.nameEu}`} />
          ))}
        </datalist>

        {/* Input de categoría 1 */}
        <label htmlFor="category1" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría 1:
        </label>
        <input
          list="category1Suggestions"
          type="text"
          id="category1"
          name="category1"
          placeholder="Escribe una categoría..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-slate-500 focus:border-slate-500"
          value={category1Filter}
          onChange={(e) => setCategory1Filter(e.target.value)}
          autoComplete="off"
        />
        <datalist id="category1Suggestions">
          {categories.map((category, index) => (
            <option key={index} value={`${category.nameEs} / ${category.nameEu}`} />
          ))}
        </datalist>

        {/* Input de categoría 2 */}
        <label htmlFor="category2" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría 2:
        </label>
        <input
          list="category2Suggestions"
          type="text"
          id="category2"
          name="category2"
          placeholder="Escribe una categoría..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-slate-500 focus:border-slate-500"
          value={category2Filter}
          onChange={(e) => setCategory2Filter(e.target.value)}
          autoComplete="off"
        />
        <datalist id="category2Suggestions">
          {categories.map((category, index) => (
            <option key={index} value={`${category.nameEs} / ${category.nameEu}`} />
          ))}
        </datalist>
      </div>

      {/* Panel derecho */}
      <div className="w-2/3 p-4">
        <h2 className="text-xl font-bold mb-4">Símbolos</h2>

        {/* Símbolos con Paginación */}
        <div className="grid grid-cols-3 gap-2">
          {filteredSymbols
            .slice(currentPage * 6, currentPage * 6 + 6) // Mostrar solo 6 símbolos por página
            .map((symbol, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center h-24 bg-slate-200 text-gray-800 font-semibold rounded-md shadow cursor-pointer hover:bg-slate-300 transition-colors p-1 gap-1"
                onClick={() => openModal(symbol)}
              >
                <p className="text-xs">{`${symbol.nameEs} / ${symbol.nameEu}`}</p>
                <Symbol className="flex-1" symbol={symbol.jsonData}></Symbol>
              </div>
            ))}
        </div>

        {/* Controles de Paginación */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            Anterior
          </button>
          <p className="text-sm font-semibold">
            Página {currentPage + 1} de {Math.ceil(filteredSymbols.length / 6)}
          </p>
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
            onClick={nextPage}
            disabled={currentPage === Math.ceil(filteredSymbols.length / 6) - 1}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de edición de símbolo */}
      {isModalOpen && selectedSymbol && editedSymbol && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
            {/* Contenedor Flex que divide en dos columnas */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Panel Izquierdo: muestra el símbolo y permite redirigir a /generador al hacer click */}
              <div
                className="w-1/2 p-4 flex flex-col items-center border-r border-gray-300 cursor-pointer overflow-y-auto min-h-0 h-full"
                onClick={handleRedirectToGenerador}
              >
                <div className="w-full h-full flex-1 min-h-0 overflow-hidden">
                  <Symbol className="w-full h-full object-contain" symbol={selectedSymbol.jsonData} />
                </div>
                <p className="text-xs mt-2">{`${selectedSymbol.nameEs} / ${selectedSymbol.nameEu}`}</p>
              </div>
              {/* Panel Derecho: formulario de edición */}
              <div className="w-1/2 p-4 overflow-y-auto">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold mb-4">Editar Símbolo</h3>
                  <div className="mb-4">
                    <label htmlFor="editNameEs" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre (Español):
                    </label>
                    <input
                      type="text"
                      id="editNameEs"
                      value={editedSymbol.nameEs}
                      onChange={(e) => setEditedSymbol({ ...editedSymbol, nameEs: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="editnameEu" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre (Euskera):
                    </label>
                    <input
                      type="text"
                      id="editnameEu"
                      value={editedSymbol.nameEu}
                      onChange={(e) => setEditedSymbol({ ...editedSymbol, nameEu: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categorías:</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedSymbol.categories.map((category, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                        >
                          {`${category.Category.nameEs} / ${category.Category.nameEu}`}
                          <button
                            onClick={() => handleRemoveCategory(category.id)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex">
                        <input
                          type="text"
                          list="newCategorySuggestions"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Selecciona o escribe una categoría"
                          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-slate-500 focus:border-slate-500"
                          autoComplete="off"
                        />
                        <button
                          onClick={handleAddCategory}
                          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
                        >
                          Añadir
                        </button>
                      </div>
                      <datalist id="newCategorySuggestions">
                        {categories.map((category, index) => (
                          <option key={index} value={`${category.nameEs} / ${category.nameEu}`} />
                        ))}
                      </datalist>
                    </div>
                    <button
                      onClick={openNewCategoryModal}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors w-full"
                    >
                      Crear Nueva Categoría
                    </button>
                    <button
                      onClick={openDeleteCategoryModal}
                      className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors w-full"
                    >
                      Eliminar Categoría
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={handleEdit}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Borrar
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear nueva categoría */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Crear Nueva Categoría</h3>
              <div className="mb-4">
                <label htmlFor="newCategoryEs" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre (Español):
                </label>
                <input
                  type="text"
                  id="newCategoryEs"
                  value={newCategoryName.es}
                  onChange={(e) => setNewCategoryName({ ...newCategoryName, es: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newCategoryEus" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre (Euskera):
                </label>
                <input
                  type="text"
                  id="newCategoryEus"
                  value={newCategoryName.eus}
                  onChange={(e) => setNewCategoryName({ ...newCategoryName, eus: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleAddNewCategory}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Crear
                </button>
                <button
                  onClick={closeNewCategoryModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para eliminar categoría */}
      {isDeleteCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Eliminar Categoría</h3>
              <div className="mb-4">
                <label htmlFor="deleteCategorySelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Selecciona la categoría a eliminar:
                </label>
                <select
                  id="deleteCategorySelect"
                  value={categoryToDelete}
                  onChange={(e) => setCategoryToDelete(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.id}>
                      {category.nameEs} / {category.nameEu}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleDeleteCategory}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  disabled={!categoryToDelete}
                >
                  Eliminar
                </button>
                <button
                  onClick={closeDeleteCategoryModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
