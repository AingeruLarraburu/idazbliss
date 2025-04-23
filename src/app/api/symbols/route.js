import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { checkKeys, isNotNullObject } from "@/utils/objects";
import { quitarTildesEspaciosMinuscula } from "@/utils/textUtils";
import { getSession, isadmin } from "@/libs/auth";

export async function GET() {
  try {
    // Obtener todos los registros de la tabla symbol y las categorías asociadas
    const session = await getSession();
    const user = session?.user?.email || "No user";
    console.log("Usuario: " + user);

    const symbols = await prisma.symbol.findMany({
      where: {
        OR: [
          { dictionaryId: 0 },
          {
            dictionary: {
              email: user,
            },
          },
        ],
      },
      include: {
        categories: {
          include: {
            Category: true, // Incluir la categoría relacionada
          },
        },
      },
    });

    return NextResponse.json(symbols);
  } catch (error) {
    console.error("Error fetching symbols:", error);

    // Retornar una respuesta de error con un mensaje adecuado
    return NextResponse.json([]);
  }
}

export async function POST(request, { params }) {
  // Simulate fetching data from a database or external API
  const { names, symbol, dictionaryId } = await request.json();
  const session = await getSession();
  if (!(session && session.user && session.user.email)) {
    return NextResponse.json({ error: "No estás logeado" });
  }
  if (dictionaryId == 0 && !isadmin(session.user.email)) {
    return NextResponse.json({ error: "Sólo administradores pueden gestionar el diccionario Oficial" });
  }
  const languageKeys = ["nameEs", "nameEu"];
  const symbolKeys = ["lines", "circles", "curves", "arcs", "rectangles", "width"];
  // Comprobamos que los parámetros recibidos son json
  if (!isNotNullObject(symbol)) {
    return NextResponse.json({ error: "Symbol not json" });
  }
  if (!isNotNullObject(names)) {
    return NextResponse.json({ error: "Names not json" });
  }
  // Comprobamos que los keys son válidos
  if (!checkKeys(languageKeys, names)) {
    return NextResponse.json({ error: "Invalid name keys" });
  }
  if (!checkKeys(symbolKeys, symbol)) {
    return NextResponse.json({ error: "Invalid symbol keys" });
  }
  // Comprobamos que se han definido nombres
  for (const key in names) {
    if (names[key] === "") {
      return NextResponse.json({ error: "Falta al menos un nombre" });
    }
  }
  // Comprobamos que hay al menos un item en el símbolo
  var itemCount = 0;
  for (const key in symbol) {
    if (key !== "width") {
      itemCount = itemCount + symbol[key].length;
    }
  }
  if (itemCount === 0) {
    return NextResponse.json({ error: "El símbolo está vacío" });
  }

  try {
    const symbols = await prisma.symbol.findMany({
      where: {
        dictionaryId: dictionaryId,
      },
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
      const toCreate = {
        jsonData: symbol,
      };
      for (const key in names) {
        toCreate[key] = names[key];
      }
      toCreate.dictionaryId = dictionaryId;
      const newSymbol = await prisma.symbol.create({
        data: toCreate, // Pasamos el objeto con los datos del nuevo símbolo
      });
      return NextResponse.json(newSymbol);
    }
    return NextResponse.json({ error: "El nombre ya existe" });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
