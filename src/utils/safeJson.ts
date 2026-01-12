export function safeJsonParse<T = unknown>(raw: string): T {
  if (!raw || typeof raw !== 'string') {
    throw new Error('safeJsonParse: input must be a non-empty string');
  }

  // 1) Try direct JSON.parse first (fast path)
  try {
    return JSON.parse(raw) as T;
  } catch {
    // continue to heuristics
  }

  // 2) Remove common markdown fences and smart quotes
  let s = raw.replace(/```(?:json)?\s*/g, '').replace(/```/g, '').trim();
  s = s.replace(/[“”‘’]/g, '"');

  // 3) Try to extract the first {...} block which usually contains the JSON
  const blockMatch = s.match(/\{[\s\S]*\}/);
  if (blockMatch) {
    const block = blockMatch[0];
    try {
      return JSON.parse(block) as T;
    } catch {
      // 4) Last-resort heuristics: try to fix unquoted keys and single quotes
      try {
        const attempt = block
          .replace(/'([\s\S]*?)'/g, '"$1"') // single -> double quotes
          .replace(/([{,]\s*)([A-Za-z0-9_-]+)\s*:/g, '$1"$2":');
        return JSON.parse(attempt) as T;
      } catch {
        // fall through
      }
    }
  }

  // If nothing worked, throw with helpful diagnostics
  throw new Error('safeJsonParse: could not parse JSON response');
}