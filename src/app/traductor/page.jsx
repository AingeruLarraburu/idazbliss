"use client";

import { useState, useEffect } from "react";
import Symbol from "@/components/symbol";

import { firstDivision, squareSize } from "@/config/config";

const defaultJsonData = {
  width: 4,
};

const modificadores = {
  presente: {
    lines: [
      { x1: 0, y1: 10, x2: 5, y2: 0 },
      { x1: 5, y1: 0, x2: 10, y2: 10 },
    ],
  },
  pasado: {
    curves: [{ sx: 0, sy: 0, mx: 5, my: 5, ex: 0, ey: 10 }],
  },
  futuro: {
    curves: [{ sx: 0, sy: 10, mx: -5, my: 5, ex: 0, ey: 0 }],
  },
  condicionalPresente: {
    arcs: [
      { sx: -2, sy: 2, r: 2, h: 1, ex: 2, ey: 2 },
      { sx: 2, sy: 2, r: 2, h: 1, ex: 0, ey: 4 },
    ],
    circles: [{ cx: 0, cy: 10, r: 1, fill: "black" }],
    lines: [{ x1: 0, y1: 4, x2: 0, y2: 6 }],
  },
  condicionalPasado: {
    arcs: [
      { sx: -2, sy: 2, r: 2, h: 1, ex: 2, ey: 2 },
      { sx: 2, sy: 2, r: 2, h: 1, ex: 0, ey: 4 },
    ],
    circles: [{ cx: 0, cy: 10, r: 1, fill: "black" }],
    lines: [{ x1: 0, y1: 4, x2: 0, y2: 6 }],
    curves: [{ sx: 5, sy: 0, mx: 10, my: 5, ex: 5, ey: 10 }],
  },
  condicionalFuturo: {
    arcs: [
      { sx: -2, sy: 2, r: 2, h: 1, ex: 2, ey: 2 },
      { sx: 2, sy: 2, r: 2, h: 1, ex: 0, ey: 4 },
    ],
    circles: [{ cx: 0, cy: 10, r: 1, fill: "black" }],
    lines: [{ x1: 0, y1: 4, x2: 0, y2: 6 }],
    curves: [{ sx: 7.5, sy: 0, mx: 2.5, my: 5, ex: 7.5, ey: 10 }],
  },
  pasivoPresente: {
    lines: [
      { x1: 0, y1: 0, x2: -10, y2: 5 },
      { x1: 0, y1: 10, x2: -10, y2: 5 },
    ],
  },
  pasivoPasado: {
    lines: [
      { x1: 0, y1: 0, x2: -10, y2: 5 },
      { x1: 0, y1: 10, x2: -10, y2: 5 },
    ],
    curves: [{ sx: 5, sy: 0, mx: 10, my: 5, ex: 5, ey: 10 }],
  },
  pasivoFuturo: {
    lines: [
      { x1: 0, y1: 0, x2: -10, y2: 5 },
      { x1: 0, y1: 10, x2: -10, y2: 5 },
    ],
    curves: [{ sx: 7.5, sy: 0, mx: 2.5, my: 5, ex: 7.5, ey: 10 }],
  },
  plural: {
    lines: [
      { x1: -5, y1: 0, x2: 5, y2: 10 },
      { x1: 5, y1: 0, x2: -5, y2: 10 },
    ],
  },
};

export default function Traductor() {
  const [mode, setMode] = useState("textoToBliss"); // 'textoToBliss' or 'blissToTexto'
  const [frase, setFrase] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [traduccion, setTraduccion] = useState("Introduce símbolos y pulsa traducir");
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual
  const [blissToTexto, setBlissToTexto] = useState([]);
  const [isSymbolTranslating, setIsSymbolTranslating] = useState(false);
  const [filterCounts, setFilterCounts] = useState({
    lines: 0,
    arcs: 0,
    curves: 0,
    circles: 0,
    rectangles: 0,
  });
  const [selectingSymbol, setSelectingSymbol] = useState(0); // Estado para el símbolo seleccionado

  // Funciones para cambiar de página
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredSymbols.length / 6) - 1));
  };

  const handleAddSymbol = (symbol) => {
    console.log("handleAddSymbol", symbol);
    console.log("selectingSymbol", selectingSymbol);
    const adaptedSymbol = {
      ...symbol,
      jsonMod: symbol.jsonData,
      modificador: "ninguno",
    };
    setBlissToTexto((prev) => {
      const updated = [...prev]; // copiamos el array
      updated[selectingSymbol] = adaptedSymbol; // actualizamos solo la posición deseada
      return updated;
    });
    setShowModal(false);
  };

  const handleCountChange = (key, count) => {
    // 1️⃣ calculas el objeto con el conteo actualizado
    const newCounts = {
      ...filterCounts,
      [key]: count,
    };
    // 2️⃣ actualizas el estado
    setFilterCounts(newCounts);

    // 3️⃣ haces tu lógica de filtrado usando newCounts
    const filterSum = Object.values(newCounts).reduce((acc, v) => acc + v, 0);

    const newFiltered = symbols
      .filter((symbol) => {
        const d = symbol.jsonData;
        return (
          d.arcs.length >= newCounts.arcs &&
          d.circles.length >= newCounts.circles &&
          d.curves.length >= newCounts.curves &&
          d.lines.length >= newCounts.lines &&
          d.rectangles.length >= newCounts.rectangles
        );
      })
      .map((symbol) => {
        const { arcs, circles, curves, lines, rectangles } = symbol.jsonData;
        const total = arcs.length + circles.length + curves.length + lines.length + rectangles.length;
        const diff = Math.abs(total - filterSum);
        return { ...symbol, __diff: diff };
      })
      .sort((a, b) => {
        if (a.__diff !== b.__diff) return a.__diff - b.__diff;
        return a.nameEs.localeCompare(b.nameEs);
      })
      .map(({ __diff, ...sym }) => sym);

    setFilteredSymbols(newFiltered);
  };

  useEffect(() => {
    const cachedSymbols = localStorage.getItem("cachedOfficialSymbols");
    if (cachedSymbols) {
      setSymbols(JSON.parse(cachedSymbols));
      setFilteredSymbols(JSON.parse(cachedSymbols));
    }
    const fetchData = async () => {
      try {
        const response = await fetch("/api/symbols");
        const newData = await response.json();
        localStorage.setItem("cachedOfficialSymbols", JSON.stringify(newData));
        setSymbols(newData);
        setFilteredSymbols(newData);
      } catch (error) {
        console.error("Error fetching symbols:", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectSymbol = async (i) => {
    console.log("handleSelectSymbol", i);
    setSelectingSymbol(i);
    setFilterCounts({
      lines: 0,
      arcs: 0,
      curves: 0,
      circles: 0,
      rectangles: 0,
    });
    setCurrentPage(0);
    setShowModal(true);
  };

  const modificarSimbolo = async (simbolo, modificador) => {
    if (modificador === "ninguno" || modificador === "presente") return simbolo;
    const simboloAdaptado = {};
    const uplines = [];
    let deltaX = 0;
    let deltaY = firstDivision - squareSize * 2;
    simboloAdaptado.nameEs = simbolo.nameEs;
    simboloAdaptado.nameEu = simbolo.nameEu;
    simboloAdaptado.id = simbolo.id;
    simboloAdaptado.jsonData = { width: simbolo.jsonData.width };
    simboloAdaptado.jsonData.arcs = JSON.parse(JSON.stringify(simbolo.jsonData.arcs));
    simboloAdaptado.jsonData.curves = JSON.parse(JSON.stringify(simbolo.jsonData.curves));
    simboloAdaptado.jsonData.rectangles = JSON.parse(JSON.stringify(simbolo.jsonData.rectangles));
    simboloAdaptado.jsonData.circles = JSON.parse(JSON.stringify(simbolo.jsonData.circles));
    simboloAdaptado.jsonData.lines = [];
    for (const line of simbolo.jsonData.lines) {
      if (line.y1 <= firstDivision && line.y2 <= firstDivision && line.x1 !== line.x2 && line.y1 !== line.y2) {
        uplines.push(line);
        deltaX += (line.x1 + line.x2) / 2;
      } else {
        simboloAdaptado.jsonData.lines.push(line);
      }
    }
    deltaX = uplines.length ? deltaX / uplines.length : (simbolo.jsonData.width * squareSize) / 2;
    for (const key in modificadores[modificador]) {
      modificadores[modificador][key].forEach((item) => {
        if (key === "lines") {
          simboloAdaptado.jsonData.lines.push({
            x1: item.x1 + deltaX,
            y1: item.y1 + deltaY,
            x2: item.x2 + deltaX,
            y2: item.y2 + deltaY,
          });
        }
        if (key === "arcs") {
          simboloAdaptado.jsonData.arcs.push({
            sx: item.sx + deltaX,
            sy: item.sy + deltaY,
            ex: item.ex + deltaX,
            ey: item.ey + deltaY,
            r: item.r,
            h: item.h,
          });
        }
        if (key === "curves") {
          simboloAdaptado.jsonData.curves.push({
            sx: item.sx + deltaX,
            sy: item.sy + deltaY,
            mx: item.mx + deltaX,
            my: item.my + deltaY,
            ex: item.ex + deltaX,
            ey: item.ey + deltaY,
          });
        }
        if (key === "circles") {
          simboloAdaptado.jsonData.circles.push({
            cx: item.cx + deltaX,
            cy: item.cy + deltaY,
            r: item.r,
            fill: item.fill,
          });
        }
        if (key === "rectangles") {
          simboloAdaptado.jsonData.rectangles.push({
            x: item.x + deltaX,
            y: item.y + deltaY,
            width: item.width,
            height: item.height,
          });
        }
      });
    }
    return simboloAdaptado;
  };

  const handleTranslate = async () => {
    if (isTranslating) return;
    setIsTranslating(true);
    const response = await fetch(`/api/traductor`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frase }),
    });
    const message = await response.json();
    const toPrint = [];
    for (const token of message.translation) {
      const simbolo = symbols.find((s) => s.nameEs.toLowerCase() === token.nombre.toLowerCase());
      if (simbolo) {
        toPrint.push(await modificarSimbolo(simbolo, token.modificador));
      } else {
        toPrint.push({ nameEs: token.nombre, jsonData: defaultJsonData });
      }
    }
    setCards(toPrint);
    setIsTranslating(false);
  };

  const handleBackFromSelectSymbol = () => {
    setShowModal(false);
    const defaultIndexes = {
      lines: 0,
      arcs: 0,
      curves: 0,
      circles: 0,
      rectangles: 0,
    };
    setFilterCounts(defaultIndexes);
  };

  const handleMode = async () => {
    setMode((prev) => (prev === "textoToBliss" ? "blissToTexto" : "textoToBliss"));
    const defaultIndexes = {
      lines: 0,
      arcs: 0,
      curves: 0,
      circles: 0,
      rectangles: 0,
    };
    setFilterCounts(defaultIndexes);
  };

  const handleSymbolTranslate = async () => {
    if (isSymbolTranslating) return;
    setIsSymbolTranslating(true);
    const mensaje = { simbolos: [] };
    for (const symbol of blissToTexto) {
      const simbolo = {
        nameEs: symbol.nameEs,
        modificador: symbol.modificador,
      };
      mensaje.simbolos.push(simbolo);
    }
    const response = await fetch(`/api/traductor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje }),
    });
    const message = await response.json();
    console.log("Respuesta", message);
    setTraduccion(message.spanish);
    setIsSymbolTranslating(false);
  };

  const adaptarSimbolo = async (i) => {
    const simbolo = { ...blissToTexto[i] };
    if (simbolo.modificador == "ninguno" || simbolo.modificador == "presente") {
      simbolo.modificador = "futuro";
    } else if (simbolo.modificador == "futuro") {
      simbolo.modificador = "pasado";
    } else if (simbolo.modificador == "pasado") {
      simbolo.modificador = "condicionalPresente";
    } else if (simbolo.modificador == "condicionalPresente") {
      simbolo.modificador = "condicionalPasado";
    } else if (simbolo.modificador == "condicionalPasado") {
      simbolo.modificador = "condicionalFuturo";
    } else if (simbolo.modificador == "condicionalFuturo") {
      simbolo.modificador = "pasivoPresente";
    } else if (simbolo.modificador == "pasivoPresente") {
      simbolo.modificador = "pasivoPasado";
    } else if (simbolo.modificador == "pasivoPasado") {
      simbolo.modificador = "pasivoFuturo";
    } else if (simbolo.modificador == "pasivoFuturo") {
      simbolo.modificador = "plural";
    } else if (simbolo.modificador == "plural") {
      simbolo.modificador = "ninguno";
    }
    console.log("adaptarSimbolo", simbolo.modificador);
    const simboloAdaptado = await modificarSimbolo(simbolo, simbolo.modificador);
    setBlissToTexto((prev) => {
      const updated = [...prev]; // copiamos el array
      updated[i] = simbolo; // actualizamos solo la posición deseada
      updated[i].jsonMod = simboloAdaptado.jsonData; // actualizamos el jsonMod
      return updated;
    });
  };

  return (
    <div className="h-screen flex flex-col p-4 box-border">
      {/* Botón de modo */}
      <button
        onClick={() => handleMode()}
        className="w-full mb-4 px-4 py-2 rounded-md transition-colors bg-blue-500 text-white hover:bg-blue-600"
      >
        {mode === "textoToBliss" ? "Texto a Bliss" : "Bliss a Texto"}
      </button>

      {mode === "textoToBliss" ? (
        <>
          {/* Input + botón traducir */}
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Escribe la frase..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
              value={frase}
              onChange={(e) => setFrase(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTranslate()}
            />
            <button
              onClick={handleTranslate}
              className={`ml-4 px-4 py-2 rounded-md transition-colors ${
                isTranslating ? "bg-blue-400 text-white animate-pulse" : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isTranslating ? "Traduciendo" : "Traducir"}
            </button>
          </div>

          {/* Tarjetas de traducción */}
          <div className="flex-1 flex flex-wrap gap-1 items-start p-0">
            {cards.map((card, index) => (
              <div key={index} className="h-1/3 border rounded shadow flex flex-col justify-between p-1">
                <div className="h-[calc(100%-24px)] w-full p-1 box-border">
                  <Symbol className="h-full w-full object-contain" symbol={card.jsonData} />
                </div>
                <p className="text-center text-sm">{card.nameEs}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Traducción de ejemplo */}
          <div className="flex items-center w-full mb-4">
            <button
              onClick={handleSymbolTranslate}
              className={`px-4 py-2 rounded-md transition-colors ${
                isSymbolTranslating
                  ? "bg-blue-400 text-white animate-pulse"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isSymbolTranslating ? "Traduciendo" : "Traducir"}
            </button>
            <div className="flex-1 text-left border border-blue-500 p-2 rounded ml-4">{traduccion}</div>
          </div>
          <div className="flex-1 flex flex-wrap gap-1 items-start p-0">
            {blissToTexto.map((card, i) => (
              <div key={i} className="h-1/3 border rounded shadow flex flex-col justify-between p-1 cursor-pointer">
                <div className="h-[calc(100%-70px)] w-full p-1 box-border" onClick={() => handleSelectSymbol(i)}>
                  <Symbol className="h-full w-full object-contain" symbol={card.jsonMod} />
                </div>
                <p className="text-center text-sm">{card.nameEs}</p>
                <button
                  className="text-center text-sm text-green-800 font-bold hover:underline"
                  onClick={(e) => {
                    e.stopPropagation(); // Previene que se dispare también handleCardClick
                    adaptarSimbolo(i);
                  }}
                >
                  Modificar
                </button>
                <button
                  className="text-center text-sm text-blue-500 font-bold hover:underline"
                  onClick={(e) => {
                    e.stopPropagation(); // Previene que se dispare también handleCardClick
                    setBlissToTexto((prev) => prev.filter((_, index) => index !== i));
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}

            {/* Botón para añadir nuevo símbolo */}
            <button
              onClick={() =>
                setBlissToTexto((prev) => [
                  ...prev,
                  {
                    nameEs: "",
                    nameEu: "",
                    jsonData: defaultJsonData,
                    jsonMod: defaultJsonData,
                    modificador: "ninguno",
                  },
                ])
              }
              className="h-1/3 border rounded shadow flex flex-col justify-between p-1 cursor-pointer items-center justify-center"
            >
              <div className="h-[calc(100%-24px)] w-full flex items-center justify-center">
                <span className="text-3xl text-blue-500 font-bold">+</span>
              </div>
              <p className="text-center text-sm">Añadir</p>
            </button>
          </div>
          {/* Modal */}
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={() => setShowModal(false)}
            >
              <div
                className="bg-white w-[90vw] h-[90vh] rounded-lg p-6 overflow-hidden flex"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Panel izquierdo */}
                <div className="w-1/4 flex flex-col border-r border-gray-200 p-2 gap-2 overflow-y-auto">
                  <p>Lineas:</p>
                  <div className="flex items-center justify-between border border-blue-400 rounded-md p-2">
                    {/* Izquierda */}
                    <div className="flex items-center">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="0" y1="0" x2="24" y2="24" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Centro */}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleCountChange("lines", filterCounts.lines + 1)}
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                        <line x1="12" y1="0" x2="12" y2="24" stroke="black" strokeWidth="2" />
                      </svg>
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleCountChange("lines", filterCounts.lines == 0 ? 0 : filterCounts.lines - 1)}
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Derecha */}
                    <p className="w-12 h-12 p-2 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                      {filterCounts.lines}
                    </p>
                  </div>
                  <p>Rectangulos:</p>
                  <div className="flex items-center justify-between border border-blue-400 rounded-md p-2">
                    {/* Izquierda */}
                    <div className="flex items-center">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="4" width="16" height="16" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Centro */}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleCountChange("rectangles", filterCounts.rectangles + 1)}
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                        <line x1="12" y1="0" x2="12" y2="24" stroke="black" strokeWidth="2" />
                      </svg>
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() =>
                          handleCountChange(
                            "rectangles",
                            filterCounts.rectangles == 0 ? 0 : filterCounts.rectangles - 1
                          )
                        }
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Derecha */}
                    <p className="w-12 h-12 p-2 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                      {filterCounts.rectangles}
                    </p>
                  </div>
                  <p>Circulos:</p>
                  <div className="flex items-center justify-between border border-blue-400 rounded-md p-2">
                    {/* Izquierda */}
                    <div className="flex items-center">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Centro */}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleCountChange("circles", filterCounts.circles + 1)}
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                        <line x1="12" y1="0" x2="12" y2="24" stroke="black" strokeWidth="2" />
                      </svg>
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() =>
                          handleCountChange("circles", filterCounts.circles == 0 ? 0 : filterCounts.circles - 1)
                        }
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Derecha */}
                    <p className="w-12 h-12 p-2 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                      {filterCounts.circles}
                    </p>
                  </div>
                  <p>Arcos:</p>
                  <div className="flex items-center justify-between border border-blue-400 rounded-md p-2">
                    {/* Izquierda */}
                    <div className="flex items-center">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14,2 A8,8 0 0 1 22,10 M22,13 A8,8 0 0 1 14,21 M11,21 A8,8 0 0 1 3,13 M3,10 A8,8 0 0 1 11,2" />
                      </svg>
                    </div>

                    {/* Centro */}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleCountChange("arcs", filterCounts.arcs + 1)}
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                        <line x1="12" y1="0" x2="12" y2="24" stroke="black" strokeWidth="2" />
                      </svg>
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleCountChange("arcs", filterCounts.arcs == 0 ? 0 : filterCounts.arcs - 1)}
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Derecha */}
                    <p className="w-12 h-12 p-2 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                      {filterCounts.arcs}
                    </p>
                  </div>
                  <p>Curvas:</p>
                  <div className="flex items-center justify-between border border-blue-400 rounded-md p-2">
                    {/* Izquierda */}
                    <div className="flex items-center">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10,10 Q6,6 6,0 M14,10 Q18,6 18,0 M10,14 Q6,18 6,24 M14,14 Q18,18 18,24" />
                      </svg>
                    </div>

                    {/* Centro */}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleCountChange("curves", filterCounts.curves + 1)}
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                        <line x1="12" y1="0" x2="12" y2="24" stroke="black" strokeWidth="2" />
                      </svg>
                      <svg
                        className="w-12 h-12 p-2 bg-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() =>
                          handleCountChange("curves", filterCounts.curves == 0 ? 0 : filterCounts.curves - 1)
                        }
                      >
                        <line x1="0" y1="12" x2="24" y2="12" stroke="black" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Derecha */}
                    <p className="w-12 h-12 p-2 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                      {filterCounts.curves}
                    </p>
                  </div>
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
                  <button
                    className="px-4 py-2 my-8 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50 w-full"
                    onClick={() => handleBackFromSelectSymbol()}
                  >
                    Atrás
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
