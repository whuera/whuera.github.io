# Handoff

## Estado actual (2026-11-12)
- Rediseño **Liquid Glass** estilo maxtrans.mobilpymes.store aplicado a `index.html` + `styles.css`.
- **Sin header ni barra lateral** (diseño mínimo): un solo menú tipo píldora (`.seg-control`, construido por `buildSectionTabs()` en `#segSlot`) con todas las secciones, un separador, el botón destacado **Entrevístame** (abre `openAssistantModal()`) y el botón de tema. El CV se descarga desde Habilitantes.
- **Portafolio** es una pestaña más (`#portfolio`, entre Certificaciones y Habilitantes). `loadPortfolioContent()` carga `index_fp.html` dentro de esa pestaña; el mapa se dibuja al abrirla. Ya no existen las pestañas superiores CV/Portfolio ni la barra lateral.
- Tema **claro por defecto**; botón luna/sol al final del menú píldora (`toggleTheme()` en `<head>` de `index.html`), guarda la elección en `localStorage('theme')`.
- Tokens en `styles.css`: `:root` (light) y `:root[data-theme="dark"]`. Usar siempre `var(--ink|--text-color|--muted|--secondary-color|--surface|--hairline)` en vez de colores fijos, incluso en estilos inline.
- Capa "Liquid Glass layer" al final de `styles.css`: vidrio en el menú píldora, secciones, modales y footer; las tarjetas internas usan `--surface` plano (sin vidrio sobre vidrio).
- Fallbacks: `prefers-reduced-transparency` (sin blur) y `prefers-reduced-motion`.
- Fondo: grid CSS de cuadrados azules suaves (`body::before`, token `--grid-line`, 96px) sobre manchas de color suaves. Se eliminaron la animación de partículas (canvas) y el plano de arquitectura de fondo.
- Fuente: Plus Jakarta Sans (Google Fonts).
- Preview local: `.claude/launch.json` → `python3 -m http.server 5173`.

- Rendimiento de scroll: NO usar `background-attachment: fixed` ni `perspective`/`rotateX` junto a `backdrop-filter` (causaba parpadeo). Las capas de fondo son `position: fixed` + `transform: translateZ(0)`.
- **Vista única con pestañas tipo macOS** (control segmentado): la página no hace scroll (`html, body { overflow: hidden }`). `buildSectionTabs()` en `index.html` crea un botón por cada `.section` hija directa de `#dynamicContent`, con la etiqueta `data-tab` y el ícono `data-icon`. `showSection(id)` muestra una sola sección; si el contenido es largo, hace scroll dentro del panel. Para agregar una pestaña nueva: una `<section class="section" id="..." data-tab="..." data-icon="fa-...">` nueva en `loadCvContent()`.
- Paneles de vidrio esmerilado: `.section` con `blur(24px) saturate(180%)`, `--panel-fill` y un grano SVG (`--grain`). Como las secciones ya no se desplazan bajo el header, no hay vidrio sobre vidrio en movimiento (esa era la causa del parpadeo). Sin hover con movimiento en superficies no clicables.
- Al cambiar `styles.css`, subir la versión en `index.html` (`styles.css?v=...`) para evitar caché.

- Pestaña **Habilitantes** (`#habilitantes` en `loadCvContent()`): lista de documentos para reclutadores. CV → `openDownloadModal()` (mantiene el captcha). ACI e IBM enlazan a los repos públicos `whuera/aci-certificates` e `IBM-certificates`.

- Modal **Implementaciones IA** (`#iaModal`): Proyecto 1 ProFinance (detección de fraude) y Proyecto 2 **Orbix** (centro de control de drones con ML; captura en `images/orbix-centro-control.webp`; enlaces a https://orbix.mobilpymes.store/ y a la publicación de LinkedIn https://lnkd.in/p/dm8EMcjy)) y Proyecto 3 **Dronex** (servicios con drones y ML; captura en `images/dronex-landing.webp`; https://dronex-kappa.vercel.app).

- Modal **Implementaciones Transaccionales** (`#txModal`, `openTxModal()`), con su botón "Implementaciones" en la tarjeta Arquitecto Transaccional (pestaña Perfil). Proyecto 1 **ATM Simulator Platform** (https://atm-simulator-alpha.vercel.app/, captura `images/atm-simulator.webp`) y Proyecto 2 **BASE24-eps Simulator** (https://base24-eps-simulator.vercel.app/, captura `images/base24-eps-simulator.webp`). Reutiliza las clases `.ia-project-head` e `.ia-impl-*` del modal IA.
- Modal **Implementaciones de Arquitectura de Soluciones** (`#solModal`, `openSolModal()`), con su botón "Implementaciones" en la tarjeta Arquitecto de Soluciones. Proyecto 1 **Mobilpymes Store** (https://www.mobilpymes.store, captura `images/mobilpymes-store.webp`) y Proyecto 2 **ProFinance** (https://pro-bank-five.vercel.app/#features, captura `images/profinance-banca.webp`). Cuenta el ecosistema: la tienda paga con Pay Direct (ProFinance) y consume el CRM Backend.
- Modal **Entrevístame** (`#assistantModal`, `openAssistantModal(paneId)`), usado por todos los botones Entrevístame, con dos pestañas: **Agendar reunión** (por defecto; Google Calendar embebido con la URL de inserción `calendar.google.com/calendar/appointments/schedules/…?gv=true` más un botón al enlace corto https://calendar.app.google/XAxKpgkTgd7bmVFv6) y **Entrevista virtual (IA)** (el iframe `mobilpymes.cl/interview` de siempre). Cada iframe se carga la primera vez que se abre su pestaña, y al cerrar se liberan los dos (`INTERVIEW_FRAMES`). Ojo: el enlace corto bloquea iframes (X-Frame-Options); para embeber hay que usar la URL `/calendar/appointments/schedules/...?gv=true`.
- La "×" de los modales es `position: absolute` explícito (la capa de vidrio pone `position: relative` a los hijos de `.modal-content.glass-card`).

## Pendientes
- Habilitantes: Java, GCP, AWS, el Título de Ingeniería y el Título de Data Scientist (IPP Chile), el Diplomado en Cloud Computing (UDLA) y el Diplomado en IA y Data Science (U. de Chile) no tienen archivo (el repo `whuera/certificados` es privado y vacío). Hoy muestran "Bajo solicitud" con un correo ya redactado (mailto). Cuando estén los PDF, súbelos a `resources/` y cambia en cada fila "Solicitar" por un enlace "Ver" y la etiqueta a "Disponible".
- Los dos simuladores transaccionales piden inicio de sesión: un reclutador solo verá la pantalla de login. El de BASE24-eps es de acceso restringido.
- Las páginas de país (`ecuador.html`, `chile.html`, etc., cargadas en iframe del modal) y `metrics.html` mantienen su estilo oscuro propio; no siguen el tema.
- `styles.css` conserva reglas antiguas que la capa nueva sobrescribe; se puede limpiar si se quiere reducir tamaño.
