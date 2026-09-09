# ADR-0014 — Appropriate Legal Notices y oferta de código fuente en todos los modos

**Estado:** aceptado (decisión de SGF, 2026-09-09)
**Fecha:** 2026-09-09
**Fase:** 0

## Contexto

Dos obligaciones de la AGPL admitían margen, y SGF ha decidido no aprovecharlo en
ninguno de los dos casos.

1. **Sección 5 d), verificada sobre el fichero `LICENSE`:** *"If the work has
   interactive user interfaces, each must display Appropriate Legal Notices;
   however, if the Program has interactive interfaces that do not display
   Appropriate Legal Notices, your work need not make them do so."* En la
   inspección del proyecto origen no se ha localizado ninguna pantalla que
   muestre aviso de copyright, ausencia de garantía y acceso a la licencia, de
   modo que GNEO **podría** acogerse a la dispensa.
2. **Sección 13:** la oferta de código se activa por *modificar + ofrecer
   interacción remota por red*. En un `local-only` monopuesto, sin servidor
   accesible, es discutible que existan "usuarios remotos".

## Decisión

1. **Se implementan los Appropriate Legal Notices**, renunciando a la dispensa de
   la sección 5 d). Entrada permanente de menú **"Acerca de / Licencia"** en el
   frontend y en el complemento de Word —no un pie de página escondido—, que
   satisface la definición verificada en la sección 0: aviso de copyright
   apropiado, advertencia de ausencia de garantía, mención de que los
   licenciatarios pueden distribuir la obra bajo esta licencia, y cómo consultar
   una copia de la misma.
2. **Se ofrece el código fuente en todos los modos de despliegue**, incluido
   `local-only` monopuesto. Sin condicionales, sin razonar caso a caso.
   - Endpoint `GET /source`, sin autenticación y sin coste, que sirve el
     *Corresponding Source* **exacto de la build en ejecución** (la build inyecta
     commit y digest del árbol; servir otra versión no cumple la sección 13).
   - Enlace destacado **"Código fuente"** junto a los avisos legales.
   - Incluye scripts de construcción y ficheros de configuración necesarios para
     reconstruir y ejecutar la obra. **Los secretos del operador no forman parte
     del código fuente y no se publican** — de ahí la exigencia de que
     `.env.example` contenga sólo *placeholders* no funcionales.
3. Ambas pantallas son además el vehículo natural para las obligaciones de
   transparencia del art. 50 del Reglamento (UE) 2024/1689 y para la advertencia
   de que el resultado no constituye asesoramiento jurídico. **Un solo sitio, tres
   obligaciones.**

## Alternativas consideradas

- **Acogerse a la dispensa de la sec. 5 d).** Legítimo, y era la lectura literal
  disponible. Descartada: la dispensa ahorra una pantalla y cuesta credibilidad,
  y con GNEO orientado a distribuirse a terceros el receptor de una copia debe
  poder ver de quién es el copyright, que no hay garantía y dónde está la
  licencia sin salir de la aplicación.
- **Condicionar la oferta de código al modo de despliegue.** Habría obligado a
  decidir, en cada instalación, si un `local-only` "sigue siendo" monopuesto —una
  pregunta que se responde mal el día que alguien expone el puerto en la red del
  despacho. Descartada por la misma razón por la que se rechaza cualquier
  degradación silenciosa en este proyecto: **el fallo debe ser cerrado, y la
  obligación, incondicional.**

## Consecuencias

- El coste es una pantalla y un endpoint. A cambio, ninguna de las dos
  obligaciones más visibles de la AGPL depende de una interpretación.
- `GET /source` debe servir el árbol **de la build en ejecución**, no la punta de
  la rama. Eso obliga a que el proceso de construcción deje disponible el
  *Corresponding Source* correspondiente a cada imagen publicada, lo que a su vez
  disciplina el pipeline de distribución. Es trabajo real y hay que planificarlo.
- El endpoint es público y sin autenticación: sirve **código**, nunca datos. Debe
  quedar fuera de toda ruta que toque el almacén de documentos o la base de datos,
  y así se comprueba en el test.

## Verificación

- Prueba de integración que arranca la aplicación, llama a `GET /source` sin
  credenciales y comprueba que el árbol devuelto corresponde al commit y digest
  inyectados en la build en ejecución.
- Prueba de que el endpoint responde en los tres modos de soberanía, incluido
  `local-only`.
- Prueba de que el árbol servido **no contiene** ningún fichero `.env` ni material
  del acervo de SGF (enlaza con el `knowhow-gate` del ADR-0001).
- Prueba de interfaz: la entrada "Acerca de / Licencia" existe y es alcanzable en
  el frontend y en el complemento de Word, y contiene los cuatro elementos que
  exige la definición de la sección 0.
