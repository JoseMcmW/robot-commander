# Guía de Contribución

¡Gracias por tu interés en contribuir a Robot Commander! 🎉

## Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas un ambiente respetuoso y profesional.

## ¿Cómo Contribuir?

### Reportar Bugs

Si encuentras un bug, por favor abre un issue con:

- **Título descriptivo**
- **Pasos para reproducir** el problema
- **Comportamiento esperado** vs **comportamiento actual**
- **Screenshots** si es aplicable
- **Información del entorno** (navegador, OS, versión)

### Sugerir Mejoras

Para sugerir nuevas características:

1. Verifica que no exista un issue similar
2. Abre un issue describiendo:
   - El problema que resuelve
   - La solución propuesta
   - Alternativas consideradas
   - Impacto en el proyecto

### Pull Requests

#### Proceso

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```
3. **Realiza tus cambios** siguiendo las guías de estilo
4. **Commit** con mensajes descriptivos:
   ```bash
   git commit -m "feat: agregar detección de gestos"
   ```
5. **Push** a tu fork:
   ```bash
   git push origin feature/mi-nueva-caracteristica
   ```
6. **Abre un Pull Request** con descripción detallada

#### Guías de Estilo

**TypeScript**
- Usa tipos explícitos, evita `any`
- Prefiere interfaces sobre types para objetos
- Documenta funciones complejas con JSDoc
- Usa nombres descriptivos para variables y funciones

**React**
- Componentes funcionales con hooks
- Props tipadas con interfaces
- Usa `useCallback` y `useMemo` cuando sea necesario
- Mantén componentes pequeños y enfocados

**Commits**
Sigue [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, punto y coma, etc.
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

**Ejemplos:**
```
feat: agregar soporte para comandos en inglés
fix: corregir detección de objetos en baja luz
docs: actualizar README con nuevos comandos
refactor: simplificar lógica del Vision Agent
```

#### Checklist antes de PR

- [ ] El código compila sin errores (`bun run build`)
- [ ] Pasa el linter sin warnings (`bun run lint`)
- [ ] Los tipos de TypeScript son correctos
- [ ] La funcionalidad fue probada manualmente
- [ ] Se actualizó la documentación si es necesario
- [ ] Los commits siguen Conventional Commits
- [ ] El PR tiene una descripción clara

### Desarrollo Local

```bash
# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tu API key de Gemini

# Iniciar desarrollo
bun run dev

# Ejecutar linter
bun run lint

# Build de producción
bun run build
```

### Estructura de Branches

- `main` - Rama principal, siempre estable
- `feature/*` - Nuevas características
- `fix/*` - Correcciones de bugs
- `docs/*` - Cambios en documentación
- `refactor/*` - Refactorizaciones

### Testing

Actualmente el proyecto no tiene tests automatizados. Si quieres contribuir agregando tests:

1. Usa Vitest como framework
2. Enfócate en lógica de negocio (agents, utils)
3. Agrega tests de integración para flujos críticos

## Áreas de Contribución

### Prioridad Alta
- [ ] Tests unitarios y de integración
- [ ] Soporte para más idiomas
- [ ] Mejoras en precisión de detección
- [ ] Optimizaciones de performance

### Prioridad Media
- [ ] Nuevos comandos de voz
- [ ] Integración con robots físicos
- [ ] Modo offline
- [ ] Temas personalizables

### Prioridad Baja
- [ ] Animaciones mejoradas
- [ ] Sonidos de feedback
- [ ] Estadísticas de uso
- [ ] Exportar historial

## Preguntas

Si tienes preguntas sobre cómo contribuir, puedes:

- Abrir un issue con la etiqueta `question`
- Contactar a los maintainers
- Revisar issues existentes con `good first issue`

## Reconocimientos

Todos los contribuidores serán reconocidos en el README y en las release notes.

¡Gracias por hacer de Robot Commander un mejor proyecto! 🚀
