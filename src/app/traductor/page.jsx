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
  const [frase, setFrase] = useState("");
  const [cards, setCards] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Primero, tratamos de obtener los datos cacheados
    const cachedSymbols = localStorage.getItem("cachedOfficialSymbols");
    if (cachedSymbols) {
      const parsedSymbols = JSON.parse(cachedSymbols);
      setSymbols(parsedSymbols);
    }

    // Luego, realizamos el fetch a la API para obtener datos actualizados
    const fetchData = async () => {
      try {
        const response = await fetch("/api/symbols");
        const newData = await response.json();

        // Actualizamos el cache y los estados con los nuevos datos
        localStorage.setItem("cachedOfficialSymbols", JSON.stringify(newData));
        setSymbols(newData);
      } catch (error) {
        console.error("Error fetching symbols:", error);
        // Si falla el fetch, ya tenemos los datos cacheados (si existían)
      }
    };

    fetchData();
  }, []);

  const modificarSimbolo = async (simbolo, modificador) => {
    if (modificador == "ninguno" || modificador == "presente") {
      return simbolo;
    }
    const simboloAdaptado = {};
    const uplines = [];
    let deltaX = 0;
    let deltaY = firstDivision - squareSize * 2;
    simboloAdaptado.nameEs = simbolo.nameEs;
    simboloAdaptado.nameEu = simbolo.nameEu;
    simboloAdaptado.id = simbolo.id;
    simboloAdaptado.jsonData = {};
    simboloAdaptado.jsonData.width = simbolo.jsonData.width;
    simboloAdaptado.jsonData.arcs = JSON.parse(JSON.stringify(simbolo.jsonData.arcs));
    simboloAdaptado.jsonData.curves = JSON.parse(JSON.stringify(simbolo.jsonData.curves));
    simboloAdaptado.jsonData.rectangles = JSON.parse(JSON.stringify(simbolo.jsonData.rectangles));
    simboloAdaptado.jsonData.circles = JSON.parse(JSON.stringify(simbolo.jsonData.circles));
    simboloAdaptado.jsonData.lines = [];
    for (let i = 0; i < simbolo.jsonData.lines.length; i++) {
      const line = simbolo.jsonData.lines[i];
      if (line.y1 <= firstDivision && line.y2 <= firstDivision && line.x1 != line.x2 && line.y1 != line.y2) {
        // Línea en la parte superior
        uplines.push(line);
        deltaX += (line.x1 + line.x2) / 2;
      } else {
        // Línea en la parte inferior
        simboloAdaptado.jsonData.lines.push(line);
      }
    }
    if (uplines.length > 0) {
      deltaX = deltaX / uplines.length;
    } else {
      deltaX = (simbolo.jsonData.width * squareSize) / 2;
    }
    for (const key in modificadores[modificador]) {
      for (let i = 0; i < modificadores[modificador][key].length; i++) {
        console.log("key", key);
        console.log(i);
        if (key == "lines") {
          simboloAdaptado.jsonData.lines.push({
            x1: modificadores[modificador][key][i].x1 + deltaX,
            y1: modificadores[modificador][key][i].y1 + deltaY,
            x2: modificadores[modificador][key][i].x2 + deltaX,
            y2: modificadores[modificador][key][i].y2 + deltaY,
          });
        }
        if (key == "arcs") {
          simboloAdaptado.jsonData.arcs.push({
            sx: modificadores[modificador][key][i].sx + deltaX,
            sy: modificadores[modificador][key][i].sy + deltaY,
            ex: modificadores[modificador][key][i].ex + deltaX,
            ey: modificadores[modificador][key][i].ey + deltaY,
            r: modificadores[modificador][key][i].r,
            h: modificadores[modificador][key][i].h,
          });
        }
        if (key == "curves") {
          simboloAdaptado.jsonData.curves.push({
            sx: modificadores[modificador][key][i].sx + deltaX,
            sy: modificadores[modificador][key][i].sy + deltaY,
            mx: modificadores[modificador][key][i].mx + deltaX,
            my: modificadores[modificador][key][i].my + deltaY,
            ex: modificadores[modificador][key][i].ex + deltaX,
            ey: modificadores[modificador][key][i].ey + deltaY,
          });
        }
        if (key == "circles") {
          simboloAdaptado.jsonData.circles.push({
            cx: modificadores[modificador][key][i].cx + deltaX,
            cy: modificadores[modificador][key][i].cy + deltaY,
            r: modificadores[modificador][key][i].r,
            fill: modificadores[modificador][key][i].fill,
          });
        }
        if (key == "rectangles") {
          simboloAdaptado.jsonData.rectangles.push({
            x: modificadores[modificador][key][i].x + deltaX,
            y: modificadores[modificador][key][i].y + deltaY,
            width: modificadores[modificador][key][i].width,
            height: modificadores[modificador][key][i].height,
          });
        }
      }
    }
    return simboloAdaptado;
  };

  const handleTranslate = async () => {
    if (isTranslating) return;
    console.log("hola");
    setIsTranslating(true);
    const respuesta = await fetch(`/api/traductor`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frase: frase,
      }),
    });
    const mensaje = await respuesta.json();
    let toPrint = [];
    for (let i = 0; i < mensaje.translation.length; i++) {
      const simbolo = symbols.find((s) => s.nameEs.toLowerCase() === mensaje.translation[i].nombre.toLowerCase());
      if (simbolo) {
        const simboloAdaptado = await modificarSimbolo(simbolo, mensaje.translation[i].modificador);
        toPrint.push(simboloAdaptado);
      } else {
        const newSymbol = {
          nameEs: mensaje.translation[i].nombre,
          jsonData: defaultJsonData,
        };
        toPrint.push(newSymbol);
      }
    }
    setCards(toPrint);
    setIsTranslating(false);
  };

  return (
    <div className="h-screen flex flex-col p-4 box-border">
      {/* Input + botón alineados */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Escribe la frase..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-slate-500 focus:border-slate-500"
          value={frase}
          onChange={(e) => setFrase(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTranslate();
            }
          }}
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

      {/* Tarjetas en tres filas máximo */}
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
    </div>
  );
}
