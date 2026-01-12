# Documento de Requisitos

## Introducción

Este proyecto es un sistema de control de robot mediante voz y visión que utiliza TensorFlow.js para detección de objetos, reconocimiento de voz del navegador, y Gemini AI para procesamiento de comandos. Actualmente, el código contiene múltiples usos del tipo `any` en TypeScript que reducen la seguridad de tipos y dificultan el mantenimiento del código.

El objetivo de esta mejora es eliminar todos los tipos `any` del proyecto y reemplazarlos con tipos específicos y correctos, mejorando así la calidad del código, la detección de errores en tiempo de compilación, y la experiencia de desarrollo con mejor autocompletado.

## Requisitos

### Requisito 1: Tipado de Detecciones de Objetos

**User Story:** Como desarrollador, quiero que las detecciones de objetos de TensorFlow.js tengan tipos específicos, para que pueda trabajar con ellas de forma segura y con autocompletado.

#### Criterios de Aceptación

1. WHEN se definen tipos para detecciones de objetos THEN el sistema SHALL crear una interfaz `Detection` que incluya las propiedades: `class`, `score`, `bbox`, y `colorAnalysis`
2. WHEN se usa el tipo `Detection` THEN el sistema SHALL reemplazar todos los `any[]` relacionados con detecciones en `WebcamCapture.tsx`, `App.tsx`, y `visionAgent.ts`
3. WHEN se define el tipo de `bbox` THEN el sistema SHALL usar un tipo específico como `[number, number, number, number]` para representar `[x, y, width, height]`
4. WHEN se integra `ColorAnalysis` THEN el sistema SHALL hacer que la propiedad `colorAnalysis` sea opcional en la interfaz `Detection`

### Requisito 2: Tipado de API de Reconocimiento de Voz

**User Story:** Como desarrollador, quiero tipos específicos para la API de reconocimiento de voz del navegador, para evitar el uso de `any` en el componente `VoiceInput`.

#### Criterios de Aceptación

1. WHEN se accede a la API de reconocimiento de voz THEN el sistema SHALL crear interfaces TypeScript para `SpeechRecognition`, `SpeechRecognitionEvent`, y `SpeechRecognitionErrorEvent`
2. WHEN se define `SpeechRecognition` THEN el sistema SHALL incluir propiedades como `continuous`, `interimResults`, `lang`, `maxAlternatives` y métodos como `start()`, `stop()`
3. WHEN se define `SpeechRecognitionEvent` THEN el sistema SHALL incluir la propiedad `results` con el tipo correcto para acceder a transcripciones
4. WHEN se usa en `VoiceInput.tsx` THEN el sistema SHALL reemplazar todos los `any` relacionados con reconocimiento de voz con los tipos específicos creados

### Requisito 3: Tipado de Resultados de Agentes

**User Story:** Como desarrollador, quiero que los resultados de los agentes de IA tengan tipos específicos, para garantizar la consistencia de datos entre componentes.

#### Criterios de Aceptación

1. WHEN se define el resultado del orquestador THEN el sistema SHALL crear una interfaz `OrchestrationResult` que incluya `visionResult` y `plan`
2. WHEN se usa `lastResult` en `App.tsx` THEN el sistema SHALL reemplazar el tipo `any` con `OrchestrationResult | null`
3. WHEN se definen propiedades de target THEN el sistema SHALL crear una interfaz `TargetProperties` para reemplazar `Record<string, any>` en `visionAgent.ts`
4. WHEN se validan los tipos THEN el sistema SHALL asegurar que todas las propiedades opcionales estén marcadas correctamente con `?`

### Requisito 4: Tipado de Funciones de Callback

**User Story:** Como desarrollador, quiero que las funciones de callback y handlers tengan tipos específicos, para evitar errores en el paso de parámetros.

#### Criterios de Aceptación

1. WHEN se define `drawDetections` en `WebcamCapture.tsx` THEN el sistema SHALL tipar el parámetro `predictions` como `Detection[]` en lugar de `any[]`
2. WHEN se usan funciones de mapeo y filtrado THEN el sistema SHALL eliminar las anotaciones explícitas de tipo `any` en callbacks inline
3. WHEN se definen handlers de eventos THEN el sistema SHALL usar tipos específicos de eventos de React en lugar de `any`
4. WHEN se pasan callbacks entre componentes THEN el sistema SHALL definir tipos de función específicos para props como `onDetectionsUpdate`

### Requisito 5: Validación y Configuración de TypeScript

**User Story:** Como desarrollador, quiero que el compilador de TypeScript detecte automáticamente el uso de `any`, para prevenir su introducción en el futuro.

#### Criterios de Aceptación

1. WHEN se configura TypeScript THEN el sistema SHALL habilitar la opción `noImplicitAny` en `tsconfig.app.json`
2. WHEN se configura TypeScript THEN el sistema SHALL considerar habilitar `strict: true` para máxima seguridad de tipos
3. WHEN se compila el proyecto THEN el sistema SHALL no mostrar errores de tipos después de las correcciones
4. WHEN se ejecuta el linter THEN el sistema SHALL poder eliminar los comentarios `// eslint-disable-next-line @typescript-eslint/no-explicit-any` que ya no sean necesarios
