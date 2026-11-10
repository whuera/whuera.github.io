# Handoff

## Estado actual (2026-11-10)
- Rediseño **Liquid Glass** estilo maxtrans.mobilpymes.store aplicado a `index.html` + `styles.css`.
- Tema **claro por defecto**; botón luna/sol en la barra superior (`toggleTheme()` en `<head>` de `index.html`), guarda la elección en `localStorage('theme')`.
- Tokens en `styles.css`: `:root` (light) y `:root[data-theme="dark"]`. Usar siempre `var(--ink|--text-color|--muted|--secondary-color|--surface|--hairline)` en vez de colores fijos, incluso en estilos inline.
- Capa "Liquid Glass layer" al final de `styles.css`: vidrio solo en header, sidebar, secciones, modales y footer; las tarjetas internas usan `--surface` plano (sin vidrio sobre vidrio).
- Fallbacks: `prefers-reduced-transparency` (sin blur) y `prefers-reduced-motion`.
- Fondo: grid CSS de cuadrados azules suaves (`body::before`, token `--grid-line`, 96px) sobre manchas de color suaves. Se eliminaron la animación de partículas (canvas) y el plano de arquitectura de fondo.
- Fuente: Plus Jakarta Sans (Google Fonts).
- Preview local: `.claude/launch.json` → `python3 -m http.server 5173`.

- Rendimiento de scroll: NO usar `background-attachment: fixed` ni `perspective`/`rotateX` junto a `backdrop-filter` (causaba parpadeo). Las capas de fondo son `position: fixed` + `transform: translateZ(0)`.
- **Vista única con pestañas tipo macOS** (control segmentado): la página no hace scroll (`html, body { overflow: hidden }`). `buildSectionTabs()` en `index.html` crea un botón por cada `.section` hija directa de `#dynamicContent`, con la etiqueta `data-tab` y el ícono `data-icon`. `showSection(id)` muestra una sola sección; si el contenido es largo, hace scroll dentro del panel. La barra lateral también llama a `showSection`. Para agregar una pestaña nueva: una `<section class="section" id="..." data-tab="..." data-icon="fa-...">` nueva en `loadCvContent()` o en `index_fp.html`.
- Paneles de vidrio esmerilado: `.section` con `blur(24px) saturate(180%)`, `--panel-fill` y un grano SVG (`--grain`). Como las secciones ya no se desplazan bajo el header, no hay vidrio sobre vidrio en movimiento (esa era la causa del parpadeo). Sin hover con movimiento en superficies no clicables.
- Al cambiar `styles.css`, subir la versión en `index.html` (`styles.css?v=...`) para evitar caché.

- Pestaña **Habilitantes** (`#habilitantes` en `loadCvContent()`, también en la barra lateral): lista de documentos para reclutadores. CV → `openDownloadModal()` (mantiene el captcha). ACI e IBM enlazan a los repos públicos `whuera/aci-certificates` e `IBM-certificates`.

## Pendientes
- Habilitantes: Java, GCP, AWS, el Título de Ingeniería y el Título de Data Scientist (IPP Chile), el Diplomado en Cloud Computing (UDLA) y el Diplomado en IA y Data Science (U. de Chile) no tienen archivo (el repo `whuera/certificados` es privado y vacío). Hoy muestran "Bajo solicitud" con un correo ya redactado (mailto). Cuando estén los PDF, súbelos a `resources/` y cambia en cada fila "Solicitar" por un enlace "Ver" y la etiqueta a "Disponible".
- Las páginas de país (`ecuador.html`, `chile.html`, etc., cargadas en iframe del modal) y `metrics.html` mantienen su estilo oscuro propio; no siguen el tema.
- `styles.css` conserva reglas antiguas que la capa nueva sobrescribe; se puede limpiar si se quiere reducir tamaño.
