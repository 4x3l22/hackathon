# Sistema de Carrito de Compras - Guía de Uso

## 📋 Descripción General

El sistema de carrito de compras está implementado como un servicio singleton que mantiene el estado del carrito de forma global en toda la aplicación.

## 🎯 Componentes Implementados

### 1. **CartService** (`src/app/services/cart.service.ts`)
Servicio global que gestiona el estado del carrito:
- Almacenamiento persistente con localStorage
- Observables reactivos para actualizaciones en tiempo real
- Notificaciones tipo snackbar con SweetAlert2
- Cálculos automáticos de subtotal, envío y total

### 2. **Carshop Component** (`src/app/pages/carshop/`)
Vista principal del carrito con:
- Lista de productos agregados
- Controles de cantidad (+/-)
- Botón para eliminar productos
- Resumen de costos (subtotal, envío, total)
- Indicador de envío gratis
- Botón "Proceder al pago"

## 🚀 Cómo Usar el Servicio del Carrito

### Importar el Servicio

```typescript
import { CartService } from './services/cart.service';

constructor(private cartService: CartService) {}
```

### Agregar Producto al Carrito

```typescript
this.cartService.addToCart({
  id: 1,
  name: 'Nombre del producto',
  price: 45000,
  quantity: 1,
  image: 'url-de-la-imagen.jpg'
});
```

**Nota:** Al agregar un producto, se muestra automáticamente una notificación snackbar sin interrumpir la navegación.

### Suscribirse a Cambios del Carrito

```typescript
this.cartService.cartItems$.subscribe(items => {
  console.log('Items actuales:', items);
  // Actualizar UI
});
```

### Métodos Disponibles

```typescript
// Obtener items actuales
const items = this.cartService.getCartItems();

// Actualizar cantidad
this.cartService.updateQuantity(productId, newQuantity);

// Incrementar cantidad
this.cartService.increaseQuantity(productId);

// Decrementar cantidad
this.cartService.decreaseQuantity(productId);

// Eliminar producto
this.cartService.removeFromCart(productId);

// Vaciar carrito
this.cartService.clearCart();

// Obtener totales
const subtotal = this.cartService.getSubtotal();
const shipping = this.cartService.getShippingCost();
const total = this.cartService.getTotal();
const totalItems = this.cartService.getTotalItems();
```

## 💰 Reglas de Negocio

### Envío Gratis
- **Costo fijo de envío:** $5,000 COP
- **Envío GRATIS** en compras mayores a **$80,000 COP**
- El sistema muestra un indicador de cuánto falta para obtener envío gratis

### Persistencia
- Los productos se guardan en `localStorage`
- El carrito persiste entre recargas de página
- Se carga automáticamente al iniciar la aplicación

## 🎨 Características de UX

### Notificaciones Snackbar
Se muestran automáticamente en las siguientes acciones:
- ✅ Producto agregado
- ℹ️ Producto eliminado
- ⚠️ Advertencias

Las notificaciones:
- Aparecen en la esquina superior derecha
- Se ocultan automáticamente después de 3 segundos
- No bloquean la navegación
- Incluyen barra de progreso

### Confirmaciones
Acciones críticas requieren confirmación:
- Eliminar un producto
- Vaciar el carrito completo

### Actualizaciones en Tiempo Real
- Los totales se recalculan automáticamente
- Los cambios se reflejan inmediatamente en toda la aplicación
- Indicador visual de envío gratis se actualiza dinámicamente

## 🔄 Flujo de Navegación

```
Producto Detail (/product/:id)
    ↓
[Agregar al Carrito]
    ↓
Snackbar: "Producto agregado"
    ↓
Usuario elige:
    → Ir al carrito (/cart)
    → Seguir comprando (permanece en la página)
```

## 📱 Responsive Design

La vista del carrito está optimizada para:
- 📱 Móviles (stack vertical)
- 💻 Desktop (layout de 2 columnas)
- 🖥️ El resumen del pedido es sticky en desktop

## 🛠️ Integración con Otras Vistas

### Vista de Producto
Ya está integrada para usar el `CartService`. Al hacer clic en "Agregar al Carrito":
1. Valida disponibilidad
2. Agrega al carrito con el servicio
3. Muestra confirmación
4. Ofrece ir al carrito o seguir comprando

### Vista de Perfil
Los productos pueden navegar a la vista de detalle donde el usuario puede agregarlos al carrito.

## 🔐 Próximos Pasos (Integración Backend)

Para integrar con el backend:

```typescript
// En CartService
addToCart(product: CartItem): void {
  // 1. Agregar localmente
  // 2. Sincronizar con backend
  this.http.post('/api/cart/add', product).subscribe({
    next: () => {
      // Actualizar estado local
      this.showSnackbar('Producto agregado', 'success');
    },
    error: (error) => {
      // Manejar error
      this.showSnackbar('Error al agregar producto', 'error');
    }
  });
}
```

## 📊 Estructura de Datos

### CartItem Interface
```typescript
interface CartItem {
  id: number;           // ID único del producto
  name: string;         // Nombre del producto
  price: number;        // Precio unitario
  quantity: number;     // Cantidad en el carrito
  image: string;        // URL de la imagen
  maxQuantity?: number; // Cantidad máxima disponible (opcional)
}
```

## ✨ Características Implementadas

- ✅ Agregar productos al carrito
- ✅ Actualizar cantidad (incrementar/decrementar)
- ✅ Eliminar productos
- ✅ Vaciar carrito completo
- ✅ Cálculo automático de totales
- ✅ Envío gratis en compras > $80,000
- ✅ Persistencia en localStorage
- ✅ Notificaciones snackbar no intrusivas
- ✅ Actualizaciones en tiempo real
- ✅ Vista responsiva
- ✅ Confirmaciones para acciones críticas
- ✅ Indicador de envío gratis
- ✅ Sticky resumen en desktop
- ✅ TrackBy para optimización de renderizado

## 🎯 Criterios de Aceptación Cumplidos

- ✅ El carrito refleja correctamente los productos agregados y eliminados
- ✅ Los precios se actualizan en tiempo real según la cantidad
- ✅ La alerta de producto agregado se muestra sin bloquear la navegación
- ✅ El botón de pago está siempre activo (con validación interna)
- ✅ La vista es completamente funcional en dispositivos móviles
- ✅ Los productos se actualizan en tiempo real
- ✅ Más de una unidad del mismo producto se maneja correctamente
- ✅ Alerta tipo snackbar sin interrumpir navegación
