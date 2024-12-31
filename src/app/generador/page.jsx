"use client";
import { useState, useEffect } from "react";

export default function Generador() {
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const [rightClicking, setRightClicking] = useState(false);
  const [lines, setLines] = useState([]);
  const [circles, setCircles] = useState([]);
  const [curves, setCurves] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const tools = [
    "line",
    "circle",
    "rectangle",
    "select",
    "mover",
    "curveH",
    "curveV",
    "point",
    "pizza",
    "semiH",
    "semiV",
    "curveR",
    "rueda",
    "coma",
    "interrogante",
  ];
  const [selectedTool, setSelectedTool] = useState(0);
  const [selectedLineIndices, setSelectedLineIndices] = useState([]);
  const [selectedCircleIndices, setSelectedCircleIndices] = useState([]);
  const [selectedRectangleIndices, setSelectedRectangleIndices] = useState([]);
  const [selectedCurveIndices, setSelectedCurveIndices] = useState([]);
  const [selectedArcIndices, setSelectedArcIndices] = useState([]);

  const numHorizontal = 30;
  const numVertical = 10;
  const squareSize = 10;
  const firstDivision = 40;
  const secondDivision = 80;

  const viewBoxWidth = numHorizontal * squareSize;
  const viewBoxHeight = numVertical * squareSize;

  async function createSymbol() {
    console.log("createSymbol");
    const respuesta = await fetch("/api/symbols", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        names: { nameEs: "Casa", nameEu: "Etxea" },
        symbol: { lines: lines, circles: circles, curves: curves, arcs: arcs, rectangles: rectangles },
      }),
    });
  }

  function getScaledEventPoint(e) {
    const svg = e.target.ownerSVGElement || e.target;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    const ctm = svg.getScreenCTM();
    const svgPoint = point.matrixTransform(ctm.inverse());

    const adjustment = squareSize / 2;
    const adjustedX = Math.round(svgPoint.x / adjustment) * adjustment;
    const adjustedY = Math.round(svgPoint.y / adjustment) * adjustment;
    return [adjustedX, adjustedY];
  }

  function selecteds() {
    return (
      selectedLineIndices.length +
      selectedCircleIndices.length +
      selectedRectangleIndices.length +
      selectedCurveIndices.length +
      selectedArcIndices.length
    );
  }

  function unselectAll() {
    setSelectedLineIndices([]);
    setSelectedCircleIndices([]);
    setSelectedRectangleIndices([]);
    setSelectedCurveIndices([]);
    setSelectedArcIndices([]);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    //Si se pulsa ratón centro eliminar seleccionadas
    if (e.button === 1) {
      unselectDelete();
    }
    e.button === 2 ? setRightClicking(true) : setRightClicking(false);
    const [adjustedX, adjustedY] = getScaledEventPoint(e);
    setStartCoords({ x: adjustedX, y: adjustedY });
    setEndCoords({ x: adjustedX, y: adjustedY });
    if (tools[selectedTool] === "mover") {
      setIsMoving(true);
    } else if (selecteds() > 0) {
      setIsMoving(true);
    } else {
      setIsDrawing(true);
    }
  }

  function moveLines(deltaX, deltaY) {
    if (selectedLineIndices.length > 0) {
      const currentLines = [...lines];
      for (let i = 0; i < selectedLineIndices.length; i++) {
        const index = selectedLineIndices[i];

        currentLines[index].x1 += deltaX;
        currentLines[index].x2 += deltaX;
        currentLines[index].y1 += deltaY;
        currentLines[index].y2 += deltaY;
      }
      setLines(currentLines);
    }
  }
  function moveCircles(deltaX, deltaY) {
    if (selectedCircleIndices.length > 0) {
      const currentCircles = [...circles];
      for (let i = 0; i < selectedCircleIndices.length; i++) {
        const index = selectedCircleIndices[i];
        currentCircles[index].cx += deltaX;
        currentCircles[index].cy += deltaY;
      }
      setCircles(currentCircles);
    }
  }
  function moveRectangles(deltaX, deltaY) {
    if (selectedRectangleIndices.length > 0) {
      const currentRectangles = [...rectangles];
      for (let i = 0; i < selectedRectangleIndices.length; i++) {
        const index = selectedRectangleIndices[i];
        currentRectangles[index].x += deltaX;
        currentRectangles[index].y += deltaY;
      }
      setRectangles(currentRectangles);
    }
  }
  function moveCurves(deltaX, deltaY) {
    if (selectedCurveIndices.length > 0) {
      const currentCurves = [...curves];
      for (let i = 0; i < selectedCurveIndices.length; i++) {
        const index = selectedCurveIndices[i];
        currentCurves[index].sx += deltaX;
        currentCurves[index].sy += deltaY;
        currentCurves[index].mx += deltaX;
        currentCurves[index].my += deltaY;
        currentCurves[index].ex += deltaX;
        currentCurves[index].ey += deltaY;
      }
      setCurves(currentCurves);
    }
  }
  function moveArcs(deltaX, deltaY) {
    if (selectedArcIndices.length > 0) {
      const currentArcs = [...arcs];
      for (let i = 0; i < selectedArcIndices.length; i++) {
        const index = selectedArcIndices[i];
        currentArcs[index].sx += deltaX;
        currentArcs[index].sy += deltaY;
        currentArcs[index].ex += deltaX;
        currentArcs[index].ey += deltaY;
      }
      setArcs(currentArcs);
    }
  }

  function move(who, deltaX, deltaY) {
    const elements = {
      line: { selectedIndices: selectedLineIndices, items: lines, setItems: setLines },
      circle: { selectedIndices: selectedCircleIndices, items: circles, setItems: setCircles },
      rectangle: { selectedIndices: selectedRectangleIndices, items: rectangles, setItems: setRectangles },
      curve: { selectedIndices: selectedCurveIndices, items: curves, setItems: setCurves },
      arc: { selectedIndices: selectedArcIndices, items: arcs, setItems: setArcs },
    };
    if (elements[who].selectedIndices.length > 0) {
      const currentSelecteds = [...elements[who].items];
      for (let i = 0; i < elements[who].selectedIndices.length; i++) {
        const index = elements[who].selectedIndices[i];
        if (who == "line") {
          currentSelecteds[index].x1 += deltaX;
          currentSelecteds[index].x2 += deltaX;
          currentSelecteds[index].y1 += deltaY;
          currentSelecteds[index].y2 += deltaY;
        } else if (who == "circle") {
          currentSelecteds[index].cx += deltaX;
          currentSelecteds[index].cy += deltaY;
        } else if (who == "rectangle") {
          currentSelecteds[index].x += deltaX;
          currentSelecteds[index].y += deltaY;
        } else if (who == "curve") {
          currentSelecteds[index].sx += deltaX;
          currentSelecteds[index].sy += deltaY;
          currentSelecteds[index].mx += deltaX;
          currentSelecteds[index].my += deltaY;
          currentSelecteds[index].ex += deltaX;
          currentSelecteds[index].ey += deltaY;
        } else if (who == "arc") {
          currentSelecteds[index].sx += deltaX;
          currentSelecteds[index].sy += deltaY;
          currentSelecteds[index].ex += deltaX;
          currentSelecteds[index].ey += deltaY;
        }
      }
      elements[who].setItems(currentSelecteds);
    }
  }
  function moveItems(deltaX, deltaY) {
    /*     moveLines(deltaX, deltaY);
    moveCircles(deltaX, deltaY);
    moveRectangles(deltaX, deltaY);
    moveCurves(deltaX, deltaY);
    moveArcs(deltaX, deltaY); */
    move(selectedLineIndices, lines, setLines, deltaX, deltaY);
    move(selectedCircleIndices, circles, setCircles, deltaX, deltaY);
    move(selectedRectangleIndices, rectangles, setRectangles, deltaX, deltaY);
    move(selectedCurveIndices, curves, setCurves, deltaX, deltaY);
    move(selectedArcIndices, arcs, setArcs, deltaX, deltaY);
  }
  function handleMouseMove(e) {
    e.preventDefault();
    if (isDrawing) {
      const [adjustedX, adjustedY] = getScaledEventPoint(e);
      setEndCoords({ x: adjustedX, y: adjustedY });
    } else if (isMoving) {
      const [adjustedX, adjustedY] = getScaledEventPoint(e);
      setEndCoords({ x: adjustedX, y: adjustedY });
      const deltaX = endCoords.x - startCoords.x;
      const deltaY = endCoords.y - startCoords.y;
      if (deltaX != 0 || deltaY != 0) {
        moveItems(deltaX, deltaY);
        setIsMoved(true);
        setStartCoords({ x: endCoords.x, y: endCoords.y });
      }
    }
  }

  function handleMouseLeave() {
    setIsDrawing(false);
    setIsMoving(false);
    setTimeout(() => {
      setIsMoved(false);
    }, 100);
  }

  function handleMouseUp(e) {
    setIsDrawing(false);
    setIsMoving(false);
    setTimeout(() => {
      setIsMoved(false);
    }, 100);
    console.log(tools[selectedTool]);
    if (!isMoved) {
      if (e.button === 2 || tools[selectedTool] === "select") {
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
        const newSelectedCurves = [];
        curves.forEach((curve, index) => {
          const isInsideSelection =
            (curve.sx >= minX && curve.sx <= maxX && curve.sy >= minY && curve.sy <= maxY) ||
            ((curve.mx + curve.sx + curve.ex) / 3 >= minX &&
              (curve.mx + curve.sx + curve.ex) / 3 <= maxX &&
              (curve.my + curve.sy + curve.ey) / 3 >= minY &&
              (curve.my + curve.sy + curve.ey) / 3 <= maxY) ||
            (curve.ex >= minX && curve.ex <= maxX && curve.ey >= minY && curve.ey <= maxY);

          if (isInsideSelection && !newSelectedCurves.includes(index)) {
            newSelectedCurves.push(index);
          }
        });
        setSelectedCurveIndices(newSelectedCurves);
        const newSelectedArcs = [];
        arcs.forEach((arc, index) => {
          const isInsideSelection =
            (arc.sx >= minX && arc.sx <= maxX && arc.sy >= minY && arc.sy <= maxY) ||
            ((arc.sx + arc.ex) / 2 >= minX &&
              (arc.sx + arc.ex) / 2 <= maxX &&
              (arc.sy + arc.ey) / 2 >= minY &&
              (arc.sy + arc.ey) / 2 <= maxY) ||
            (arc.ex >= minX && arc.ex <= maxX && arc.ey >= minY && arc.ey <= maxY);
          if (isInsideSelection && !newSelectedArcs.includes(index)) {
            newSelectedArcs.push(index);
          }
        });
        setSelectedArcIndices(newSelectedArcs);
      } else if (tools[selectedTool] === "line") {
        if (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y) {
          setLines((prevLines) => [
            ...prevLines,
            { x1: startCoords.x, y1: startCoords.y, x2: endCoords.x, y2: endCoords.y },
          ]);
        }
      } else if (tools[selectedTool] === "circle") {
        const centerX = (startCoords.x + endCoords.x) / 2;
        const centerY = (startCoords.y + endCoords.y) / 2;
        const radius = Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2);
        if (radius > 0) {
          setCircles((prevCircles) => [...prevCircles, { cx: centerX, cy: centerY, r: radius }]);
        }
      } else if (tools[selectedTool] === "rueda") {
        const centerX = (startCoords.x + endCoords.x) / 2;
        const centerY = (startCoords.y + endCoords.y) / 2;
        const radius = Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2);
        if (radius > 0) {
          setCircles((prevCircles) => [...prevCircles, { cx: centerX, cy: centerY, r: radius }]);
          const diff =
            Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) *
            Math.SQRT1_2;
          const mediaX = (startCoords.x + endCoords.x) / 2;
          const mediaY = (startCoords.y + endCoords.y) / 2;
          setLines((prevLines) => [
            ...prevLines,
            {
              x1: mediaX - diff,
              y1: mediaY - diff,
              x2: mediaX + diff,
              y2: mediaY + diff,
            },
          ]);
          setLines((prevLines) => [
            ...prevLines,
            {
              x1: mediaX + diff,
              y1: mediaY - diff,
              x2: mediaX - diff,
              y2: mediaY + diff,
            },
          ]);
        }
      } else if (tools[selectedTool] === "point") {
        var discard = 0;
        if (startCoords.x === endCoords.x && startCoords.y === endCoords.y) {
          discard = 1;
        } else {
          circles.map((circle) => {
            if (
              circle.cx === startCoords.x &&
              circle.cy === startCoords.y &&
              circle.r === 1 &&
              circle.fill === "black"
            ) {
              discard = 1;
            }
          });
        }
        if (discard === 0) {
          setCircles((prevCircles) => [...prevCircles, { cx: startCoords.x, cy: startCoords.y, r: 1, fill: "black" }]);
        }
      } else if (tools[selectedTool] === "coma") {
        var discard = 0;
        if (startCoords.x === endCoords.x && startCoords.y === endCoords.y) {
          discard = 1;
        } else {
          circles.map((circle) => {
            if (
              circle.cx === startCoords.x &&
              circle.cy === startCoords.y &&
              circle.r === 1 &&
              circle.fill === "black"
            ) {
              discard = 1;
            }
          });
        }
        if (discard === 0) {
          setCircles((prevCircles) => [...prevCircles, { cx: startCoords.x, cy: startCoords.y, r: 1, fill: "black" }]);
          setCurves((prevCurves) => [
            ...prevCurves,
            {
              sx: startCoords.x + 1,
              sy: startCoords.y,
              mx: startCoords.x + 1,
              my: startCoords.y + 2.5,
              ex: startCoords.x - 1,
              ey: startCoords.y + 5,
            },
          ]);
        }
      } else if (tools[selectedTool] === "interrogante") {
        var discard = 0;
        if (startCoords.x === endCoords.x && startCoords.y === endCoords.y) {
          discard = 1;
        } else {
          circles.map((circle) => {
            if (
              circle.cx === startCoords.x &&
              circle.cy === startCoords.y &&
              circle.r === 1 &&
              circle.fill === "black"
            ) {
              discard = 1;
            }
          });
        }
        if (discard === 0) {
          setCircles((prevCircles) => [...prevCircles, { cx: startCoords.x, cy: startCoords.y, r: 1, fill: "black" }]);
          setLines((prevLines) => [
            ...prevLines,
            {
              x1: startCoords.x,
              y1: startCoords.y - squareSize + 4,
              x2: startCoords.x,
              y2: startCoords.y - squareSize + 6,
            },
          ]);
          setArcs((prevArcs) => [
            ...prevArcs,
            {
              sx: startCoords.x - 2,
              sy: startCoords.y - squareSize + 2,
              r: 2,
              h: 1,
              ex: startCoords.x + 2,
              ey: startCoords.y - squareSize + 2,
            },
          ]);
          setArcs((prevArcs) => [
            ...prevArcs,
            {
              sx: startCoords.x + 2,
              sy: startCoords.y - squareSize + 2,
              r: 2,
              h: 1,
              ex: startCoords.x,
              ey: startCoords.y - squareSize + 4,
            },
          ]);
        }
      } else if (tools[selectedTool] === "rectangle") {
        const rectX = Math.min(startCoords.x, endCoords.x);
        const rectY = Math.min(startCoords.y, endCoords.y);
        const width = Math.abs(endCoords.x - startCoords.x);
        const height = Math.abs(endCoords.y - startCoords.y);
        if (width > 0 && height > 0) {
          setRectangles((prevRectangles) => [...prevRectangles, { x: rectX, y: rectY, width: width, height: height }]);
        }
      } else if (tools[selectedTool] === "curveH") {
        const diffX = endCoords.x - startCoords.x;
        const middle = {};
        middle.y = (startCoords.y + endCoords.y) / 2;
        //middle.x = startCoords.x + 2 * diffX;
        middle.x = startCoords.x + diffX;
        if (startCoords.x !== endCoords.x && startCoords.y !== endCoords.y) {
          setCurves((prevCurves) => [
            ...prevCurves,
            { sx: startCoords.x, sy: startCoords.y, mx: middle.x, my: middle.y, ex: startCoords.x, ey: endCoords.y },
          ]);
        }
      } else if (tools[selectedTool] === "curveV") {
        const diffY = endCoords.y - startCoords.y;
        const middle = {};
        middle.x = (startCoords.x + endCoords.x) / 2;
        //middle.y = startCoords.y + 2 * diffY;
        middle.y = startCoords.y + diffY;
        if (startCoords.x !== endCoords.x && startCoords.y !== endCoords.y) {
          setCurves((prevCurves) => [
            ...prevCurves,
            { sx: startCoords.x, sy: startCoords.y, mx: middle.x, my: middle.y, ex: endCoords.x, ey: startCoords.y },
          ]);
        }
      } else if (tools[selectedTool] === "curveR") {
        const middle = { x: endCoords.x, y: (startCoords.y + endCoords.y) / 2 };
        if (startCoords.x !== endCoords.x && startCoords.y !== endCoords.y) {
          setCurves((prevCurves) => [
            ...prevCurves,
            { sx: startCoords.x, sy: startCoords.y, mx: middle.x, my: middle.y, ex: endCoords.x, ey: endCoords.y },
          ]);
        }
      } else if (tools[selectedTool] === "pizza") {
        const startPoint = { x: endCoords.x, y: startCoords.y };
        const radious = Math.abs(endCoords.x - startCoords.x);
        const endPoint = {
          x: startCoords.x,
          y: endCoords.y < startCoords.y ? startCoords.y - radious : startCoords.y + radious,
        };
        // Horario en segundo y cuarto cuadrante, si no antihorario
        const horario = (endCoords.x - startCoords.x) * (endCoords.y - startCoords.y) > 0 ? 1 : 0;
        if (startCoords.x !== endCoords.x && startCoords.y !== endCoords.y) {
          setArcs((prevArcs) => [
            ...prevArcs,
            { sx: startPoint.x, sy: startPoint.y, r: radious, h: horario, ex: endPoint.x, ey: endPoint.y },
          ]);
        }
      } else if (tools[selectedTool] === "semiH") {
        const startPoint = { x: startCoords.x, y: startCoords.y };
        const radious = Math.abs(endCoords.x - startCoords.x) / 2;
        const endPoint = {
          x: endCoords.x,
          y: startCoords.y,
        };
        // Horario en segundo y cuarto cuadrante, si no antihorario
        const horario = (endCoords.x - startCoords.x) * (endCoords.y - startCoords.y) > 0 ? 0 : 1;
        if (startCoords.x !== endCoords.x) {
          setArcs((prevArcs) => [
            ...prevArcs,
            { sx: startPoint.x, sy: startPoint.y, r: radious, h: horario, ex: endPoint.x, ey: endPoint.y },
          ]);
        }
      } else if (tools[selectedTool] === "semiV") {
        const startPoint = { x: startCoords.x, y: startCoords.y };
        const radious = Math.abs(endCoords.y - startCoords.y) / 2;
        const endPoint = {
          x: startCoords.x,
          y: endCoords.y,
        };
        // Horario en segundo y cuarto cuadrante, si no antihorario
        const horario = (endCoords.x - startCoords.x) * (endCoords.y - startCoords.y) > 0 ? 1 : 0;
        if (startCoords.y !== endCoords.y) {
          setArcs((prevArcs) => [
            ...prevArcs,
            { sx: startPoint.x, sy: startPoint.y, r: radious, h: horario, ex: endPoint.x, ey: endPoint.y },
          ]);
        }
      }
    }
    setRightClicking(false);
  }

  // Selección de líneas
  function handleItemClick(index, selectedArray, selectedSet) {
    console.log("Onclick event");
    console.log(tools[selectedTool]);
    if (isMoved) return;
    const newSelectedArray = [...selectedArray];
    if (newSelectedArray.includes(index)) {
      newSelectedArray.splice(newSelectedArray.indexOf(index), 1);
    } else {
      newSelectedArray.push(index);
    }
    selectedSet(newSelectedArray);
  }

  // Selección de herramienta
  function handleToolSelect(tool) {
    if (selectedTool !== tool) {
      setSelectedTool(tool);
    }
  }

  function unselectDelete() {
    setLines((prevLines) => prevLines.filter((_, index) => !selectedLineIndices.includes(index)));
    setCircles((prevCircles) => prevCircles.filter((_, index) => !selectedCircleIndices.includes(index)));
    setRectangles((prevRectangles) => prevRectangles.filter((_, index) => !selectedRectangleIndices.includes(index)));
    setCurves((prevCurves) => prevCurves.filter((_, index) => !selectedCurveIndices.includes(index)));
    setArcs((prevArcs) => prevArcs.filter((_, index) => !selectedArcIndices.includes(index)));
    unselectAll();
  }
  // Manejo de la tecla "Suprimir" para eliminar los seleccionados
  function handleKeyDown(e) {
    if (e.key === "Delete") {
      unselectDelete();
    }
  }

  // Manejo de la tecla "Suprimir" para eliminar los seleccionados
  function handleRightClick(e) {
    e.preventDefault();
    //unselectAll();
  }

  // Efecto para escuchar la tecla "Suprimir"
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedLineIndices, selectedCircleIndices, selectedRectangleIndices, selectedCurveIndices, selectedArcIndices]);

  useEffect(() => {
    const handleWheel = (event) => {
      setSelectedTool((prevTool) =>
        event.deltaY > 0 ? (prevTool - 1 + tools.length) % tools.length : (prevTool + 1 + tools.length) % tools.length
      );
    };

    window.addEventListener("wheel", handleWheel);

    // Nota: Sin esta limpieza, el listener permanecerá activo incluso después de desmontar
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white shadow-lg flex flex-col p-4">
        {/* Contenedor para las herramientas, organizadas en dos columnas */}
        <div className="flex flex-wrap gap-4">
          {/* Boton para la linea */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("line"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "line" ? "border-blue-500 border-2" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <line
                x1="0"
                y1="0"
                x2="24"
                y2="24"
                stroke={tools[selectedTool] === "line" ? "blue" : "black"}
                strokeWidth="2"
              />
            </svg>
          </button>
          {/* Boton para el círculo */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("circle"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "circle" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke={tools[selectedTool] === "circle" ? "blue" : "black"}
                strokeWidth="2"
              />
            </svg>
          </button>
          {/* Nuevo botón para el rectángulo */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("rectangle"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "rectangle" ? "border-2 border-blue-500" : ""
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
                stroke={tools[selectedTool] === "rectangle" ? "blue" : "black"}
                strokeWidth="2"
              />
            </svg>
          </button>
          {/* Nuevo botón para seleccionar */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("select"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "select" ? "border-2 border-blue-500" : ""
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
                stroke={tools[selectedTool] === "select" ? "blue" : "black"}
                strokeWidth="2"
                strokeDasharray="2,2" // Esto hace que la línea sea entrecortada
                strokeDashoffset="1"
              />
            </svg>
          </button>
          {/* Nuevo botón para mover */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("mover"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "mover" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M5 9l-3 3 3 3M9 5l3-3 3 3M9 19l3 3 3-3M19 9l3 3-3 3M2 12h20M12 2v20"
                stroke={tools[selectedTool] === "mover" ? "blue" : "black"}
              />
            </svg>
          </button>
          {/* Nuevo botón para curva izquierda derecha */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("curveH"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "curveH" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M12,0 Q24,12 12,24 M12,0 Q0,12 12,24"
                stroke={tools[selectedTool] === "curveH" ? "blue" : "black"}
              />
            </svg>
          </button>
          {/* Curva Vertical */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("curveV"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "curveV" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M0,12 Q12,0 24,12 M0,12 Q12,24 24,12"
                stroke={tools[selectedTool] === "curveV" ? "blue" : "black"}
              />
            </svg>
          </button>
          {/* Punto */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("point"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "point" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="2"
                fill={tools[selectedTool] === "point" ? "blue" : "black"}
                stroke={tools[selectedTool] === "point" ? "blue" : "black"}
                strokeWidth="2"
              />
            </svg>
          </button>
          {/* Pizza */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("pizza"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "pizza" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M14,2 A8,8 0 0 1 22,10 M22,13 A8,8 0 0 1 14,21 M11,21 A8,8 0 0 1 3,13 M3,10 A8,8 0 0 1 11,2"
                stroke={tools[selectedTool] === "pizza" ? "blue" : "black"}
              />
            </svg>
          </button>
          {/* SemiCirculo Horizontal */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("semiH"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "semiH" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M4,9 A8,8 0 0 1 20,9 M4,14 A8,8 0 0 0 20,14"
                stroke={tools[selectedTool] === "semiH" ? "blue" : "black"}
              />
            </svg>
          </button>
          {/* SemiCirculo Vertical */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("semiV"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "semiV" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M9,4 A8,8 0 0 0 9,20 M14,4 A8,8 0 0 1 14,20"
                stroke={tools[selectedTool] === "semiV" ? "blue" : "black"}
              />
            </svg>
          </button>
          {/* Curva Reloj de arena */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("curveR"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "curveR" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M10,10 Q6,6 6,0 M14,10 Q18,6 18,0 M10,14 Q6,18 6,24 M14,14 Q18,18 18,24"
                stroke={tools[selectedTool] === "curveR" ? "blue" : "black"}
              />
            </svg>
          </button>
          {/* Boton para la rueda */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("rueda"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "rueda" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke={tools[selectedTool] === "rueda" ? "blue" : "black"}
                strokeWidth="2"
              />
              <line
                x1="5"
                y1="5"
                x2="19"
                y2="19"
                stroke={tools[selectedTool] === "rueda" ? "blue" : "black"}
                strokeWidth="2"
              />
              <line
                x1="5"
                y1="19"
                x2="19"
                y2="5"
                stroke={tools[selectedTool] === "rueda" ? "blue" : "black"}
                strokeWidth="2"
              />
            </svg>
          </button>
          {/* Coma */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("coma"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "coma" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="2"
                fill={tools[selectedTool] === "coma" ? "blue" : "black"}
                stroke={tools[selectedTool] === "coma" ? "blue" : "black"}
                strokeWidth="1"
              />
              <path
                d="M13,11 Q14,15 11,17"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                stroke={tools[selectedTool] === "coma" ? "blue" : "black"}
              />
            </svg>
          </button>
          {/* Interrogante Txiki */}
          <button
            onClick={() => handleToolSelect(tools.indexOf("interrogante"))}
            className={`mb-4 p-2 bg-gray-200 rounded-full ${
              tools[selectedTool] === "interrogante" ? "border-2 border-blue-500" : ""
            }`}
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="20"
                r="2"
                fill={tools[selectedTool] === "interrogante" ? "blue" : "black"}
                stroke={tools[selectedTool] === "interrogante" ? "blue" : "black"}
                strokeWidth="1"
              />
              <line
                x1="12"
                y1="16"
                x2="12"
                y2="10"
                stroke={tools[selectedTool] === "interrogante" ? "blue" : "black"}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8,6 A4,4 0 1 1 12,10"
                stroke={tools[selectedTool] === "interrogante" ? "blue" : "black"}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
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
          onContextMenu={handleRightClick}
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
              onClick={() => handleItemClick(index, selectedLineIndices, setSelectedLineIndices)}
            />
          ))}
          {circles.map((circle, index) => (
            <circle
              key={index}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              stroke={selectedCircleIndices.includes(index) ? "blue" : "black"}
              fill={circle.r == 1 ? "black" : "none"}
              strokeWidth="2"
              strokeLinecap="round"
              onClick={() => handleItemClick(index, selectedCircleIndices, setSelectedCircleIndices)}
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
              strokeLinecap="round"
              onClick={() => handleItemClick(index, selectedRectangleIndices, setSelectedRectangleIndices)}
            />
          ))}
          {curves.map((curve, index) => (
            <path
              key={index}
              d={`M${curve.sx},${curve.sy} Q${curve.mx},${curve.my} ${curve.ex},${curve.ey}`}
              stroke={selectedCurveIndices.includes(index) ? "blue" : "black"}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              onClick={() => handleItemClick(index, selectedCurveIndices, setSelectedCurveIndices)}
            />
          ))}
          {arcs.map((arc, index) => (
            <path
              key={index}
              d={`M${arc.sx},${arc.sy} A${arc.r},${arc.r}, 0 0 ${arc.h} ${arc.ex},${arc.ey}`}
              stroke={selectedArcIndices.includes(index) ? "blue" : "black"}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              onClick={() => handleItemClick(index, selectedArcIndices, setSelectedArcIndices)}
            />
          ))}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "line" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <line
                x1={startCoords.x}
                y1={startCoords.y}
                x2={endCoords.x}
                y2={endCoords.y}
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "circle" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <circle
                cx={(startCoords.x + endCoords.x) / 2}
                cy={(startCoords.y + endCoords.y) / 2}
                r={Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2)}
                stroke="black"
                fill={
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) == 1
                    ? "black"
                    : "none"
                }
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "rueda" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <circle
                cx={(startCoords.x + endCoords.x) / 2}
                cy={(startCoords.y + endCoords.y) / 2}
                r={Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2)}
                stroke="black"
                fill={
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) == 1
                    ? "black"
                    : "none"
                }
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "rueda" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <line
                x1={
                  (startCoords.x + endCoords.x) / 2 -
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) *
                    Math.SQRT1_2
                }
                y1={
                  (startCoords.y + endCoords.y) / 2 -
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) *
                    Math.SQRT1_2
                }
                x2={
                  (startCoords.x + endCoords.x) / 2 +
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) *
                    Math.SQRT1_2
                }
                y2={
                  (startCoords.y + endCoords.y) / 2 +
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) *
                    Math.SQRT1_2
                }
                stroke="black"
                strokeWidth="2"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "rueda" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <line
                x1={
                  (startCoords.x + endCoords.x) / 2 +
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) *
                    Math.SQRT1_2
                }
                y1={
                  (startCoords.y + endCoords.y) / 2 -
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) *
                    Math.SQRT1_2
                }
                x2={
                  (startCoords.x + endCoords.x) / 2 -
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) *
                    Math.SQRT1_2
                }
                y2={
                  (startCoords.y + endCoords.y) / 2 +
                  Math.min(Math.abs(endCoords.x - startCoords.x) / 2, Math.abs(endCoords.y - startCoords.y) / 2) *
                    Math.SQRT1_2
                }
                stroke="black"
                strokeWidth="2"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "rectangle" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <rect
                x={Math.min(startCoords.x, endCoords.x)}
                y={Math.min(startCoords.y, endCoords.y)}
                width={Math.abs(endCoords.x - startCoords.x)}
                height={Math.abs(endCoords.y - startCoords.y)}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {(isDrawing && tools[selectedTool] === "select") || rightClicking ? (
            <rect
              x={Math.min(startCoords.x, endCoords.x)}
              y={Math.min(startCoords.y, endCoords.y)}
              width={Math.abs(endCoords.x - startCoords.x)}
              height={Math.abs(endCoords.y - startCoords.y)}
              fill="rgba(0, 0, 255, 0.1)"
            />
          ) : null}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "curveH" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <path
                d={`M${startCoords.x},${startCoords.y} Q${startCoords.x + 1 * (endCoords.x - startCoords.x)},${
                  (startCoords.y + endCoords.y) / 2
                } ${startCoords.x},${endCoords.y}`}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "curveV" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <path
                d={`M${startCoords.x},${startCoords.y} Q${(startCoords.x + endCoords.x) / 2},${
                  startCoords.y + 1 * (endCoords.y - startCoords.y)
                }, ${endCoords.x},${startCoords.y}`}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "curveR" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <path
                d={`M${startCoords.x},${startCoords.y} Q${endCoords.x},${(startCoords.y + endCoords.y) / 2}, ${
                  endCoords.x
                },${endCoords.y}`}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing && !rightClicking && tools[selectedTool] === "point" && (
            <circle
              cx={startCoords.x}
              cy={startCoords.y}
              r={startCoords.x != endCoords.x || startCoords.y != endCoords.y ? 1 : 0}
              stroke="black"
              fill="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
          {isDrawing && !rightClicking && tools[selectedTool] === "coma" && (
            <circle
              cx={startCoords.x}
              cy={startCoords.y}
              r={startCoords.x != endCoords.x || startCoords.y != endCoords.y ? 1 : 0}
              stroke="black"
              fill="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "coma" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <path
                d={`M${startCoords.x + 1},${startCoords.y} Q${startCoords.x + 1},${startCoords.y + 3}, ${
                  startCoords.x - 1
                },${startCoords.y + 5}`}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "pizza" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <path
                d={`M${endCoords.x},${startCoords.y} A${Math.abs(endCoords.x - startCoords.x)},${Math.abs(
                  endCoords.x - startCoords.x
                )}, 0 0 ${(endCoords.x - startCoords.x) * (endCoords.y - startCoords.y) > 0 ? 1 : 0} ${startCoords.x},${
                  endCoords.y < startCoords.y
                    ? startCoords.y - Math.abs(endCoords.x - startCoords.x)
                    : startCoords.y + Math.abs(endCoords.x - startCoords.x)
                }`}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "semiH" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <path
                d={`M${startCoords.x},${startCoords.y} A${Math.abs(endCoords.x - startCoords.x) / 2},${
                  Math.abs(endCoords.x - startCoords.x) / 2
                }, 0 0 ${(endCoords.x - startCoords.x) * (endCoords.y - startCoords.y) > 0 ? 0 : 1} ${endCoords.x},${
                  startCoords.y
                }`}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "semiV" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <path
                d={`M${startCoords.x},${startCoords.y} A${Math.abs(endCoords.y - startCoords.y) / 2},${
                  Math.abs(endCoords.y - startCoords.y) / 2
                }, 0 0 ${(endCoords.x - startCoords.x) * (endCoords.y - startCoords.y) > 0 ? 1 : 0} ${startCoords.x},${
                  endCoords.y
                }`}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "interrogante" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <circle
                cx={startCoords.x}
                cy={startCoords.y}
                r={startCoords.x != endCoords.x || startCoords.y != endCoords.y ? 1 : 0}
                stroke="black"
                fill="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "interrogante" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <path
                d={`M${startCoords.x - 2},${startCoords.y - squareSize + 2} A2,2 0 1 1 ${startCoords.x},${
                  startCoords.y - squareSize + 4
                }`}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          {isDrawing &&
            !rightClicking &&
            tools[selectedTool] === "interrogante" &&
            (startCoords.x != endCoords.x || startCoords.y != endCoords.y) && (
              <line
                x1={startCoords.x}
                y1={startCoords.y - squareSize + 4}
                x2={startCoords.x}
                y2={startCoords.y - squareSize + 6}
                stroke="black"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
        </svg>
        <button onClick={createSymbol}>Generar símbolo</button>
      </div>
    </div>
  );
}
