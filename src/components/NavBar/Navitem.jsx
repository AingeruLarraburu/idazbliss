import Link from "next/link";

function Navitem({ name, link, isActive }) {
  return (
    <Link
      href={link}
      className={`relative px-1 py-2 text-base font-medium transition-colors duration-200 ${
        isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
      }`}
    >
      <span
        className={`after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 ${
          isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
        }`}
      >
        {name}
      </span>
    </Link>
  );
}

export default Navitem;
