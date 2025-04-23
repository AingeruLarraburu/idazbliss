import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { getSession } from "@/libs/auth";

export async function GET() {
  try {
    const session = await getSession();
    const user = session?.user?.email || "idazbliss@gmail.com";

    const collections = await prisma.collection.findMany({
      where: {
        OR: [{ email: user }],
      },
      select: {
        id: true,
        name: true,
        items: {
          select: {
            Symbol: {
              include: {
                categories: {
                  include: {
                    Category: true,
                  },
                },
              },
            },
            id: true,
            collectionId: true,
            symbolId: true,
          },
        },
      },
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);

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
    return NextResponse.json({ error: "Falta el nombre de la colección" });
  }

  try {
    // Comprobar si ya existe un diccionario con ese nombre para el usuario
    const existing = await prisma.collection.findFirst({
      where: {
        email: session.user.email,
        name: name,
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe una colección con ese nombre" });
    }

    const newCollection = await prisma.collection.create({
      data: {
        name: name,
        email: session.user.email,
      },
    });

    return NextResponse.json(newCollection);
  } catch (error) {
    console.error("Error al crear el diccionario:", error);
    return NextResponse.json({ error: "Error interno del servidor" });
  }
}
