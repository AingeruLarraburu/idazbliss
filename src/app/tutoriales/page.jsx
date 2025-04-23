"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const sections = [
  {
    id: "introduccion",
    title: "Introducción a Bliss",
    color: "bg-blue-100",
    content: `Bliss es un lenguaje de símbolos diseñado para facilitar la comunicación de personas con dificultades en el lenguaje hablado. Fue desarrollado en la década de 1940 por Charles K. Bliss y se basa en relaciones lógicas entre símbolos.`,
  },
  {
    id: "historia",
    title: "Historia de Bliss",
    color: "bg-green-100",
    content: `El Dr. Charles K. Bliss creó Blissymbolics como un sistema universal de símbolos ideográficos tras observar la complejidad de los idiomas escritos y buscando una forma más accesible de comunicación. Con el tiempo, se adaptó para usuarios de comunicación aumentativa y alternativa (CAA).`,
  },
  {
    id: "principios",
    title: "Principios Básicos",
    color: "bg-yellow-100",
    content: `Cada símbolo Bliss incorpora una idea o concepto. Combinando y modificando símbolos, se expresan oraciones y matices complejos. Los componentes básicos incluyen formas geométricas, líneas y puntos.`,
  },
  {
    id: "sintaxis",
    title: "Sintaxis y Gramática",
    color: "bg-pink-100",
    content: `La gramática de Bliss sigue un orden lógico: Sujeto + Verbo + Objeto. El tamaño, la posición y la orientación de los símbolos pueden alterar el significado. Aprender reglas de combinación es esencial.`,
  },
  {
    id: "ejemplos",
    title: "Ejemplos de Uso",
    color: "bg-purple-100",
    content: `1. "Yo como manzana": símbolo de persona + símbolo de comer + símbolo de manzana.
2. "Está lloviendo": símbolo de lluvia + modificador de tiempo.`,
  },
  {
    id: "recursos",
    title: "Recursos y Enlaces",
    color: "bg-red-100",
    content: `- Documentación oficial de Bliss.
- Colecciones de símbolos online.
- Cursos y tutoriales en video.`,
  },
];

export default function TutorialesPage() {
  return (
    <div className="space-y-16 py-12 px-6 bg-gray-50">
      {sections.map(({ id, title, color, content }) => (
        <Section key={id} id={id} title={title} color={color} content={content} />
      ))}
    </div>
  );
}

function Section({ id, title, color, content }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.6 }}
      className={`${color} rounded-2xl p-8 shadow-lg max-w-4xl mx-auto`}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-700 whitespace-pre-line">{content}</p>
    </motion.section>
  );
}
