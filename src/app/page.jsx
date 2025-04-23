import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Bliss: El lenguaje para todos</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-10">
        Una plataforma interactiva para traducir texto a símbolos Bliss y viceversa. Aprende, juega, explora y crea con
        uno de los lenguajes más inclusivos del mundo.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {features.map((feature) => (
          <Link
            key={feature.name}
            href={feature.link}
            className="bg-white rounded-2xl shadow-md p-6 text-left hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-500 border border-transparent"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-2">{feature.name}</h2>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    name: "Diccionario",
    link: "/diccionario",
    description: "Consulta el significado de cada símbolo Bliss y explora su contexto de uso.",
  },
  {
    name: "Traductor",
    link: "/traductor",
    description: "Convierte texto a símbolos Bliss y símbolos Bliss a texto de forma instantánea.",
  },
  {
    name: "Generador",
    link: "/generador",
    description: "Crea tus propios símbolos combinando ideas para expresar conceptos únicos.",
  },
  {
    name: "Colecciones",
    link: "/colecciones",
    description: "Guarda tus símbolos favoritos y crea grupos personalizados para usar después.",
  },
  {
    name: "Juegos",
    link: "/juegos",
    description: "Aprende Bliss jugando. Practica con actividades dinámicas y entretenidas.",
  },
  {
    name: "Tutoriales",
    link: "/tutoriales",
    description: "Guías paso a paso para dominar el lenguaje Bliss desde lo más básico hasta avanzado.",
  },
];
