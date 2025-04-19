import OpenAI from "openai";
import prisma from "@/libs/db";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

async function obtenerSimbolos() {
  try {
    // Obtener todos los registros de la tabla symbol y las categorías asociadas
    const symbols = await prisma.symbol.findMany({
      include: {
        categories: {
          include: {
            Category: true, // Incluir la categoría relacionada
          },
        },
      },
    });

    // Retornar la respuesta con los datos en formato JSON
    return symbols;
  } catch (error) {
    console.error("Error fetching symbols:", error);

    // Retornar una respuesta de error con un mensaje adecuado
    return [];
  }
}

async function traduccionIA(frase) {
  const simbolos = await obtenerSimbolos();
  console.log(simbolos[0].nameEs);
  let pregunta = "Te paso una lista de símbolos Bliss que tengo disponibles (Cada línea es uno):\n";
  for (let i = 0; i < simbolos.length; i++) {
    pregunta += `${simbolos[i].id}: ${simbolos[i].nameEs}\n`;
  }
  pregunta += `\nY los símbolos ya tienen dentro los modificadores, aunque para sustantivos puedo aplicar "plural", y para verbos los siguientes:\n`;
  pregunta += `\n"presente", "pasado", "futuro", "condicionalPresente", "condicionalPasado", "condicionalFuturo", "pasivoPasado", "pasivoPresente", "pasivoFuturo"\n`;
  pregunta += `\nQuiero que traduzcas la frase que te diré al final, y retornes un array de json, donde cada json tendrá una key id, otra nombre y otra key modificador de los que te he pasado. Ejemplo: translation: [
    /* Yo soy guapo */
    {
      id: 1582,
      nombre: 'yo, a mi, me, yo mismo/a',
      modificador: 'ninguno'
    },
    {
      id: 1284,
      nombre: 'existir, ser, estar',
      modificador: 'presente'
    },
    { id: 1213, nombre: 'guapo', modificador: 'ninguno' }
     /* Ayer comí patatas */
     { id: 198, nombre: 'ayer', modificador: 'ninguno' },
    { id: 531, nombre: 'comer', modificador: 'pasado' },
    { id: -1, nombre: 'patatas', modificador: 'plural' },
     /* Hoy como manzanas */
    { id: 20, nombre: 'ahora', modificador: 'ninguno' },
    { id: 531, nombre: 'comer', modificador: 'presente' },
    { id: 4, nombre: 'manzana', modificador: 'plural' },
     /* Mañana comeré lechuga */
    { id: 197, nombre: 'mañana', modificador: 'ninguno' },
    { id: 531, nombre: 'comer', modificador: 'futuro' },
    { id: -1, nombre: 'lechuga', modificador: 'ninguno' },
     /* La patata fue comida */
    { id: -1, nombre: 'patata', modificador: 'ninguno' },
    { id: 531, nombre: 'comer', modificador: 'pasivoPasado' },
     /* La lechuga será comida */
    { id: -1, nombre: 'lechuga', modificador: 'ninguno' },
    { id: 531, nombre: 'comer', modificador: 'pasivoFuturo' }
     /* Si llueve vería una película */
    { id: 1363, nombre: 'si (condicional)', modificador: 'ninguno' },
    { id: 1423, nombre: 'llover', modificador: 'condicionalPresente' },
    { id: 1517, nombre: 'ver', modificador: 'condicionalPresente' },
    { id: 1723, nombre: 'película', modificador: 'ninguno' }
     /* Si hubiera llovido, hubiera visto película */
    { id: 1363, nombre: 'si (condicional)', modificador: 'ninguno' },
    { id: 1423, nombre: 'llover', modificador: 'condicionalPasado' },
    { id: 1517, nombre: 'ver', modificador: 'condicionalPasado' },
    { id: 1723, nombre: 'película', modificador: 'ninguno' }
     /* Voy al coche */
    {
      id: 1582,
      nombre: 'yo, a mi, me, yo mismo/a',
      modificador: 'ninguno'
    },
    { id: 1332, nombre: 'ir', modificador: 'presente' },
    { id: 191, nombre: 'coche', modificador: 'ninguno' }
     /* Iré al coche */
    {
      id: 1582,
      nombre: 'yo, a mi, me, yo mismo/a',
      modificador: 'ninguno'
    },
    { id: 1332, nombre: 'ir', modificador: 'futuro' },
    { id: 191, nombre: 'coche', modificador: 'ninguno' }
     /* Hola ¿Qué tal? */
    { id: 1263, nombre: 'hola', modificador: 'ninguno' },
    { id: 534, nombre: 'cómo (pregunta)', modificador: 'ninguno' },
    {
      id: 1284,
      nombre: 'existir, ser, estar',
      modificador: 'presente'
    }
  ]
Ten en cuenta que la mayoría no necesita modificador, en cuyo caso la key modificador debe valer "ninguno". Si no está el símbolo que necesitas pon id: -1, nombre: (el que tu necesitas) modificador: (el que necesites)\n`;
  pregunta += `\nTambién es importante que adaptes la frase al Bliss. Adaptaciones como por ejemplo saber que "voy", en Bliss es "yo" e "ir"\n`;
  pregunta += `\nEs de extrema importancia que me des el nombre del símbolo literalmente como te lo paso, recuerda, cada linea es uno:\n`;
  pregunta += `\nLa frase es:\n`;
  pregunta += `${frase}\n`;
  console.log("Pregunta:", pregunta);
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat", // o "gpt-4" si está disponible
      messages: [
        {
          role: "system",
          content: `
            Eres un erudito en el lenguaje de símbolos Bliss, y tu labor es traducir frases al lenguaje de símbolos Bliss, siguiendo la semántica de Bliss.
          `,
        },
        {
          role: "user",
          content: pregunta,
        },
      ],
      temperature: 0.0, // Controla la creatividad (bajo = más preciso, alto = más diverso)
      max_tokens: 500, // Límite de longitud de la respuesta
      response_format: { type: "json_object" }, // Para recibir JSON estructurado
    });

    const bestMatch = JSON.parse(response.choices[0].message.content);
    console.log("********************");
    console.log(bestMatch);
    console.log("********************");
    return bestMatch;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return { translation: [] };
  }
}

export async function PUT(request) {
  try {
    const json = await request.json();
    console.log("JSON recibido:", json);
    const traducido = await traduccionIA(json.frase);
    console.log("Traducido:", traducido);

    return new Response(JSON.stringify(traducido), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error procesando el PUT:", error);
    return new Response(JSON.stringify({ translation: [] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
