export function safeJsonParse<T = any>(raw: string): T {
  const fixed = raw
    // agregar comillas a keys
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
    // strings con comillas simples
    .replace(/'/g, '"')
    // valores no string tipo center, left, right
    .replace(/:\s*(left|right|center)\b/g, ': "$1"');

  return JSON.parse(fixed);
}