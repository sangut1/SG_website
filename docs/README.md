# GNEO — documentación de la Fase 0

**GNEO** (nombre provisional) es el fork europeo de MikeOSS reorientado del
Derecho anglosajón al Derecho continental.

> **Fase 0 APROBADA por SGF el 2026-09-09.** Análisis previo cerrado. Ningún
> fichero de aplicación ha sido escrito ni modificado en esta fase. El código de
> GNEO se desarrolla en `sangut1/gneo` (privado); estos documentos permanecen
> aquí como memoria del proyecto.
>
> **Fase 1 en marcha.** `sangut1/gneo` sembrado el 2026-09-09 con los 631 commits
> del historial del proyecto de origen (`main` en `8b3466f`). El bloque 1
> —gobernanza y cumplimiento AGPL— está en la rama `fase-1/gobernanza`.

| Documento | Contenido |
| --- | --- |
| [00 — Cumplimiento AGPL-3.0](00-licencia-agpl.md) | Obligaciones de los arts. 4, 5, 7 y 13; frontera entre código derivado y *know-how* de SGF; checklist de rebranding; regla dura del repositorio |
| [01 — Inventario US-céntrico](01-inventario-us-centrico.md) | 51 hallazgos con evidencia por fichero y línea, marcados como sustituir / abstraer / eliminar / conservar, más 13 de soberanía del dato |
| [02 — Arquitectura objetivo](02-arquitectura-objetivo.md) | Arquitectura de GNEO con diagrama, decisiones justificadas y consecuencias declaradas |
| [ADR](adr/) | Un registro por decisión arquitectónica relevante (ADR-0001 a ADR-0014) |
| [Fase 1 — arranque](fase-1/) | Procedimiento de siembra del repositorio GNEO y borradores de los ficheros de gobernanza (`NOTICE.md`, `TRADEMARKS.md`, `AGENTS.md`, `CLAUDE.md`) |

## Decisiones de SGF

### 2026-09-08

| Cuestión | Decisión |
| --- | --- |
| Proveedor de modelo de la Fase 1 | **Ollama en local.** Proveedores externos desactivados de fábrica |
| Frontera con el *know-how* de SGF | **Contenido cargado por el operador.** El acervo no es software; queda fuera del árbol AGPL. Se descarta el módulo-servicio propietario y con él la zona gris del art. 5 *in fine* AGPL |
| `local-only` con corpus vacío | **Negarse y declarar la laguna.** El sistema no elabora contenido normativo sin corpus que lo sostenga |
| Repositorio del fork | **Fase 0 aquí; el código, en repositorio nuevo** |

### 2026-09-09

| Cuestión | Decisión |
| --- | --- |
| Nombre del fork | **GNEO** (provisional) |
| Escenario de explotación | **Distribución a terceros**, aunque en la Fase 1 sólo lo use SGF. Activa de pleno las secs. 4, 5 y 6 AGPL además de la 13 |
| Renombrado del contexto de firma | **Aceptado** romper la verificación de manifiestos anteriores |
| Appropriate Legal Notices (sec. 5 d) AGPL) | **Se implementan**, renunciando a la dispensa. ADR-0014 |
| Oferta de código (sec. 13 AGPL) | **Se ofrece siempre**, en todos los modos, incluido `local-only` monopuesto. ADR-0014 |
| Rol a efectos del Reglamento (UE) 2024/1689 | **Proveedor** |
| Regla de modelo local obligatorio | **Sólo art. 10 RGPD** y secreto profesional. El art. 9 queda como clase opcional desactivada por defecto |
| Política de citas no resueltas | **`marcar`** por defecto. Nunca se presenta como verificada |
| Alcance jurisdiccional | **España** en la Fase 1. Horizonte próximo: **México, Colombia, Perú, Ecuador y Argentina**. UI en `es-ES` con paquetes de idioma intercambiables. ADR-0013 |
| Complemento de Word | **Se mantiene** en la Fase 1 |

Pendientes, sin bloquear la Fase 1: **Q-18** (dominio y marca "GNEO", sin
comprobar), **Q-14** (corpus de escritos para validar el parser de citas) y
**Q-16** (orden de CC. AA. y supervisores dentro de la Fase A).

## Convenio de verificación de fuentes

Ninguna afirmación normativa de estos documentos procede de la memoria del
modelo. Cada una está en uno de estos dos estados:

- **Verificado**: contrastado contra fuente oficial (texto consolidado de EUR-Lex
  o del BOE, o el propio fichero `LICENSE` para la AGPL). Se indica la fuente.
- `[PENDIENTE DE VERIFICACIÓN]`: no ha podido contrastarse. **No debe publicarse
  ni incorporarse a texto visible para el usuario** hasta que se contraste.

Durante la redacción, el entorno de trabajo tenía bloqueado el egreso de red
hacia `boe.es`, `eur-lex.europa.eu`, `op.europa.eu` y `poderjudicial.es`; la
verificación se realizó a través de un conector a fuente oficial. Quedan
pendientes los avisos legales de los portales y el régimen de fuentes de los cinco
ordenamientos iberoamericanos del horizonte.

## Base analizada

`Open-Legal-Products/mike`, commit `8b3466fc04bf8cad623238a71fca1fda3fc89fde`
(2026-09-05), licencia AGPL-3.0.
