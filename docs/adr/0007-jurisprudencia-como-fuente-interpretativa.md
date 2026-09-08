# ADR-0007 — Jurisprudencia como fuente interpretativa, sin *stare decisis*

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

La base modela la jurisprudencia como fuente primaria: *cluster* de CourtListener
con *opinions* firmadas, y prompts que instruyen al modelo a citar el caso como
apoyo jurídico (inventario I-05, I-15). El Requisito 2.1 exige lo contrario.

## Decisión

1. La resolución judicial se modela como **fuente interpretativa**, nunca como
   fuente primaria vinculante.
2. Atributo `valor_interpretativo` ∈ { `doctrina_consolidada`,
   `sentencia_aislada`, `supranacional_tjue`, `supranacional_tedh`,
   `constitucional` }, con tratamiento diferenciado en la recuperación y en la
   presentación.
3. **No se importa lógica de *stare decisis***: no existen campos `binding`,
   `overruled`, `distinguished`, ni jerarquía de vinculación entre tribunales.
4. Identificador canónico: **ECLI**. Los identificadores nativos (ROJ, número de
   asunto) son alias resolubles.
5. El prompt exige **norma primero**: no se cita una resolución como fundamento
   autónomo sin haber identificado el precepto aplicable y su redacción vigente.
6. El *soft law* (directrices EBA/ESMA/EIOPA, dictámenes EDPB, circulares de
   supervisores) se modela como fuente interpretativa administrativa, con
   declaración expresa de su carácter no vinculante.

## Alternativas consideradas

- **Reutilizar el modelo de *cluster* + *opinions*.** Ahorraría trabajo, pero
  induce al modelo a razonar por precedente y fragmenta la identidad de la
  resolución. Descartada.

## Consecuencias

- El voto particular se modela como parte de la resolución, no como opinión de
  primer nivel.
- La distinción entre doctrina consolidada y sentencia aislada exige criterio
  editorial o metadatos de la fuente; cuando no consten, se marca como
  **desconocido** y no se presume consolidada.

## Verificación

- Casos de `evals/` que penalizan respuestas que fundan la solución en una
  sentencia sin identificar antes el precepto.
