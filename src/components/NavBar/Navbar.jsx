"use client";
import Navitem from "./Navitem";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const itemsLeft = [
    { name: "Diccionario", link: "/diccionario" },
    { name: "Traductor", link: "/traductor" },
    { name: "Generador", link: "/generador" },
    { name: "Colecciones", link: "/colecciones" },
    { name: "Juegos", link: "/juegos" },
    { name: "Tutoriales", link: "/tutoriales" },
    { name: "Manuales", link: "/manuales" },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white flex items-center justify-between px-4 py-1.5 shadow-sm">
      {/* IZQUIERDA: solo menús */}
      <ul className="flex items-center gap-3">
        {itemsLeft.map((item) => (
          <li key={item.link}>
            <Navitem name={item.name} link={item.link} isActive={pathname.startsWith(item.link)} />
          </li>
        ))}
      </ul>

      {/* CENTRO: carrusel de 3 jpg sin aumentar altura */}
      <Link href="/" className="flex items-center gap-2">
        <img src="/Easo.jpg" alt="Easo" className="max-h-8 w-auto object-contain" />
        <img src="/Plaiaundi.jpg" alt="Plaiaundi" className="max-h-8 w-auto object-contain" />
        <img src="/Eskurtze.jpg" alt="Eskurtze" className="max-h-8 w-auto object-contain" />
      </Link>

      {/* DERECHA: login/logout */}
      <ul className="flex items-center gap-4">
        {session?.user ? (
          <>
            <li>
              <img
                src={session.user.image || "/IdazBlissLogo.jpg"}
                alt="Foto de perfil"
                className="h-8 w-8 rounded-full object-cover border border-gray-300"
              />
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="relative px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors
                           after:content-[''] after:absolute after:left-0 after:bottom-0
                           after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300
                           hover:after:w-full"
              >
                Salir
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              {/* Icono genérico de usuario */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-8 w-8 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12
                     15.75a7.488 7.488 0 0 0-5.982
                     2.975m11.963 0a9 9 0 1
                     0-11.963 0m11.963
                     0A8.966 8.966 0 0
                     1 12 21a8.966 8.966 0 0
                     1-5.982-2.275M15
                     9.75a3 3 0 1
                     1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </li>
            <li>
              <button
                onClick={() => signIn()}
                className="relative px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors
                           after:content-[''] after:absolute after:left-0 after:bottom-0
                           after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300
                           hover:after:w-full"
              >
                Entrar
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
