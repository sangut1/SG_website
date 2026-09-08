# ADR-0012 — Purga real con mapa de propagación y *crypto-shredding*

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

La base practica borrado lógico: las versiones de documento se marcan como
borradas y **permanecen en el manifiesto de exportación**, según documenta el
propio proyecto origen (*"Soft-deleted versions remain in the manifest with their
`deleted_at` value […] the filename and timestamps of a deleted version remain
visible to anyone who can access the project export"*). El Requisito 1 exige
purga real por documento, expediente y tenant, incluyendo índices vectoriales,
cachés y logs derivados, con mapa de propagación documentado.

## Decisión

1. **Purga real**, no borrado lógico, con mapa de propagación explícito
   (`02-arquitectura-objetivo.md`, §10.4) que alcanza: versiones, objetos, texto
   extraído, conversiones y miniaturas, índice léxico, índice vectorial, cachés de
   contexto, citas que lo referencian, adjuntos de chat, filas de revisión
   tabular, trabajos encolados y exportaciones generadas.
2. **Resolución de la tensión con la auditoría inmutable (ADR-0011):**
   - el log **no contiene contenido**, sólo identificadores, hashes y metadatos;
   - la purga **no borra eventos**: escribe un **evento-lápida** que declara qué
     se purgó, cuándo y por qué; la cadena permanece verificable;
   - los identificadores personales del log son seudónimos cuya tabla de
     correspondencia se destruye con la purga del tenant.
3. **Crypto-shredding**: la purga de tenant destruye su DEK (ADR-0003),
   inutilizando cualquier copia remanente en almacén, copias de seguridad
   incluidas.
4. La purga se ejecuta en la cola durable, es reanudable e **idempotente**, y
   registra su avance por destino del mapa.

## Alternativas consideradas

- **Borrado lógico con retención configurable.** Es lo que hay y no cumple el
  requisito.
- **Borrado inmediato y síncrono.** Con almacenes de objetos e índices
  distribuidos, un fallo a mitad deja el sistema en estado inconsistente y sin
  registro de qué faltó. Descartada en favor de la cola reanudable.

## Consecuencias

- Las copias de seguridad no pueden purgarse selectivamente: **el
  *crypto-shredding* es la única garantía realista** sobre ellas, y así debe
  documentarse ante el cliente sin adornos.
- Cada nuevo destino de datos (un índice, una caché, un formato derivado) obliga a
  ampliar el mapa. Se controla con un gate: todo destino nuevo declarado en el
  registro de destinos o falla la revisión.

## Verificación

- Test que purga un documento y comprueba, **uno a uno**, cada destino del mapa.
- Test que purga un tenant y comprueba que los objetos remanentes son
  indescifrables.
- Test que verifica que la cadena de auditoría sigue siendo válida tras la purga.
