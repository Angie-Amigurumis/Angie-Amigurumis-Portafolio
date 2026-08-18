2# Lanaria — Portafolio con Airtable

Portafolio de amigurumis conectado a Airtable. Diseño pastel separado en HTML, CSS y JS.

---

## 📁 Estructura

```
lanaria-airtable/
├── index.html          # Estructura de la página
├── css/
│   └── styles.css      # Diseño pastel, cards, modal, responsive
├── js/
│   └── app.js          # Carrusel + Airtable + Modal + Mobile menu
└── README.md
```

---

## ⚙️ Configuración paso a paso

### 1. Crear base en Airtable

1. Ve a [airtable.com](https://airtable.com) y crea una cuenta gratuita.
2. Crea una nueva base.
3. Camb1 **"Productos"**.
4. Crea estos campos exactamente:

   | Campo | Tipo | Notas |
   |-------|------|-------|
   | **Nombre** | Single line text | Nombre del amigurumi |
   | **Descripcion** | Long text | Descripción corta |
   | **Precio** | Number | Solo número, ej: `180` |
   | **Imagen** | Attachment | Foto del producto |
   | **Categoria** | Single select o Number | `1`=Mini, `2`=Clásico, `3`=Premium |

5. Agrega productos de prueba.

### 2. Imágenes del carrusel

Abre `js/app.js` y edita `CAROUSEL_IMAGES` con las URLs de tus fotos destacadas:

```javascript
const CAROUSEL_IMAGES = [
  'https://tuservidor.com/foto1.jpg',
  'https://tuservidor.com/foto2.jpg'
];
```

### 3. Credenciales de Airtable

- **Personal Access Token:** Developer hub → Personal access tokens → Crear con scope `data.records:read`
- **Base ID:** En la URL de tu base: `appXXXXXXXXXXXXXX`

### 4. Configurar WhatsApp

En `js/app.js`:

```javascript
const WHATSAPP_NUMBER = '5215512345678'; // código país + número
```

### 5. Configurar token

En `js/app.js`:

```javascript
const AIRTABLE_TOKEN = 'TU_PERSONAL_ACCESS_TOKEN_AQUI';
const AIRTABLE_BASE_ID = 'TU_BASE_ID_AQUI';
```

### 6. Subir a GitHub Pages

```bash
git clone https://github.com/nombreagente/nombreagente.github.io.git
cd nombreagente.github.io
# Copia los archivos aquí
git add .
git commit -m "Lanaria portafolio"
git push origin main
```

Luego: **Settings → Pages → Source: main branch**

---


## ⚠️ Seguridad

El token de Airtable es visible en el código del navegador pero nadie puede modificar ni borrar productos.
