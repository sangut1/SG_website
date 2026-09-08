# ADR-0004 — Multi-tenancy con aislamiento por fila y por bucket

**Estado:** propuesto
**Fecha:** 2026-09-08
**Fase:** 0

## Contexto

La base no tiene tenants: aísla por `user_id` y por listas de compartición
(`project_access_grants`, `chat_access_grants`, `workflow_shares`), con 30
políticas RLS (inventario I-23). El Requisito 1 exige aislamiento a nivel de fila
y de *bucket*, más `kill switch` por tenant.

## Decisión

1. `tenant_id` **obligatorio** en toda tabla con contenido de negocio, con RLS que
   lo filtra por el claim de sesión. Una tabla nueva sin `tenant_id` es un fallo
   de revisión bloqueante.
2. Aislamiento de objetos por **bucket o prefijo dedicado por tenant**, con
   credenciales distintas donde el almacén lo soporte.
3. **`kill switch` por tenant**: deshabilita de inmediato todos los proveedores
   externos de modelo del tenant, con efecto sobre peticiones en curso, registro
   en auditoría y reversión sólo por el operador.
4. Las concesiones de compartición existentes se conservan **dentro** del tenant;
   no cruzan la frontera de tenant en ningún caso.

## Alternativas consideradas

- **Una base de datos por tenant.** Aislamiento máximo, coste operativo alto y
  migraciones multiplicadas. Se reserva para clientes que lo exijan, como
  variante de despliegue, no como modelo por defecto.
- **Aislamiento sólo en la capa de aplicación.** Un `where` olvidado es una fuga
  entre despachos. Descartada.

## Consecuencias

- Migración no trivial de las 51 tablas heredadas.
- Todas las consultas pasan a ejecutarse bajo rol con RLS activo; el rol de
  servicio queda restringido a tareas de mantenimiento explícitas.

## Verificación

- Test que, autenticado como tenant A, intenta leer filas y objetos de B por
  identificador directo y obtiene vacío o error, nunca datos.
- Gate de esquema que falla si una tabla de negocio carece de `tenant_id` o de RLS.
