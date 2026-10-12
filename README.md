# 🎀 Gran Revelación de Sexo | Estefanía & Carlos 🧸

Invitación web interactiva y moderna para la Gran Revelación de Sexo (Sábado 7 de Noviembre de 2026), desarrollada con **React 19**, **Vite**, **Tailwind CSS v4** y **Lucide Icons**.

---

## ✨ Características Principales

- **🧸 Modal de Bienvenida & Onboarding:** Captura inicial de datos del invitado (Nombre, WhatsApp y Correo) antes de ingresar.
- **⏳ Cuenta Regresiva en Tiempo Real:** Días, horas, minutos y segundos exactos hasta el Sábado 7 de Noviembre.
- **🎯 Juego Interactivo "¿Cuál es tu intuición?":**
  - Votación dinámica entre **Team Niño 👦** y **Team Niña 👧** con adorables ilustraciones vectoriales de ositos Teddy Bear.
  - Porcentajes y total de votos calculados en vivo.
  - Efectos de confeti festivo con física realista (`canvas-confetti`).
- **🗺️ Detalles del Evento & Mapa Interactivo:**
  - Integración de mapa interactivo con coordenadas reales.
  - Botones directos con 1 clic para abrir la ruta en **Google Maps** o iniciar navegación en **Waze**.
  - Botón para copiar coordenadas/dirección al portapapeles.
  - Botón para agendar en **Google Calendar**.
- **📝 Formulario RSVP Inteligente:**
  - Datos del invitado precargados automáticamente.
  - Selector de asistencia (Sí / No).
  - Cantidad de adultos y niños.
  - **Campos dinámicos de acompañantes:** Botón para agregar y quitar acompañantes con nombre individual.
  - Restricciones alimentarias / alergias.
  - Mensaje o dedicatoria para Estefanía, Carlos y el bebé.
- **📲 Envío Directo a WhatsApp:** Generación de un Pase Digital y envío de un mensaje formateado con todo el detalle de la confirmación directamente al WhatsApp de los padres.
- **💌 Muro de Recuerdos Público:** Espacio visual donde se muestran los mensajes de cariño dejados por los invitados.
- **👑 Panel de Papás (Administración):** Métricas en tiempo real de confirmaciones, votos y botón para exportar la lista completa a **Excel (CSV con UTF-8 BOM)**.
- **🎵 Música Ambiental Relajante:** Reproductor de caja musical sintetizada con Web Audio API (100% libre de enlaces externos o cortes).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** [React 19](https://react.dev/)
- **Empaquetador & Dev Server:** [Vite 8](https://vite.dev/)
- **Estilos & Animaciones:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Efectos de Partículas:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Persistencia:** Local-First (`storageService`) + Preparado para Cloud Sync (Google Sheets / Supabase)

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/CarlosL-Code/invitaciones.git
   cd invitaciones
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## ⚙️ Configuración del Evento

Todos los datos (nombres, fechas, teléfono de WhatsApp, coordenadas y textos) se configuran en un único archivo:
👉 [`src/config/eventConfig.js`](src/config/eventConfig.js)

---

Con amor para la familia de Estefanía & Carlos 💕
