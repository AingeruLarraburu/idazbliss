import Link from "next/link";

function Navitem({ name, link }) {
  return <Link href={link}>{name}</Link>;
}

export default Navitem;
