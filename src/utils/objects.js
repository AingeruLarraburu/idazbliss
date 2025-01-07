// objects.js

// Función que verifica si el valor es un objeto
export function isNotNullObject(value) {
  return value !== null && typeof value === "object" && Object.keys(value).length > 0;
}

// Función que verifica si las claves del objeto están en el array de nombres
export function checkKeys(namesArray, obj) {
  // Obtener todas las claves del objeto
  const keys = Object.keys(obj);

  // Verificar si todas las claves del objeto están en el array de nombres
  for (const key of keys) {
    if (!namesArray.includes(key)) {
      return false; // Si una key no está en el array, devolver false
    }
  }

  return true; // Si todas las claves están en el array, devolver true
}

export function copyObjectWithArrays(original) {
  return Object.fromEntries(Object.entries(original).map(([key, value]) => [key, [...value]]));
}
