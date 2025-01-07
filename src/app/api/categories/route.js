import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { checkKeys, isNotNullObject } from "@/utils/objects";
import { quitarTildesEspaciosMinuscula } from "@/utils/textUtils";
import { getSession, isadmin } from "@/libs/auth";

export async function GET() {
  try {
    // Obtener todos los registros de la tabla symbol
    //const symbols = await db.symbol.findMany();
    const categories = await prisma.category.findMany();

    // Retornar la respuesta con los datos en formato JSON
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching symbols:", error);
    // Retornar una respuesta de error con un mensaje adecuado
    return NextResponse.json([]);
  }
}

export async function POST(request, { params }) {
  // Comprobamos que esté autorizado
  const session = await getSession();
  if (!(session && session.user && session.user.email && isadmin(session.user.email))) {
    return NextResponse.json({ error: "No estás autorizado" });
  }
  // Simulate fetching data from a database or external API
  const { names } = await request.json();
  const languageKeys = ["nameEs", "nameEu"];
  // Comprobamos que los parámetros recibidos son json
  if (!isNotNullObject(names)) {
    return NextResponse.json({ error: "Names not json" });
  }
  // Comprobamos que los keys son válidos
  if (!checkKeys(languageKeys, names)) {
    return NextResponse.json({ error: "Invalid name keys" });
  }
  // Comprobamos que se han definido nombres
  for (const key in names) {
    if (names[key] === "") {
      return NextResponse.json({ error: "Falta al menos un nombre" });
    }
  }
  try {
    // Comprobamos que no existe aún la categoría
    const symbols = await prisma.category.findMany({
      select: {
        nameEs: true,
        nameEu: true,
      },
    });
    const normalizedEs = quitarTildesEspaciosMinuscula(names.nameEs);
    const normalizedEu = quitarTildesEspaciosMinuscula(names.nameEu);
    const existe =
      symbols.length == 0
        ? false
        : symbols.some((symbol) => {
            const nameEsNormalized = symbol.nameEs ? quitarTildesEspaciosMinuscula(symbol.nameEs) : "";
            const nameEuNormalized = symbol.nameEu ? quitarTildesEspaciosMinuscula(symbol.nameEu) : "";
            return nameEsNormalized == normalizedEs || nameEuNormalized == normalizedEu;
          });
    if (!existe) {
      // Si no existe, creamos la categoría
      const toCreate = {};
      for (const key in names) {
        toCreate[key] = names[key];
      }
      const newCategory = await prisma.category.create({
        data: toCreate,
      });
      return NextResponse.json(newCategory);
    }
    return NextResponse.json({ error: "El nombre ya existe" });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
