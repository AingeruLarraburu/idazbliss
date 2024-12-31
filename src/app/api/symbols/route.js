import { NextResponse } from "next/server";
import db from "@/libs/db";
import { checkKeys, isNotNullObject } from "@/utils/objects";
import { envToArray } from "@/utils/textUtils";

export async function GET() {
  // Simulate fetching data from a database or external API
  //console.log("geteando");
  const symbols = db.symbol.findMany();
  return NextResponse.json(symbols);
}

export async function POST(request, { params }) {
  // Simulate fetching data from a database or external API
  const { names, symbol } = await request.json();
  const languageKeys = envToArray(process.env.LANGUAGE_KEYS);
  const symbolKeys = envToArray(process.env.SYMBOL_KEYS);
  // Comprobamos que los parámetros recibidos son json
  if (!isNotNullObject(symbol)) {
    console.log("Yeah1!");
    return NextResponse.error(new Error("symbol is not json"));
  }
  if (!isNotNullObject(names)) {
    console.log("Yeah2!");
    return NextResponse.error(new Error("Names is not json"));
  }
  if (!checkKeys(languageKeys, names)) {
    console.log("Yeah3!");
    return NextResponse.error(new Error("Bad name keys"));
  }
  if (!checkKeys(symbolKeys, symbol)) {
    return NextResponse.error(new Error("Bad symbol keys"));
  }
  const toCreate = {
    jsonData: symbol,
  };
  for (const key in names) {
    toCreate[key] = names[key];
  }
  const newSymbol = await prisma.symbol.create({
    data: toCreate, // Pasamos el objeto con los datos del nuevo símbolo
  });
  return NextResponse.json(newSymbol);
}
