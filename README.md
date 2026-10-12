# Speak Up

Aplicacion para practicar ingles

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
- Muestra el significado en espanol de cada verbo y, con el boton "Ver en español", la traduccion de cada oracion (conjugada segun sujeto y tiempo, con "vos").
- Modo "Completar oraciones": muestra una oracion de la guia (sujeto, tiempo y tipo al azar) con el verbo oculto para escribirlo, con puntaje y audio al corregir.
- Seccion de frases habituales para 17 situaciones (restaurante, aeropuerto, hotel, supermercado, medico, emergencias, charla casual y mas), con traduccion, audio y un dialogo de ejemplo.
- Practica de pronunciacion con microfono: boton "Decir" en la tarjeta, en cada oracion de la guia y en cada frase habitual, y ejercicio "Decir la frase". Compara lo que entendio el reconocimiento de voz con la frase, palabra por palabra, y marca en rojo las que no se entendieron.
- Practica de frases habituales: armar la frase en ingles ordenando palabras a partir del espanol, o escuchar la frase y elegir su traduccion. Por lugar o con todos mezclados.
- Tiene modo oscuro: sigue al sistema o se elige a mano (automatico / oscuro / claro).
- Incluye una guia de formatos de oracion para el verbo activo: afirmar, negar, preguntar, responder y preguntar con Wh-, en presente, pasado, presente perfecto, futuro, presente continuo y con modales, eligiendo el sujeto (I, you, he, she, we, they).
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

La pronunciacion usa Piper (ver "Voz HD con Piper"). Si no esta disponible, se usa `speechSynthesis` del navegador en `en-US`.

## Voz HD con Piper

- **Verbos:** los audios de cada verbo (normal y lento) estan pregrabados con [Piper](https://github.com/OHF-Voice/piper1-gpl) en `public/audio/verbs`, con la voz `en_US-lessac-medium`.
- **Frases:** se generan en el navegador con `@mintplex-labs/piper-tts-web`. La voz (unos 63 MB) se descarga una sola vez y queda guardada en el navegador. Mientras se descarga, o si falla, se usa la voz del navegador (`speechSynthesis`), eligiendo la mas natural disponible.
- `onnxruntime-web` esta fijado en `1.18.0` porque la libreria carga los `.wasm` de esa version desde el CDN.

Para regenerar los audios de los verbos (por ejemplo si cambia `app/data.ts`), hace falta Python y ffmpeg:

```bash
python -m venv .piper/venv
.piper/venv/Scripts/python -m pip install piper-tts
.piper/venv/Scripts/python -m piper.download_voices --data-dir .piper/voices en_US-lessac-medium
.piper/venv/Scripts/python scripts/generate_audio.py
```

## PWA

La app se puede instalar en el celular o la PC ("Agregar a pantalla de inicio" / "Instalar app"). El service worker (`public/sw.js`) guarda la app y los 204 audios de verbos para usarla sin conexion. Si la voz HD ya se descargo, las frases tambien funcionan offline.

Si se cambia `public/sw.js`, subir la version de `CACHE` para que los navegadores tomen la nueva.

## Reconocimiento de voz

La practica con microfono usa `SpeechRecognition` o `webkitSpeechRecognition`, segun disponibilidad del navegador.

Notas:

- Funciona mejor en Google Chrome.
- Puede no estar disponible en todos los navegadores.
- Si no esta disponible, la app sigue funcionando con escucha, tarjetas y quiz escrito.

La comparacion (`app/pronunciation.ts`) ignora mayusculas y puntuacion, acepta contracciones (`I'm` = `I am`) y numeros escritos con cifras (`2` = `two`, `$24` = `twenty-four dollars`), y entre las transcripciones posibles elige la que mejor coincide.

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
  grammar.ts     Generador de oraciones por tiempo verbal y sujeto
  spanish.ts     Traduccion y conjugacion en espanol de las oraciones
  cloze.ts       Arma los ejercicios de completar oraciones
  phrases.ts     Frases habituales por lugar (restaurante, aeropuerto, medico, etc.)
  speech.ts      Reconocimiento de voz del navegador
  pronunciation.ts  Comparacion palabra por palabra de lo dicho con la frase
  speak-check.tsx   Boton "Decir" y resultado de pronunciacion
  tts.ts         Audio: mp3 de Piper, Piper en el navegador y voz del navegador
  theme-toggle.tsx  Selector de tema claro / oscuro
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
