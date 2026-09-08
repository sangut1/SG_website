# ADR-0001 — Fork monorepo y *know-how* de SGF como contenido, no como software

**Estado:** aceptado (decisión de SGF, 2026-09-08)
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

El proyecto origen (`Open-Legal-Products/mike`, commit `8b3466f`) está bajo
AGPL-3.0. La sección 5 c), verificada sobre el fichero `LICENSE`, obliga a
licenciar bajo AGPL *"the entire work, as a whole […] regardless of how they are
packaged"*. SGF necesita proteger plantillas contractuales, criterios internos de
revisión, playbooks y prompts de valor competitivo.

## Decisión

1. El fork se mantiene como **monorepo único bajo AGPL-3.0**, conservando la
   estructura `backend/` · `frontend/` · `word-addin/` y el historial de git. El
   código vive en un **repositorio nuevo y dedicado**, no en el del sitio web.
2. **El *know-how* de SGF no se incorpora al programa en ninguna forma.** Es
   **contenido**, y entra en el sistema por las mismas rutas que un documento de
   cliente: subida de documentos, filas de base de datos y configuración del
   operador.
3. El árbol AGPL contiene la **capacidad, vacía de contenido**: la biblioteca de
   plantillas, el motor de listas de comprobación, el campo donde se pega un
   prompt. Es la diferencia entre publicar un procesador de textos y publicar los
   contratos escritos con él.
4. Ningún *seed*, *fixture*, test, ejemplo de documentación ni valor por defecto
   contiene material real de SGF. Los datos de ejemplo son ficticios y lo
   declaran.
5. Los prompts de valor competitivo se cargan como **configuración del tenant**,
   no como constantes del código. El repositorio incluye prompts base genéricos,
   publicables sin reservas.
6. El acervo se custodia fuera del repositorio, con versionado, respaldo y control
   de acceso propios, y con procedimiento documentado de carga.

**Fundamento:** el contenido que un usuario introduce en un programa AGPL no se
convierte en obra derivada del programa. La AGPL alcanza al software, no a los
documentos que se procesan con él. Esta vía **no tiene zona gris**.

## Alternativas consideradas

- **Todo en el árbol AGPL.** Cumplimiento trivial, pero publica el *know-how*.
  Descartada por SGF.
- **Módulo-servicio propietario separado** (repositorio privado, proceso y
  contenedor distintos, contrato `KB-API v1` genérico documentado en el
  repositorio público, núcleo plenamente funcional sin el módulo, intercambio de
  datos y no de código). **Reduciría** el riesgo sin eliminarlo: la frontera entre
  obra derivada y mera agregación (párrafo final de la sec. 5 AGPL) es una **zona
  gris no resuelta jurisprudencialmente**, y la posición de la FSF es opinión del
  licenciante, no norma. **Descartada por SGF el 2026-09-08** en favor del riesgo
  nulo. Queda descrita en `00-licencia-agpl.md` §3.3 por si se reabre.
- **Plugin cargado en proceso.** El escenario donde la tesis de obra derivada es
  más fuerte. Descartada sin discusión.

## Consecuencias

- **Se renuncia a lógica propietaria.** No puede haber algoritmos, reglas de
  decisión ni flujos exclusivos de SGF que no estén publicados bajo AGPL. Todo lo
  que sea *programa* es público. Es el precio del riesgo nulo, y está aceptado.
- Si el producto llegara a necesitar lógica propietaria, hay que **reabrir este
  ADR** y asumir expresamente la zona gris. No se hace de tapadillo.
- A cambio: cero coste operativo adicional (ningún despliegue extra, ninguna
  mTLS entre procesos, ningún contrato que versionar) y una posición defendible
  sin matices ante cualquier reclamación de cumplimiento.
- SGF puede afirmar que su acervo documental no está sujeto a la AGPL. Lo que
  **no** puede afirmar es que la plataforma contenga funcionalidad propietaria.

## Verificación

- Gate `knowhow-gate` en CI: falla si aparecen ficheros bajo `**/knowhow/**`,
  `**/plantillas/**`, `**/playbooks/**` o marcadores reservados del acervo.
- Ampliación de la configuración de `gitleaks` (ya presente en el pipeline del
  origen) con patrones propios.
- `CODEOWNERS` con revisión obligatoria de SGF sobre `docs/`, `NOTICE.md`,
  `LICENSE`, `TRADEMARKS.md` y los manifiestos de conectores.
- Prueba de arranque en limpio: el sistema debe ser plenamente funcional con la
  biblioteca de plantillas vacía.
