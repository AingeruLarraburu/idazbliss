// skipcq: JS-0128
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/traductor">Traductor</Link>
        </li>
        <li>
          <Link href="/generador">Generador</Link>
        </li>
        <li>
          <Link href="/prueba">Prueba</Link>
        </li>
      </ul>
    </nav>
  );
}
