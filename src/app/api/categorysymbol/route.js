import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { getSession, isadmin } from "@/libs/auth";

/* export async function GET() {
  try {
    // Obtener todos los registros de la tabla symbol
    //const symbols = await db.symbol.findMany();
    const categories = await prisma.category.findMany();

    // Retornar la respuesta con los datos en formato JSON
    console.log(categories);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching symbols:", error);

    // Retornar una respuesta de error con un mensaje adecuado
    return NextResponse.json([]);
  }
}
 */
export async function POST(request, { params }) {
  // Simulate fetching data from a database or external API
  // Comprobamos que esté autorizado
  const session = await getSession();
  const { categoryId, symbolId } = await request.json();
  if (!(session && session.user && session.user.email)) {
    return NextResponse.json({ error: "No estás autorizado" });
  }
  try {
    const simbolo = await prisma.symbol.findUnique({
      where: { id: Number(symbolId) },
    });
    if (simbolo.dictionaryId == 0) {
      if (!isadmin(session.user.email)) {
        return NextResponse.json({ error: "Sólo administradores pueden gestionar el diccionario Oficial" });
      }
    } else {
      const dict = await prisma.dictionary.findFirst({
        where: {
          id: simbolo.dictionaryId,
          email: session.user.email,
        },
      });
      if (!dict) {
        return NextResponse.json({ error: "No estás autorizado" });
      }
    }
  } catch (error) {
    console.log("Error en la consulta de diccionario: ", error);
    return NextResponse.json({ error: "No autorizado" });
  }
  try {
    const newRelation = await prisma.symbolCategory.create({
      data: { categoryId, symbolId },
    });
    return NextResponse.json(newRelation);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
