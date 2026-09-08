# 00 — Análisis de cumplimiento AGPL-3.0

**Estado:** borrador para aprobación (Fase 0).
**Fecha:** 2026-09-08.
**Autor:** equipo de arquitectura del fork.
**Destinatario:** Santos Gutiérrez Figueroa (en adelante, **SGF**).

---

## 0. Método y trazabilidad de fuentes

Este documento se apoya en las siguientes fuentes, verificadas en el momento de
redactarlo:

| Fuente | Cómo se ha verificado | Estado |
| --- | --- | --- |
| Texto de la GNU AGPL-3.0 | Fichero `LICENSE` del repositorio origen, clonado en el commit `8b3466fc04bf8cad623238a71fca1fda3fc89fde` (2026-09-05). Se han leído literalmente las secciones 0 (definición de *Appropriate Legal Notices*), 4, 5, 7 y 13. | **Verificado** |
| Licencia declarada por el proyecto origen | `README.md` y `LICENSE` del repositorio `Open-Legal-Products/mike`. | **Verificado** |
| Reglamento (UE) 2024/1689, arts. 50 y 113 | Texto consolidado oficial (CELEX 32024R1689, versión consolidada `02024R1689-20260727`), recuperado mediante conector a fuente oficial. | **Verificado** |
| Reglamento (UE) 2016/679 (RGPD), arts. 9, 10 y 35 | Texto consolidado oficial (CELEX 32016R0679). | **Verificado** |

> **Aviso de verificación pendiente.** Durante la elaboración de este documento
> el entorno de trabajo tenía bloqueado el egreso de red hacia `boe.es`,
> `eur-lex.europa.eu`, `op.europa.eu` y `poderjudicial.es` por política del
> proxy. Todo lo que aparece marcado como `[PENDIENTE DE VERIFICACIÓN]` no ha
> podido contrastarse contra el portal oficial y **no debe publicarse ni
> incorporarse a texto visible para el usuario** hasta que se contraste.
> No se ha reconstruido de memoria ningún contenido normativo.

---

## 1. Punto de partida

El proyecto origen (`Open-Legal-Products/mike`, "MikeOSS") se distribuye bajo
**GNU Affero General Public License v3.0**. El fork europeo hereda esa licencia
en todo el código derivado. Esto no es negociable ni renunciable: la AGPL es la
única vía por la que tenemos derecho a modificar y explotar ese código.

Magnitud de lo que se hereda (medido sobre el commit citado):

- 790 ficheros `.ts` / `.tsx`.
- `backend/schema.sql`: 4.906 líneas, 51 tablas.
- 85 migraciones dadas de alta en `backend/migrations/`.
- Tres aplicaciones: `frontend/` (Next.js), `backend/` (Express) y
  `word-addin/` (complemento de Microsoft Word).

---

## 2. Obligaciones aplicadas a este despliegue

### 2.1 Sección 4 — Distribución de copias literales

Texto verificado (extracto): *"You may convey verbatim copies of the Program's
source code as you receive it, in any medium, provided that you conspicuously
and appropriately publish on each copy an appropriate copyright notice; keep
intact all notices stating that this License and any non-permissive terms added
in accord with section 7 apply to the code; keep intact all notices of the
absence of any warranty; and give all recipients a copy of this License along
with the Program."*

**Aplicación al fork:**

1. `LICENSE` se conserva **íntegro y sin modificar** en la raíz del repositorio.
   No se sustituye, no se resume, no se "adapta".
2. Se conservan los avisos de copyright del proyecto origen y de sus
   contribuyentes. El rebranding **no autoriza** a borrar autoría.
3. Se conservan los avisos de ausencia de garantía (secciones 15 y 16).
4. Todo receptor de una copia recibe el texto de la licencia junto con el
   programa.

La sección 4 también permite cobrar por la copia y por soporte o garantía. Es
relevante: SGF puede facturar despliegue, mantenimiento y soporte del fork sin
que ello altere las obligaciones de la licencia.

### 2.2 Sección 5 — Distribución de versiones modificadas

Texto verificado (condiciones a), b), c) y d)):

- **a)** *"The work must carry prominent notices stating that you modified it,
  and giving a relevant date."*
- **b)** *"The work must carry prominent notices stating that it is released
  under this License and any conditions added under section 7."*
- **c)** *"You must license the entire work, as a whole, under this License to
  anyone who comes into possession of a copy. […] regardless of how they are
  packaged."*
- **d)** *"If the work has interactive user interfaces, each must display
  Appropriate Legal Notices; however, if the Program has interactive interfaces
  that do not display Appropriate Legal Notices, your work need not make them do
  so."*

**Aplicación al fork:**

1. **Aviso destacado de modificación con fecha.** Se crea `NOTICE.md` en la raíz
   con: identificación del proyecto origen, commit base del que se forkea,
   declaración expresa de que la obra ha sido modificada por SGF, y un registro
   fechado de las modificaciones sustanciales por fase. La condición a) exige
   "una fecha relevante", no una fecha por commit; el registro por fases la
   satisface con holgura.
2. **Aviso de licencia.** Cabecera de licencia en los ficheros nuevos de autoría
   SGF que se incorporen al árbol AGPL, y declaración global en `README.md`.
3. **La obra completa bajo AGPL.** Todo lo que esté en el árbol del fork y forme
   parte del programa queda bajo AGPL. Esto es exactamente lo que motiva la
   arquitectura de separación del apartado 3 y la regla dura del apartado 5.
4. **Appropriate Legal Notices en la interfaz.** La definición verificada en la
   sección 0 exige *"a convenient and prominently visible feature that (1)
   displays an appropriate copyright notice, and (2) tells the user that there is
   no warranty for the work […], that licensees may convey the work under this
   License, and how to view a copy of this License."*
   Se implementará como entrada permanente de menú ("Acerca de / Licencia") en
   el frontend y en el complemento de Word, no como pie de página escondido.

> **Nota literal sobre la condición d).** Su segunda mitad es una excepción
> condicionada: si el Programa original tiene interfaces que **no** muestran
> Appropriate Legal Notices, la obra derivada tampoco está obligada a añadirlos
> en ellas. En la inspección realizada no se ha localizado en el frontend ni en
> el complemento de Word ninguna pantalla que muestre aviso de copyright,
> ausencia de garantía y acceso a la licencia (la única referencia externa
> encontrada es un enlace al repositorio de *workflows* en
> `frontend/src/app/components/workflows/OpenSourceWorkflowModal.tsx:20`).
> **Decisión propuesta: implementarlos igualmente.** La excepción es una
> dispensa, no una prohibición, y el aviso es además el vehículo natural para
> cumplir la sección 13 y el art. 50 del Reglamento (UE) 2024/1689.
> *Confirmación requerida de SGF.*

### 2.3 Sección 7 — Términos adicionales

Texto verificado. Lo relevante para nosotros:

- Se pueden añadir **permisos adicionales** (relajaciones) sobre material propio.
- Se pueden añadir, sobre material que aportemos y del que seamos titulares,
  ciertos términos tasados: limitación de garantía y responsabilidad (a),
  preservación de avisos legales y atribución (b), prohibición de tergiversar el
  origen (c), limitación del uso publicitario de nombres (d), **denegación de
  derechos de marca** (e) e indemnización (f).
- *"All other non-permissive additional terms are considered 'further
  restrictions' within the meaning of section 10."* Es decir: cualquier otra
  restricción que intentáramos añadir sería inválida y removible por el receptor.

**Aplicación al fork:**

1. Se invoca expresamente la **letra e)**: el fork **no concede** derecho alguno
   sobre las marcas, nombres comerciales, logotipos ni dominios de SGF. Se
   declarará en `TRADEMARKS.md` y se referenciará desde `LICENSE`+`NOTICE.md`
   (la sección 7 exige *"place, in the relevant source files, a statement of the
   additional terms that apply to those files, or a notice indicating where to
   find the applicable terms"*).
2. Se invoca la **letra b)** para exigir la preservación de la atribución de SGF
   en las obras derivadas del fork.
3. **No se intentará** ninguna restricción de campo de uso, de competencia, de
   no comercialización ni cláusula "ético-restrictiva": serían *further
   restrictions* nulas y dañarían nuestra credibilidad en el ecosistema.

### 2.4 Sección 13 — Interacción remota en red (la obligación crítica)

Texto verificado: *"Notwithstanding any other provision of this License, if you
modify the Program, your modified version must prominently offer all users
interacting with it remotely through a computer network (if your version supports
such interaction) an opportunity to receive the Corresponding Source of your
version by providing access to the Corresponding Source from a network server at
no charge, through some standard or customary means of facilitating copying of
software."*

Ésta es la cláusula que convierte a la AGPL en lo que es. Nótese que se activa
por **modificar + ofrecer interacción remota**, no por "distribuir". Nótese
también que la sección 0 verificada precisa que *"Mere interaction with a user
through a computer network, with no transfer of a copy, is not conveying"*: por
eso la sección 13 existe como obligación autónoma.

**Aplicación por modo de despliegue** (véase `docs/02-arquitectura-objetivo.md`):

| Modo | ¿Hay interacción remota por red? | Obligación |
| --- | --- | --- |
| `local-only` en una única máquina, sin servidor accesible por red | Discutible; en la práctica no hay "usuarios remotos" | Se ofrece igualmente el código fuente. Coste cero, riesgo cero. |
| `local-only` on-premise servido a los usuarios del despacho por LAN | **Sí** | Oferta obligatoria a todos esos usuarios. |
| `nube-propietaria` | **Sí** | Oferta obligatoria. |
| `hibrido` | **Sí** | Oferta obligatoria. |

**Implementación propuesta (uniforme, sin depender del modo):**

1. Endpoint `GET /source` en el backend, que sirve el *Corresponding Source*
   exacto de la build en ejecución, sin autenticación y sin coste.
2. Enlace destacado en la interfaz ("Código fuente"), junto a los Appropriate
   Legal Notices.
3. La build inyecta el commit y un digest del árbol; el endpoint sirve **ese**
   árbol, no "la última versión de la rama". Servir una versión distinta de la
   que se ejecuta no cumple la sección 13.
4. El *Corresponding Source* incluye scripts de construcción y ficheros de
   configuración necesarios para reconstruir y ejecutar la obra. Los **secretos
   del operador no forman parte del código fuente** y no se publican; de ahí la
   exigencia (Requisito 1) de que `.env.example` contenga únicamente
   *placeholders* no funcionales.

> **Aviso.** El proyecto origen no implementa hoy esta oferta de código en la
> interfaz. Si el fork se despliega como servicio accesible por red sin
> implementarla, **el incumplidor sería SGF**, no el proyecto origen. Es la
> obligación de mayor riesgo reputacional del proyecto y debe estar resuelta
> antes del primer despliegue accesible por red, incluso interno.

---

## 3. Frontera entre código derivado (AGPL) y *know-how* de SGF

> **DECISIÓN DE SGF, 2026-09-08.** Se adopta la **vía de contenido cargado por el
> operador** (antes descrita como alternativa 3.4). Se descarta, por ahora, la
> arquitectura de módulo-servicio propietario. Véase ADR-0001.

### 3.1 El problema

SGF quiere proteger su *know-how*: plantillas contractuales, criterios internos
de revisión, prompts de valor competitivo, listas de comprobación, doctrina
interna. Ese material, si se incorpora al árbol del fork, queda alcanzado por la
sección 5 c) —*"You must license the entire work, as a whole, under this
License"*— y habría que publicarlo bajo AGPL a todo el que reciba una copia y,
por la sección 13, a todo usuario remoto.

### 3.2 Solución adoptada: el *know-how* no es software

El material de valor de SGF **no se incorpora al programa en ninguna forma**. Es
**contenido**, y entra en el sistema por las mismas rutas por las que entra
cualquier documento de un cliente:

```
┌───────────────────────────────────────────────────────────┐
│  FORK (AGPL-3.0) — repositorio público                    │
│                                                           │
│  · backend · frontend · modelo de fuentes y preceptos     │
│  · pipeline antialucinación · conectores                  │
│  · biblioteca de plantillas, playbooks y criterios:       │
│    LA FUNCIONALIDAD, VACÍA DE CONTENIDO                   │
└───────────────────────────────────────────────────────────┘
                            ▲
                            │  carga en tiempo de ejecución
                            │  (subida de documentos, filas de BD,
                            │   ficheros de configuración del operador)
                            │
┌───────────────────────────────────────────────────────────┐
│  ACERVO DE SGF — fuera del árbol de código                │
│  plantillas · criterios de revisión · playbooks · prompts │
│  Custodia, versionado y respaldo por procedimiento propio │
└───────────────────────────────────────────────────────────┘
```

**Reglas de la separación:**

1. El repositorio contiene la **capacidad** (una biblioteca de plantillas, un
   motor de listas de comprobación, un campo donde se pega un prompt), **nunca el
   contenido**. Es la diferencia entre publicar un procesador de textos y publicar
   los contratos escritos con él.
2. Ningún *seed*, *fixture*, test, ejemplo de documentación ni valor por defecto
   contiene material real de SGF. Los datos de ejemplo son **ficticios y lo
   declaran**.
3. Los prompts de valor competitivo se cargan como **datos de configuración del
   tenant**, no como constantes del código. El repositorio incluye prompts base
   genéricos, publicables sin reservas; los de SGF viven en la configuración del
   despliegue.
4. El acervo se custodia fuera del repositorio, con su propio versionado,
   respaldo y control de acceso, y con procedimiento documentado de carga.

**Fundamento:** el contenido que un usuario introduce en un programa AGPL no se
convierte en obra derivada del programa. La AGPL alcanza al software, no a los
documentos que se procesan con él. Esta vía **no tiene zona gris**.

### 3.3 Lo que se renuncia con esta decisión, y la zona gris que se evita

**Se renuncia a** lógica propietaria: no puede haber algoritmos, reglas de
decisión ni flujos exclusivos de SGF que no estén publicados bajo AGPL. Todo lo
que sea *programa* es público. Si en el futuro el producto necesitara lógica
propietaria, habría que reabrir esta decisión y asumir el riesgo descrito a
continuación.

**Se evita** la zona gris. Se conserva aquí la advertencia, porque sigue siendo
la razón por la que esta decisión es la prudente:

> La distinción entre **obra derivada** (que la sección 5 c) obliga a licenciar
> íntegramente bajo AGPL) y **mera agregación** (*"aggregate"*, párrafo final de
> la sección 5, que expresamente no contagia la licencia a las demás partes) es
> una **zona gris no resuelta jurisprudencialmente**. El texto verificado de la
> AGPL define el agregado como una compilación de *"other separate and
> independent works, which are not by their nature extensions of the covered
> work, and which are not combined with it such as to form a larger program"*.
> Los conceptos "extensión por naturaleza" y "programa mayor" no están definidos
> en la licencia, no han recibido interpretación uniforme y no existe, hasta
> donde se ha podido comprobar, doctrina jurisprudencial consolidada que fije su
> alcance en el escenario de dos procesos que se comunican por HTTP.
>
> La postura de la Free Software Foundation (autora de la licencia) sobre
> comunicación entre procesos **no es Derecho aplicable**: es la opinión del
> licenciante, relevante como criterio de interpretación de la voluntad de las
> partes, no como norma.
> `[PENDIENTE DE VERIFICACIÓN: contrastar el texto actual del FAQ oficial de la
> FSF sobre GPL/AGPL y separación por procesos antes de citarlo en ningún
> documento del proyecto.]`

Una arquitectura de módulo-servicio separado por procesos e interfaz HTTP
—repositorio privado, contenedor distinto, contrato genérico documentado en el
repositorio público, núcleo plenamente funcional sin el módulo, intercambio de
datos y no de código— **reduciría** ese riesgo sin eliminarlo. Queda descrita
aquí y en ADR-0001 por si SGF decide reabrirla; **no se implementa**.

### 3.4 Consecuencia para la comunicación comercial

Con esta decisión, SGF puede afirmar sin matices que su acervo documental no está
sujeto a la AGPL, porque no es software. Lo que **no** puede afirmar es que la
plataforma contenga funcionalidad propietaria: no la contiene, por diseño.

## 4. Checklist de rebranding

Marcas, logotipos, dominios y referencias al proyecto origen que deben retirarse
o sustituirse — **conservando** los avisos de copyright y añadiendo la indicación
destacada de modificaciones y fechas de la sección 5 a).

### 4.1 Qué se elimina o sustituye

| # | Elemento | Ubicaciones detectadas | Acción |
| --- | --- | --- | --- |
| R-01 | Nombre de producto "Mike" / "MikeOSS" en textos visibles | 195 ficheros contienen la cadena; textos visibles concentrados en `frontend/src/app/layout.tsx`, `frontend/src/app/signup/page.tsx`, `frontend/src/app/support/page.tsx`, `word-addin/src/taskpane/auth/LoginPage.tsx`, `word-addin/src/taskpane/components/shell/ApiKeyBanner.tsx` | Sustituir por el nombre del fork (**pendiente de decidir**) |
| R-02 | Logotipo e imagen de marca | `frontend/src/app/components/site-logo.tsx`, `docs/assets/link-image.jpg`, `docs/assets/mike-home.png`, `word-addin/assets/` | Eliminar y sustituir por identidad SGF |
| R-03 | Dominio `mikeoss.com` | `README.md`, `word-addin/manifest.xml`, `word-addin/.env.example`, `word-addin/webpack.config.js`, `word-addin/scripts/dev.sh`, `docker-compose.yml`, `backend/supabase/config.toml` | Sustituir por dominio propio |
| R-04 | Identificadores internos con la marca (`mike-backend:local`, bucket por defecto `mike`, tablas `mike_workflows` / `mike_workflow_assets`, `frontend/src/app/lib/mikeApi.ts`, contexto de firma `mike-project-manifest-v1`) | `docker-compose.yml:250,274`, `backend/src/lib/storage.ts`, `backend/schema.sql:1108,1167`, `backend/src/lib/manifestSigning.ts` | Renombrar. **Atención:** el cambio del contexto de firma y de los nombres de tabla exige migración y rompe la verificación de manifiestos anteriores; documentar en ADR y en la nota de versión |
| R-05 | Enlace al repositorio de *workflows* del origen | `frontend/src/app/components/workflows/OpenSourceWorkflowModal.tsx:20`, `backend/src/lib/workflowCatalogSource.ts` (`DEFAULT_REPOSITORY = "Open-Legal-Products/mike-workflows"`) | Sustituir por catálogo propio; véase también inventario I-14 |
| R-06 | Política de seguridad y canales de contacto del origen | `SECURITY.md`, `CONTRIBUTING.md` | Reescribir con los canales de SGF |
| R-07 | Manifiesto del complemento de Word (IDs, URLs, nombre visible) | `word-addin/manifest.xml` | Regenerar con identidad propia (GUID nuevo) |

### 4.2 Qué se conserva obligatoriamente

| # | Elemento | Fundamento |
| --- | --- | --- |
| C-01 | `LICENSE` íntegro y sin modificar | Secs. 4 y 5 b) |
| C-02 | Avisos de copyright del proyecto origen y sus contribuyentes | Sec. 4 |
| C-03 | Avisos de ausencia de garantía | Sec. 4; secs. 15–16 |
| C-04 | Atribución del origen en `README.md` y `NOTICE.md`: proyecto, autoría, URL y commit base | Secs. 4 y 5 a) |
| C-05 | Historial de git heredado (no se aplasta ni se reescribe la historia del origen) | Buena práctica probatoria de C-02 y C-04 |

### 4.3 Qué se añade obligatoriamente

| # | Elemento | Fundamento |
| --- | --- | --- |
| A-01 | `NOTICE.md`: declaración destacada de que la obra ha sido modificada por SGF, con fechas por fase | Sec. 5 a) |
| A-02 | Declaración de licencia AGPL-3.0 del fork y de los términos añadidos al amparo de la sec. 7 | Sec. 5 b) |
| A-03 | `TRADEMARKS.md`: reserva de marcas de SGF al amparo de la sec. 7 e) | Sec. 7 e) |
| A-04 | Appropriate Legal Notices en el frontend y en el complemento de Word | Sec. 5 d) + definición de la sec. 0 |
| A-05 | Endpoint `GET /source` y enlace destacado "Código fuente" | Sec. 13 |
| A-06 | `THIRD-PARTY-NOTICES.md` generado automáticamente a partir del árbol de dependencias | Buena práctica; soporte de C-02 para dependencias |

### 4.4 Cuidado con el rebranding excesivo

Retirar la marca del origen **no** autoriza a presentar el fork como obra
originaria de SGF. La sección 7 c) permite precisamente exigir lo contrario
(*"Prohibiting misrepresentation of the origin of that material"*). El material
de marketing de santosgutierrez.com debe describir el producto como **fork de
un proyecto de software libre**, no como desarrollo propio *ex novo*.

---

## 5. Regla dura del repositorio

**Norma de obligado cumplimiento para cualquier persona o agente que trabaje en
el repositorio del fork:**

> **PROHIBIDO** incorporar al árbol de código —en cualquier rama, en cualquier
> fichero, incluidos tests, *fixtures*, semillas, comentarios, documentación,
> ficheros de ejemplo y mensajes de commit— plantillas contractuales, criterios
> internos de revisión, playbooks, prompts de valor competitivo, doctrina
> interna o cualquier otro *know-how* de Santos Gutiérrez Figueroa.
>
> Todo ese material vive **exclusivamente** en el módulo propietario externo
> (repositorio privado, proceso separado).
>
> La prohibición alcanza también a **documentos de clientes**, datos personales
> reales y cualquier expediente. Un *fixture* de test debe ser ficticio y
> declararlo.

**Controles de cumplimiento previstos (se implementan en la Fase 1):**

1. `gitleaks` ya existe en el pipeline del origen (`.github/workflows/gitleaks.yml`);
   se amplía su configuración con patrones propios.
2. Nuevo *gate* `knowhow-gate` en CI: falla si aparecen rutas, espacios de
   nombres o marcadores reservados del módulo propietario, o ficheros bajo
   `**/knowhow/**`, `**/plantillas/**`, `**/playbooks/**`.
3. `CODEOWNERS` con revisión obligatoria de SGF sobre `docs/`, `NOTICE.md`,
   `LICENSE`, `TRADEMARKS.md` y los manifiestos de conectores.
4. Regla equivalente replicada en `CLAUDE.md` y `AGENTS.md` del fork, para que la
   hereden las sesiones de agentes.

---

## 6. Compatibilidad de licencias de dependencias

La sección 5 c) obliga a licenciar la obra completa bajo AGPL, lo que exige que
toda dependencia incorporada sea compatible.

**Estado actual:** el repositorio origen declara 31 dependencias de producción en
`backend/` y 44 en `frontend/`. **No se ha realizado todavía la auditoría de
licencias.** `[PENDIENTE — tarea de la Fase 1: generar el SBOM y el informe de
licencias, y revisar cada incompatibilidad potencial.]`

**Política que se propone adoptar:**

| Categoría | Ejemplos típicos | Decisión |
| --- | --- | --- |
| Permisivas | MIT, BSD-2/3, ISC, Apache-2.0 | Admitidas |
| Copyleft débil | MPL-2.0, LGPL | Admitidas con revisión caso a caso |
| Copyleft fuerte compatible | GPL-3.0-or-later, AGPL-3.0 | Admitidas |
| GPL-2.0-**only** | — | **Prohibida** (incompatible con AGPL-3.0) |
| Sin licencia declarada, "source-available", BSL, SSPL, *non-commercial*, *ethical source* | — | **Prohibidas** |
| Modelos de IA y sus pesos | — | Fuera del árbol de código; licencia analizada por separado en el manifiesto del proveedor |

Regla operativa: **ninguna dependencia nueva sin justificación escrita y sin
revisión de licencia**, conforme a las convenciones de trabajo del proyecto.

---

## 7. Riesgos abiertos y decisiones que requieren pronunciamiento de SGF

### 7.1 Resueltas por SGF el 2026-09-08

| # | Cuestión | Decisión |
| --- | --- | --- |
| Q-02 | Frontera con el *know-how* de SGF | **Contenido cargado por el operador.** El acervo de SGF no es software y queda fuera del árbol AGPL. Se descarta el módulo-servicio propietario. Véase §3 y ADR-0001 |
| Q-13 | Dónde vive el repositorio del fork | **Fase 0 aquí (`sangut1/SG_website`), código en repositorio nuevo.** Estos documentos permanecen como memoria del proyecto; el fork se crea en un repositorio dedicado al aprobar la Fase 1 |

### 7.2 Pendientes

| # | Cuestión | Por qué no la resuelvo yo |
| --- | --- | --- |
| Q-01 | Nombre y marca del fork | Decisión comercial de SGF; condiciona R-01 a R-07 |
| Q-03 | ¿Habrá distribución del software a terceros (instaladores, imágenes) o sólo despliegue operado por SGF? | Cambia el peso relativo de las secs. 4/5 frente a la sec. 13 |
| Q-04 | ¿Se implementan Appropriate Legal Notices pese a la dispensa de la sec. 5 d)? | Propuesta: sí. Requiere confirmación |
| Q-05 | Ámbito de la oferta de código de la sec. 13 en `local-only` monopuesto | Propuesta: ofrecerlo siempre. Requiere confirmación |
| Q-06 | ¿Se acepta romper la verificación de manifiestos anteriores al renombrar el contexto de firma (R-04)? | Tiene efectos probatorios sobre exportaciones ya emitidas |

---

## 8. Entregables de cumplimiento a producir en la Fase 1

- [ ] `NOTICE.md` (sec. 5 a) y atribución del origen)
- [ ] `TRADEMARKS.md` (sec. 7 e))
- [ ] `THIRD-PARTY-NOTICES.md` + SBOM + informe de licencias
- [ ] Endpoint `GET /source` con prueba de integración que verifique que sirve el
      árbol de la build en ejecución
- [ ] Pantalla "Acerca de / Licencia" en frontend y complemento de Word
- [ ] `CLAUDE.md` y `AGENTS.md` del fork con la regla dura del apartado 5
- [ ] *Gate* `knowhow-gate` en CI
- [ ] `CODEOWNERS`
