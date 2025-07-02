# FENIFISC registration system

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/marcasnts-projects/v0-fenifisc-registration-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/reQzDkp14D9)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/marcasnts-projects/v0-fenifisc-registration-system](https://vercel.com/marcasnts-projects/v0-fenifisc-registration-system)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/reQzDkp14D9](https://v0.dev/chat/projects/reQzDkp14D9)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Guía rápida para desarrolladores

### Estructura del proyecto
- `app/` — Páginas, rutas y lógica principal (incluye el wizard de registro en `register/`)
- `components/` — Componentes reutilizables de UI
- `hooks/` — Hooks personalizados
- `lib/` — Lógica auxiliar y modelos
- `public/` — Recursos estáticos
- `styles/` — Estilos globales
- `app/api/` — Endpoints API (competencias, atletas, login admin, etc)

### Flujo del registro (wizard)
1. **Información personal**: nombre, apellido, email, teléfono, cédula, dirección
2. **Subida de documentos**: fotos de cédula (frente y reverso)
3. **Selección de categoría**: categorías oficiales FENIFISC/IFBB
4. **Selección de competencia**: competencias disponibles
5. **Revisión y confirmación**: resumen y envío

### Principales endpoints/API
- `/api/competitions` — Obtener competencias
- `/api/athletes` — Registrar atleta
- `/api/admin-login` — Login de administrador
- `/api/notify-admin-new-athlete` — Notificar nuevo registro

### Cómo ejecutar localmente
1. Clona el repositorio
2. Instala dependencias: `npm install` o `pnpm install`
3. Ejecuta en desarrollo: `npm run dev` o `pnpm dev`
4. Accede a `http://localhost:3000`

### Buenas prácticas
- Mantén los componentes y hooks reutilizables en sus carpetas
- Usa validaciones tanto en frontend como en backend
- Documenta endpoints y flujos clave
- Usa variables de entorno para datos sensibles
- Realiza pruebas antes de desplegar
