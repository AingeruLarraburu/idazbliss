// Función que verifica si el valor es un objeto
export function envToArray(envVariable) {
  // Dividir la cadena en un array usando la coma como delimitador
  return envVariable.split(",");
}
