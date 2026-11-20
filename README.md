# Interfaz web para sensores Arduino/ESP32

Panel en **Angular 20** (con renderizado en servidor) para ver los datos y controlar los actuadores de un montaje con ESP32. Funciona junto con el repositorio [`Sensores`](https://github.com/tigonoby/Sensores), que contiene el sketch del microcontrolador.

## Contenido

- `src/app/pages` — página principal del panel.
- `src/app/services` — servicio de control de LED.
- `src/app/interfaces` — tipos de los datos.

## Stack

Angular 20 · Angular SSR · Express · Bootstrap / Bootstrap Icons · TypeScript

## Ejecución

```bash
npm install
npm start                      # desarrollo en http://localhost:4200
npm run build && npm run serve:ssr:interfaz-arduino   # servidor SSR
```
