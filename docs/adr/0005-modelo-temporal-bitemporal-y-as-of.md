# ADR-0005 — Modelo bitemporal y fecha de referencia obligatoria

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

La base no tiene ninguna noción de vigencia temporal ni de fecha de referencia
(inventario I-17, I-18). El Requisito 2.2 exige versionado temporal de primera
clase y una `as_of` en toda consulta. El Derecho continental lo impone: un
contrato de 2021 se juzga con la redacción de 2021.

## Decisión

1. **Dos ejes temporales** por redacción de precepto:
   - **Vigencia** (tiempo del mundo): `fecha_inicio_vigencia`,
     `fecha_fin_vigencia`, `estado` ∈ { `vigente`, `derogado`, `suspendido`,
     `anulado`, `no_vigente_aun` }, y norma modificativa que la introdujo.
   - **Conocimiento** (tiempo del sistema): `ingerido_en`, `sustituido_en`,
     `fuente`, `hash`.
2. **Aplicación diferida** modelada aparte de la vigencia
   (`fecha_aplicabilidad` ≠ `fecha_vigencia`), y **prórrogas** como relación
   normativa que desplaza fechas conservando la procedencia.
3. **`as_of` obligatoria** en toda consulta, por defecto hoy, modificable y
   visible. Implementada como **tipo *branded*** `AsOfDate`: no existe una
   sobrecarga de recuperación sin ella.
4. La `as_of` empleada **se declara en cada respuesta** y se registra en
   auditoría junto con los hashes de las redacciones aportadas.
5. Si el corpus no cubre esa fecha, se **declara la laguna**. No se interpola ni
   se ofrece la redacción vigente como sucedáneo.

## Alternativas consideradas

- **Un solo eje (vigencia).** Simple, pero impide reproducir qué sabía el sistema
  cuando emitió una respuesta pasada: inservible para auditoría y para defender
  un dictamen emitido hace un año. Descartada.
- **`as_of` opcional con valor por defecto.** Un parámetro opcional se olvida.
  Descartada por diseño de tipos.

## Consecuencias

- Toda la capa de recuperación, el índice y las herramientas expuestas al modelo
  cambian de firma.
- Coste de almacenamiento e ingesta mayores: se guardan todas las redacciones.
- Prueba de fuego del modelo: el Reglamento (UE) 2024/1689, cuyo art. 113
  (verificado) establece entrada en vigor a los veinte días de su publicación,
  aplicación general desde el 2 de agosto de 2026 y calendarios escalonados por
  capítulos (2 de febrero de 2025, 2 de agosto de 2025, 27 de julio de 2026,
  2 de diciembre de 2027 y 2 de agosto de 2028). Un modelo de un solo campo de
  fecha no puede representarlo.

## Verificación

- Casos de la suite `evals/` con `as_of` en el pasado que deben devolver la
  redacción de entonces.
- Test que comprueba que ninguna función de recuperación acepta llamada sin
  `AsOfDate` (comprobación de tipos en CI).
