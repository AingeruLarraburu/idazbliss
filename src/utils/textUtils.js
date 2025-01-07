// Función que verifica si el valor es un objeto
export function envToArray(envVariable) {
  // Dividir la cadena en un array usando la coma como delimitador
  return envVariable.split(",");
}

export function quitarTildesEspaciosMinuscula(str) {
  // Quitar tildes
  const sinTildes = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Eliminar espacios y convertir a minúsculas
  const resultado = sinTildes.replace(/\s+/g, "").toLowerCase();

  return resultado;
}
