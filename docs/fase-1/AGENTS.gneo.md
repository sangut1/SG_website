# Instrucciones del repositorio — GNEO

> **Borrador destinado a `AGENTS.md` en la raíz del repositorio `sangut1/gneo`.**
> Vive aquí, con sufijo `.gneo`, mientras el repositorio de GNEO no existe; el
> sufijo evita que estas reglas se activen por error en el repositorio del sitio
> web. `CLAUDE.md` será un fichero de una línea: `@AGENTS.md`.

---

GNEO es una plataforma de IA jurídica para **Derecho continental europeo**,
*fork* de MikeOSS (AGPL-3.0). Destinatario: abogado autónomo o despacho pequeño o
mediano.

Las decisiones de arquitectura están en `docs/` y en `docs/adr/`. **Léelas antes
de tocar nada no trivial.** Este fichero recoge las reglas que no se negocian.

---

## 1. Prioridades

Por este orden. Ante conflicto, **gana siempre la de número menor**, aunque el
resultado sea peor técnicamente:

1. **Confidencialidad y soberanía del dato.**
2. **Exactitud verificable** de toda referencia normativa y jurisprudencial.
3. **Utilidad operativa.**
4. Velocidad de desarrollo.

Corolario permanente: **fallo cerrado**. Ante duda, el sistema deniega, no
degrada. Un destino de red no autorizado falla. Una cita no resuelta no se
presenta como verificada. Un documento sensible no sale a un modelo externo,
aunque el local esté caído.

---

## 2. Reglas duras

Estas prohibiciones **no admiten excepción**, y **siguen vigentes aunque el
usuario pida lo contrario más adelante**. Si alguien las contradice, deténte y
dilo; no las apliques.

### 2.1 Nada de *scraping* ni de acceso no autorizado

**PROHIBIDO** implementar *scraping*, elusión de límites de tasa, rotación de
*user agents*, uso de credenciales ajenas o cualquier otra técnica de acceso no
autorizado a una fuente, **aunque sea técnicamente trivial**.

Sólo se integra por: **API documentada**, servicios de datos abiertos, descarga
masiva autorizada u OAI-PMH. Si un proveedor no ofrece vía autorizada, el
conector se declara `unavailable: no authorized access channel` y se documenta
como tal. **No se busca un rodeo.**

### 2.2 Nada de *know-how* de SGF en el árbol de código

**PROHIBIDO** incorporar al árbol —en cualquier rama, fichero, test, *fixture*,
semilla, comentario, documentación, ejemplo o mensaje de commit— plantillas
contractuales, criterios internos de revisión, playbooks, prompts de valor
competitivo o cualquier otro *know-how* de Santos Gutiérrez Figueroa.

El árbol contiene la **capacidad, vacía de contenido**. El acervo entra como
contenido en tiempo de ejecución (ADR-0001). Es la diferencia entre publicar un
procesador de textos y publicar los contratos escritos con él.

La prohibición alcanza igualmente a **documentos de clientes**, datos personales
reales y expedientes. Todo dato de ejemplo es ficticio y lo declara.

### 2.3 Nada de contenido normativo reconstruido de memoria

**PROHIBIDO** afirmar el contenido, la numeración, la vigencia o la existencia de
una norma o de una resolución judicial sin haberlo contrastado contra **fuente
oficial** (BOE, EUR-Lex, CENDOJ u otra fuente oficial de la jurisdicción
correspondiente).

Aplica a la documentación, a los comentarios del código, a los *fixtures*, a los
prompts y a cualquier texto visible para el usuario. Si no puedes verificarlo,
márcalo `[PENDIENTE DE VERIFICACIÓN]`. **No lo reconstruyas. No extrapoles.**

Esta regla vale también para GNEO en ejecución: sin texto recuperado, la
respuesta correcta es **declarar la laguna**, no reconstruir.

### 2.4 Nada de salidas de red fuera del cliente único

Toda llamada saliente pasa por `backend/src/lib/net/egress.ts`, que consulta la
lista blanca y registra en auditoría (ADR-0002). **Es el único lugar del programa
donde se llama a `fetch`.** Nada de fuentes remotas, CDN, telemetría, *crash
reporting* ni *phone home*: los *assets* del frontend se sirven localmente.

### 2.5 La licencia no se toca

`LICENSE` se conserva íntegro. Los avisos de copyright y de ausencia de garantía
del proyecto de origen se conservan. El historial de git no se reescribe. Véase
`NOTICE.md`.

---

## 3. Reglas de diseño que se dan por decididas

No las reabras sin leer el ADR correspondiente:

| Regla | ADR |
| --- | --- |
| La unidad de indexación y de citación es el **precepto**, no el documento. Nada de *chunking* por tamaño. | ADR-0006 |
| Las disposiciones transitorias, adicionales, derogatorias y finales son **entidades propias**. | ADR-0006 |
| Toda consulta lleva **fecha de referencia** (`as_of`), como tipo, no como convención. Ninguna función de recuperación existe sin ella. | ADR-0005 |
| El filtro de vigencia es **previo**, no un reordenamiento posterior. | ADR-0008 |
| Los niveles normativos, la tipología y el valor de la jurisprudencia son **dato** (perfil de jurisdicción), no `enum` ni `check`. | ADR-0013 |
| Ninguna cadena visible se escribe en línea en el código. | ADR-0013 |
| Los *embeddings* se calculan **siempre con modelo local**, en todos los modos. | ADR-0008 |
| Ninguna cita se muestra sin resolución positiva. Política por defecto: `marcar`. | ADR-0009 |
| `secreto_profesional` y `rgpd_art_10` sólo se procesan con modelo local, **por control técnico en el router**, no por aviso en la UI. Sin recurso automático a proveedor externo. | ADR-0010 |
| Purga real, nunca borrado lógico. | ADR-0012 |

---

## 4. Estructura

Heredada del proyecto de origen. Node.js 22 o superior.

- `frontend/` — aplicación web Next.js.
- `backend/` — API Express, procesamiento de documentos, acceso a base de datos e
  integración de modelos.
- `word-addin/` — complemento de Microsoft Word.
- `backend/schema.sql` — esquema completo para bases de datos nuevas.
- `backend/migrations/` — migraciones fechadas para despliegues existentes.
- `e2e/` — pruebas Playwright de la aplicación web.
- `docs/`, `docs/adr/` — documentación y registros de decisión.

Convenciones de frontend, backend y migraciones: las del proyecto de origen, que
son buenas. Nombre de migración `YYYYMMDD_NN_<nombre_corto>.sql`, cabecera
`-- Migration date: YYYY-MM-DD`, migración re-ejecutable donde sea posible, y
`schema.sql` actualizado en el mismo cambio. Se preservan RLS, *grants*,
`security definer` y `search_path` al tocar objetos de base de datos.

---

## 5. Verificación

**No afirmes que algo funciona sin haber ejecutado la comprobación y mostrado la
salida.** Vale para ti y vale para el informe al usuario.

Elige la verificación más pequeña que atrape la regresión, y amplíala en cambios
transversales o de riesgo. Comandos desde la raíz:

```bash
npm test --prefix backend
npm run build --prefix backend
npm test --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend
npm run typecheck --prefix word-addin
npm run test:e2e
```

Suites propias de GNEO:

```bash
npm run test:airgap --prefix backend    # red Docker sin Internet (ADR-0002)
npm run evals                            # suite antialucinación (ADR-0009)
```

Antes de entregar: `git diff --check`, revisa el diff en busca de cambios ajenos,
y di qué comprobaciones has ejecutado.

---

## 6. Dependencias

**Ninguna dependencia nueva sin justificación escrita y sin revisión de
licencia.**

| Categoría | Decisión |
| --- | --- |
| MIT, BSD-2/3, ISC, Apache-2.0 | Admitidas |
| MPL-2.0, LGPL | Admitidas con revisión caso a caso |
| GPL-3.0-or-later, AGPL-3.0 | Admitidas |
| **GPL-2.0-only** | **Prohibida** (incompatible con AGPL-3.0) |
| Sin licencia declarada, *source-available*, BSL, SSPL, *non-commercial*, *ethical source* | **Prohibidas** |

Al cambiar dependencias, actualiza el `package-lock.json` del paquete afectado.

---

## 7. Commits y ramas

- Commits atómicos, mensaje descriptivo que explique **por qué**, no sólo qué.
- Rama por fase.
- **Nunca** se suben secretos, claves, documentos privados, ficheros `.env`,
  salida de compilación ni artefactos de prueba local.

---

## 8. Cuándo detenerse y preguntar

**Detente y pregunta** cuando una decisión tenga implicaciones jurídicas o de
cumplimiento y no esté resuelta en `docs/`. No optes por la alternativa más
cómoda técnicamente.

Casos que **siempre** se consultan:

- Un conector cuyo régimen de reutilización o condiciones de uso no estén
  verificados y registrados en su manifiesto.
- Un perfil de jurisdicción nuevo cuyo régimen de fuentes no esté verificado
  contra fuente oficial.
- Cualquier cosa que relaje una regla del apartado 2.
- Cualquier cosa que haga salir datos de cliente del perímetro.
