# ADR-0009 — Pipeline antialucinación bloqueante y umbrales de CI

**Estado:** propuesto; el punto 8 es decisión aceptada de SGF (2026-09-08)
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

El prompt heredado contiene la instrucción *"If no documents are provided, answer
from legal knowledge."* (`backend/src/lib/chat/prompts.ts`, inventario I-16): es
exactamente la autorización a reconstruir Derecho de memoria que el Requisito 2.5
prohíbe. La base sí aporta, en cambio, dos piezas aprovechables: el protocolo de
citación con marcadores `[N]` y bloque `<CITATIONS>`, y la verificación de
literalidad de la cita contra el texto de origen con tres niveles de tolerancia
(`verifyCitations.ts`).

## Decisión

1. **Pipeline obligatorio y bloqueante**: generación → extracción de citas →
   resolución contra fuente conectada o corpus local → comprobación de vigencia a
   `as_of` → comprobación de literalidad → comprobación de *grounding* →
   renderizado.
2. **Ninguna cita se muestra sin resolución positiva.** Una cita no resuelta se
   marca **NO VERIFICADA** de forma inequívoca o se suprime, según
   `politica_citas_no_resueltas` ∈ { `marcar`, `suprimir` }. **No existe valor de
   configuración que la presente como verificada.**
3. Toda afirmación jurídica enlaza al fragmento que la sostiene. Sin anclaje se
   marca como **razonamiento del modelo**, no como contenido normativo.
4. Se elimina del prompt la autorización a responder de memoria y se sustituye por
   la obligación de **declarar la laguna**.
5. Suite `evals/` con trampas deliberadas (precepto derogado, numeración
   inexistente, normas confundibles, redacción anterior, aplicación diferida,
   disposición transitoria determinante, transposición, conflicto de normas,
   divergencia entre versiones lingüísticas, cita inexistente en el prompt).
6. **Umbrales de CI:** `tasa_alucinacion` = **0 %**, sin excepción; las demás
   métricas (`tasa_laguna_no_declarada`, `tasa_vigencia_incorrecta`,
   `cobertura_grounding`) con umbral configurable y objetivo 0 % / 100 %.
7. La suite se ejecuta **con modelo local**, para ser reproducible sin salida de
   red y sin coste por ejecución.
8. **Regla de corpus insuficiente (decisión de SGF, 2026-09-08).** Cuando
   **ninguna** cita puede resolverse contra fuente —`local-only` con corpus vacío
   o sin cobertura de la materia—, el sistema **no elabora contenido normativo**:
   declara la laguna, indica qué corpus o conector le falta, y se detiene. No
   entrega una respuesta jurídica íntegramente marcada como no verificada, porque
   el usuario acaba fiándose de lo que tiene delante. El trabajo sobre documentos
   del propio expediente (análisis, comparación, redacción, revisión) no queda
   afectado: no depende del corpus.

## Alternativas consideradas

- **Marcar la confianza con un porcentaje.** Traslada al usuario una decisión que
  el sistema puede tomar. Un abogado no necesita "87 % de confianza": necesita
  saber si la cita existe y está vigente. Descartada.
- **Verificar sólo bajo demanda.** Convierte la verificación en opcional; es el
  fallo que el producto existe para impedir. Descartada.
- **Responder con todo marcado como no verificado** cuando no hay corpus. Más
  útil a corto plazo, pero traslada al usuario la carga de desconfiar de cada
  línea. Descartada por SGF el 2026-09-08.

## Consecuencias

- Respuestas más lentas y más pobres cuando el corpus es incompleto. Es el
  comportamiento correcto.
- Un umbral de 0 % puede bloquear el pipeline con frecuencia al principio. También
  es el comportamiento correcto: la alternativa es publicar un producto que
  inventa citas.
- Consecuencia límite asumida (Q-11, resuelta): **el modo `local-only` no es
  utilizable para consulta jurídica hasta que se haya ingerido corpus.** Sí lo es
  desde el primer día para el trabajo sobre documentos del expediente. Esto eleva
  la ingesta de corpus de "tarea de la Fase A" a **requisito de puesta en
  servicio** del modo insignia.

## Verificación

- La propia suite `evals/` es el criterio de aceptación del producto.
- Gate de CI que falla al superar los umbrales.
- Test con corpus vacío que comprueba que el sistema declara la laguna y **no**
  produce contenido normativo.
