/**
 * Safely parse a value that might be a JSON string.
 *
 * Some database drivers (e.g. SQLite via Prisma) return JSON columns
 * as strings instead of parsed objects. This function handles both cases.
 */
export function parseJson(value: unknown): unknown {
  if (typeof value === 'string') {
    return JSON.parse(value) as unknown;
  }
  return value;
}
