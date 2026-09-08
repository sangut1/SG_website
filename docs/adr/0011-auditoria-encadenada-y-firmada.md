# ADR-0011 — Auditoría encadenada por hash y firmada

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

La base aporta tres piezas: `audit_events` con acción, usuario, proyecto, chat,
documento, revisión y modelo; SHA-256 por versión de documento; y firma Ed25519
de manifiestos de exportación con separación de dominio y `key_id` para rotación
(`manifestSigning.ts`, `docs/tamper-evident-exports.md`). Le faltan dos cosas para
servir como log de auditoría: **encadenamiento de hash** y **escritura
garantizada** — hoy el registro es explícitamente *fire-and-forget* y traga los
errores (`audit.ts`: *"recording an event must NEVER throw or block the
user-facing path"*).

## Decisión

1. **Encadenamiento por tenant**: cada evento incluye `prev_hash`, formando una
   cadena verificable. El extremo se sella periódicamente con Ed25519 y puede
   publicarse como anclaje externo.
2. **Escritura garantizada**: las acciones auditables se encolan en la cola
   durable ya existente (`db_jobs`); una acción cuyo evento no puede registrarse
   **no se completa**. Se abandona el comportamiento *fire-and-forget* para los
   eventos auditables (se conserva para telemetría interna no probatoria, si la
   hubiera).
3. **Append-only real**: revocación de `UPDATE` y `DELETE` sobre la tabla para
   todos los roles de aplicación.
4. **Contenido mínimo por evento**: quién, qué documento, qué consulta, qué
   fuentes, qué modelo y versión, `as_of`, clasificación de sensibilidad,
   resultado del pipeline antialucinación, y hashes —nunca contenido—.
5. Exportable, con verificador independiente documentado.

## Alternativas consideradas

- **Blockchain o servicio externo de sellado.** Introduce una salida de red
  incompatible con `local-only` y una dependencia de tercero contraria a la
  soberanía. El anclaje externo queda como **opción** del operador, no como
  requisito.
- **Conservar el comportamiento *fire-and-forget*.** Es razonable para telemetría
  y ruinoso para prueba: un log con huecos silenciosos no acredita nada.

## Consecuencias

- La escritura de auditoría entra en el camino crítico de las acciones auditables;
  hay que dimensionar la cola.
- El encadenamiento por tenant obliga a serializar la escritura por tenant.
- Tensión con el derecho de supresión, resuelta en el ADR-0012.

## Verificación

- Test de verificación de cadena que detecta un evento alterado, insertado o
  eliminado.
- Test que comprueba que un fallo de auditoría aborta la acción auditable.
