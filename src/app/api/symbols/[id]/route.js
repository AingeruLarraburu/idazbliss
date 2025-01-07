import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { checkKeys, isNotNullObject } from "@/utils/objects";
import { getSession, isadmin } from "@/libs/auth";

export async function GET(request, { params }) {
  try {
    console.log("SymbolId: ", params.id);
    const symbol = await prisma.symbol.findUnique({
      where: { id: Number(params.id) },
      include: {
        categories: {
          include: {
            Category: true, // Incluir la categoría relacionada
          },
        },
      },
    });
    return NextResponse.json(symbol);
  } catch (error) {
    console.log(error);
    return NextResponse.json({});
  }
}

export async function PUT(request, { params }) {
  // Simulate fetching data from a database or external API
  const { names, symbol } = await request.json();
  console.log(names);
  console.log(symbol);
  const languageKeys = ["nameEs", "nameEu"];
  const symbolKeys = ["lines", "circles", "curves", "arcs", "rectangles", "width"];
  // Comprobamos que esté autorizado
  const session = await getSession();
  if (!(session && session.user && session.user.email && isadmin(session.user.email))) {
    return NextResponse.json({ error: "No estás autorizado" });
  }
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
    const toCreate = {
      jsonData: symbol,
    };
    for (const key in names) {
      toCreate[key] = names[key];
    }
    const newSymbol = await prisma.symbol.update({
      where: { id: Number(params.id) },
      data: toCreate, // Pasamos el objeto con los datos del nuevo símbolo
    });
    console.log("epet");
    console.log(newSymbol);
    return NextResponse.json(newSymbol);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

export async function DELETE(request, { params }) {
  // Comprobamos que esté autorizado
  const session = await getSession();
  if (!(session && session.user && session.user.email && isadmin(session.user.email))) {
    return NextResponse.json({ error: "No estás autorizado" });
  }
  try {
    console.log("Symbol removing");
    const symbolRemoved = await prisma.symbol.delete({ where: { id: Number(params.id) } });
    console.log("Symbol removed");
    return NextResponse.json(symbolRemoved);
  } catch (error) {
    return NextResponse.json(error.message);
  }
}
