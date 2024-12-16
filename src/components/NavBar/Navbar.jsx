// skipcq: JS-0128

import Logo from "../Logo";
import Navitem from "./Navitem";

export default function Navbar() {
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
    { name: "Idioma", link: "/" },
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
      <h1 className="mx-auto">IdazBliss</h1>
      <ul className="flex flex-row gap-2 p-2">
        {itemsRight.map((item, index) => (
          <li key={index}>
            <Navitem name={item.name} link={item.link} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
