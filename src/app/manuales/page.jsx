"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Menu } from "lucide-react"; // Asegúrate de tener instalado lucide-react

const GENERADOR_ID = "1sHqq3iwf10-ipu061q4qGszFlSNWmKqy";
const GENERADOR_BASE = `https://drive.google.com/file/d/${GENERADOR_ID}/preview`;

const DICCIONARIO_ID = "1Rx7xBgYF2blmofDp6l1HD9E3EzTwGQrh";
const DICCIONARIO_BASE = `https://drive.google.com/file/d/${DICCIONARIO_ID}/preview`;

const TRADUCTOR_ID = "1UeUX-eqBpxG67WpGlG1DnQ75MuY8zJQ6";
const TRADUCTOR_BASE = `https://drive.google.com/file/d/${TRADUCTOR_ID}/preview`;

const COLECCIONES_ID = "1X-wHiGkhhdxo2Vx_RVhwG3naio5Kh4ln";
const COLECCIONES_BASE = `https://drive.google.com/file/d/${COLECCIONES_ID}/preview`;

const JUEGOS_ID = "1w8nWxOKsQzg--D1EcJZHUG-SAwDSYRQV";
const JUEGOS_BASE = `https://drive.google.com/file/d/${JUEGOS_ID}/preview`;

const manuals = [
  {
    id: "diccionario",
    title: "Diccionario",
    color: "bg-green-100",
    description: `Navega por todos los símbolos disponibles con definiciones y ejemplos.\nFiltra por categoría o busca directamente por nombre.`,
    embedUrl: DICCIONARIO_BASE,
  },
  {
    id: "generador",
    title: "Generador",
    color: "bg-blue-100",
    description: `Crea símbolos combinando formas y elementos básicos.\nUtiliza el generador para diseñar nuevos símbolos personalizados.`,
    embedUrl: GENERADOR_BASE,
  },
  {
    id: "traductor",
    title: "Traductor",
    color: "bg-yellow-100",
    description: `Convierte texto a símbolos Bliss o símbolos Bliss a texto.\nIdeal para practicar y comprobar traducciones.`,
    embedUrl: TRADUCTOR_BASE,
  },
  {
    id: "colecciones",
    title: "Colecciones",
    color: "bg-pink-100",
    description: `Organiza tus símbolos en colecciones a tu medida.\nCrea y edita conjuntos de símbolos.`,
    embedUrl: COLECCIONES_BASE,
  },
  {
    id: "juegos",
    title: "Juegos",
    color: "bg-purple-100",
    description: `Pon a prueba tus conocimientos con diferentes juegos.`,
    embedUrl: JUEGOS_BASE,
  },
  {
    id: "tutoriales",
    title: "Tutoriales",
    color: "bg-red-100",
    description: `Accede a guías para comprender y dominar el lenguaje de símbolos Bliss.`,
    embedUrl: JUEGOS_BASE,
  },
];

export default function ManualesPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false); // Cierra el menú después de hacer scroll
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden bg-white border-b p-4 z-10">
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 text-gray-700">
          <Menu className="w-6 h-6" />
          <span className="font-semibold">Manuales</span>
        </button>
        {menuOpen && (
          <ul className="mt-4 space-y-2">
            {manuals.map(({ id, title }) => (
              <li key={id}>
                <button
                  onClick={() => handleScroll(id)}
                  className="block w-full text-left p-2 text-gray-700 hover:bg-gray-200 rounded"
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:block md:w-1/4 bg-white border-r p-4 overflow-auto">
        <ul className="space-y-2">
          {manuals.map(({ id, title }) => (
            <li key={id}>
              <button
                onClick={() => handleScroll(id)}
                className="block w-full text-left p-2 text-gray-700 hover:bg-gray-200 rounded"
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6 space-y-16">
        {manuals.map(({ id, title, color, description, embedUrl }) => (
          <Section key={id} id={id} title={title} color={color} description={description} embedUrl={embedUrl} />
        ))}
      </div>
    </div>
  );
}

function Section({ id, title, color, description, embedUrl }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.6 }}
      className={`${color} scroll-mt-24 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto flex flex-col space-y-6`}
    >
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-700 whitespace-pre-line">{description}</p>
      <div className="w-full h-0 pb-[56.25%] relative">
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={`${title} video`}
        />
      </div>
    </motion.section>
  );
}
