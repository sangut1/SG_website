# 01 — Inventario de componentes con supuestos de Derecho anglosajón

**Estado:** borrador para aprobación (Fase 0).
**Fecha:** 2026-09-08, revisado el 2026-09-09.
**Fork:** **GNEO** (nombre provisional).
**Base analizada:** `Open-Legal-Products/mike`, commit
`8b3466fc04bf8cad623238a71fca1fda3fc89fde` (2026-09-05), clonado y leído
íntegramente para este inventario.

---

## 0. Alcance y método

Se ha inspeccionado el árbol completo: `backend/` (249 ficheros `.ts` en `src/`),
`frontend/`, `word-addin/`, `backend/schema.sql` (4.906 líneas, 51 tablas),
`backend/migrations/` (85 ficheros), `docker-compose.yml`, `docs/`, `e2e/` y
`.github/workflows/`.

Cada elemento se marca con una de estas cuatro acciones:

| Marca | Significado |
| --- | --- |
| **SUSTITUIR** | El componente cumple una función necesaria, pero su implementación asume Derecho anglosajón. Se reescribe con semántica continental. |
| **ABSTRAER** | El componente está acoplado a un supuesto concreto que debe convertirse en un punto de extensión configurable. |
| **ELIMINAR** | El componente no tiene equivalente en el producto objetivo, o su permanencia es un riesgo. |
| **CONSERVAR** | Es jurídicamente neutro y aprovechable tal cual, o con retoques menores. |

Se incluyen también, marcados con **[SOB]**, los hallazgos que no son de Derecho
anglosajón pero comprometen el Requisito 1 (soberanía del dato). No forman parte
estricta del encargo de este documento, pero aparecerían de todos modos al tocar
los mismos ficheros y ocultarlos sería un error.

---

## 1. Resumen ejecutivo

1. El acoplamiento al Derecho de los EE. UU. está **concentrado**, no difuso: se
   reduce esencialmente a la integración con CourtListener y a lo que cuelga de
   ella (prompt de investigación, modelo de cita de *case law*, tablas de índice,
   proveedor de credenciales, conmutador de UI).
2. El acoplamiento **conceptual** es mucho más profundo que el acoplamiento de
   código, y es el verdadero trabajo: la plataforma **no tiene modelo de norma**.
   Su unidad de conocimiento es el *documento subido por el usuario*. No existe
   entidad "precepto", ni jerarquía normativa, ni vigencia temporal, ni fecha de
   referencia. Todo eso hay que construirlo.
3. Hallazgo relevante y positivo: **no hay índice vectorial ni embeddings** en
   ninguna parte (`pgvector`, `embedding`, `vector(` no aparecen en el esquema).
   La recuperación se basa en meter documentos completos en el contexto del
   modelo. Esto significa que la capa de recuperación se diseña desde cero, sin
   deuda técnica que desmontar — y sin trabajo previo aprovechable.
4. Hallazgo relevante y negativo: el razonamiento por precedente **no está
   codificado como lógica**, sino **inscrito en los prompts**. No hay un módulo
   de *stare decisis* que borrar; hay instrucciones en lenguaje natural que
   reescribir por completo. Es más fácil de cambiar y más fácil de olvidar.

---

## 2. Integración con CourtListener y jurisprudencia de EE. UU.

| # | Elemento | Evidencia | Supuesto anglosajón | Acción |
| --- | --- | --- | --- | --- |
| I-01 | Cliente HTTP de CourtListener (1.189 líneas) | `backend/src/lib/courtlistener.ts`; endpoints en líneas 6–8 (`https://www.courtlistener.com/api/rest/v4`, `courtlistener.com`, `storage.courtlistener.com`) | Fuente exclusiva de *case law* estadounidense | **ELIMINAR** del núcleo; su función pasa a un `LegalSourceProvider` (Requisito 3). El código se conserva como referencia de estilo, no como dependencia |
| I-02 | Herramientas de investigación expuestas al modelo (`courtlistener_verify_citations`, `_get_cases`, `_find_in_case`, `_read_case`) | `backend/src/lib/chat/tools/courtlistenerTools.ts` | Flujo de trabajo *verify citation → fetch cluster → find passage → read opinion* propio del sistema de *reporters* | **SUSTITUIR** por herramientas genéricas del conector: `buscar_norma`, `obtener_precepto`, `resolver_cita`, `comprobar_vigencia`, `buscar_resolucion` |
| I-03 | Prompt de sistema de investigación | `backend/src/lib/chat/tools/courtlistenerTools.ts:75-93` (`COURTLISTENER_SYSTEM_PROMPT`), literal: *"US CASE LAW RESEARCH: Use CourtListener when answering US-law questions that require case law."* | Investigación jurídica = búsqueda de sentencias | **SUSTITUIR** íntegramente (véase apartado 6) |
| I-04 | Parseo de citas por *reporter* (volumen–reporter–página) | `backend/src/lib/courtlistener.ts:139-141, 464-471, 574, 624-631, 899-904`; ejemplos literales en prompt: `"467 U.S. 837"`, `"323 U.S. 134"` | Sistema de citación por repertorio de EE. UU. | **SUSTITUIR** por parser continental (`art. 1255 CC`, `art. 28.3 RGPD`, `STS 123/2024, de 5 de marzo`, ECLI) |
| I-05 | Modelo de datos de cita de jurisprudencia | `backend/src/lib/chat/citations.ts` (`ParsedCaseCitation` con `cluster_id`, `opinionId`, `author`); `backend/src/lib/sourceDocuments.ts:145` (`normalizeCaseDocument`, título = `caseName + citation`, metadato `Date` = `dateFiled`) | Identidad de la resolución = *cluster* + *opinions* separadas y firmadas (mayoritaria, concurrente, disidente) | **SUSTITUIR**: el modelo continental es órgano + sala + número/año + fecha + ECLI + ponente, sin votos particulares como opiniones de primer nivel (el voto particular existe, pero no fragmenta la identidad de la resolución) |
| I-06 | Tablas de índice masivo de CourtListener | `backend/schema.sql:2626` (`courtlistener_citation_index`), `:2645` (`courtlistener_opinion_cluster_index`); migración `20260523_courtlistener_bulk_indexes.sql` | Índices de repertorios estadounidenses | **ELIMINAR**; se sustituyen por el esquema de fuentes normativas europeas (doc. 02, §3) |
| I-07 | Caché de opiniones en almacenamiento de objetos | `backend/src/lib/courtlistener.ts:9` (`courtlistener/opinions/by-cluster`); `docs/courtlistener.md` | Volcado masivo del proveedor de EE. UU. | **ELIMINAR**. Nota: el patrón de *bulk data* sí es reutilizable, y es **necesario** para el modo `local-only` (doc. 02, §7) |
| I-08 | Proveedor de credenciales `courtlistener` | `backend/src/lib/userApiKeys.ts:6-33`; migración `20260528_01_add_courtlistener_user_api_key_provider.sql` | Un proveedor concreto cableado en el enum de claves | **ABSTRAER**: el enum pasa a ser la lista dinámica de conectores registrados. El mecanismo de cifrado por usuario **se conserva** (es exactamente lo que exige el Requisito 3) |
| I-09 | Conmutador de UI "Enable CourtListener / CourtListener provides access to US case law" | `frontend/src/app/(pages)/settings/features/page.tsx:98-120` | — | **SUSTITUIR** por la pantalla de gestión de conectores |
| I-10 | Bandera de perfil `legal_research_us` | `backend/schema.sql` (`user_profiles`); migración `20260611_user_profile_legal_research_us.sql`; `backend/src/lib/userSettings.ts:22,106-108`; `backend/src/routes/chat.ts:913,926,1031`; `backend/src/routes/projectChat.ts:364,380,457`; `frontend/src/app/contexts/UserProfileContext.tsx:56,231,463`; `frontend/src/app/lib/mikeApi.ts:532,646` | Booleano "investigación jurídica de EE. UU." **activado por defecto** (`?? true`, `!== false`) | **SUSTITUIR** por `conectores_habilitados[]` por tenant, **desactivados por defecto** (principio de mínimo egreso, Requisito 1) |
| I-11 | Puerta de herramientas por bandera | `backend/src/lib/chat/prompts.ts:106-112` (`buildSystemPrompt(includeResearchTools)`); `backend/src/lib/chat/streaming.ts`; `backend/src/lib/chat/tools/toolDispatcher.ts` | — | **CONSERVAR el patrón** (no decirle al modelo que tiene herramientas que no tiene es correcto), **ABSTRAER** el contenido |
| I-12 | Estado de turno de investigación (límite de llamadas, tope de 3 búsquedas, corte ante 429) | `backend/src/lib/chat/tools/courtlistenerTurnState.ts` | Límites de tasa del proveedor de EE. UU. | **ABSTRAER**: pasa a ser política declarada en el manifiesto de cada conector |
| I-13 | Documentación de la integración | `docs/courtlistener.md`; entrada en `README.md` y `docs/README.md` | — | **ELIMINAR** y sustituir por `docs/conectores/` |

---

## 3. Lógica de precedente y razonamiento analógico

**Hallazgo:** no existe ningún módulo, tabla, función ni tipo que implemente
*stare decisis*, *binding authority*, *distinguishing*, *overruling* o jerarquía
de tribunales. El razonamiento por precedente vive **exclusivamente en los
prompts** y en las descripciones de herramientas que se envían al modelo.

| # | Elemento | Evidencia | Acción |
| --- | --- | --- | --- |
| I-14 | Instrucción de fundar la respuesta en el texto de la *opinion* obtenida en el turno | `courtlistenerTools.ts:85` — *"Final case citations must be based on opinion text or passage snippets supplied in this turn."* | **CONSERVAR el principio** (es antialucinación y es excelente), **SUSTITUIR** el objeto: el anclaje debe ser al **precepto** con su redacción vigente, y sólo después a la resolución |
| I-15 | Instrucción de citar el caso como "apoyo jurídico" con enlace y marcador | `courtlistenerTools.ts:86-88` — *"If you mention a CourtListener case as legal support in the final answer…"* | **SUSTITUIR**: la jurisprudencia es fuente **interpretativa**, no apoyo autónomo. El prompt debe exigir norma primero |
| I-16 | Cláusula de conocimiento libre sin documentos | `backend/src/lib/chat/prompts.ts` (`SYSTEM_PROMPT_AFTER_RESEARCH`) — *"If no documents are provided, answer from legal knowledge."* | **ELIMINAR Y PROHIBIR**. Es exactamente la instrucción que el Requisito 2.5 veta: sin texto recuperado la respuesta correcta es declarar la laguna, no reconstruir de memoria. **Es el hallazgo más grave del inventario** |
| I-17 | Ausencia total de modelo de jerarquía normativa, transposición, vigencia y conflicto de normas | Verificado por ausencia en `backend/schema.sql` y en `backend/src/lib/` | **CONSTRUIR DE CERO** (doc. 02, §3) |
| I-18 | Ausencia de fecha de referencia (`as_of`) en cualquier consulta | Verificado por ausencia | **CONSTRUIR DE CERO** (doc. 02, §4) |

---

## 4. Modelo de datos y unidad de conocimiento

| # | Elemento | Evidencia | Supuesto | Acción |
| --- | --- | --- | --- | --- |
| I-19 | Unidad de conocimiento = documento subido y sus versiones | `backend/schema.sql:691` (`documents`), `:721` (`document_versions`), `:929` (`document_edits`) | La plataforma es un gestor documental con IA, no una base de conocimiento normativo | **CONSERVAR** para expedientes y documentos de cliente; **AÑADIR** en paralelo el modelo normativo (instrumento → precepto → redacción) |
| I-20 | Cita anclada a página y cita de hoja de cálculo anclada a celda | `backend/src/lib/chat/citations.ts` (`page`, `sheet`, `cell`, `[[PAGE_BREAK]]`) | Anclaje a paginación física | **CONSERVAR** para documentos de cliente; **AMPLIAR** con anclaje estructural (`instrumento#art.28.3`) para normas |
| I-21 | Verificación de literalidad de cita contra el texto de origen, con tres niveles de tolerancia | `backend/src/lib/chat/verifyCitations.ts:32-67` (`locateQuote`: exacta → normalizada → tolerante a puntuación) | — | **CONSERVAR Y EXTENDER**. Es la base directa de la "comprobación de literalidad" del Requisito 4 |
| I-22 | Ausencia de índice vectorial y de *chunking* | Verificado por ausencia de `pgvector`/`embedding`; `backend/src/lib/search.ts` sólo normaliza términos de búsqueda | La recuperación es "mete el documento entero en el contexto" | **CONSTRUIR DE CERO**: recuperación híbrida a nivel de precepto, filtrada por vigencia a `as_of` |
| I-23 | Sin multi-tenancy real: el aislamiento es por `user_id` y por listas de compartición | `project_access_grants`, `chat_access_grants`, `workflow_shares`, `project_org_access_overrides`; 30 políticas RLS en el esquema | Un despacho = un conjunto de usuarios que comparten, no un tenant | **SUSTITUIR** por tenant de primer nivel con RLS por fila y prefijo de *bucket* por tenant (Requisito 1) |
| I-24 | Borrado lógico (*soft delete*) de versiones de documento | `backend/schema.sql:733,752`; migración `20260610_01_soft_deleted_document_versions.sql`; `docs/tamper-evident-exports.md` documenta que las versiones borradas **permanecen en el manifiesto** | Retención por defecto | **SUSTITUIR** por purga real con mapa de propagación (Requisito 1). Atención al conflicto declarado entre borrado y cadena de auditoría: se resuelve en doc. 02, §9 |
| I-25 | Taxonomía de jurisdicciones como lista de países + estados de EE. UU. | `frontend/src/app/components/workflows/NewWorkflowModal.tsx:84-88` (`JURISDICTION_OPTIONS`, `US_STATE_OPTIONS` con los 50 estados); `user_profiles.jurisdiction` como texto libre validado contra esa lista | Modelo federal EE. UU.; el resto del mundo es "un país" | **SUSTITUIR** por la jerarquía territorial declarada en el **perfil de jurisdicción** (ADR-0013). Perfil `ES`/`EU` de la Fase 1: UE → Estado miembro → comunidad autónoma → entidad local. No se cablea: con la ampliación prevista a Iberoamérica, la lista debe ser dato |
| I-26 | Perfil de usuario con `professional_title` de tradición anglosajona (`Partner`, `Senior Associate`, `Associate`, `Law Clerk`, `Counsel`, `General Counsel`) | `backend/schema.sql:25-36` | Estructura de *law firm* anglosajona | **SUSTITUIR** por nomenclatura española/UE (abogado ejerciente, socio, of counsel, pasante, asesor jurídico interno…) — decisión de SGF |
| I-27 | `practice_setting` (`private_practice`, `in_house`, `not_practising`) | `backend/schema.sql:19-23` | Neutro | **CONSERVAR** |

---

## 5. Formatos, idioma y localización

| # | Elemento | Evidencia | Acción |
| --- | --- | --- | --- |
| I-28 | Formato de fecha cableado a `en-US` | `frontend/src/app/components/assistant/DocPanel.tsx:384` (`new Intl.DateTimeFormat("en-US", …)`) | **SUSTITUIR** por configuración regional del tenant (por defecto `es-ES`) |
| I-29 | Formato de importe cableado a `en-US` | `frontend/src/app/components/settings/RouterSettingsSection.tsx:22` (`new Intl.NumberFormat("en-US", …)`) | **SUSTITUIR** (separador decimal coma, símbolo €) |
| I-30 | Resto de fechas con configuración regional del navegador (`toLocaleDateString(undefined, …)`) | `FileDirectory.tsx:104`, `ProjectsOverview.tsx:71`, `ProjectPageParts.tsx:50`, `WorkflowAssets.tsx:60`, `OrganizationsOverview.tsx:51`, `OrganizationWorkspace.tsx:99`, `history/page.tsx:133`, `tabular-reviews/page.tsx:77`, `word-addin/.../ChatHistoryList.tsx:40` | **ABSTRAER**: la configuración regional debe ser del **tenant**, no del navegador. Una fecha jurídica no puede depender de la configuración del equipo desde el que se consulta |
| I-31 | Interfaz y prompts íntegramente en inglés; sin infraestructura de i18n | Todo `frontend/src`, `word-addin/src`, `backend/src/lib/chat/` | **SUSTITUIR**: i18n de primera clase con **paquetes de idioma intercambiables** desde el primer commit (ADR-0013), `es-ES` como paquete base. Tres ejes independientes: idioma de interfaz, de prompts y de la manifestación normativa. Reforzado por el multilingüismo UE (Requisito 2.3) y por la ampliación prevista a Iberoamérica. Incluye el complemento de Word, que **se mantiene** en la Fase 1 |
| I-32 | `lang="en-US"` en generación de documentos ofimáticos | `backend/src/lib/chat/tools/documentOps.ts:810` | **SUSTITUIR** por el idioma del documento |
| I-33 | Normalización de texto pensada para el inglés (`"U.S." → "us"`, `"plaintiff's" → "plaintiffs"`) | `backend/src/lib/chat/tools/documentOps.ts:1744,1779` | **SUSTITUIR** por normalización sensible al español (tildes, `ñ`, abreviaturas jurídicas: `art.`, `núm.`, `Excmo.`, `LOPJ`) |

---

## 6. Prompts del sistema — reescritura íntegra

Los prompts son el componente con más carga de supuestos anglosajones y el que
más silenciosamente puede sobrevivir a la migración.

| # | Fichero | Contenido | Acción |
| --- | --- | --- | --- |
| I-34 | `backend/src/lib/chat/prompts.ts` | `SYSTEM_PROMPT_BEFORE_RESEARCH` + `SYSTEM_PROMPT_AFTER_RESEARCH`; identidad *"You are Mike, an AI legal assistant for lawyers"*; reglas de citación, generación y edición de `.docx` | **SUSTITUIR** íntegramente. Se conservan como patrón, reescritos en español: reglas de citación numerada, política de contenido no confiable y traza de razonamiento |
| I-35 | `backend/src/lib/chat/wordPrompt.ts` | Prompt del complemento de Word; misma identidad y supuestos | **SUSTITUIR** íntegramente |
| I-36 | `backend/src/lib/chat/contextBuilders.ts:78-103` | Inyección del perfil profesional en el prompt, con salvaguarda explícita de que los valores del perfil son **datos, no instrucciones** | **CONSERVAR el mecanismo**, **SUSTITUIR** el contenido; añadir al bloque la **fecha de referencia** y el **modo de soberanía** activo |
| I-37 | `backend/src/lib/chat/tools/courtlistenerTools.ts:75-93` | Prompt de investigación de EE. UU. | **ELIMINAR** |
| I-38 | Catálogo de *workflows* del sistema | `backend/src/lib/workflowCatalogSource.ts` (`proofread`, `compare-documents`, `extract-key-terms`, `draft-from-template`, `commercial-agreement-tabular-review`), sincronizados desde `Open-Legal-Products/mike-workflows` vía `codeload.github.com` | **ABSTRAER**: el catálogo pasa a ser local y versionado en el fork. **[SOB]** la descarga desde GitHub en el arranque es una salida de red incompatible con `local-only` |

**Reglas que deben quedar prohibidas de forma explícita en el prompt nuevo**, por
ser precisamente lo que hoy se autoriza:

- *"If no documents are provided, answer from legal knowledge."* (I-16)
- Citar una resolución como fundamento autónomo sin identificar antes el precepto
  aplicable (I-15).
- Responder sin declarar la fecha de referencia utilizada.
- Afirmar el contenido de un precepto que no esté presente en el contexto
  recuperado.

---

## 7. Elementos que se conservan (activo aprovechable)

| # | Elemento | Evidencia | Por qué se conserva |
| --- | --- | --- | --- |
| I-39 | Protocolo de citación con marcadores `[N]` + bloque `<CITATIONS>` y validación de contigüidad | `prompts.ts`, `citations.ts` | Base directa del pipeline antialucinación del Requisito 4 |
| I-40 | Verificación de literalidad de la cita contra el texto de origen | `verifyCitations.ts` | Requisito 4, "comprobación de literalidad" |
| I-41 | Firma Ed25519 de manifiestos de exportación con separación de dominio y `key_id` para rotación | `backend/src/lib/manifestSigning.ts`; `docs/tamper-evident-exports.md` | Base del log de auditoría inmutable del Requisito 6. **Falta encadenamiento de hash**: hay digest por manifiesto, no cadena |
| I-42 | SHA-256 por versión de documento | migración `20260731_01_document_version_content_sha256.sql` | Integridad probatoria |
| I-43 | Tabla `audit_events` con acción, usuario, proyecto, chat, documento, revisión y **modelo** | `backend/schema.sql:4344-4362`; `backend/src/lib/audit.ts` | Esqueleto del registro por inferencia del Requisito 5. **Carece de encadenamiento y es *fire-and-forget*** (`audit.ts:52-58` traga los errores): insuficiente para auditoría |
| I-44 | Cola de trabajos durable en Postgres (`db_jobs`) | `backend/schema.sql:4369`; `backend/src/lib/dbq/` | Necesaria para purga real, exportaciones y limpieza de almacenamiento sin infraestructura externa |
| I-45 | Cifrado de claves de API por usuario (AES-GCM con `iv` y `auth_tag`) | `backend/schema.sql:327` (`user_api_keys`); `backend/src/lib/userApiKeys.ts`; migración `20260502_secure_user_api_keys.sql` | Exactamente el mecanismo que exige el Requisito 3 para credenciales de conectores |
| I-46 | Política de contenido no confiable con *nonce* por petición | `prompts.ts` (`UNTRUSTED CONTENT POLICY`) | Defensa contra inyección de prompt desde documentos. Se conserva y se extiende al texto recuperado de conectores |
| I-47 | Guardas SSRF (bloqueo de rangos privados IPv4/IPv6) | `backend/src/lib/privateIp.ts` | Punto de partida del cliente HTTP único con lista blanca (Requisito 1) |
| I-48 | Soporte de Ollama con detección dinámica de modelos | `backend/src/lib/llm/models.ts:29-31`; `GET /models/ollama` | Base del enrutado a modelo local del Requisito 5 |
| I-49 | Abstracción de proveedor de modelo | `backend/src/lib/llm/{providers,models,types,aiSdk}.ts` | Se conserva la forma; se le añade el control técnico de enrutado por sensibilidad |
| I-50 | Infraestructura de pruebas (Vitest, Playwright, pruebas de *stack*, CodeQL, gitleaks, *mutation testing*, control de drift de esquema) | `.github/workflows/` (11 flujos) | Se conserva y se amplía con la suite `evals/` y las pruebas de red aislada |
| I-51 | Convenciones de migración y `schema.sql` como esquema completo | `AGENTS.md`; `backend/migrations/` | Se conservan |

---

## 8. Hallazgos de soberanía del dato **[SOB]**

No son "US-céntricos", pero bloquean el Requisito 1 y aparecen en los mismos
ficheros.

| # | Elemento | Evidencia | Acción |
| --- | --- | --- | --- |
| S-01 | Fuentes remotas de Google en el complemento de Word | `word-addin/src/taskpane/index.html:14-17` (`preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`, más `<link>` a `css2?family=EB+Garamond…`) | **ELIMINAR**: empaquetar las fuentes localmente |
| S-02 | `@import` a Google Fonts en la página de error global | `frontend/src/app/global-error.tsx:20` | **ELIMINAR** |
| S-03 | `next/font/google` en el layout | `frontend/src/app/layout.tsx:2` (`Inter`, `EB_Garamond`) | **SUSTITUIR** por `next/font/local`. Aunque `next/font` autoaloja el binario, descarga en tiempo de compilación: una build en entorno aislado fallaría |
| S-04 | CDN externo para fuentes estándar de PDF.js | `frontend/src/app/components/shared/views/highlightQuote.ts:14` (`https://unpkg.com/pdfjs-dist@4.10.38/standard_fonts/`) | **ELIMINAR**: servir localmente. Afecta a la visualización de documentos de cliente |
| S-05 | Sincronización del catálogo de *workflows* desde GitHub en el arranque | `backend/src/lib/workflowCatalogSource.ts`; servicio `workflow-sync` en `docker-compose.yml:248` | **ABSTRAER**: catálogo local por defecto; sincronización opcional y sujeta a lista blanca |
| S-06 | Enrutadores de modelo externos por defecto en el código (`openrouter.ai`, `opencode.ai/zen/go/v1`, `ai-gateway.vercel.sh`) | `backend/src/lib/llm/providers.ts:25-31` | **ABSTRAER** a configuración; **desactivados por defecto** |
| S-07 | Modelo por defecto = proveedor externo | `backend/src/lib/llm/models.ts:52-54` (`DEFAULT_MAIN_MODEL = "gemini-3-flash-preview"`) | **SUSTITUIR** por modelo local por defecto (véase pregunta abierta sobre `<<PROVEEDOR_MODELO_FASE_1>>`) |
| S-08 | Almacenamiento acoplado a Cloudflare R2 en nombres y documentación | `backend/src/lib/storage.ts:1-10` | **ABSTRAER** a "S3-compatible" con residencia UE verificada al arranque |
| S-09 | Clave anónima de Supabase real (de desarrollo, pero funcional) en `.env.example` | `.env.example` | **SUSTITUIR** por *placeholder* no funcional (Requisito 1) |
| S-10 | Volcado de cargas útiles de opinión a disco en desarrollo | `backend/src/lib/courtlistener.ts:22-34` (`logs/courtlistener-opinions/`) | **ELIMINAR** con I-01. Patrón a vetar: no se escriben a disco contenidos recuperados fuera del almacenamiento gestionado |
| S-11 | Sin cifrado en reposo de documentos ni de base de datos gestionado por la aplicación | Verificado por ausencia (sólo `user_api_keys` está cifrado a nivel de aplicación) | **CONSTRUIR** (Requisito 1) |
| S-12 | Ausencia de telemetría, *crash reporting* y analítica de terceros | Búsqueda negativa de `posthog`, `sentry`, `segment`, `mixpanel`, `gtag`, `googletagmanager`, `plausible`, `amplitude`, `datadog`, `@vercel/analytics` | **CONSERVAR**. Punto de partida favorable: el "cero telemetría" del Requisito 1 se cumple ya, salvo por S-01 a S-05. Debe protegerse con un *gate* de CI que impida su reintroducción |
| S-13 | Redis y Supabase (GoTrue, PostgREST, nginx) como piezas del *stack* | `docker-compose.yml` | **CONSERVAR** con revisión: todo es autoalojable, ninguno exige servicio gestionado. Verificar que GoTrue no realiza llamadas salientes por defecto |

---

## 9. Cuadro de recuento

| Acción | Elementos |
| --- | --- |
| **SUSTITUIR** | I-02, I-03, I-04, I-05, I-09, I-10, I-15, I-23, I-24, I-25, I-26, I-28, I-29, I-31, I-32, I-33, I-34, I-35, S-03, S-04(parcial), S-07, S-09 |
| **ABSTRAER** | I-08, I-11, I-12, I-30, I-36, I-38, S-05, S-06, S-08 |
| **ELIMINAR** | I-01, I-06, I-07, I-13, I-16, I-37, S-01, S-02, S-04, S-10 |
| **CONSERVAR** | I-19(parcial), I-20, I-21, I-27, I-39 a I-51, S-12, S-13 |
| **CONSTRUIR DE CERO** | I-17, I-18, I-22, S-11 |

---

## 10. Consecuencias para la planificación

1. Borrar CourtListener es trabajo de una semana. **Construir el modelo normativo
   temporal es el proyecto.** La planificación no debe dejarse engañar por la
   facilidad del apartado 2.
2. El hallazgo I-16 (*"answer from legal knowledge"*) obliga a tratar la
   reescritura de prompts y el pipeline antialucinación como **una sola tarea**,
   no como dos fases. Reescribir los prompts sin el pipeline deja el mismo
   riesgo con otras palabras.
3. La ausencia de índice vectorial (I-22) es una oportunidad: se puede diseñar la
   recuperación con la vigencia temporal como filtro de primer nivel, en vez de
   añadirla a posteriori sobre un índice plano.
4. Los hallazgos S-01 a S-05 deben resolverse **antes** de la primera prueba de
   red aislada, o esa prueba no arrancará. S-01 (fuentes remotas de Google en el
   complemento de Word) sigue en alcance: SGF ha decidido **mantener el
   complemento** en la Fase 1.
5. La decisión de ampliar a Iberoamérica (2026-09-09) sube de categoría los
   hallazgos I-25, I-28 a I-33: dejan de ser localización y pasan a ser
   **arquitectura**. Un `enum` de jurisdicciones o una cadena en línea que se
   cuelen ahora se pagan con una migración después (ADR-0013).
