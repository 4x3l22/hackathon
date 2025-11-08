# Credenciales de Prueba - Sistema de Login

Usa estas credenciales para probar el sistema de autenticación:

## 👨‍🎨 Artesano

**Email:** maria@artesano.com  
**Contraseña:** 123456  
**Nombre:** María Elena Gutiérrez  
**Rol:** Artesano

---

## 👤 Usuarios

### Usuario 1
**Email:** juan@usuario.com  
**Contraseña:** 123456  
**Nombre:** Juan Pérez  
**Rol:** Usuario

### Usuario 2
**Email:** laura@usuario.com  
**Contraseña:** 123456  
**Nombre:** Laura Rodríguez  
**Rol:** Usuario

### Usuario 3
**Email:** carlos@usuario.com  
**Contraseña:** 123456  
**Nombre:** Carlos Mendoza  
**Rol:** Usuario

---

## 🔐 Notas Importantes

- Todos los usuarios tienen la misma contraseña: **123456**
- El login valida el email y contraseña contra el mock en `src/utils/usuariosMock.ts`
- Al iniciar sesión correctamente, serás redirigido al **Home** automáticamente
- La sesión se guarda en localStorage y persiste entre recargas
- El rol de "artesano" puede tener privilegios especiales en el futuro

## 🎯 Funcionalidades Implementadas

✅ Validación de email en tiempo real  
✅ Validación de contraseña (mínimo 6 caracteres)  
✅ Redirección automática al home después de login exitoso  
✅ Persistencia de sesión con localStorage  
✅ Manejo de errores con SweetAlert2  
✅ Diferenciación entre roles (artesano/usuario)
