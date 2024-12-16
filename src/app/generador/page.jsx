"use client";
import { useState, useEffect } from "react";

export default function Generador() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [circles, setCircles] = useState([]);
  const [rectangles, setRectangles] = useState([]); // Nuevo estado para los rectángulos
  const [selectedTool, setSelectedTool] = useState("line");
  const [selectedLineIndices, setSelectedLineIndices] = useState([]);
  const [selectedCircleIndices, setSelectedCircleIndices] = useState([]);
  const [selectedRectangleIndices, setSelectedRectangleIndices] = useState([]); // Nuevo estado para los rectángulos seleccionados

  const numHorizontal = 30;
  const numVertical = 10;
  const squareSize = 10;
  const firstDivision = 40;
  const secondDivision = 80;

  const viewBoxWidth = numHorizontal * squareSize;
  const viewBoxHeight = numVertical * squareSize;

  function handleMouseDown(e) {
    e.preventDefault();
    const svg = e.target.ownerSVGElement || e.target;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    const ctm = svg.getScreenCTM();
    const svgPoint = point.matrixTransform(ctm.inverse());

    const adjustment = squareSize / 2;
    const adjustedX = Math.round(svgPoint.x / adjustment) * adjustment;
    const adjustedY = Math.round(svgPoint.y / adjustment) * adjustment;

    setStartCoords({ x: adjustedX, y: adjustedY });
    setEndCoords({ x: adjustedX, y: adjustedY });
    setIsDrawing(true);
  }

  function handleMouseMove(e) {
    e.preventDefault();
    if (!isDrawing) return;

    const svg = e.target.ownerSVGElement || e.target;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    const ctm = svg.getScreenCTM();
    const svgPoint = point.matrixTransform(ctm.inverse());

    const adjustment = squareSize / 2;
    const adjustedX = Math.round(svgPoint.x / adjustment) * adjustment;
    const adjustedY = Math.round(svgPoint.y / adjustment) * adjustment;

    setEndCoords({ x: adjustedX, y: adjustedY });
  }

  function handleMouseLeave() {
    setIsDrawing(false);
  }

  function handleMouseUp() {
    setIsDrawing(false);
    if (selectedTool === "line") {
      if (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y) {
        setLines((prevLines) => [
          ...prevLines,
          { x1: startCoords.x, y1: startCoords.y, x2: endCoords.x, y2: endCoords.y, isSelected: false },
        ]);
      }
    } else if (selectedTool === "circle") {
      const centerX = (startCoords.x + endCoords.x) / 2;
      const centerY = (startCoords.y + endCoords.y) / 2;
      const radius = Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2);
      if (radius > 0) {
        setCircles((prevCircles) => [...prevCircles, { cx: centerX, cy: centerY, r: radius, isSelected: false }]);
      }
    } else if (selectedTool === "rectangle") {
      const rectX = Math.min(startCoords.x, endCoords.x);
      const rectY = Math.min(startCoords.y, endCoords.y);
      const width = Math.abs(endCoords.x - startCoords.x);
      const height = Math.abs(endCoords.y - startCoords.y);
      if (width > 0 && height > 0) {
        setRectangles((prevRectangles) => [
          ...prevRectangles,
          { x: rectX, y: rectY, width: width, height: height, isSelected: false },
        ]);
      }
    } else if (selectedTool === "select") {
      const minX = Math.min(startCoords.x, endCoords.x);
      const minY = Math.min(startCoords.y, endCoords.y);
      const maxX = Math.max(startCoords.x, endCoords.x);
      const maxY = Math.max(startCoords.y, endCoords.y);
      const newSelectedLines = [];
      lines.forEach((line, index) => {
        // Verificamos si alguno de los puntos (x1, y1) o (x2, y2) está dentro del área seleccionada
        const isInsideSelection =
          (line.x1 >= minX && line.x1 <= maxX && line.y1 >= minY && line.y1 <= maxY) ||
          (line.x2 >= minX && line.x2 <= maxX && line.y2 >= minY && line.y2 <= maxY);

        if (isInsideSelection && !newSelectedLines.includes(index)) {
          newSelectedLines.push(index);
        }
      });
      setSelectedLineIndices(newSelectedLines);
      const newSelectedCircles = [];
      circles.forEach((circle, index) => {
        // Verificamos si el centro del círculo está dentro del área seleccionada
        const isInsideSelection = circle.cx >= minX && circle.cx <= maxX && circle.cy >= minY && circle.cy <= maxY;

        if (isInsideSelection && !newSelectedCircles.includes(index)) {
          newSelectedCircles.push(index);
        }
      });
      setSelectedCircleIndices(newSelectedCircles);
      const newSelectedRectangles = [];
      rectangles.forEach((rect, index) => {
        const isInsideSelection =
          (rect.x >= minX && rect.x <= maxX && rect.y >= minY && rect.y <= maxY) ||
          (rect.x + rect.width >= minX && rect.x + rect.width <= maxX && rect.y >= minY && rect.y <= maxY) ||
          (rect.x + rect.width >= minX &&
            rect.x + rect.width <= maxX &&
            rect.y + rect.height >= minY &&
            rect.y + rect.height <= maxY) ||
          (rect.x >= minX && rect.x <= maxX && rect.y + rect.height >= minY && rect.y + rect.height <= maxY);

        if (isInsideSelection && !newSelectedRectangles.includes(index)) {
          newSelectedRectangles.push(index);
        }
      });
      setSelectedRectangleIndices(newSelectedRectangles);
    }
  }

  // Selección de líneas
  function handleLineClick(index) {
    const newSelectedLines = [...selectedLineIndices];
    if (newSelectedLines.includes(index)) {
      newSelectedLines.splice(newSelectedLines.indexOf(index), 1);
    } else {
      newSelectedLines.push(index);
    }
    setSelectedLineIndices(newSelectedLines);
  }

  // Selección de círculos
  function handleCircleClick(index) {
    const newSelectedCircles = [...selectedCircleIndices];
    if (newSelectedCircles.includes(index)) {
      newSelectedCircles.splice(newSelectedCircles.indexOf(index), 1);
    } else {
      newSelectedCircles.push(index);
    }
    setSelectedCircleIndices(newSelectedCircles);
  }

  // Selección de rectángulos
  function handleRectangleClick(index) {
    const newSelectedRectangles = [...selectedRectangleIndices];
    if (newSelectedRectangles.includes(index)) {
      newSelectedRectangles.splice(newSelectedRectangles.indexOf(index), 1);
    } else {
      newSelectedRectangles.push(index);
    }
    setSelectedRectangleIndices(newSelectedRectangles);
  }

  // Selección de herramienta
  function handleToolSelect(tool) {
    if (selectedTool !== tool) {
      setSelectedTool(tool);
    }
  }

  // Manejo de la tecla "Suprimir" para eliminar los seleccionados
  function handleKeyDown(e) {
    if (e.key === "Delete") {
      setLines((prevLines) => prevLines.filter((_, index) => !selectedLineIndices.includes(index)));
      setCircles((prevCircles) => prevCircles.filter((_, index) => !selectedCircleIndices.includes(index)));
      setRectangles((prevRectangles) => prevRectangles.filter((_, index) => !selectedRectangleIndices.includes(index)));
      setSelectedLineIndices([]);
      setSelectedCircleIndices([]);
      setSelectedRectangleIndices([]);
    }
  }

  // Efecto para escuchar la tecla "Suprimir"
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedLineIndices, selectedCircleIndices, selectedRectangleIndices]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white shadow-lg flex flex-col items-center p-4">
        <button
          onClick={() => handleToolSelect("line")}
          className={`mb-4 p-2 bg-gray-200 rounded-full ${selectedTool === "line" ? "border-2 border-blue-500" : ""}`}
        >
          <svg
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <line x1="0" y1="0" x2="24" y2="24" stroke={selectedTool === "line" ? "blue" : "black"} strokeWidth="2" />
          </svg>
        </button>
        <button
          onClick={() => handleToolSelect("circle")}
          className={`mb-4 p-2 bg-gray-200 rounded-full ${selectedTool === "circle" ? "border-2 border-blue-500" : ""}`}
        >
          <svg
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" stroke={selectedTool === "circle" ? "blue" : "black"} strokeWidth="2" />
          </svg>
        </button>
        {/* Nuevo botón para el rectángulo */}
        <button
          onClick={() => handleToolSelect("rectangle")}
          className={`mb-4 p-2 bg-gray-200 rounded-full ${
            selectedTool === "rectangle" ? "border-2 border-blue-500" : ""
          }`}
        >
          <svg
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              stroke={selectedTool === "rectangle" ? "blue" : "black"}
              strokeWidth="2"
            />
          </svg>
        </button>
        {/* Nuevo botón para seleccionar */}
        <button
          onClick={() => handleToolSelect("select")}
          className={`mb-4 p-2 bg-gray-200 rounded-full ${selectedTool === "select" ? "border-2 border-blue-500" : ""}`}
        >
          <svg
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              stroke={selectedTool === "select" ? "blue" : "black"}
              strokeWidth="2"
              strokeDasharray="2,2" // Esto hace que la línea sea entrecortada
              strokeDashoffset="1"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 bg-gray-50 p-6 flex flex-col items-center justify-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full max-w-5xl max-h-screen border"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {Array.from({ length: numVertical }).map((_, rowIndex) =>
            Array.from({ length: numHorizontal }).map((_, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * squareSize}
                y={rowIndex * squareSize}
                width={squareSize}
                height={squareSize}
                fill="none"
                stroke="gray"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            ))
          )}
          <line x1="0" y1={firstDivision} x2={viewBoxWidth} y2={firstDivision} stroke="grey" strokeWidth="2" />
          <line x1="0" y1={secondDivision} x2={viewBoxWidth} y2={secondDivision} stroke="grey" strokeWidth="2" />
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={selectedLineIndices.includes(index) ? "blue" : "black"}
              strokeWidth="2"
              strokeLinecap="round"
              onClick={() => handleLineClick(index)}
            />
          ))}
          {circles.map((circle, index) => (
            <circle
              key={index}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              stroke={selectedCircleIndices.includes(index) ? "blue" : "black"}
              fill="none"
              strokeWidth="2"
              onClick={() => handleCircleClick(index)}
            />
          ))}
          {rectangles.map((rect, index) => (
            <rect
              key={index}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              stroke={selectedRectangleIndices.includes(index) ? "blue" : "black"}
              fill="none"
              strokeWidth="2"
              onClick={() => handleRectangleClick(index)}
            />
          ))}
          {isDrawing && selectedTool === "line" && (
            <line
              x1={startCoords.x}
              y1={startCoords.y}
              x2={endCoords.x}
              y2={endCoords.y}
              stroke="black"
              strokeWidth="2"
            />
          )}
          {isDrawing && selectedTool === "circle" && (
            <circle
              cx={(startCoords.x + endCoords.x) / 2}
              cy={(startCoords.y + endCoords.y) / 2}
              r={Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2)}
              stroke="black"
              fill="none"
              strokeWidth="2"
            />
          )}
          {isDrawing && selectedTool === "rectangle" && (
            <rect
              x={Math.min(startCoords.x, endCoords.x)}
              y={Math.min(startCoords.y, endCoords.y)}
              width={Math.abs(endCoords.x - startCoords.x)}
              height={Math.abs(endCoords.y - startCoords.y)}
              stroke="black"
              fill="none"
              strokeWidth="2"
            />
          )}
          {isDrawing && selectedTool === "select" && (
            <rect
              x={Math.min(startCoords.x, endCoords.x)}
              y={Math.min(startCoords.y, endCoords.y)}
              width={Math.abs(endCoords.x - startCoords.x)}
              height={Math.abs(endCoords.y - startCoords.y)}
              fill="rgba(0, 0, 255, 0.1)"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
