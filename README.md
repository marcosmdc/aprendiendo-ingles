# Aplicacion para practicar ingles

Aplicacion web sencilla hecha con Next.js para aprender y practicar la pronunciacion de verbos irregulares en ingles. Los datos fueron cargados desde el archivo `plan_verbos_irregulares.xlsx`, especificamente desde la hoja `Verbos`.

## Objetivo

La aplicacion permite estudiar verbos irregulares en grupos semanales, escuchar su pronunciacion, repetir frases de ejemplo y comprobar si se recuerdan correctamente las formas de pasado simple y participio.

## Funcionalidades

- Muestra 102 verbos irregulares extraidos del Excel original.
- Organiza los verbos por semana de estudio.
- Agrupa los verbos por patron de aprendizaje, por ejemplo `Sin cambios`, `-ought / -aught`, `Participio en -en` y `Repaso mixto`.
- Permite filtrar por semana.
- Permite filtrar por patron.
- Permite buscar verbos por base form, past simple o past participle.
- Incluye modo de tarjetas para estudiar cada verbo.
- Incluye modo mini quiz para completar el pasado simple y el participio.
- Reproduce la pronunciacion del verbo usando la API nativa del navegador `speechSynthesis`.
- Reproduce frases de ejemplo para practicar pronunciacion en contexto.
- Incluye una opcion de pronunciacion lenta para escuchar con mas claridad.
- Permite practicar con microfono si el navegador soporta `SpeechRecognition` o `webkitSpeechRecognition`.
- Guarda en el navegador los verbos marcados como dominados usando `localStorage`.
- No requiere login, usuarios ni base de datos.
- Esta preparada para subirse a GitHub y desplegarse en Vercel.

## Modos de practica

### Tarjetas

En este modo se muestra un verbo activo con sus tres formas principales:

```text
base form / past simple / past participle
```

Desde la tarjeta se puede:

- Escuchar el verbo completo.
- Escuchar una frase de ejemplo.
- Escuchar el verbo lentamente.
- Practicar con el microfono.
- Marcar el verbo como dominado.
- Pasar a la siguiente tarjeta.

### Mini quiz

En este modo la aplicacion muestra el verbo en base form y pide completar:

- Past simple.
- Past participle.

Al presionar `Corregir`, la aplicacion indica si la respuesta es correcta o muestra la respuesta esperada.

Para verbos con respuestas alternativas separadas por `/`, como `burnt/burned`, acepta cualquiera de las opciones.

## Pronunciacion

La pronunciacion se implementa con `speechSynthesis`, una API nativa del navegador. No se usa una libreria externa ni servicios pagos.

Configuracion usada:

- Idioma: `en-US`.
- Velocidad normal: `0.9`.
- Velocidad lenta: `0.72`.

La calidad de la voz depende del navegador y del sistema operativo.

## Reconocimiento de voz

La practica con microfono usa `SpeechRecognition` o `webkitSpeechRecognition`, segun disponibilidad del navegador.

Notas:

- Funciona mejor en Google Chrome.
- Puede no estar disponible en todos los navegadores.
- Si no esta disponible, la app sigue funcionando con escucha, tarjetas y quiz escrito.

## Persistencia local

Los verbos marcados como dominados se guardan en `localStorage` con la clave `known-verbs`.

Esto significa que:

- No se necesita backend.
- La informacion queda guardada solo en el navegador del usuario.
- Si se borra el almacenamiento del navegador, se pierde el progreso local.

## Estructura principal

```text
app/
  data.ts        Datos de los verbos extraidos del Excel
  globals.css    Estilos globales de la interfaz
  layout.tsx     Layout principal y metadata
  page.tsx       Pantalla principal y logica de practica
package.json     Scripts y dependencias del proyecto
next.config.mjs  Configuracion de Next.js
```

## Comandos

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Compilar para produccion:

```bash
npm run build
```

Ejecutar build de produccion localmente:

```bash
npm run start
```

## Despliegue en Vercel

La aplicacion no requiere variables de entorno ni servicios externos.

Pasos generales:

1. Subir el proyecto a GitHub.
2. Importar el repositorio desde Vercel.
3. Usar la configuracion automatica de Next.js.
4. Desplegar.

## Consideraciones

- La app usa renderizado estatico para la ruta principal.
- No hay autenticacion.
- No hay base de datos.
- Los datos actuales estan embebidos en `app/data.ts`.
- Si el Excel cambia, se debe actualizar `app/data.ts` con los nuevos verbos.
