# ADR-0006 — El precepto como unidad de indexación; disposiciones como entidades propias

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

La unidad de conocimiento de la base es el documento subido por el usuario
(inventario I-19). El Requisito 2.2 exige que la unidad de indexación y de
citación sea el **precepto**: instrumento → libro/título/capítulo → artículo →
apartado → letra.

## Decisión

1. **El precepto es la unidad** de indexación, de citación, de versionado y de
   anclaje (*grounding*). El documento sigue siendo la unidad para expedientes y
   material de cliente; conviven.
2. La estructura se almacena como **árbol navegable**, no como texto plano con
   marcadores. Sin árbol no hay resolución de remisiones internas
   ("el artículo anterior", "el apartado 2 del artículo 5").
3. **Las disposiciones transitorias, adicionales, derogatorias y finales son
   entidades de primer nivel**, con numeración ordinal propia, texto propio,
   versionado propio y relaciones "afecta a" hacia los preceptos que condicionan.
   No son texto suelto al final del documento.
4. La recuperación **expande estructuralmente**: recuperado un apartado, aporta al
   contexto su artículo, sus letras y las disposiciones que le afectan.

## Alternativas consideradas

- **Chunking por tamaño**, como en un RAG genérico. Rompe apartados por la mitad,
  destruye la jerarquía y hace imposible citar con precisión. Es el error de
  diseño más común en IA jurídica. Descartada.
- **Documento como unidad, con búsqueda dentro.** Es lo que hace la base. No
  permite versionado por precepto ni cita precisa. Descartada.

## Consecuencias

- Ingesta considerablemente más costosa: hay que parsear estructura, no sólo
  extraer texto. Justifica la prioridad dada a Akoma Ntoso, Formex y XML del BOE
  frente al PDF.
- Es lo que hace posible el ADR-0005 (versionado por precepto) y el ADR-0009
  (anclaje verificable).

## Verificación

- Casos de `evals/` en los que la respuesta correcta depende de una disposición
  transitoria; deben fallar si las disposiciones no se modelan.
- Test de resolución de remisiones internas sobre un instrumento real.
