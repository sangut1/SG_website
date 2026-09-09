# NOTICE

> **Borrador destinado a la raíz del repositorio `sangut1/gneo`.** Vive aquí
> mientras el repositorio de GNEO no existe. Al sembrarlo, este fichero se copia
> a la raíz de GNEO y se elimina de aquí.

---

## Obra original

GNEO es una **obra derivada** de **Mike (MikeOSS)**, plataforma open source de IA
jurídica publicada por **Open Legal Products**.

- Proyecto original: https://github.com/Open-Legal-Products/mike
- Licencia: **GNU Affero General Public License, versión 3** (AGPL-3.0)
- Commit base del fork: `8b3466fc04bf8cad623238a71fca1fda3fc89fde` (2026-09-05)

Se conservan íntegros el fichero `LICENSE`, los avisos de copyright del proyecto
original y de sus contribuyentes, y los avisos de ausencia de garantía. El
historial de git del proyecto original se conserva completo (631 commits, desde
`65739ef1ce39a1ba9f13602c0ac57c6d72f495e3`, de 2026-04-29).

## Declaración de modificación

*Conforme a la sección 5 a) de la AGPL-3.0: "The work must carry prominent
notices stating that you modified it, and giving a relevant date."*

**Esta obra ha sido modificada por Santos Gutiérrez Figueroa (SGF).**

Registro de modificaciones sustanciales, por fases:

| Fase | Fecha de inicio | Modificaciones |
| --- | --- | --- |
| Fase 0 — Análisis | 2026-09-08 | Ninguna modificación de código. Análisis de cumplimiento, inventario y arquitectura objetivo. |
| Fase 1 — Fork y cumplimiento | *(pendiente)* | Rebranding a GNEO; entregables de cumplimiento AGPL; retirada de fuentes y CDN externos; reglas del repositorio y *gates* de CI. |

*(Cada fase posterior añade una fila con su fecha y el alcance de lo modificado.
La sección 5 a) exige "una fecha relevante", no una fecha por commit.)*

## Licencia de esta obra derivada

GNEO se publica bajo la **GNU Affero General Public License, versión 3**, la
misma que la obra original. Véase `LICENSE`.

Copyright de las modificaciones © 2026 Santos Gutiérrez Figueroa.
Copyright de la obra original © sus respectivos titulares, según el historial
del repositorio de origen.

Este programa se distribuye con la esperanza de que sea útil, pero **SIN NINGUNA
GARANTÍA**; ni siquiera la garantía implícita de COMERCIABILIDAD o APTITUD PARA
UN PROPÓSITO PARTICULAR. Véanse las secciones 15 y 16 de la Licencia.

## Términos adicionales al amparo de la sección 7

Se han añadido términos adicionales relativos a marcas, al amparo de la letra e)
de la sección 7. Véase `TRADEMARKS.md`.

## Código fuente

Conforme a la sección 13 de la AGPL-3.0, toda persona que interactúe con GNEO a
través de una red recibe la oferta del código fuente correspondiente a la versión
en ejecución, sin coste, a través del endpoint `GET /source` y del enlace
destacado "Código fuente" de la interfaz.

## Aviso sobre el contenido

El árbol de código de GNEO contiene **funcionalidad, no contenido jurídico**. Las
plantillas contractuales, criterios de revisión, playbooks y prompts de valor de
SGF **no forman parte de este programa**: se cargan como contenido en tiempo de
ejecución y no están sujetos a la AGPL. Véase la regla dura en `AGENTS.md`.
