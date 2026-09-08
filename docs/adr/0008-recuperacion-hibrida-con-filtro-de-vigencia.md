# ADR-0008 — Recuperación híbrida con filtro de vigencia previo y embeddings locales

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

La base no tiene índice vectorial ni embeddings (verificado: `pgvector`,
`embedding` y `vector(` no aparecen en el esquema). La recuperación consiste en
aportar documentos completos al contexto del modelo (inventario I-22). Hay que
construir la capa desde cero, lo que permite hacerlo bien a la primera.

## Decisión

1. Recuperación **híbrida a nivel de precepto**:
   1. **filtro duro previo** por `as_of`, jurisdicción, nivel y materia;
   2. **léxica** con PostgreSQL FTS en configuración española y `pg_trgm` (ya
      presente en la base);
   3. **vectorial opcional**;
   4. **expansión estructural** (ADR-0006).
2. El **filtro temporal es lo primero**, no un reordenamiento posterior. Un
   precepto no vigente a `as_of` no entra en el conjunto candidato salvo consulta
   histórica expresa.
3. Los **embeddings se calculan siempre con modelo local**, en todos los modos de
   despliegue. Vectorizar el corpus o los documentos de cliente con un proveedor
   externo sería una salida de datos difícil de justificar ante un cliente que
   compra soberanía.
4. La capa vectorial es **opcional**: el sistema debe ser plenamente funcional sin
   ella, para no condicionar el modo `local-only` a la disponibilidad de un modelo
   de embeddings.

## Alternativas consideradas

- **Sólo vectorial.** Falla justamente donde el Derecho es preciso: números de
  artículo, referencias exactas, abreviaturas. Descartada.
- **Sólo léxica.** No cubre la consulta en lenguaje natural del abogado.
  Insuficiente por sí sola.
- **Reordenar por vigencia tras recuperar.** Deja entrar redacciones derogadas en
  el contexto del modelo, que las usará. Descartada.

## Consecuencias

- Coste de ingesta mayor y dependencia de un modelo de embeddings local cuando la
  capa vectorial esté activa.
- La calidad de la recuperación depende críticamente de la calidad del parseo
  estructural: refuerza la prioridad de los formatos XML sobre el PDF.

## Verificación

- Casos de `evals/` con redacciones anteriores que deben quedar excluidas del
  conjunto candidato, comprobado sobre el conjunto recuperado y no sólo sobre la
  respuesta final.
