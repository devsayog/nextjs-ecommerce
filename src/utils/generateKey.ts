export function generateKey() {
  return `_${Math.random().toString(36).substring(2, 9)}`
}
