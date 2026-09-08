# ADR-0002 — Cliente HTTP único con lista blanca de egreso

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

El Requisito 1 exige que toda llamada saliente pase por un cliente HTTP único con
lista blanca y registro en auditoría, y que un destino no listado **falle**, sin
degradación silenciosa. La base heredada llama a `fetch` desde múltiples módulos
(CourtListener, sincronización de *workflows* desde `codeload.github.com`,
proveedores de modelo, almacenamiento S3, conectores MCP) y trae fuentes remotas
de Google y un CDN de PDF.js en el frontend (inventario S-01 a S-06).

## Decisión

1. Módulo `backend/src/lib/net/egress.ts` como **único** punto del programa
   autorizado a abrir conexiones salientes.
2. Aplicación forzosa en **tres capas**: regla ESLint, gate de CI, y sustitución
   de `globalThis.fetch` en el arranque por una función que lanza excepción.
3. Toda llamada registra tenant, destino, conector, propósito, `as_of`, resultado
   y bytes en la cadena de auditoría.
4. Se reutiliza `backend/src/lib/privateIp.ts` (ya presente) y se añade resolución
   previa de DNS con comprobación de la IP resuelta, contra *DNS rebinding*.
5. `SOVEREIGNTY_MODE=local-only` vacía la lista blanca de forma irreversible en
   tiempo de ejecución.
6. Los assets del frontend se sirven **localmente**: fuentes empaquetadas
   (`next/font/local`), PDF.js sin CDN, sin `@import` remotos.

## Alternativas consideradas

- **Cortafuegos de red solamente.** No cumple el registro en auditoría por llamada
  ni distingue propósitos; y no protege el modo `local-only` en portátil.
  Se mantiene como **capa adicional**, no como sustituto.
- **Confiar en la revisión de código.** Insuficiente: un `fetch` nuevo pasaría
  desapercibido en la revisión número cuarenta.

## Consecuencias

- Todo conector nuevo debe pasar por el módulo, sin excepción.
- Los SDK de terceros que traen su propio cliente HTTP (AWS SDK, SDK de modelos)
  deben inyectarse con el cliente del módulo o quedan prohibidos.
- Fricción real de desarrollo. Es intencionada.

## Verificación

- Suite `backend/src/__tests__/airgap/` en red Docker `internal: true`.
- Test que verifica que un destino fuera de lista blanca produce error tipado y
  un evento de auditoría, no un tiempo de espera.
