import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { getSession, isadmin } from "@/libs/auth";

async function isCollectionOwnedByEmail(collectionSymbolId, email) {
  try {
    const collectionSymbol = await prisma.collectionSymbol.findUnique({
      where: { id: Number(collectionSymbolId) },
      include: {
        Collection: true,
      },
    });

    if (!collectionSymbol) {
      console.log("CollectionSymbol no encontrado");
      return false;
    }
    console.log("Email:", email);
    console.log("CollectionSymbol email:", collectionSymbol.Collection.email);
    return collectionSymbol.Collection.email === email;
  } catch (error) {
    console.error("Error al verificar el propietario de la colección:", error);
    return false;
  }
}

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
  if (!isCollectionOwnedByEmail(params.id, session.user.email)) {
    return NextResponse.json({ error: "No puedes borrar una colección que no es tuya" });
  }
  try {
    const relationRemoved = await prisma.collectionSymbol.delete({ where: { id: Number(params.id) } });
    return NextResponse.json(relationRemoved);
  } catch (error) {
    return NextResponse.json(error.message);
  }
}
