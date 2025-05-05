import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { checkKeys, isNotNullObject } from "@/utils/objects";
import { quitarTildesEspaciosMinuscula } from "@/utils/textUtils";
import { getSession, isadmin } from "@/libs/auth";

export async function GET() {
  try {
    // Obtener todos los registros de la tabla symbol y las categorías asociadas
    const session = await getSession();
    const user = session?.user?.email || "idazbliss@gmail.com";
    console.log("Diccionarios GET: " + user);

    const dictionaries = await prisma.dictionary.findMany({
      where: {
        OR: [{ id: 0 }, { email: user }],
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(dictionaries);
  } catch (error) {
    console.error("Error fetching symbols:", error);

    // Retornar una respuesta de error con un mensaje adecuado
    return NextResponse.json([]);
  }
}

export async function POST(request, { params }) {
  const { name } = await request.json();
  const session = await getSession();

  if (!(session && session.user && session.user.email)) {
    return NextResponse.json({ error: "No estás autorizado" });
  }

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Falta el nombre del diccionario" });
  }

  try {
    // Comprobar si ya existe un diccionario con ese nombre para el usuario
    const existing = await prisma.dictionary.findFirst({
      where: {
        email: session.user.email,
        name: name,
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe un diccionario con ese nombre" });
    }

    const newDictionary = await prisma.dictionary.create({
      data: {
        name: name,
        email: session.user.email,
      },
    });

    return NextResponse.json(newDictionary);
  } catch (error) {
    console.error("Error al crear el diccionario:", error);
    return NextResponse.json({ error: "Error interno del servidor" });
  }
}
