# Documentación — fork europeo de MikeOSS

Fase 0 (análisis previo). **No se ha escrito ni modificado ningún fichero de
aplicación.** Estos documentos requieren aprobación explícita de Santos Gutiérrez
Figueroa antes de pasar a la Fase 1.

| Documento | Contenido |
| --- | --- |
| [00 — Cumplimiento AGPL-3.0](00-licencia-agpl.md) | Obligaciones de los arts. 4, 5, 7 y 13; frontera entre código derivado y módulo propietario; checklist de rebranding; regla dura del repositorio |
| [01 — Inventario US-céntrico](01-inventario-us-centrico.md) | Inventario exhaustivo de componentes con supuestos de Derecho anglosajón, marcados como sustituir / abstraer / eliminar / conservar |
| [02 — Arquitectura objetivo](02-arquitectura-objetivo.md) | Arquitectura propuesta con diagrama, decisiones justificadas y cuestiones abiertas |
| [ADR](adr/) | Un registro por decisión arquitectónica relevante (ADR-0001 a ADR-0012) |

## Convenio de verificación de fuentes

Ninguna afirmación normativa de estos documentos procede de la memoria del
modelo. Cada una está en uno de estos dos estados:

- **Verificado**: contrastado contra fuente oficial (texto consolidado de EUR-Lex
  o del BOE, o el propio fichero `LICENSE` para la AGPL). Se indica la fuente.
- `[PENDIENTE DE VERIFICACIÓN]`: no ha podido contrastarse. **No debe publicarse
  ni incorporarse a texto visible para el usuario** hasta que se contraste.

Durante la redacción, el entorno de trabajo tenía bloqueado el egreso de red
hacia `boe.es`, `eur-lex.europa.eu`, `op.europa.eu` y `poderjudicial.es`; la
verificación se realizó a través de un conector a fuente oficial. Los avisos
legales y condiciones de uso de los portales quedan pendientes.

## Base analizada

`Open-Legal-Products/mike`, commit `8b3466fc04bf8cad623238a71fca1fda3fc89fde`
(2026-09-05), licencia AGPL-3.0.
