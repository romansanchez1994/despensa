# 🛒 Despensa — Guía de instalación y actualización

## Archivos del proyecto
- `index.html` — La aplicación completa (actualizada)
- `manifest.json` — Configuración PWA
- `sw.js` — Service Worker (offline)
- `setup.sql` — Script para crear/actualizar tablas en Supabase
- `INSTRUCCIONES.md` — Este archivo

---

## ACTUALIZAR desde GitHub (si ya tenías la app)

### Paso 1 — Actualizar la base de datos (nuevo campo precio)
1. Ve a **[supabase.com](https://supabase.com)** → tu proyecto
2. **SQL Editor** → **New query**
3. Ejecuta solo esta línea:
   ```sql
   alter table inventory add column if not exists price numeric default null;
   ```
4. Pulsa **Run** ▶️

### Paso 2 — Subir los nuevos archivos a GitHub
Reemplaza en tu repositorio los archivos:
- `index.html` ← el más importante, tiene todos los cambios
- `setup.sql` ← actualizado con el campo precio

**Desde GitHub web** (sin instalar nada):
1. Entra a tu repositorio en github.com
2. Pulsa sobre `index.html` → icono del lápiz ✏️ (Edit)
3. Selecciona todo el texto → bórralo → pega el contenido del nuevo `index.html`
4. Pulsa **Commit changes** → **Commit directly to main**
5. Repite para `setup.sql`

**Si usas GitHub Desktop o git en terminal:**
```bash
git add index.html setup.sql
git commit -m "feat: precio en inventario, lista por tienda, OCR mejorado, borrar productos"
git push
```

### Paso 3 — Actualizar en Netlify (despliegue automático)
Si conectaste Netlify a GitHub, **se actualiza solo** en 1-2 minutos tras el push.

Si hiciste Netlify Drop (arrastrando):
1. Ve a [app.netlify.com](https://app.netlify.com) → tu sitio
2. Pestaña **Deploys** → **Deploy settings** o arrastra la carpeta actualizada

---

## INSTALACIÓN DESDE CERO

### Paso 1 — Crear tablas en Supabase
1. Ve a tu proyecto Supabase → **SQL Editor** → **New query**
2. Copia y pega todo el contenido de `setup.sql`
3. Pulsa **Run** ▶️

### Paso 2 — Subir a GitHub
1. Crea repositorio en github.com (público o privado)
2. Sube los 4 archivos: `index.html`, `manifest.json`, `sw.js`, `setup.sql`

### Paso 3 — Conectar con Netlify (despliegue automático)
1. Ve a [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
2. Conecta tu GitHub y selecciona el repositorio
3. Deja todo por defecto → **Deploy site**
4. Te da una URL tipo `https://nombre.netlify.app`

### Paso 4 — Crear cuenta en la app
1. Abre la URL en Safari (iPhone)
2. Pulsa **"Crear cuenta"** → email + contraseña
3. Confirma el email que te llega de Supabase

### Paso 5 — Instalar como app en iPhone
En Safari:
1. Pulsa el botón **Compartir** (cuadrado con flecha ↑)
2. **"Añadir a la pantalla de inicio"**
3. Nombre: "Despensa" → **Añadir**

Repetid en el móvil de tu mujer con el **mismo email y contraseña**.

---

## Novedades de esta versión

### 🔧 Ticket OCR arreglado
- Soporte para arrastrar imagen desde el PC
- Funciona con foto desde cámara del móvil
- El campo de selección es un botón claro, sin captura forzada

### 📦 Packs → Unidades automático
- "Cerveza Mahou 0,0 33cl P-12" → 12 latas (unit: lata)
- "Aquarius limón P-6" → 6 latas
- Nunca crea artículos tipo "pack"

### 💰 Precio en inventario
- Visible como etiqueta verde en cada producto
- Se rellena automáticamente desde el ticket OCR
- Editable manualmente al añadir/editar un producto

### 🗑️ Eliminar productos
- Botón 🗑️ en cada producto → confirmación antes de borrar
- En móvil: también puedes deslizar a la izquierda (swipe)

### 🏪 Lista de la compra por supermercado
- Los productos pendientes se agrupan por tienda
- Cada tienda tiene su sección con contador de productos
- Puedes preguntar al chat: "¿Qué tengo que comprar en Ahorramas?"

---

## Cómo funciona la sincronización
- 🟢 Verde = sincronizado
- 🟡 Amarillo parpadeando = sincronizando
- 🔴 Rojo = sin conexión

Cualquier cambio que haga uno se ve en el otro en menos de 1 segundo.
