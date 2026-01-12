# Plan de Implementación

- [x] 1. Crear archivo central de tipos

  - Crear `src/types/index.ts` con todas las interfaces de tipos
  - Definir interfaz `Detection` con propiedades: class, score, bbox (tupla), colorAnalysis (opcional)
  - Definir interfaces para SpeechRecognition API: SpeechRecognitionAlternative, SpeechRecognitionResult, SpeechRecognitionResultList, SpeechRecognitionEvent, SpeechRecognitionErrorEvent, SpeechRecognition, SpeechRecognitionConstructor
  - Definir interfaz `TargetProperties` con propiedades opcionales: target, color, direction, y index signature
  - Agregar declaración global para extender Window con SpeechRecognition
  - Exportar OrchestrationResult desde orchestrator.ts para uso en otros archivos
  - _Requirements: 1.1, 2.1, 2.2, 3.3_

- [x] 2. Actualizar componente WebcamCapture

  - Importar tipo `Detection` desde `@/types`
  - Cambiar prop `onDetectionsUpdate` de `(detections: any[]) => void` a `(detections: Detection[]) => void`
  - Cambiar state `detections` de `useState<any[]>([])` a `useState<Detection[]>([])`
  - Cambiar parámetro de función `drawDetections` de `predictions: any[]` a `predictions: Detection[]`
  - Eliminar anotaciones de tipo `any` en callbacks de `forEach` y `map` (TypeScript inferirá el tipo)
  - _Requirements: 1.2, 1.3, 4.1, 4.2_

- [x] 3. Actualizar componente VoiceInput

  - Importar tipos de SpeechRecognition desde `@/types`
  - Cambiar acceso a API de `(window as any).SpeechRecognition` a usar tipos definidos con verificación de Window
  - Cambiar `recognitionRef` de `useRef<any>(null)` a `useRef<SpeechRecognition | null>(null)`
  - Cambiar handler `onresult` de `(event: any)` a `(event: SpeechRecognitionEvent)`
  - Cambiar handler `onerror` de `(event: any)` a `(event: SpeechRecognitionErrorEvent)`
  - Eliminar comentarios `eslint-disable-next-line @typescript-eslint/no-explicit-any`
  - _Requirements: 2.2, 2.3, 2.4, 4.3_

- [x] 4. Actualizar componente App

  - Importar tipos `Detection` y `OrchestrationResult` desde sus respectivos archivos
  - Cambiar state `detections` de `useState<any[]>([])` a `useState<Detection[]>([])`
  - Cambiar state `lastResult` de `useState<any>(null)` a `useState<OrchestrationResult | null>(null)`
  - _Requirements: 1.2, 3.2, 3.4_

- [x] 5. Actualizar agente de visión (visionAgent)

  - Importar tipos `Detection` y `TargetProperties` desde `@/types`
  - Cambiar parámetro `detections` de `any[]` a `Detection[]` en función `analyzeDetections`
  - Cambiar parámetro `targetProperties` de `any` a `TargetProperties` en función `analyzeDetections`
  - Eliminar anotaciones de tipo `any` en callbacks de `sort` y `filter`
  - _Requirements: 1.2, 3.3, 4.2_

- [x] 6. Actualizar agente de habla (speechAgent)

  - Importar tipo `TargetProperties` desde `@/types`
  - Cambiar propiedad `properties` en interfaz `SpeechResult` de `Record<string, any>` a `TargetProperties`
  - _Requirements: 3.3_

- [x] 7. Validar y limpiar código


  - Ejecutar compilación de TypeScript para verificar que no hay errores de tipos
  - Ejecutar linter para verificar que no hay warnings
  - Revisar y eliminar comentarios `eslint-disable` que ya no sean necesarios
  - Verificar que todas las importaciones de tipos están correctas
  - _Requirements: 5.1, 5.3, 5.4_

- [ ]\* 8. Pruebas de funcionalidad
  - Verificar que WebcamCapture detecta objetos correctamente
  - Verificar que VoiceInput captura comandos de voz correctamente
  - Verificar que el flujo completo de comando funciona end-to-end
  - Verificar que no hay errores en consola del navegador
  - _Requirements: 5.3_
