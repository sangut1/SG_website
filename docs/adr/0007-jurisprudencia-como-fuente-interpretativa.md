# ADR-0007 — Jurisprudencia como fuente interpretativa (perfil `ES`/`EU`), sin *stare decisis*

**Estado:** propuesto; matizado por ADR-0013 (2026-09-09)
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

La base modela la jurisprudencia como fuente primaria: *cluster* de CourtListener
con *opinions* firmadas, y prompts que instruyen al modelo a citar el caso como
apoyo jurídico (inventario I-05, I-15). El Requisito 2.1 exige lo contrario.

## Decisión

1. La resolución judicial se modela como **fuente interpretativa**, nunca como
   fuente primaria vinculante. **Esto es el contenido del perfil de jurisdicción
   `ES`/`EU`, no una constante del motor** (ADR-0013): otro perfil puede atribuir
   efecto vinculante a determinadas resoluciones cuando su ordenamiento lo haga,
   sin que ello altere el perfil español.
2. Atributo `valor_interpretativo` ∈ { `doctrina_consolidada`,
   `sentencia_aislada`, `supranacional_tjue`, `supranacional_tedh`,
   `constitucional` }, con tratamiento diferenciado en la recuperación y en la
   presentación.
3. **No se importa lógica de *stare decisis*** en ningún perfil: no existen campos
   `overruled` ni `distinguished`, ni vinculación entre tribunales derivada del
   propio precedente. Donde un ordenamiento continental atribuye efecto vinculante
   a ciertas resoluciones, ese efecto **procede de la ley**, se declara en el
   perfil y se trata como tal, no como precedente que se autovincula.
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
- Con la ampliación prevista a Iberoamérica (ADR-0013), el catálogo de valores de
  la jurisprudencia deja de ser una lista fija y pasa a declararse por perfil. El
  régimen concreto de cada ordenamiento que se incorpore queda
  `[PENDIENTE DE VERIFICACIÓN]` contra su fuente oficial antes de escribir su
  perfil.

## Verificación

- Casos de `evals/` que penalizan respuestas que fundan la solución en una
  sentencia sin identificar antes el precepto.
