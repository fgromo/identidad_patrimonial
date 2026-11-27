# Identidad patrimonial · AV1003B

Sitio estático (HTML, CSS y JS, sin instalación) para los cuatro campus: Chihuahua, Cuernavaca, Hidalgo y Laguna.
Diseño: crema y negro cálido, tipografías Archivo (extendida) y Barlow, cursor propio, imagen que sigue al cursor sobre los nombres, texto que se desplaza con el scroll y reproductor con forma de onda real. Los colores por campus (`tone`) están en `data/projects.json`.
El nombre "Identidad patrimonial" es provisional: cámbialo en `data/projects.json` (`site.name`).

## Publicar en GitHub Pages
1. Crea una cuenta en github.com (conviene un correo de proyecto, no personal).
2. New repository → nombre, por ejemplo, `identidad-patrimonial` → Public → Create.
3. "uploading an existing file": arrastra el CONTENIDO de esta carpeta (incluye `.nojekyll`) → Commit.
4. Settings → Pages → Source: "Deploy from a branch" → Branch: `main`, carpeta `/ (root)` → Save.
5. En un minuto el sitio queda en `https://TU-USUARIO.github.io/identidad-patrimonial/`.

Nota: el repositorio gratuito es público. El sitio trae `noindex` y `robots.txt` para que no aparezca en buscadores, pero cualquiera con el enlace puede verlo. Antes de publicar voces o rostros, confirma el consentimiento de los estudiantes y la política institucional.

## Agregar un proyecto
1. Crea la carpeta `media/<campus>/<slug-del-proyecto>/` y sube ahí el audio (mp3; conserva el máster en WAV aparte) y las fotos (JPG de 1600 a 2000 px en el lado mayor). Nombres consistentes, por ejemplo `01_lugar_autor.jpg` y `01_audio_autor.mp3`.
2. En `data/projects.json`, dentro de `projects`, copia el bloque del proyecto de muestra y edítalo:
   - `campus`: `hidalgo`, `cuernavaca`, `laguna` o `chihuahua`
   - `slug`: nombre corto sin espacios ni acentos
   - `title`, `author`, `kind`
   - `text`: lista de párrafos
   - `images`: `[{"src":"media/hidalgo/mi-proyecto/foto1.jpg","alt":"Descripción","caption":"Pie de foto"}]`
   - `audio`: `"media/hidalgo/mi-proyecto/audio.mp3"`
3. Cuida las comas del JSON. Valida en jsonlint.com si algo no carga.
4. Borra el proyecto de muestra cuando ya haya reales.

## Que cada campus edite lo suyo
En GitHub: Settings → Collaborators → invita a un responsable por campus (cuenta propia). Cada quien edita solo su carpeta `media/<campus>/` y su bloque en `projects.json`. Más adelante se puede añadir un panel de edición (Decap CMS) para no tocar JSON.

## Probar en tu computadora
`python3 -m http.server` dentro de la carpeta y abrir http://localhost:8000
