# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2025-01-12

### ✨ Agregado
- Sistema multi-agente con 4 agentes especializados (Speech, Vision, Planner, Executor)
- Detección de objetos en tiempo real con TensorFlow.js COCO-SSD
- Reconocimiento de voz en español con Web Speech API
- Análisis de color de objetos detectados
- Canvas interactivo con visualización del robot
- Interfaz responsive para móvil, tablet y desktop
- Historial de comandos ejecutados
- Feedback visual de estado en tiempo real
- Integración con Google Gemini AI para procesamiento de lenguaje natural

### ⚡ Optimizado
- Modelo MobileNet V2 para 85-90% de accuracy (vs 75% con V1)
- Code splitting automático (TensorFlow.js, React, Icons)
- Backend fallback: WebGL → WASM → CPU
- Canvas optimizado con `willReadFrequently` para lecturas frecuentes
- Prevención de inicialización repetida en React StrictMode
- Warnings de TensorFlow.js silenciados automáticamente
- Bundle size optimizado: 1.4 MB total (382 KB gzipped)

### 🎨 Mejorado
- Diseño completamente responsive sin espacios en blanco
- Overflow horizontal prevenido en todas las pantallas
- Textos con `break-words` para evitar overflow
- Header optimizado con `truncate` y `shrink-0`
- Canvas escalable que se adapta al contenedor
- Mejor UX con indicadores visuales de targets

### 🐛 Corregido
- Tipos TypeScript corregidos en todos los agentes
- Warnings de React hooks eliminados
- Problemas de inicialización en StrictMode resueltos
- Overflow horizontal en pantallas pequeñas corregido
- Detecciones más estables con mejor threshold

### 📚 Documentación
- README completo con guías de instalación y uso
- Documentación de arquitectura multi-agente
- Guía de troubleshooting
- CONTRIBUTING.md con guías para contribuidores
- LICENSE MIT agregada
- .env.example para configuración fácil

### 🛠️ Técnico
- TypeScript 5.6 con tipos estrictos
- React 19 con hooks modernos
- Vite 7 con HMR optimizado
- Tailwind CSS 4 para estilos
- Zustand para state management
- ESLint configurado con reglas estrictas

## [Unreleased]

### 🚀 Planeado
- Tests unitarios y de integración con Vitest
- Soporte para comandos en inglés
- Integración con robots físicos vía WebSocket
- Modo offline con service workers
- Temas personalizables (claro/oscuro)
- Exportar historial de comandos
- Estadísticas de uso y analytics
- Mejoras en animaciones del robot

---

[1.0.0]: https://github.com/tu-usuario/robot-commander/releases/tag/v1.0.0
