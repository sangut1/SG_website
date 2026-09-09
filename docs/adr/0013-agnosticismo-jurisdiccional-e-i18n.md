# ADR-0013 — Agnosticismo jurisdiccional y paquetes de idioma desde el primer día

**Estado:** aceptado (decisión de SGF, 2026-09-09)
**Fecha:** 2026-09-09
**Fase:** 0

## Contexto

El alcance de la Fase 1 es **España** (con Derecho de la UE), pero SGF prevé
ampliar GNEO **principalmente a países de Iberoamérica**, y quiere que la interfaz
—desarrollada en `es-ES`— admita paquete de cambio de idioma.

Eso convierte tres decisiones que parecían cerradas en decisiones de diseño
abiertas, y conviene verlas ahora y no cuando haya 51 tablas migradas:

1. **La jerarquía de fuentes de la UE no es universal.** El eje
   supranacional → nacional → autonómico → local, con la relación de transposición
   de Directivas, es específico del Derecho de la UE. En Iberoamérica el nivel
   supraestatal, cuando existe, tiene otra naturaleza y otro efecto.
2. **ELI y ECLI son europeos.** No hay equivalente universal en Iberoamérica.
3. **El valor de la jurisprudencia no es el mismo en todo el Derecho
   continental.** El ADR-0007 excluye —con razón para España y la UE— la lógica de
   *stare decisis* del *common law*. Pero varios ordenamientos iberoamericanos de
   tradición continental atribuyen a determinadas resoluciones un **efecto
   vinculante** por vía legal o constitucional. Un sistema que trate "jurisprudencia
   = fuente interpretativa" como **constante del código** sería incorrecto allí.
   `[PENDIENTE DE VERIFICACIÓN: régimen concreto de cada ordenamiento que se
   incorpore, contra su fuente oficial, antes de escribir su perfil.]`

## Decisión

1. **Perfil de jurisdicción como dato, no como código.** Un fichero
   `config/jurisdicciones/<codigo>.toml` declara, para cada jurisdicción:
   - sus **niveles** normativos y su orden de rango;
   - su **tipología** de instrumentos;
   - su **esquema de identificador canónico**;
   - su **fichero de estilo de cita** (§6.1 del doc. 02);
   - su **catálogo de valores de la jurisprudencia** y el efecto de cada uno;
   - sus **relaciones normativas** propias (la transposición de Directivas es de
     la UE; otros ordenamientos tienen las suyas).

   Niveles y tipos **no** son `enum` de TypeScript ni `check` de Postgres: son
   filas. Cablearlos obligaría a migrar el esquema para dar de alta cada país.

2. **Identificador canónico propio.** URI interno
   `gneo:<jurisdiccion>:<tipo>:<...>`, del que **ELI y ECLI son el caso particular
   de la UE y España**. CELEX, `BOE-A-AAAA-NNNNN`, ROJ y los identificadores
   nativos que vengan son **alias resolubles**, nunca clave primaria.

3. **El valor de la jurisprudencia lo fija el perfil**, no el motor. Para España y
   la UE: fuente **interpretativa**, sin efecto vinculante (ADR-0007, que sigue
   plenamente vigente para el perfil `ES`). El motor debe poder representar que
   otra jurisdicción atribuya efecto vinculante a determinadas resoluciones, sin
   que eso contamine el perfil español. **Lo que no se importa en ningún perfil es
   la lógica de *stare decisis* del *common law*** —`overruled`, `distinguished`,
   vinculación por jerarquía de tribunales derivada del propio precedente—: el
   efecto vinculante continental, donde existe, procede de la ley, no del
   precedente en sí.

4. **i18n de primera clase, con tres ejes independientes:**
   - **idioma de la interfaz** (paquete de idioma; `es-ES` es el paquete base y
     la fuente de verdad de las cadenas);
   - **idioma de los prompts** del sistema;
   - **idioma de la manifestación normativa** recuperada.

   No se acoplan. Un abogado español puede tener la interfaz en `es-ES` y comparar
   las versiones española y francesa de un precepto de la UE. Las variantes
   iberoamericanas del español (`es-419`, `es-MX`, `es-AR`…) son paquetes que
   heredan de `es-ES` y sólo redefinen lo que cambia. El portugués de Brasil, si
   llega, es un paquete más, no una excepción.

5. **Ninguna cadena visible se escribe en línea en el código.** Se declara un
   *gate* de CI que falla ante literales de UI fuera de los ficheros de mensajes.
   Es la única forma de que el paquete de idioma siga siendo completo cuando el
   proyecto tenga dos años.

6. **Localización de formatos por tenant, no por navegador.** Fechas, importes y
   ordenación se resuelven con la configuración regional del tenant (hallazgos
   I-28 a I-30 del inventario). Una fecha jurídica no puede depender del equipo
   desde el que se consulta.

## Alternativas consideradas

- **Cablear España y la UE ahora y generalizar cuando toque.** Es lo barato hoy y
  lo caro después: obligaría a migrar el esquema, reescribir el motor de conflicto
  de normas y reindexar el corpus. Con la ampliación ya anunciada, es una decisión
  que se sabe equivocada de antemano. Descartada.
- **Interfaz sólo en español, i18n más tarde.** Retroadaptar i18n a una base con
  cadenas dispersas por cientos de componentes es de los trabajos peor pagados que
  existen. El coste de hacerlo desde el principio es una fracción. Descartada.
- **Hacer de ELI la clave primaria.** Cómodo mientras el alcance sea europeo,
  bloqueante en cuanto deje de serlo. Descartada.

## Consecuencias

- Sobrecoste inicial moderado: una indirección más en el modelo de fuentes y la
  disciplina de i18n desde el primer commit.
- El motor de conflicto de normas (jerarquía, competencia, temporalidad,
  especialidad) trabaja sobre el **rango declarado en el perfil**, no sobre una
  escala española cableada.
- La suite `evals/` pasa a estar **particionada por jurisdicción**. La de la Fase 1
  es la española y de la UE; cada perfil nuevo trae la suya, y sin ella el perfil
  no se da por bueno.
- Queda abierto **Q-17**: qué países de Iberoamérica y en qué horizonte. La
  respuesta determina si hay que soportar precedente vinculante ya en la Fase 1 o
  basta con dejar la puerta abierta, que es lo que hace este ADR.

## Verificación

- Test que da de alta un **perfil de jurisdicción ficticio** con niveles, tipos y
  valor de jurisprudencia distintos de los españoles, y comprueba que ingesta,
  recuperación, citación y detección de conflictos funcionan **sin tocar código ni
  migrar el esquema**. Es la prueba de que el agnosticismo es real y no una
  intención declarada.
- *Gate* de CI contra literales de UI fuera de los ficheros de mensajes.
- Test de completitud de paquetes de idioma: toda clave de `es-ES` existe en cada
  paquete publicado, o el paquete se marca como parcial de forma visible.
