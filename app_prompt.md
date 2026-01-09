# Prompt: Voice + Vision Robot Commander

## 📋 Descripción General

Necesito una aplicación web que permite controlar un robot simulado usando comandos de voz en lenguaje natural combinados con reconocimiento de objetos en tiempo real mediante visión por computadora. La aplicación debe implementar un sistema multi-agente de IA donde cada agente especializado procesa una parte del pipeline de control.

## 🎯 Objetivo del Proyecto

Crear una demo interactiva de robótica educativa que demuestre la integración de:
- Machine Learning en el browser (TensorFlow.js)
- Procesamiento de lenguaje natural con LLMs
- Arquitectura multi-agente (patrón LangGraph)
- Visión por computadora en tiempo real

**Contexto:** Es para una entrevista en Educabot (empresa de robótica educativa) para una posición de Frontend Developer con énfasis en IA.

## 🏗️ Arquitectura del Sistema

### Sistema Multi-Agente (4 agentes especializados)

1. **Speech Agent** 
   - Procesa comandos de voz usando Gemini API
   - Extrae intención del usuario (acción, objetivo, propiedades)
   - Input: Transcripción de voz
   - Output: `{ action, target, properties }`

2. **Vision Agent**
   - Analiza objetos detectados por la cámara
   - Determina si coinciden con lo que busca el usuario
   - Input: Array de detecciones + propiedades buscadas
   - Output: `{ found, bestMatch, confidence, position }`

3. **Planner Agent**
   - Planifica secuencia de acciones del robot
   - Considera: comando del usuario, análisis de visión, estado del robot
   - Input: Resultados de Speech + Vision + Estado actual
   - Output: `{ actions[], reasoning }`

4. **Executor Agent**
   - Ejecuta las acciones planificadas en el robot
   - Controla movimientos y animaciones
   - Input: Array de acciones
   - Output: Movimientos visuales del robot

### Orchestrator
Coordina los 4 agentes en secuencia (patrón LangGraph):
```
User Command → Speech → Vision → Planner → Executor → Result
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Vite** como build tool
- **Tailwind CSS** para estilos
- **Zustand** para state management global

### Machine Learning
- **TensorFlow.js** (runtime de ML en browser)
- **COCO-SSD** (modelo pre-entrenado para detección de 80 objetos)
- Procesamiento en cliente (sin servidor ML)

### Inteligencia Artificial
- **Gemini 1.5 Flash API** (Google) para procesamiento de lenguaje natural
- Multi-agent system inspirado en LangGraph
- Prompts estructurados para cada agente

### APIs del Browser
- **Web Speech API** para reconocimiento de voz nativo
- **MediaDevices API** para acceso a webcam
- **Canvas 2D** para renderizar robot y detecciones

### Deploy
- **Vercel** con CI/CD automático
- Variables de entorno para API keys

## 🎨 Funcionalidades Específicas

### 1. Detección de Objetos en Tiempo Real
- Webcam captura video en 640x480
- TensorFlow.js + COCO-SSD detecta objetos en cada frame (~30 FPS)
- Canvas overlay dibuja bounding boxes sobre objetos detectados
- Muestra etiquetas con nombre y confianza (ej: "person (87%)")
- Lista de objetos detectados actualizada en tiempo real

### 2. Control por Voz
- Botón de micrófono activa/desactiva grabación
- Web Speech API transcribe audio a texto
- Soporta comandos en español e inglés
- Ejemplos de comandos:
  - "Robot, muévete hacia adelante"
  - "Gira a la izquierda"
  - "Ve hacia la persona"
  - "Busca el objeto rojo"

### 3. Robot Simulado
- Canvas 2D (600x600px) con grid de fondo
- Robot representado como rectángulo con indicador de dirección
- Estado: posición (x, y), rotación (grados)
- Acciones disponibles:
  - `move_forward` / `move_backward` (con steps)
  - `turn_left` / `turn_right` (con grados)
  - `stop`
- Animaciones suaves entre movimientos

### 4. Dashboard de Estado
- Estado actual del sistema (procesando, esperando, error)
- Indicadores visuales de cada agente activo
- Historial de comandos ejecutados (últimos 10)
- Explicación de la última decisión de la IA
- Contador de objetos detectados

### 5. Modo Demo
- Botón "Probar comando rápido" ejecuta comando predefinido
- Funciona sin API key (respuestas simuladas)
- Útil para testing y presentaciones

## 📁 Estructura de Código

### Componentes React

```
src/
├── components/
│   ├── WebcamCapture.tsx       # Cámara + detección ML
│   ├── VoiceInput.tsx          # Control de micrófono
│   ├── RobotCanvas.tsx         # Simulación del robot
│   ├── AgentDashboard.tsx      # Estado de agentes (opcional)
│   └── ControlPanel.tsx        # Controles manuales (opcional)
```

### Sistema de Agentes (Arquitectura Modular)

```
src/agents/
├── geminiClient.ts       # Cliente base de Gemini API
├── speechAgent.ts        # Agente 1: Procesa voz
├── visionAgent.ts        # Agente 2: Analiza visión
├── plannerAgent.ts       # Agente 3: Planifica acciones
├── executorAgent.ts      # Agente 4: Ejecuta movimientos
├── orchestrator.ts       # Coordinador de agentes
└── index.ts              # Barrel export
```

### Machine Learning

```
src/ml/
├── objectDetection.ts    # Wrapper de COCO-SSD
└── colorDetection.ts     # Detección de colores (opcional)
```

### State Management

```
src/store/
└── useRobotStore.ts      # Zustand store para estado del robot
```

## 🔄 Flujo de Ejecución Detallado

### 1. Inicialización
```
- App carga
- TensorFlow.js inicializa backend (WebGL o CPU)
- COCO-SSD descarga modelo (~5MB)
- Webcam solicita permisos y se activa
- Robot aparece en centro del canvas
```

### 2. Detección Continua
```
Loop infinito:
- Capturar frame de video
- COCO-SSD.detect(frame) → predictions[]
- Dibujar video + bounding boxes en canvas
- Actualizar lista de objetos detectados
- requestAnimationFrame → repeat
```

### 3. Comando de Voz
```
Usuario habla → Web Speech API transcribe → onCommand(text)
│
└─> Orchestrator.orchestrateCommand(text, detections, robotState)
    │
    ├─> Speech Agent: callGemini(prompt) 
    │   └─> Parse JSON → { action, target, properties }
    │
    ├─> Vision Agent: callGemini(prompt)
    │   └─> Analiza detecciones → { found, bestMatch, confidence }
    │
    ├─> Planner Agent: callGemini(prompt)
    │   └─> Genera plan → { actions[], reasoning }
    │
    └─> Executor Agent: executeActions(actions[])
        └─> Para cada acción:
            - store.moveForward() / turnLeft() / etc.
            - await delay(200ms) para animación
            - Actualizar canvas
```

### 4. Renderizado del Robot
```
useEffect en RobotCanvas:
- Leer estado: { x, y, rotation, currentAction }
- Limpiar canvas
- Dibujar grid de fondo
- ctx.save()
- ctx.translate(x, y)
- ctx.rotate(rotation)
- Dibujar cuerpo del robot (rectángulo)
- Dibujar indicador de dirección (triángulo)
- ctx.restore()
- Dibujar texto con acción actual
```

## 🎨 Diseño UI/UX

### Layout
```
┌─────────────────────────────────────────────────┐
│  🤖 Voice + Vision Robot Commander              │
│  Controla el robot usando voz + IA              │
├─────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │                  │  │                  │    │
│  │   Webcam Feed    │  │  Robot Canvas    │    │
│  │   + Detections   │  │   (Simulación)   │    │
│  │                  │  │                  │    │
│  └──────────────────┘  └──────────────────┘    │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │ 🎤 Voice Control │  │ 📊 Estado        │    │
│  │  [Micrófono]    │  │  Sistema activo  │    │
│  └──────────────────┘  └──────────────────┘    │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │ Objetos: 3       │  │ 📝 Historial     │    │
│  │ person, tv, cup  │  │  1. "muévete..." │    │
│  └──────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Paleta de Colores
- Fondo: Gradiente oscuro (gray-950 → blue-950)
- Primario: Azul (#3b82f6)
- Éxito: Verde (#10b981)
- Error: Rojo (#ef4444)
- Texto: Blanco/Gray-300

### Animaciones
- Pulse en botón de micrófono cuando está grabando
- Spinner de loading al procesar comandos
- Smooth transitions en movimientos del robot
- Fade in/out de mensajes de estado

## 🔐 Configuración

### Variables de Entorno
```bash
# .env.local
VITE_GEMINI_API_KEY=tu_api_key_de_google_gemini
```

### Obtener API Key
1. Ir a https://aistudio.google.com/app/apikey
2. Crear API key (gratis: 60 req/min, 1500/día)
3. Copiar a `.env.local`

### Fallback sin API Key
Si no hay API key, el sistema usa respuestas simuladas (modo demo).

## 📊 Tipos TypeScript

### Interfaces Principales

```typescript
// Speech Agent
interface SpeechResult {
  action: 'move_to' | 'turn' | 'search' | 'stop';
  target: string;
  properties: Record<string, any>;
}

// Vision Agent
interface VisionResult {
  found: boolean;
  bestMatch: string | null;
  confidence: number;
  position: 'left' | 'center' | 'right';
}

// Planner Agent
interface RobotAction {
  type: 'move_forward' | 'move_backward' | 'turn_left' | 'turn_right' | 'stop';
  steps?: number;
  amount?: number;
}

interface ActionPlan {
  actions: RobotAction[];
  reasoning: string;
}

// Robot State
interface RobotState {
  x: number;
  y: number;
  rotation: number;
  isMoving: boolean;
  currentAction: string;
  commandHistory: string[];
}
```

## 🧪 Testing / Demo

### Escenarios de Prueba

1. **Detección básica**
   - Mostrar objetos a la cámara
   - Verificar detección y etiquetado correcto

2. **Comando simple**
   - "Muévete hacia adelante"
   - Robot debe avanzar 3 pasos

3. **Comando con dirección**
   - "Gira a la derecha"
   - Robot debe rotar 45°

4. **Comando con objeto detectado**
   - Detectar "person" en cámara
   - Decir "ve hacia la persona"
   - Robot debe avanzar

5. **Comando complejo**
   - "Busca el objeto rojo y gira"
   - Múltiples acciones en secuencia

## ⚠️ Consideraciones Importantes

### Performance
- TensorFlow.js puede ser lento en CPU (aceptable para demo)
- WebGL acelera significativamente si está disponible
- COCO-SSD es ligero (~6MB) pero toma 2-3s en cargar

### Limitaciones
- COCO-SSD solo detecta 80 clases predefinidas
- No detecta colores específicos (requiere modelo custom)
- Gemini API tiene rate limits (60 req/min gratis)
- Web Speech API solo funciona en Chrome/Edge

### Error Handling
- Fallbacks automáticos si Gemini falla
- Modo demo si no hay API key
- Mensajes claros de error al usuario
- Logging extensivo en consola para debugging

## 📚 Documentación Adicional

### Prompts para Gemini

**Speech Agent Prompt:**
```
Analiza este comando de voz: "${transcript}"
Extrae: action, target, properties
Responde SOLO con JSON válido sin markdown.
```

**Vision Agent Prompt:**
```
Objetos detectados: ${detections}
Usuario busca: ${targetProperties}
¿Alguno coincide?
Responde SOLO con JSON: { found, bestMatch, confidence, position }
```

**Planner Agent Prompt:**
```
Comando: ${speechResult}
Visión: ${visionResult}
Estado robot: posición (${x}, ${y}), rotación ${rotation}°
Planea secuencia de acciones.
Responde SOLO con JSON: { actions[], reasoning }
```

### Comandos npm

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Type check
npx tsc --noEmit

# Deploy
vercel --prod
```

## 🎯 Entregables

1. **Código fuente**
   - Repositorio con estructura modular
   - TypeScript con tipos completos
   - Comentarios en código clave

2. **Demo funcionando**
   - URL pública en Vercel
   - Funcional con API key configurada

3. **Documentación**
   - README.md con instrucciones
   - Diagramas de arquitectura
   - Explicación de decisiones técnicas

4. **Presentación**
   - Demo en vivo de 3-5 minutos
   - Explicación del sistema multi-agente
   - Código destacando partes clave

## 💡 Puntos a Destacar en Entrevista

1. **Arquitectura moderna**: Multi-agente con separación de concerns
2. **ML en browser**: Sin backend, todo en cliente
3. **Integración de LLMs**: Uso práctico de IA generativa
4. **Clean Code**: Estructura modular, TypeScript, buenas prácticas
5. **Alineado con Educabot**: Robótica educativa + IA accesible

---

## ✅ Requisitos Críticos

- [ ] Frontend en React + TypeScript + Vite
- [ ] TensorFlow.js con COCO-SSD funcionando
- [ ] Gemini API integrada (o cualquier LLM)
- [ ] Sistema multi-agente (4 agentes mínimo)
- [ ] Webcam con detección en tiempo real
- [ ] Robot simulado con movimientos animados
- [ ] Deploy en Vercel
- [ ] Arquitectura modular y escalable
- [ ] Error handling robusto
- [ ] UI responsive y moderna

---

**Este proyecto debe demostrar conocimientos de Frontend + IA + ML en un contexto de robótica educativa.**