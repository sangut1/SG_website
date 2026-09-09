# ADR-0010 — Enrutado de modelos por sensibilidad como control técnico

**Estado:** propuesto; alcance fijado por SGF el 2026-09-09
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

El Requisito 5 exige que los expedientes amparados por secreto profesional o con
datos sensibles sólo puedan procesarse con modelo local, **como control técnico,
no como recomendación en la interfaz**. La base tiene una abstracción de
proveedor (`backend/src/lib/llm/`), soporte de Ollama y, como modelo por defecto,
un proveedor externo (`DEFAULT_MAIN_MODEL = "gemini-3-flash-preview"`).

## Decisión

1. Clasificación por expediente y documento: `secreto_profesional`,
   `rgpd_art_10`, `rgpd_art_9`, `ordinario`.
2. **`secreto_profesional` y `rgpd_art_10` sólo pueden procesarse con modelo
   local** (decisión de SGF, 2026-09-09). `rgpd_art_9` se implementa como clase
   **opcional, desactivada por defecto**, activable por quien despliegue GNEO.
3. **El control vive en el router de modelos**, se aplica sobre la unión de todos
   los documentos aportados al contexto y **antes** de construir la petición. Es
   una excepción que impide la llamada, no un aviso.
4. **Sin recurso automático**: si no hay modelo local disponible y el contexto es
   sensible, la operación **falla** con mensaje claro. Nunca se recurre a un
   proveedor externo.
5. **Modelo local por defecto: Ollama** (decisión de SGF, 2026-09-08, que resuelve
   el marcador `<<PROVEEDOR_MODELO_FASE_1>>` del encargo). La base ya lo soporta
   con detección dinámica de modelos, de modo que es también el camino de menor
   fricción. **vLLM** queda como alternativa para despliegues con GPU y
   concurrencia alta. Los proveedores externos están **desactivados de fábrica** y
   sujetos al `kill switch` por tenant (ADR-0004).

## Fundamento normativo verificado

- **Art. 9.1 RGPD** (texto consolidado oficial, CELEX 32016R0679): categorías
  especiales —origen étnico o racial, opiniones políticas, convicciones religiosas
  o filosóficas, afiliación sindical, datos genéticos, datos biométricos dirigidos
  a identificar unívocamente, salud, vida sexual u orientación sexual—.
- **Art. 10 RGPD**: datos relativos a **condenas e infracciones penales** o
  medidas de seguridad conexas.
- SGF ha decidido (2026-09-09) **limitar la regla obligatoria al art. 10** y al
  secreto profesional. Consecuencia asumida: un expediente de laboral, familia o
  daños personales con datos de salud no queda cubierto por la regla obligatoria.
  El riesgo es hoy teórico —los proveedores externos están desactivados de fábrica
  y SGF opera sólo con modelo local— y se materializaría al activar un proveedor
  externo o al desplegar GNEO un tercero con esa configuración. Por eso la clase
  `rgpd_art_9` se implementa y se deja a un interruptor de distancia en lugar de
  eliminarla.

## Alternativas consideradas

- **Aviso en la interfaz con confirmación del usuario.** Es lo que el Requisito 5
  descarta expresamente. Un clic por descuido a las nueve de la noche envía un
  expediente penal a un tercero.
- **Clasificación automática por contenido.** Útil como **ayuda** (propuesta de
  clasificación), nunca como única fuente: un falso negativo del clasificador
  sería una fuga. La clasificación efectiva la fija el usuario o la política del
  tenant; el clasificador sólo puede **elevar** la sensibilidad, nunca rebajarla.

## Consecuencias

- Calidad de respuesta menor en expedientes sensibles, limitada por el modelo
  local disponible. Es el intercambio que el producto vende.
- Obliga a que el despliegue mínimo viable incluya un modelo local operativo:
  Ollama pasa a ser **dependencia de puesta en servicio**, no accesorio. La suite
  `evals/` y la prueba de red aislada se ejecutan contra él.
- Fija el listón de calidad de la Fase 1 en lo que rinda el modelo local elegido.
  La elección del modelo concreto que corre sobre Ollama es una decisión separada
  y revisable, guiada por la suite `evals/`.

## Verificación

- Test que, con un documento marcado `rgpd_art_10` en el contexto, comprueba que
  el cliente de egreso **no recibe ninguna llamada**; y el mismo test para
  `rgpd_art_9` con la clase activada.
- Test que comprueba que la indisponibilidad del modelo local produce error y no
  recurso a proveedor externo.
