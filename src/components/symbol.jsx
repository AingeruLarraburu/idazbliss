// components/Symbol.js
import React from "react";
import {
  numHorizontal,
  numVertical,
  squareSize,
  firstDivision,
  secondDivision,
  viewBoxWidth,
  viewBoxHeight,
} from "@/config/config";

function Symbol({ symbol, className }) {
  const boxW = symbol.width * squareSize;
  const renglones = 0;
  //console.log(symbol.rectangles[0].width);
  return (
    <div className={`${className} flex`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="flex-1 max-w-full max-h-full"
        viewBox={`-2 -2 ${boxW + 4} ${viewBoxHeight + 4}`}
      >
        {renglones === 1 && (
          <>
            {Array.from({ length: numVertical }).map((_, rowIndex) =>
              Array.from({ length: symbol.width }).map((_, colIndex) => (
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
            <line x1="0" y1={firstDivision} x2={boxW} y2={firstDivision} stroke="grey" strokeWidth="2" />
            <line x1="0" y1={secondDivision} x2={boxW} y2={secondDivision} stroke="grey" strokeWidth="2" />
          </>
        )}
        {symbol.lines?.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {symbol.circles?.map((circle, index) => (
          <circle
            key={index}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            stroke="black"
            fill={circle.r == 1 ? "black" : "none"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {symbol.rectangles?.map((rect, index) => (
          <rect
            key={index}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            stroke="black"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {symbol.curves?.map((curve, index) => (
          <path
            key={index}
            d={`M${curve.sx},${curve.sy} Q${curve.mx},${curve.my} ${curve.ex},${curve.ey}`}
            stroke="black"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {symbol.arcs?.map((arc, index) => (
          <path
            key={index}
            d={`M${arc.sx},${arc.sy} A${arc.r},${arc.r}, 0 0 ${arc.h} ${arc.ex},${arc.ey}`}
            stroke="black"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

export default Symbol;
