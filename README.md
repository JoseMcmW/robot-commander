# 🤖 Voice + Vision Robot Commander

Un sistema inteligente de control de robots que combina reconocimiento de voz, visión por computadora y IA generativa para comandar un robot mediante lenguaje natural.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat&logo=tensorflow&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Demo](#-demo)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API y Tipos](#-api-y-tipos)
- [Optimizaciones](#-optimizaciones)
- [Troubleshooting](#-troubleshooting)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### 🎤 Control por Voz

- Reconocimiento de voz en español (Web Speech API)
- Procesamiento de lenguaje natural con Gemini AI
- Entrada manual como alternativa
- Feedback visual en tiempo real

### 👁️ Visión por Computadora

- Detección de objetos en tiempo real con TensorFlow.js
- Modelo COCO-SSD MobileNet V2 (85-90% accuracy)
- Análisis de color de objetos detectados
- Hasta 20 objetos simultáneos

### 🧠 Sistema Multi-Agente

Arquitectura basada en LangGraph con 4 agentes especializados:

1. **Speech Agent**: Procesa comandos de voz y extrae intenciones
2. **Vision Agent**: Analiza objetos detectados y encuentra targets
3. **Planner Agent**: Planifica secuencias de acciones
4. **Executor Agent**: Ejecuta las acciones del robot

### 🎨 Interfaz Responsive

- Diseño adaptativo para móvil, tablet y desktop
- Canvas interactivo con visualización del robot
- Indicadores visuales de estado y targets
- Historial de comandos

### ⚡ Optimizaciones

- Code splitting automático (TensorFlow.js, React, Icons)
- Backend fallback: WebGL → WASM → CPU
- Prevención de inicialización repetida (React StrictMode)
- Canvas optimizado con `willReadFrequently`
- Warnings de TensorFlow.js silenciados

## 🎬 Demo

```bash
# Comandos de ejemplo
"Robot, muévete hacia adelante"
"Gira a la izquierda"
"Ve hacia la persona"
"Busca el objeto rojo"
```

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Usuario                               │
│              (Voz + Cámara Web)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Orchestrator                             │
│           (Coordina el flujo completo)                  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌────────┐  ┌─────────┐  ┌─────────┐
   │ Speech │  │ Vision  │  │ Planner │
   │ Agent  │  │ Agent   │  │ Agent   │
   └────────┘  └─────────┘  └─────────┘
        │            │            │
        └────────────┼────────────┘
                     ▼
              ┌──────────────┐
              │   Executor   │
              │    Agent     │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │    Robot     │
              │   Canvas     │
              └──────────────┘
```

## 🛠️ Tecnologías

### Frontend

- **React 19** - UI library
- **TypeScript 5.6** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **Zustand** - State management

### Machine Learning

- **TensorFlow.js** - ML framework
- **COCO-SSD MobileNet V2** - Object detection
- **WebGL/WASM/CPU** - Backend fallback

### AI & APIs

- **Google Gemini AI** - Natural language processing
- **Web Speech API** - Voice recognition

### Dev Tools

- **ESLint** - Linting
- **Bun** - Package manager & runtime

## 📦 Requisitos Previos

- **Node.js** >= 18.0.0 o **Bun** >= 1.0.0
- **Navegador moderno** con soporte para:
  - WebGL 2.0 (recomendado)
  - Web Speech API
  - getUserMedia (cámara web)
- **API Key de Google Gemini** ([Obtener aquí](https://makersuite.google.com/app/apikey))

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/robot-commander.git
cd robot-commander
```

### 2. Instalar dependencias

```bash
# Con Bun (recomendado)
bun install

# O con npm
npm install

# O con yarn
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

## ⚙️ Configuración

### Configuración de TensorFlow.js

El modelo está optimizado para máxima precisión:

```typescript
// src/ml/objectDetection.ts
{
  base: 'mobilenet_v2',        // Modelo más preciso
  maxNumBoxes: 20,              // Hasta 20 objetos
  scoreThreshold: 0.5           // Confianza mínima 50%
}
```

### Configuración de Vite

Code splitting optimizado:

```typescript
// vite.config.ts
{
  manualChunks: {
    'tensorflow': ['@tensorflow/tfjs', '@tensorflow-models/coco-ssd'],
    'react-vendor': ['react', 'react-dom'],
    'icons': ['lucide-react']
  },
  chunkSizeWarningLimit: 1500
}
```

## 💻 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
bun run dev

# O con npm
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Producción

```bash
# Build para producción
bun run build

# Preview del build
bun run preview

# Lint
bun run lint
```

### Comandos Disponibles

| Comando           | Descripción                     |
| ----------------- | ------------------------------- |
| `bun run dev`     | Inicia servidor de desarrollo   |
| `bun run build`   | Compila para producción         |
| `bun run preview` | Preview del build de producción |
| `bun run lint`    | Ejecuta ESLint                  |

## 📁 Estructura del Proyecto

```
robot-commander/
├── public/
│   └── tfjs/                    # TensorFlow.js WASM files
├── src/
│   ├── agents/                  # Sistema multi-agente
│   │   ├── orchestrator.ts      # Coordinador principal
│   │   ├── speechAgent.ts       # Procesamiento de voz
│   │   ├── visionAgent.ts       # Análisis de visión
│   │   ├── plannerAgent.ts      # Planificación de acciones
│   │   ├── executorAgent.ts     # Ejecución de acciones
│   │   └── geminiClient.ts      # Cliente de Gemini AI
│   ├── components/              # Componentes React
│   │   ├── WebcamCapture.tsx    # Captura y detección
│   │   ├── VoiceInput.tsx       # Input de voz
│   │   ├── RobotCanvas.tsx      # Visualización del robot
│   │   └── ...
│   ├── ml/                      # Machine Learning
│   │   ├── objectDetection.ts   # Detector de objetos
│   │   └── colorDetection.ts    # Análisis de color
│   ├── store/                   # Estado global (Zustand)
│   │   └── useRobotStore.ts     # Store del robot
│   ├── types/                   # Definiciones de tipos
│   │   └── index.ts             # Tipos TypeScript
│   ├── utils/                   # Utilidades
│   │   └── safeJson.ts          # Parser JSON seguro
│   ├── App.tsx                  # Componente principal
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globales
├── .env                         # Variables de entorno
├── package.json                 # Dependencias
├── tsconfig.json                # Config TypeScript
├── vite.config.ts               # Config Vite
└── README.md                    # Este archivo
```

## 🔌 API y Tipos

### Tipos Principales

```typescript
// Detection - Objeto detectado
interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
  colorAnalysis?: ColorAnalysis;
}

// SpeechResult - Resultado del Speech Agent
interface SpeechResult {
  action: "move_to" | "turn" | "search" | "stop";
  target: string;
  properties: TargetProperties;
}

// VisionResult - Resultado del Vision Agent
interface VisionResult {
  found: boolean;
  bestMatch: string;
  confidence: number;
  position: "left" | "center" | "right";
  verticalPosition?: "top" | "middle" | "bottom";
  normalizedX?: number;
  normalizedY?: number;
}

// ActionPlan - Plan del Planner Agent
interface ActionPlan {
  actions: Action[];
  reasoning: string;
}
```

### Hooks Principales

```typescript
// Store del robot
const robotState = useRobotStore();

// Métodos disponibles
robotState.move(dx, dy);
robotState.rotate(angle);
robotState.setTarget(object, position, vertical, x, y);
robotState.addCommand(command);
```

## ⚡ Optimizaciones

### Performance

1. **Code Splitting**: Chunks separados para TensorFlow.js, React y Icons
2. **Lazy Loading**: Carga diferida de componentes pesados
3. **Memoization**: `useCallback` y `useMemo` en componentes críticos
4. **Canvas Optimization**: `willReadFrequently` para lecturas frecuentes

### Precisión del Modelo

- **MobileNet V2**: 10-15% más preciso que V1
- **Score Threshold**: 0.5 para filtrar detecciones débiles
- **WebGL Backend**: Mejor performance y precisión
- **F32 Textures**: Mayor precisión en cálculos

### Bundle Size

```
tensorflow.js:    1,072 KB (275 KB gzipped)
index.js:           346 KB (101 KB gzipped)
react-vendor.js:     11 KB (4 KB gzipped)
icons.js:             4 KB (2 KB gzipped)
```

## 🐛 Troubleshooting

### El modelo no detecta objetos

**Solución:**

- Verifica que la cámara tenga permisos
- Asegúrate de tener buena iluminación
- Mantén una distancia de 1-3 metros
- Espera a que cargue el modelo (mensaje en consola)

### Accuracy bajo (< 80%)

**Causas comunes:**

- Iluminación insuficiente o excesiva
- Fondo muy similar al objeto
- Objeto parcialmente oculto
- Cámara en movimiento

**Solución:**

- Mejora la iluminación frontal
- Usa un fondo contrastante
- Mantén la cámara estable
- Acércate o aléjate de la cámara

### Reconocimiento de voz no funciona

**Solución:**

- Verifica permisos del micrófono
- Usa Chrome/Edge (mejor soporte)
- Habla claramente y en español
- Usa el input manual como alternativa

### Warnings de TensorFlow.js

Los warnings de backend están silenciados automáticamente. Si ves warnings:

- Es normal que WebGL falle en algunos entornos
- El sistema hace fallback automático a WASM o CPU
- La funcionalidad no se ve afectada

### Build falla

```bash
# Limpia cache y reinstala
rm -rf node_modules dist
bun install
bun run build
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Asegúrate de que `bun run lint` pase sin errores

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [TensorFlow.js](https://www.tensorflow.org/js) - Framework de ML
- [Google Gemini](https://ai.google.dev/) - IA generativa
- [COCO Dataset](https://cocodataset.org/) - Dataset de objetos
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Contacto

- **Autor**: Tu Nombre
- **Email**: tu.email@ejemplo.com
- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)
- **LinkedIn**: [Tu Perfil](https://linkedin.com/in/tu-perfil)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!

**Hecho con ❤️ y TypeScript**
