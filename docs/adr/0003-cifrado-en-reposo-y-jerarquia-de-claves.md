# ADR-0003 — Cifrado en reposo con jerarquía de claves del operador

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

La base sólo cifra a nivel de aplicación las claves de API de usuario
(`user_api_keys`, AES-GCM con `iv` y `auth_tag`). Los documentos y la base de
datos no están cifrados por la aplicación (inventario S-11). El Requisito 1 exige
cifrado en reposo de documentos y base de datos, con claves gestionadas por el
operador y nunca embebidas.

## Decisión

1. **Jerarquía de claves:** KEK del operador (HSM, KMS soberano o fichero
   protegido según despliegue) → DEK por tenant → DEK por objeto.
2. **Objetos:** cifrado del lado del cliente **antes** de subir. El almacén nunca
   ve texto en claro.
3. **Base de datos:** cifrado de volumen o instancia (responsabilidad del
   operador, comprobado al arranque) más cifrado a nivel de aplicación de las
   columnas con contenido sustantivo.
4. **Ninguna clave embebida** en código ni en imagen. `.env.example` con
   *placeholders* no funcionales y comprobación de arranque que aborta si detecta
   un valor de ejemplo en modo producción.
5. Se reutiliza el mecanismo AES-GCM ya existente, generalizado.

## Alternativas consideradas

- **Sólo cifrado del proveedor de almacenamiento.** Deja la clave en manos del
  proveedor: incompatible con soberanía del dato y con el *crypto-shredding* del
  ADR-0012.
- **Cifrado por documento con clave del usuario.** Impide la indexación y la
  recuperación. Descartada.

## Consecuencias

- Rotación de claves y respaldo de la KEK pasan a ser procedimientos operativos
  documentados y probados. Perder la KEK es perder los datos: es el precio.
- El índice de recuperación trabaja sobre texto descifrado en memoria; su
  persistencia queda igualmente cifrada.

## Verificación

- Test que sube un documento y comprueba que los bytes en el almacén no contienen
  el texto en claro.
- Test de arranque que aborta con un secreto de ejemplo en modo producción.
