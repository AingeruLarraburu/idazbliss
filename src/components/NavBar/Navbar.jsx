// skipcq: JS-0128
"use client";
import Logo from "../Logo";
import Navitem from "./Navitem";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  console.log(session);
  const itemsLeft = [
    { name: "Diccionario", link: "/diccionario" },
    { name: "Traductor", link: "/traductor" },
    { name: "Generador", link: "/generador" },
    { name: "Juegos", link: "/juegos" },
    { name: "Tutoriales", link: "/tutoriales" },
    { name: "Colecciones", link: "/colecciones" },
  ];
  const itemsRight = [
    { name: "Perfil", link: "/" },
    { name: "Es", link: "/" },
  ];
  return (
    <nav className="border border-red-800 flex flex-row justify-between items-center">
      <ul className="flex flex-row gap-2 p-2">
        {itemsLeft.map((item) => (
          <li key={item.link}>
            <Navitem name={item.name} link={item.link} />
          </li>
        ))}
      </ul>
      {/* <h1 className="mx-auto">IdazBliss</h1>*/}
      <ul className="flex flex-row gap-2 p-1">
        {session?.user ? (
          <div className="flex flex-row gap-2 justify-content-center items-center">
            {/* <p>{session.user.name}</p>*/}
            <img src={session.user.image} alt="Foto" className="W-8 h-8 rounded-full cursor-pointer"></img>
            <li key="1">
              <button onClick={() => signOut()}>Salir</button>
            </li>
          </div>
        ) : (
          <div className="flex flex-row gap-2 justify-content-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
              className="w-8 h-8 rounded-full cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <li key="1">
              <button onClick={() => signIn()}>Entrar</button>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
}
