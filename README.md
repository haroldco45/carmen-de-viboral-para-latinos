# El Carmen de Viboral para Latinos

Guía de supervivencia bilingüe (español / English) para latinos recién llegados a **El Carmen de Viboral, Oriente antioqueño, Colombia**. Hace parte de la serie *para Latinos* de **Vibras Positivas HM** (portada: [latinos-por-el-mundo](https://haroldco45.github.io/latinos-por-el-mundo/)).

App: https://carmen-de-viboral-para-latinos.netlify.app/

## Qué trae

- **Papeles, PPT y visas**: PEP Tutor (hasta el 31 dic 2026) con cuenta regresiva — Medellín es una de las 10 ciudades del trámite —, Visa V, PPT para menores, Check-MIG, licencia y oficinas (Migración Medellín en Belén con cita previa, Cancillería, Personería).
- **Trabajo y salario**: mínimo 2026 ($1.750.905 · con auxilio $2.000.000, Decreto 0159 de 2026), jornada de 42 h, recargos y calculadora. Trabajo en cerámica, flores, turismo y Rionegro.
- **Fiestas de la Loza** (principios de diciembre), Noche de Velitas, novenas, Fiestas del Campesino y Festival de Teatro El Gesto Noble.
- **La loza y los talleres** (Calle de la Cerámica, museo, pintar tu propia pieza en Cerámicas Creare), **El pueblo y el centro** (parque, iglesia, chorizo de punta, Rionegro) y **Ríos y cañones** (río Melcocho con reserva obligatoria en el CAICA, Santo Domingo, Guatapé): secciones propias.
- **Transporte**: Flota El Carmen a Medellín (Terminal del Norte y estación Exposiciones) con tarjeta Cívica, aeropuerto José María Córdova, veredas, ruta al Melcocho.
- **Salud y SOS** (Hospital San Juan de Dios de El Carmen y de Rionegro), **Hablar paisa** (con voz), **Peso y cambio** en vivo, **Lugares, mapa, fotos y videos**, **Clima y festivos**, **Primeros días** y **Vivir aquí**.
- **Hoy en El Carmen**: noticias reales con botón Actualizar, franja que se actualiza sola y enlaces a las demás ciudades de la serie.
- **Videos**: 10 videos reales de El Carmen que se ven dentro de la app, video del día y videos nuevos que trae el robot.

## Robot (GitHub Actions)

`.github/workflows/actualizar.yml` corre cada 30 minutos, al subir cambios y a mano con *Run workflow*:

- `scripts/actualizar.mjs` busca noticias de El Carmen de Viboral y el Oriente en Google Noticias (`data/noticias.json`) y videos recientes en YouTube (`data/videos.json`).
- `og-image.png` es la imagen de vista previa del enlace, con foto real de un plato pintado en Cerámicas Creare. Si se borra `data/og-foto.json`, `scripts/og.py` arma otra con foto de Wikimedia Commons.

`netlify.toml` evita que Netlify publique de nuevo con cada commit del robot.

Sin emojis ni íconos: fotos reales de Wikipedia / Wikimedia Commons y de Cerámicas Creare. Datos revisados el 22 de noviembre de 2026 (hora Colombia).
