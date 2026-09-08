# ADR-0001 — Fork monorepo y separación del módulo propietario por proceso e interfaz HTTP

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

El proyecto origen (`Open-Legal-Products/mike`, commit `8b3466f`) está bajo
AGPL-3.0. La sección 5 c), verificada sobre el fichero `LICENSE`, obliga a
licenciar bajo AGPL *"the entire work, as a whole […] regardless of how they are
packaged"*. SGF necesita proteger plantillas, criterios de revisión y prompts de
valor competitivo.

## Decisión

1. El fork se mantiene como **monorepo único bajo AGPL-3.0**, conservando la
   estructura `backend/` · `frontend/` · `word-addin/` y el historial de git.
2. El *know-how* de SGF vive en un **repositorio privado separado**, desplegado
   como **proceso y contenedor distintos**, que implementa `KB-API v1`: contrato
   HTTP/JSON genérico, especificado en OpenAPI **dentro del repositorio público**.
3. El núcleo **funciona completo sin el módulo**. Sin `KB_API_URL` no hay
   degradación, no hay mensajes de carencia, no hay funcionalidad rota.
4. El módulo devuelve **datos** (texto), nunca código ejecutable ni control de
   flujo del núcleo.
5. El repositorio público no contiene referencias, fixtures ni tests del privado.

## Alternativas consideradas

- **Todo en el árbol AGPL.** Cumplimiento trivial, pero publica el *know-how*.
  Descartada por SGF.
- **Plugin cargado en proceso.** Cómodo, pero es el escenario donde la tesis de
  obra derivada es más fuerte. Descartada.
- **Know-how como contenido cargado por el operador**, sin módulo software
  (§3.4 de `00-licencia-agpl.md`). Riesgo nulo, capacidad menor. **Sigue sobre la
  mesa**: es la alternativa Q-02 pendiente de decisión de SGF.

## Consecuencias

- Coste operativo: un despliegue más, autenticación mTLS entre procesos, versión
  del contrato.
- **Riesgo residual declarado:** la frontera entre obra derivada y mera agregación
  (párrafo final de la sec. 5 AGPL) es una **zona gris no resuelta
  jurisprudencialmente**. Esta decisión reduce el riesgo; no lo elimina. Véase
  `00-licencia-agpl.md`, §3.3.
- Si SGF opta por Q-02 = "contenido-cargado", este ADR queda sustituido.

## Verificación

- Gate de CI que falla ante cualquier referencia al espacio de nombres privado.
- Prueba de integración que arranca el núcleo **sin** `KB_API_URL` y ejecuta el
  camino crítico completo.
