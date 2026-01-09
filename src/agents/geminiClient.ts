// ============================================
// GEMINI CLIENT - Base para todos los agentes
// ============================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

/**
 * Función principal para llamar a Gemini API
 * @param prompt - Prompt a enviar a Gemini
 * @returns Respuesta de texto de Gemini
 */
export async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ VITE_GEMINI_API_KEY no configurada, usando modo DEMO');
    return getDemoResponse(prompt);
  }

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error llamando a Gemini:', error);
    return getDemoResponse(prompt);
  }
}

/**
 * Respuestas simuladas para modo DEMO (sin API key)
 */
function getDemoResponse(prompt: string): string {
  if (prompt.includes('comando de voz')) {
    return JSON.stringify({
      action: 'move_to',
      target: 'forward',
      properties: { direction: 'forward' }
    });
  }
  
  if (prompt.includes('Objetos detectados')) {
    return JSON.stringify({
      found: true,
      bestMatch: 'person',
      confidence: 0.85,
      position: 'center'
    });
  }
  
  if (prompt.includes('planificador')) {
    return JSON.stringify({
      actions: [
        { type: 'move_forward', steps: 3 }
      ],
      reasoning: 'Moviéndose hacia adelante (modo demo)'
    });
  }
  
  return '{}';
}

/**
 * Helper para limpiar respuestas JSON de Gemini
 */
export function cleanJsonResponse(response: string): string {
  if (!response || typeof response !== 'string') return '';

  // Remove common markdown fences and surrounding whitespace
  const s = response.replace(/```(?:json)?\s*/g, '').replace(/```/g, '').trim();

  // Try to extract the first JSON object block
  const match = s.match(/\{[\s\S]*\}/);
  if (match) return match[0].trim();

  return s;
}