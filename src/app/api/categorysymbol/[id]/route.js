import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { getSession, isadmin } from "@/libs/auth";

/* export async function GET(request, { params }) {
  const task = await prisma.task.findUnique({ where: { id: Number(params.id) } });
  return NextResponse.json(task);
}
 */
/* export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const task = await prisma.task.update({
      where: { id: Number(params.id) },
      data: data,
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({});
  }
} */

export async function DELETE(request, { params }) {
  // Comprobamos que esté autorizado
  const session = await getSession();
  if (!(session && session.user && session.user.email)) {
    return NextResponse.json({ error: "No estás autorizado" });
  }
  try {
    const symbolcategory = await prisma.symbolCategory.findUnique({
      where: { id: Number(params.id) },
    });
    const simbolo = await prisma.symbol.findUnique({
      where: { id: Number(symbolcategory.symbolId) },
    });
    if (simbolo.dictionaryId == 0) {
      if (!isadmin(session.user.email)) {
        return NextResponse.json({ error: "Sólo administradores pueden gestionar el diccionario Oficial" });
      }
    } else {
      const dict = await prisma.dictionary.findFirst({
        where: {
          id: Number(simbolo.dictionaryId),
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
    const relationRemoved = await prisma.symbolCategory.delete({ where: { id: Number(params.id) } });
    return NextResponse.json(relationRemoved);
  } catch (error) {
    return NextResponse.json(error.message);
  }
}
