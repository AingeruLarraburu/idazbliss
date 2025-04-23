import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { getSession } from "@/libs/auth";

// PUT: actualizar el nombre de un diccionario
export async function PUT(request, { params }) {
  const { id } = params;
  const { name } = await request.json();
  const session = await getSession();

  if (!(session && session.user && session.user.email)) {
    return NextResponse.json({ error: "No estás autorizado" });
  }

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Falta el nuevo nombre de la colección" });
  }

  try {
    const updated = await prisma.collection.updateMany({
      where: {
        id: parseInt(id),
        email: session.user.email,
      },
      data: {
        name: name,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "No se encontró el diccionario o no tienes permisos" });
    }

    return NextResponse.json({ success: true, message: "Diccionario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el diccionario:", error);
    return NextResponse.json({ error: "Error interno del servidor" });
  }
}

// DELETE: eliminar un diccionario
export async function DELETE(request, { params }) {
  const { id } = params;
  const session = await getSession();

  if (!(session && session.user && session.user.email)) {
    return NextResponse.json({ error: "No estás autorizado" });
  }

  try {
    const deleted = await prisma.collection.deleteMany({
      where: {
        id: parseInt(id),
        email: session.user.email,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "No se encontró el diccionario o no tienes permisos" });
    }

    return NextResponse.json({ success: true, message: "Diccionario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el diccionario:", error);
    return NextResponse.json({ error: "Error interno del servidor" });
  }
}
