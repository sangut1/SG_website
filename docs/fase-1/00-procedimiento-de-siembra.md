# Procedimiento de siembra del repositorio GNEO

**Estado:** listo para ejecutar. **Bloqueado** a la espera de que exista el
repositorio.

---

## Bloqueo actual

El integrador de GitHub de esta sesión **no tiene permiso para crear
repositorios**:

```
POST https://api.github.com/user/repos
403 Resource not accessible by integration
```

El repositorio debe crearlo SGF a mano.

## Lo que hay que crear

- **Nombre:** `sangut1/gneo`
- **Visibilidad:** **privado**
- **Completamente vacío**: sin README, sin `.gitignore`, sin licencia. Cualquier
  fichero inicial genera un commit que estorba al empujar el historial del
  proyecto de origen.

**No usar el botón "Fork" de GitHub.** Un fork de un repositorio público es
siempre público, y además queda encadenado a la red del repositorio original.
GNEO se siembra por clonación y empuje, que preserva el historial completo y
permite visibilidad privada.

## Siembra

```bash
# 1. Clon completo del origen (631 commits, ~35 MB)
git clone https://github.com/Open-Legal-Products/mike.git gneo
cd gneo

# 2. El origen pasa a ser "upstream"; GNEO es "origin"
git remote rename origin upstream
git remote add origin https://github.com/sangut1/gneo.git

# 3. Empuje del historial completo
git push -u origin main
```

Commit base del fork: `8b3466fc04bf8cad623238a71fca1fda3fc89fde` (2026-09-05).
Primer commit del historial heredado: `65739ef1ce39a1ba9f13602c0ac57c6d72f495e3`
(2026-04-29).

Conservar `upstream` permite seguir las correcciones de seguridad del proyecto de
origen. **No implica** sincronización automática: cada incorporación se revisa.

## Primer commit propio de GNEO

Sobre `main`, rama `fase-1/gobernanza`:

1. Copiar a la raíz de GNEO, desde `docs/fase-1/` de este repositorio, **con el
   renombrado que se indica**:

   | Origen | Destino en GNEO |
   | --- | --- |
   | `NOTICE.md` | `NOTICE.md` |
   | `TRADEMARKS.md` | `TRADEMARKS.md` |
   | `AGENTS.gneo.md` | `AGENTS.md` |
   | `CLAUDE.gneo.md` | `CLAUDE.md` |

   El sufijo `.gneo` existe sólo para que un `AGENTS.md` o un `CLAUDE.md` con las
   reglas de GNEO no se active por error en este repositorio, que es el del sitio
   web.
2. Copiar `docs/00-licencia-agpl.md`, `docs/01-inventario-us-centrico.md`,
   `docs/02-arquitectura-objetivo.md` y `docs/adr/` a `docs/` de GNEO.
3. Retirar el aviso "Borrador destinado a la raíz del repositorio" de las
   cabeceras de los cuatro ficheros copiados.
4. `LICENSE` **no se toca**.

## Orden de trabajo de la Fase 1

| # | Bloque | Depende de |
| --- | --- | --- |
| 1 | Gobernanza: `NOTICE.md`, `TRADEMARKS.md`, `AGENTS.md`, `CLAUDE.md`, `docs/`, `CODEOWNERS` | siembra |
| 2 | *Gates* de CI: `knowhow-gate`, `gitleaks` ampliado, gate de egreso (`fetch` fuera de `egress.ts`), gate de literales de UI | 1 |
| 3 | Soberanía mínima: hallazgos S-01 a S-05 (fuentes de Google, CDN de PDF.js, catálogo de *workflows* desde GitHub). **Sin esto la prueba de red aislada no arranca** | 2 |
| 4 | Cliente de egreso único + lista blanca + `SOVEREIGNTY_MODE` + suite `airgap` | 3 |
| 5 | Rebranding a GNEO (R-01 a R-07 del doc. 00) | 1 |
| 6 | Avisos legales y `GET /source` (ADR-0014) | 5 |
| 7 | Modelo de fuentes: precepto, redacción, disposiciones, perfil de jurisdicción | — |
| 8 | Pipeline antialucinación + `evals/` | 7 |

Los bloques 1 a 6 son de cumplimiento e infraestructura y pueden avanzar en
paralelo al 7, que es el trabajo de fondo.
