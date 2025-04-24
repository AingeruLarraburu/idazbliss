"use client";

import React, { useState, useEffect } from "react";
import { CheckIcon, XMarkIcon, StarIcon } from "@heroicons/react/24/solid";
import Confetti from "react-confetti";
import Symbol from "@/components/symbol";

export default function Juegos() {
  const [selectedGame, setSelectedGame] = useState("juego1");

  // Estado juego1
  const [started1, setStarted1] = useState(false);
  const [current1, setCurrent1] = useState(0);
  const [score1, setScore1] = useState(0);
  const [correctCount1, setCorrectCount1] = useState(0);
  const [wrongCount1, setWrongCount1] = useState(0);
  const [consecWrong1, setConsecWrong1] = useState(0);
  const [timer1, setTimer1] = useState(120);
  const [finished1, setFinished1] = useState(false);
  const [results1, setResults1] = useState([]);
  const [questions1, setQuestions1] = useState([]);
  const [freshStart1, setFreshStart1] = useState(0);

  // Estado juego2
  const [started2, setStarted2] = useState(false);
  const [current2, setCurrent2] = useState(0);
  const [score2, setScore2] = useState(0);
  const [correctCount2, setCorrectCount2] = useState(0);
  const [wrongCount2, setWrongCount2] = useState(0);
  const [consecWrong2, setConsecWrong2] = useState(0);
  const [timer2, setTimer2] = useState(120);
  const [finished2, setFinished2] = useState(false);
  const [results2, setResults2] = useState([]);
  const [questions2, setQuestions2] = useState([]);
  const [freshStart2, setFreshStart2] = useState(0);

  // Símbolos compartidos
  const [symbols, setSymbols] = useState([]);

  // Nombre del usuario
  const [showNameModal, setShowNameModal] = useState(false);
  const [username, setUsername] = useState("");
  const DEFAULT_NAME = "Jugador1";

  // Historial por juego
  const [leaderboard1, setLeaderboard1] = useState([]);
  const [leaderboard2, setLeaderboard2] = useState([]);
  const STORAGE_KEY = "puntuaciones";

  // Leer símbolos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/symbols");
        const newData = await response.json();
        localStorage.setItem("cachedOfficialSymbols", JSON.stringify(newData));
        setSymbols(newData);
      } catch (error) {
        console.error("Error fetching symbols:", error);
      }
    };
    fetchData();
  }, []);

  // Generar preguntas y cargar historial cuando cambia selectedGame o symbols
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : {};
    setLeaderboard1(all["juego1"] || []);
    setLeaderboard2(all["juego2"] || []);

    function getRandom(array, count) {
      return [...array].sort(() => 0.5 - Math.random()).slice(0, count);
    }
    function getRandomExcept(array, idx) {
      return array
        .filter((_, i) => i !== idx)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    }

    if (selectedGame === "juego1") {
      const r1 = getRandom(symbols, 10);
      const names1 = r1.map((s) => `${s.nameEs} / ${s.nameEu}`);
      setQuestions1(
        r1.map((sym, i) => {
          const idx = Math.floor(Math.random() * 4);
          const opts = getRandomExcept(names1, i);
          opts[idx] = names1[i];
          return { question: { json: sym.jsonData }, options: opts, answer: idx };
        })
      );
    }

    if (selectedGame === "juego2") {
      const r2 = getRandom(symbols, 10);
      const json2 = r2.map((s) => s.jsonData);
      setQuestions2(
        r2.map((sym, i) => {
          const names2 = `${sym.nameEs} / ${sym.nameEu}`;
          const idx = Math.floor(Math.random() * 4);
          const opts = getRandomExcept(json2, i);
          opts[idx] = json2[i];
          return { question: names2, options: opts, answer: idx };
        })
      );
    }
  }, [selectedGame, symbols, freshStart1, freshStart2]);

  // Guardar resultados
  useEffect(() => {
    if (!finished1) return;
    const date = new Date().toLocaleDateString();
    const entry = { date, name: username || DEFAULT_NAME, correct: correctCount1, wrong: wrongCount1, score: score1 };
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const list = [...(stored.juego1 || []), entry].sort((a, b) => b.score - a.score).slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, juego1: list }));
    setLeaderboard1(list);
  }, [finished1]);

  useEffect(() => {
    if (!finished2) return;
    const date = new Date().toLocaleDateString();
    const entry = { date, name: username || DEFAULT_NAME, correct: correctCount2, wrong: wrongCount2, score: score2 };
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const list = [...(stored.juego2 || []), entry].sort((a, b) => b.score - a.score).slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, juego2: list }));
    setLeaderboard2(list);
  }, [finished2]);

  const reset1 = () => {
    setStarted1(false);
    setFinished1(false);
    setCurrent1(0);
    setScore1(0);
    setCorrectCount1(0);
    setWrongCount1(0);
    setConsecWrong1(0);
    setTimer1(120);
    setResults1([]);
  };
  const reset2 = () => {
    setStarted2(false);
    setFinished2(false);
    setCurrent2(0);
    setScore2(0);
    setCorrectCount2(0);
    setWrongCount2(0);
    setConsecWrong2(0);
    setTimer2(120);
    setResults2([]);
  };

  useEffect(() => {
    if (started1 && !finished1) {
      if (timer1 <= 0) return setFinished1(true);
      const iv = setInterval(() => setTimer1((t) => t - 1), 1000);
      return () => clearInterval(iv);
    }
  }, [started1, finished1, timer1]);

  useEffect(() => {
    if (started2 && !finished2) {
      if (timer2 <= 0) return setFinished2(true);
      const iv = setInterval(() => setTimer2((t) => t - 1), 1000);
      return () => clearInterval(iv);
    }
  }, [started2, finished2, timer2]);

  const handleAnswer1 = (i) => {
    if (finished1) return;
    const ok = i === questions1[current1].answer;
    ok
      ? (setScore1((s) => s + 4), setCorrectCount1((c) => c + 1), setConsecWrong1(0))
      : (setConsecWrong1((n) => n + 1), setScore1((s) => s - (consecWrong1 + 1)), setWrongCount1((w) => w + 1));
    setResults1((r) => [...r, ok]);
    const nxt = current1 + 1;
    nxt >= questions1.length ? setFinished1(true) : setCurrent1(nxt);
  };

  const handleAnswer2 = (i) => {
    if (finished2) return;
    const ok = i === questions2[current2].answer;
    ok
      ? (setScore2((s) => s + 4), setCorrectCount2((c) => c + 1), setConsecWrong2(0))
      : (setConsecWrong2((n) => n + 1), setScore2((s) => s - (consecWrong2 + 1)), setWrongCount2((w) => w + 1));
    setResults2((r) => [...r, ok]);
    const nxt = current2 + 1;
    nxt >= questions2.length ? setFinished2(true) : setCurrent2(nxt);
  };

  const start1 = () => {
    reset1();
    setFreshStart1((f) => f + 1);
    setShowNameModal(true);
  };
  const start2 = () => {
    reset2();
    setFreshStart2((f) => f + 1);
    setShowNameModal(true);
  };
  const confirmName = () => {
    setShowNameModal(false);
    selectedGame === "juego1" ? setStarted1(true) : setStarted2(true);
  };

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-4 space-y-4">
        {[
          { id: "juego1", name: "Bliss a Texto" },
          { id: "juego2", name: "Texto a Bliss" },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setSelectedGame(g.id);
              g.id === "juego1" ? reset1() : reset2();
            }}
            className={`w-full p-2 rounded-lg text-center text-sm font-medium ${
              selectedGame === g.id ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>
      <div className="flex-1 p-6 flex flex-col">
        {showNameModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold text-center mb-4">Ingresa tu nombre</h2>
              <input
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                placeholder="Tu nombre"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNameModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button onClick={confirmName} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedGame === "juego1" && !started1 && !finished1 && (
          <div className="flex flex-col items-center flex-1 bg-white rounded-md p-8">
            <button
              onClick={start1}
              className="bg-green-600 text-white rounded-lg px-8 py-4 text-xl font-bold hover:bg-green-700 transition"
            >
              Empezar
            </button>
            <div className="mt-8 w-full text-center">
              <h2 className="text-xl font-semibold mb-2">Mejores Jugadas:</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {["Fecha", "Nombre", "Aciertos", "Fallos", "Puntuación"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard1.map((u, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      {["date", "name", "correct", "wrong", "score"].map((f) => (
                        <td key={f} className="px-3 py-2 text-sm text-gray-600">
                          {u[f]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedGame === "juego1" && started1 && !finished1 && (
          <div className="flex-grow flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Puntuación:</span>
                <div className="relative">
                  <StarIcon className="text-yellow-400 w-8 h-8" />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
                    {score1}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Resultados:</span>
                <div className="flex space-x-1">
                  {results1.map((ok, i) => (
                    <div
                      key={i}
                      className={`p-1 rounded-full ${ok ? "bg-green-100" : "bg-red-100"}
`}
                    >
                      {ok ? (
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <XMarkIcon className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">
                Pregunta {current1 + 1} de {questions1.length}
              </span>
              <span className="text-sm">Tiempo: {formatTime(timer1)}</span>
            </div>
            <div className="bg-white rounded-md p-4 shadow flex-1 flex flex-col">
              <div className="flex-1 flex items-center justify-center border-2 border-gray-200 rounded mb-4">
                <Symbol symbol={questions1[current1].question.json} className="h-full w-auto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {questions1[current1].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer1(i)}
                    className="bg-blue-100 hover:bg-blue-200 rounded-lg py-2 text-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedGame === "juego1" && finished1 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Confetti />
            <div className="bg-white rounded-lg p-6 text-center">
              <h1 className="text-2xl font-bold mb-2">{username || DEFAULT_NAME}</h1>
              <p className="mb-1">Aciertos: {correctCount1}</p>
              <p className="mb-1">Fallos: {wrongCount1}</p>
              <p className="mb-4">Puntuación: {score1}</p>
              <button onClick={reset1} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
                Volver
              </button>
            </div>
          </div>
        )}

        {/* Juego2 se repite igual que juego1 */}
        {selectedGame === "juego2" && !started2 && !finished2 && (
          <div className="flex flex-col items-center flex-1 bg-white rounded-md p-8">
            <button
              onClick={start2}
              className="bg-green-600 text-white rounded-lg px-8 py-4 text-xl font-bold hover:bg-green-700 transition"
            >
              Empezar
            </button>
            <div className="mt-8 w-full text-center">
              <h2 className="text-xl font-semibold mb-2">Mejores jugadas:</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {["Fecha", "Nombre", "Aciertos", "Fallos", "Puntuación"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard2.map((u, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      {["date", "name", "correct", "wrong", "score"].map((f) => (
                        <td key={f} className="px-3 py-2 text-sm text-gray-600">
                          {u[f]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedGame === "juego2" && started2 && !finished2 && (
          <div className="flex-grow flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Puntuación:</span>
                <div className="relative">
                  <StarIcon className="text-yellow-400 w-8 h-8" />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
                    {score2}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Resultados:</span>
                <div className="flex space-x-1">
                  {results2.map((ok, i) => (
                    <div key={i} className={`p-1 rounded-full ${ok ? "bg-green-100" : "bg-red-100"}`}>
                      {ok ? (
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <XMarkIcon className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">
                Pregunta {current2 + 1} de {questions2.length}
              </span>
              <span className="text-sm">Tiempo: {formatTime(timer2)}</span>
            </div>
            <div className="bg-white rounded-md p-4 shadow flex-1 flex flex-col">
              <h1 className="w-full text-center font-bold mb-4">{questions2[current2].question}</h1>
              <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
                {questions2[current2].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer2(i)}
                    className="bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center"
                  >
                    <Symbol symbol={opt} className="h-full w-auto object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedGame === "juego2" && finished2 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Confetti />
            <div className="bg-white rounded-lg p-6 text-center">
              <h1 className="text-2xl font-bold mb-2">{username || DEFAULT_NAME}</h1>
              <p className="mb-1">Aciertos: {correctCount2}</p>
              <p className="mb-1">Fallos: {wrongCount2}</p>
              <p className="mb-4">Puntuación: {score2}</p>
              <button onClick={reset2} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
