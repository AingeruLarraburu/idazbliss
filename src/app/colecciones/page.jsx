"use client";
//Filtros Palabra Undefined / Undefined

import { useState, useEffect } from "react";
import Symbol from "@/components/symbol";
import { quitarTildesEspaciosMinuscula } from "@/utils/textUtils";

export default function Colecciones() {
  const [category1FilterSymbol, setCategory1FilterSymbol] = useState("");
  const [category2FilterSymbol, setCategory2FilterSymbol] = useState("");
  const [diccionarios, setDiccionarios] = useState([{ id: 0, name: "Oficial" }]);
  const [diccionario, setDiccionario] = useState(0);
  const [symbolFilterSymbol, setSymbolFilterSymbol] = useState("");
  const [filteredSymbolsSymbol, setFilteredSymbolsSymbol] = useState([]);
  const [categories, setCategories] = useState([]);

  const [symbolFilterCollection, setSymbolFilterCollection] = useState("");
  const [category1FilterCollection, setCategory1FilterCollection] = useState("");
  const [category2FilterCollection, setCategory2FilterCollection] = useState("");
  const [filteredSymbolsCollection, setFilteredSymbolsCollection] = useState([]);
  const [symbolsCollection, setSymbolsCollection] = useState([]);

  const [bigItem, setBigItem] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [collections, setCollections] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [symbols, setSymbols] = useState([]);
  const [isViewRemoveModal, setIsViewRemoveModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSymbolModalOpen, setIsAddSymbolModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [currentAddPage, setCurrentAddPage] = useState(0); // Estado para la página actual
  const [currentCollectionPage, setCurrentCollectionPage] = useState(0); // Estado para la página actual

  const cambiarDiccionario = (diccionario) => {
    console.log(diccionario);
    setDiccionario(Number(diccionario));
  };

  const prevAddPage = () => {
    setCurrentAddPage((prev) => Math.max(prev - 1, 0));
  };

  const nextAddPage = () => {
    setCurrentAddPage((prev) => Math.min(prev + 1, Math.ceil(filteredSymbolsSymbol.length / 6) - 1));
  };

  const prevCollectionPage = () => {
    setCurrentCollectionPage((prev) => Math.max(prev - 1, 0));
  };

  const nextCollectionPage = () => {
    setCurrentCollectionPage((prev) => Math.min(prev + 1, Math.ceil(filteredSymbolsCollection.length / 6) - 1));
  };

  // Fetch collections and symbols
  useEffect(() => {
    // Primero, tratamos de obtener los datos cacheados
    const cachedSymbols = localStorage.getItem("cachedOfficialSymbols");
    if (cachedSymbols) {
      const parsedSymbols = JSON.parse(cachedSymbols);
      setSymbols(parsedSymbols);
      setFilteredSymbolsSymbol(parsedSymbols);
    }
    // Luego, realizamos el fetch a la API para obtener datos actualizados
    const fetchData = async () => {
      try {
        const response = await fetch("/api/symbols");
        const newData = await response.json();

        // Actualizamos el cache y los estados con los nuevos datos
        localStorage.setItem("cachedOfficialSymbols", JSON.stringify(newData));
        setSymbols(newData);
        const filtrados = newData.filter((item) => item.dictionaryId === diccionario);
        setFilteredSymbolsSymbol(filtrados);
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
    // Cargar diccionarios:
    // Tratamos de obtenerlo de la cache
    const fetchDictionaries = async () => {
      try {
        const response = await fetch("/api/diccionarios");
        const dics = await response.json();
        setDiccionarios(dics);
      } catch (error) {
        console.error("Error fetching dictionaries:", error);
      }
    };
    fetchDictionaries();
    async function fetchCollections() {
      try {
        const resCols = await fetch("/api/colecciones");
        const cols = await resCols.json();
        setCollections(cols);
        console.log("Collections", cols);
        const symbolArray = cols[selectedIndex]?.items?.length ? cols[selectedIndex].items : [];

        console.log("SymbolArray", symbolArray);
        setSymbolsCollection(symbolArray);
        setFilteredSymbolsCollection(symbolArray);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchCollections();
  }, [refresh]);

  useEffect(() => {
    // Filtrar palabras basado en los inputs
    const filtered = symbols.filter((symbol) => {
      const matchesDictionary = symbol.dictionaryId === diccionarios[diccionario].id;

      const matchesWord = quitarTildesEspaciosMinuscula(symbol.nameEs + " / " + symbol.nameEu).includes(
        quitarTildesEspaciosMinuscula(symbolFilterSymbol)
      );

      const matchesCategory1 =
        category1FilterSymbol === "" ||
        symbol.categories.some((cat) =>
          quitarTildesEspaciosMinuscula(cat.Category.nameEs + " / " + cat.Category.nameEu).includes(
            quitarTildesEspaciosMinuscula(category1FilterSymbol)
          )
        );

      const matchesCategory2 =
        category2FilterSymbol === "" ||
        symbol.categories.some((cat) =>
          quitarTildesEspaciosMinuscula(cat.Category.nameEs + " / " + cat.Category.nameEu).includes(
            quitarTildesEspaciosMinuscula(category2FilterSymbol)
          )
        );

      return matchesDictionary && matchesWord && matchesCategory1 && matchesCategory2;
    });

    setFilteredSymbolsSymbol(filtered);
  }, [symbolFilterSymbol, category1FilterSymbol, category2FilterSymbol, symbols, diccionario]);

  useEffect(() => {
    // Filtrar palabras basado en los inputs
    const symbolArray = collections?.[selectedIndex]?.items?.length ? collections[selectedIndex].items : [];

    setSymbolsCollection(symbolArray);
    const filtered = symbolArray.filter((item) => {
      const matchesWord = quitarTildesEspaciosMinuscula(item.Symbol.nameEs + " / " + item.Symbol.nameEu).includes(
        quitarTildesEspaciosMinuscula(symbolFilterCollection)
      );

      const matchesCategory1 =
        category1FilterCollection === "" ||
        item.Symbol.categories.some((cat) =>
          quitarTildesEspaciosMinuscula(cat.Category.nameEs + " / " + cat.Category.nameEu).includes(
            quitarTildesEspaciosMinuscula(category1FilterCollection)
          )
        );

      const matchesCategory2 =
        category2FilterCollection === "" ||
        item.Symbol.categories.some((cat) =>
          quitarTildesEspaciosMinuscula(cat.Category.nameEs + " / " + cat.Category.nameEu).includes(
            quitarTildesEspaciosMinuscula(category2FilterCollection)
          )
        );

      return matchesWord && matchesCategory1 && matchesCategory2;
    });

    setFilteredSymbolsCollection(filtered);
  }, [symbolFilterCollection, category1FilterCollection, category2FilterCollection, selectedIndex]);

  const handleSelect = (idx) => setSelectedIndex(Number(idx));
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const handleDelete = async () => {
    const idToDelete = collections[selectedIndex]?.id ?? -1;
    if (idToDelete === -1) {
      alert("Nada que Eliminar");
      closeUpdateModal();
      return;
    }
    try {
      const respuesta = await fetch(`/api/colecciones/${idToDelete}`, { method: "DELETE" });
      const mensaje = await respuesta.json();
      console.log(mensaje);
      if (mensaje && mensaje.error) {
        alert("Error al eliminar: " + mensaje.error);
      }
      try {
        const resCols = await fetch("/api/colecciones");
        const cols = await resCols.json();
        setCollections(cols);
      } catch (error) {
        console.error("Error fetching data", error);
      }
      setSelectedIndex(0);
    } catch (e) {
      console.error(e);
    }
    closeDeleteModal();
    setRefresh(refresh + 1);
  };

  const openViewRemoveModal = (item) => {
    setBigItem(item);
    console.log("Abriendo modal de eliminar simbolo", item);
    setIsViewRemoveModal(true);
  };
  const closeViewRemoveModal = () => setIsViewRemoveModal(false);
  const handleViewRemove = async (id) => {
    console.log("Borrando de la coleccion el simbolo", bigItem.Symbol.nameEs);
    try {
      const respuesta = await fetch(`/api/collectionsymbol/${id}`, {
        method: "DELETE",
      });
      const mensaje = await respuesta.json();
      console.log(mensaje);
      if (mensaje && mensaje.error) {
        alert("Error al eliminar: " + mensaje.error);
      }
    } catch (error) {
      console.log(error);
    }
    closeViewRemoveModal();
    setRefresh(refresh + 1);
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewCollectionName("");
  };
  const handleAdd = async () => {
    if (!newCollectionName.trim()) return;
    try {
      const respuesta = await fetch(`/api/colecciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollectionName }),
      });
      const mensaje = await respuesta.json();
      console.log(mensaje);
      if (mensaje && mensaje.error) {
        alert("Error al Añadir: " + mensaje.error);
      }
      try {
        const resCols = await fetch("/api/colecciones");
        const cols = await resCols.json();
        setCollections(cols);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    } catch (e) {
      console.error(e);
    }
    closeAddModal();
  };

  const openUpdateModal = () => {
    setNewCollectionName(collections[selectedIndex]?.name || "");
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setNewCollectionName("");
  };
  const handleUpdate = async () => {
    const idToUpdate = collections[selectedIndex]?.id ?? -1;
    if (idToUpdate === -1) {
      alert("Nada que modificar");
      closeUpdateModal();
      return;
    }
    const nameToUpdate = collections[selectedIndex].name;
    if (!newCollectionName.trim()) return;
    try {
      await fetch(`/api/colecciones/${idToUpdate}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollectionName }),
      });
      try {
        const resCols = await fetch("/api/colecciones");
        const cols = await resCols.json();
        setCollections(cols);
        setSelectedIndex(cols.length - 1);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    } catch (e) {
      console.error(e);
    }
    closeUpdateModal();
  };

  const openAddSymbolModal = () => setIsAddSymbolModalOpen(true);
  const closeAddSymbolModal = () => setIsAddSymbolModalOpen(false);
  const handleAddSymbolModal = async () => {
    closeAddSymbolModal();
  };

  const handleAddSymbol = async (symbol) => {
    console.log("Symbol to add:", symbol.nameEs);
    const colId = collections[selectedIndex]?.id ?? -1;
    if (colId === -1) {
      alert("Nada donde añadir");
      closeUpdateModal();
      return;
    }
    try {
      const respuesta = await fetch("/api/collectionsymbol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbolId: symbol.id,
          collectionId: colId,
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
    closeAddSymbolModal();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel: Collections */}
      <div className="w-1/3 p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-2">Colecciones</h2>
        <label htmlFor="collectionSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Selecciona una colección:
        </label>
        <div className="flex items-center gap-2 mb-4">
          <select
            id="collectionSelect"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
            value={selectedIndex}
            onChange={(e) => handleSelect(e.target.value)}
          >
            {collections.map((col, idx) => (
              <option key={col.id} value={idx}>
                {col.name}
              </option>
            ))}
          </select>
          <button
            onClick={openDeleteModal}
            className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 transition-colors"
            title="Eliminar colección actual"
          >
            Eliminar
          </button>
        </div>
        <button
          onClick={openUpdateModal}
          className="bg-blue-500 text-white px-4 py-2 mb-3 rounded-md hover:bg-blue-600 transition-colors w-full"
        >
          Modificar colección
        </button>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full"
        >
          Añadir colección
        </button>
        <h2 className="text-xl font-bold my-2">Símbolos de la colección</h2>
        <button
          onClick={openAddSymbolModal}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full mb-2"
        >
          Añadir Símbolo
        </button>
        <h2 className="text-xl font-bold my-2 border-t border-gray-300 pt-2">Filtros</h2>

        {/* Input de símbolo */}
        <label htmlFor="symbolCollection" className="block text-sm font-medium text-gray-700 mb-1">
          Palabra:
        </label>
        <input
          list="symbolSuggestionsCollection"
          type="text"
          id="symbolCollection"
          name="symbolCollection"
          placeholder="Busca una palabra..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-slate-500 focus:border-slate-500"
          value={symbolFilterCollection}
          onChange={(e) => {
            setSymbolFilterCollection(e.target.value);
            setCurrentCollectionPage(0);
          }}
          autoComplete="off"
        />
        <datalist id="symbolSuggestionsCollection">
          {symbolsCollection.map((item, index) => (
            <option key={index} value={`${item.Symbol.nameEs} / ${item.Symbol.nameEu}`} />
          ))}
        </datalist>

        {/* Input de categoría 1 */}
        <label htmlFor="category1Collection" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría 1:
        </label>
        <input
          list="category1SuggestionsCollection"
          type="text"
          id="category1Collection"
          name="category1Collection"
          placeholder="Escribe una categoría..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-slate-500 focus:border-slate-500"
          value={category1FilterCollection}
          onChange={(e) => {
            setCategory1FilterCollection(e.target.value);
            setCurrentCollectionPage(0);
          }}
          autoComplete="off"
        />
        <datalist id="category1SuggestionsCollection">
          {categories.map((category, index) => (
            <option key={index} value={`${category.nameEs} / ${category.nameEu}`} />
          ))}
        </datalist>

        {/* Input de categoría 2 */}
        <label htmlFor="category2Collection" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría 2:
        </label>
        <input
          list="category2SuggestionsCollection"
          type="text"
          id="category2Collection"
          name="category2Collection"
          placeholder="Escribe una categoría..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-slate-500 focus:border-slate-500"
          value={category2FilterCollection}
          onChange={(e) => {
            setCategory2FilterCollection(e.target.value);
            setCurrentCollectionPage(0);
          }}
          autoComplete="off"
        />
        <datalist id="category2SuggestionsCollection">
          {categories.map((category, index) => (
            <option key={index} value={`${category.nameEs} / ${category.nameEu}`} />
          ))}
        </datalist>

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
              <p className="mb-6">
                ¿Seguro que deseas eliminar la colección <strong>{collections[selectedIndex]?.name}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Añadir colección</h3>
              <input
                type="text"
                placeholder="Nombre de la colección"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-slate-500 focus:border-slate-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeAddModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Añadir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Modificar colección</h3>
              <input
                type="text"
                placeholder="Nombre de la colección"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-slate-500 focus:border-slate-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeUpdateModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Modificar
                </button>
              </div>
            </div>
          </div>
        )}
        {isAddSymbolModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div
              className="bg-white w-[90vw] h-[90vh] rounded-lg p-6 overflow-hidden flex"
              onClick={(e) => e.stopPropagation()}
            >
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
                  value={symbolFilterSymbol}
                  onChange={(e) => {
                    setSymbolFilterSymbol(e.target.value);
                    setCurrentAddPage(0);
                  }}
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
                  value={category1FilterSymbol}
                  onChange={(e) => {
                    setCategory1FilterSymbol(e.target.value);
                    setCurrentAddPage(0);
                  }}
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
                  value={category2FilterSymbol}
                  onChange={(e) => {
                    setCategory2FilterSymbol(e.target.value);
                    setCurrentAddPage(0);
                  }}
                  autoComplete="off"
                />
                <datalist id="category2Suggestions">
                  {categories.map((category, index) => (
                    <option key={index} value={`${category.nameEs} / ${category.nameEu}`} />
                  ))}
                </datalist>
                <h2 className="text-xl font-bold mb-2">Diccionario</h2>
                <label htmlFor="diccionario" className="block text-sm font-medium text-gray-700 mb-1">
                  Selecciona un diccionario:
                </label>

                <div className="flex items-center gap-2 mb-4">
                  <select
                    id="diccionario"
                    name="diccionario"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
                    value={diccionario}
                    onChange={(e) => cambiarDiccionario(e.target.value)}
                  >
                    {diccionarios.map((item, index) => (
                      <option key={index} value={index}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Panel derecho */}
              <div className="w-2/3 p-4">
                <h2 className="text-xl font-bold mb-4">Símbolos</h2>

                {/* Símbolos con Paginación */}
                <div className="grid grid-cols-3 gap-2">
                  {filteredSymbolsSymbol
                    .slice(currentAddPage * 6, currentAddPage * 6 + 6) // Mostrar solo 6 símbolos por página
                    .map((symbol, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-center h-24 bg-slate-200 text-gray-800 font-semibold rounded-md shadow cursor-pointer hover:bg-slate-300 transition-colors p-1 gap-1"
                        onClick={() => handleAddSymbol(symbol)}
                      >
                        <p className="text-xs">{`${symbol.nameEs} / ${symbol.nameEu}`}</p>
                        <Symbol className="flex-1" symbol={symbol.jsonData}></Symbol>
                      </div>
                    ))}
                </div>

                {/* Controles de Paginación */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-0"
                    onClick={prevAddPage}
                    disabled={currentAddPage === 0}
                  >
                    Anterior
                  </button>
                  <p className="text-sm font-semibold">
                    Página {currentAddPage + 1} de {Math.ceil(filteredSymbolsSymbol.length / 6)}
                  </p>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-0"
                    onClick={nextAddPage}
                    disabled={currentAddPage === Math.ceil(filteredSymbolsSymbol.length / 6) - 1}
                  >
                    Siguiente
                  </button>
                </div>
                <button
                  className="px-4 py-2 my-8 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-0 w-full"
                  onClick={() => closeAddSymbolModal()}
                >
                  Atrás
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Symbols */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-8">Símbolos de la colección</h2>
        {/* Símbolos con Paginación */}
        <div className="grid grid-cols-3 gap-2">
          {filteredSymbolsCollection
            .slice(currentCollectionPage * 6, currentCollectionPage * 6 + 6) // Mostrar solo 6 símbolos por página
            .map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center h-24 bg-slate-200 text-gray-800 font-semibold rounded-md shadow cursor-pointer hover:bg-slate-300 transition-colors p-1 gap-1"
                onClick={() => openViewRemoveModal(item)}
              >
                <p className="text-xs">{`${item.Symbol.nameEs} / ${item.Symbol.nameEu}`}</p>
                <Symbol className="flex-1" symbol={item.Symbol.jsonData}></Symbol>
              </div>
            ))}
        </div>

        {/* Controles de Paginación */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-0"
            onClick={prevCollectionPage}
            disabled={currentCollectionPage === 0}
          >
            Anterior
          </button>
          <p className="text-sm font-semibold">
            Página {currentCollectionPage + 1} de {Math.ceil(filteredSymbolsCollection.length / 6)}
          </p>
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-0"
            onClick={nextCollectionPage}
            disabled={currentCollectionPage === Math.ceil(filteredSymbolsCollection.length / 6) - 1}
          >
            Siguiente
          </button>
        </div>
      </div>
      {/* View Remove Modal */}
      {isViewRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col justify-between w-[90vw] h-[90vh]">
            <h2 className="text-2xl font-semibold text-center mb-2">
              {bigItem.Symbol.nameEs} / {bigItem.Symbol.nameEu}
            </h2>

            <div className="w-full h-full flex-1 min-h-0 overflow-hidden my-2 border-2 border-gray-300 rounded-lg">
              <Symbol className="w-full h-full object-contain" symbol={bigItem.Symbol.jsonData} />
            </div>

            <div className="flex w-full mt-auto gap-4">
              <button
                onClick={() => handleViewRemove(bigItem.id)}
                className="w-1/2 bg-red-500 text-white px-6 py-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={closeViewRemoveModal}
                className="w-1/2 bg-gray-300 text-black px-6 py-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Atrás
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
