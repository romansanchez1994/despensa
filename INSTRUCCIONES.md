# 🛒 Despensa — Guía de instalación completa

## Archivos del proyecto
- `index.html` — La aplicación completa
- `manifest.json` — Configuración PWA (icono, nombre en iPhone)
- `sw.js` — Service Worker (funciona sin conexión)
- `setup.sql` — Script para crear las tablas en Supabase
- `INSTRUCCIONES.md` — Este archivo

---

## PASO 1 — Crear las tablas en Supabase

1. Ve a **[supabase.com](https://supabase.com)** → tu proyecto `despensa-casa`
2. En el menú izquierdo: **SQL Editor** → **New query**
3. Copia y pega el contenido de `setup.sql`
4. Pulsa **Run** (▶️)
5. Debería aparecer "Success" en verde

---

## PASO 2 — Publicar la app en internet

Necesitas que la app esté en una URL para poder abrirla en el iPhone.
La opción más fácil y gratuita es **Netlify Drop**:

1. Ve a **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Arrastra la **carpeta entera** `despensa-pwa` a la página
3. En segundos te da una URL tipo `https://nombre-aleatorio.netlify.app`
4. ¡Ya está publicada!

> También puedes usar Vercel, GitHub Pages, o cualquier hosting estático.

---

## PASO 3 — Crear tu cuenta en la app

1. Abre la URL de Netlify en Safari (iPhone)
2. Pulsa **"Crear cuenta"**
3. Pon tu email y una contraseña segura
4. **IMPORTANTE:** Supabase manda un email de confirmación — búscalo y confirma

---

## PASO 4 — Instalar como app en el iPhone

En Safari (no Chrome ni Firefox):

1. Abre la URL de Netlify
2. Pulsa el botón **Compartir** (cuadrado con flecha ↑)
3. Desplázate y pulsa **"Añadir a la pantalla de inicio"**
4. Ponle el nombre "Despensa" → **Añadir**

Ahora aparece en tu pantalla de inicio como una app normal, sin barra del navegador.

**Repite en el móvil de tu mujer** — usad el mismo email y contraseña para compartir el inventario.

---

## Cómo funciona la sincronización

- Los dos móviles comparten **la misma cuenta** (mismo email + contraseña)
- Cualquier cambio que haga uno se ve en el otro en **tiempo real** (menos de 1 segundo)
- El punto verde en la cabecera indica que está sincronizado
  - 🟢 Verde = sincronizado
  - 🟡 Amarillo = sincronizando
  - 🔴 Rojo = sin conexión (los cambios se guardan al reconectar)

---

## Funcionalidades

### 🧺 Despensa (inventario)
- Filtra por categoría deslizando los botones
- Usa `+` / `−` para ajustar cantidades
- Cuando el stock baja del mínimo → alerta roja + se añade solo a la lista

### 🛒 Lista de la compra
- Se rellena automáticamente con productos bajos
- Marca como comprado con el check
- "Limpiar ✓" borra los ya comprados

### 📷 Ticket
- Saca foto del ticket con la cámara
- La IA detecta automáticamente los productos
- Selecciona la tienda y qué productos importar

### 💬 Chat con IA
- Dile en lenguaje natural qué habéis consumido
- Actualiza el inventario automáticamente
- Pregúntale qué falta comprar

---

## Solución de problemas

**"No recibo el email de confirmación"**
→ Revisa spam. En Supabase > Authentication > Email Templates puedes reenviar.

**"Los cambios no se sincronizan"**
→ Comprueba que ambos dispositivos tienen internet. El punto rojo en la app indica sin conexión.

**"La app no se instala en iPhone"**
→ Asegúrate de abrir en **Safari** (no Chrome). El botón "Añadir a pantalla de inicio" solo aparece en Safari.

---

## Límites del plan gratuito de Supabase

Para una familia, nunca llegaréis a estos límites:
- 50.000 filas en base de datos
- 500 MB de almacenamiento
- 2 GB de transferencia/mes
- Realtime: ilimitado en el plan gratuito

Si el proyecto lleva más de 1 semana sin actividad, Supabase puede pausarlo (avisa por email). Basta con entrar a la consola y reactivarlo.
