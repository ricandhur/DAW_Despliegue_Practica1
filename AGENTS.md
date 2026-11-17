# Requisitos de arquitectura y estilo para la API REST de Eventos

## 1. Descripción del proyecto

Desarrollar una API REST con Node.js, Express y Mongoose para gestionar eventos, sus entradas y los recintos donde se celebran. La base de datos MongoDB se llamará `eventos`.

## 2. Estructura obligatoria

Mantener la estructura de carpetas trabajada en clase:

- `models/`: esquemas y modelos de Mongoose.
- `routes/`: enrutadores Express, organizados por modelo.
- `index.js`: conexión a la base de datos, configuración del servidor y montaje de rutas.
- `.env`: configuración del puerto y URL de conexión a MongoDB, como mínimo.

No crear carpetas alternativas como `controllers/`. Mantener el código fuente dentro de la estructura indicada.

## 3. Esquemas y modelos

### `models/evento.js`

Definir y exportar el modelo `eventos` con estos campos:

- `nombre`: texto obligatorio con longitud mínima de 5 caracteres.
- `fecha`: fecha obligatoria.
- `entradas`: array de subdocumentos con:
  - `tipo`: texto obligatorio con longitud mínima de 3 caracteres.
  - `precio`: número obligatorio, mínimo `0`.
  - `disponibles`: número entero obligatorio, mínimo `0`.
- `recinto`: referencia obligatoria al ID de un documento del modelo `recintos`.

Definir el esquema de entradas como subdocumento del esquema de evento.

### `models/recinto.js`

Definir y exportar el modelo `recintos` con estos campos:

- `nombre`: texto obligatorio con longitud mínima de 5 caracteres.
- `direccion`: texto obligatorio con longitud mínima de 10 caracteres.
- `localidad`: texto obligatorio con longitud mínima de 3 caracteres.
- `aforoMaximo`: número opcional.

Respetar exactamente los nombres y las mayúsculas/minúsculas de todos los campos.

## 4. Estilo de código y respuestas

- Usar una sola convención de módulos en todo el proyecto: CommonJS (`require`) o ES Modules (`import`). No mezclar ambas.
- Mantener un estilo asíncrono homogéneo en todos los endpoints; si se usa `async/await`, usarlo en todos.
- Manejar los errores de las operaciones y devolver los códigos y mensajes especificados en cada endpoint.
- Todas las respuestas JSON deben incluir `ok`: `true` cuando la petición se atienda correctamente y `false` ante errores 400 o 500. Incluir también el campo `resultado` en respuestas satisfactorias y `error` en respuestas de error, según lo especificado para cada ruta.
- En las rutas con `:id` o parámetros similares, incluir el valor recibido en el mensaje de error cuando así se indique.
- Montar los enrutadores en las rutas base `/recintos` y `/eventos`. Declarar las rutas más específicas antes de rutas dinámicas que puedan capturarlas.

## 5. Endpoints de recintos (`routes/recintos.js`)

- `GET /recintos`: si hay recintos, responder `200` con `{ ok: true, resultado: [...] }`. Si no hay ninguno o falla la consulta, responder `500` con `{ ok: false, error: "No se han encontrado recintos" }`.
- `GET /recintos/:id`: si existe, responder `200` con `{ ok: true, resultado: recinto }`. Si no existe o falla la consulta, responder `404` con `{ ok: false, error: "Recinto X no encontrado" }`, donde `X` es el ID recibido.
- `GET /recintos/localidad/:nombre`: si hay resultados, responder `200` con `{ ok: true, resultado: [...] }`. Si no hay ninguno o falla la consulta, responder `404` con `{ ok: false, error: "No se han encontrado recintos de la localidad indicada" }`.
- `POST /recintos`: crear el recinto con el JSON del cuerpo. Responder `201` con `{ ok: true, resultado: recintoCreado }`; ante un error, `500` con `{ ok: false, error: "Error añadiendo recinto" }`.
- `DELETE /recintos/:id`: si se elimina, responder `200` con `{ ok: true, resultado: recintoEliminado }`. Si no existe o falla la operación, responder `404` con `{ ok: false, error: "Error eliminando recinto X" }`.

## 6. Endpoints de eventos (`routes/eventos.js`)

- `GET /eventos`: devolver todos los eventos con la información del recinto y las entradas. Usar `populate` para resolver el recinto. Si hay resultados, responder `200` con `{ ok: true, resultado: [...] }`. Si no hay eventos o falla la consulta, responder `500` con `{ ok: false, error: "No se han encontrado eventos" }`.
- `GET /eventos/:id`: si existe, responder `200` con `{ ok: true, resultado: evento }`. Si no existe o falla la consulta, responder `404` con `{ ok: false, error: "Evento X no encontrado" }`, donde `X` es el ID recibido.
- `GET /eventos/localidad/:nombre`: obtener eventos del recinto de esa localidad cuya fecha aún no haya pasado. Si hay resultados, responder `200` con `{ ok: true, resultado: [...] }`; si no hay ninguno o falla la consulta, responder `404` con `{ ok: false, error: "No se han encontrado eventos" }`.
- `POST /eventos`: crear el evento con el JSON del cuerpo. Responder `201` con `{ ok: true, resultado: eventoCreado }`; ante un error, `500` con `{ ok: false, error: "Error añadiendo evento" }`.
- `PUT /eventos/:id`: actualizar el evento. Responder `200` con `{ ok: true, resultado: eventoActualizado }`; si no existe o falla la operación, responder `404` con `{ ok: false, error: "Error actualizando evento X" }`.
- `DELETE /eventos/:id`: eliminar el evento. Responder `200` con `{ ok: true, resultado: eventoEliminado }`; si no existe o falla la operación, responder `404` con `{ ok: false, error: "Error eliminando evento X" }`.

## 7. Endpoints de entradas

Definirlos en `routes/eventos.js`:

- `GET /eventos/entradas/:idEvento/:tipoEntrada`: buscar el tipo de entrada indicado para el evento. Si existe, responder `200` con `{ ok: true, resultado: { precio, disponibles } }`. Si no existe o falla la consulta, responder `404` con `{ ok: false, error: "Error obteniendo datos de entrada para evento X" }`, donde `X` es el ID del evento.
- `PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad`: restar `cantidad` a las entradas disponibles de ese tipo y evento. Solo completar la operación si hay suficientes entradas. Si se actualiza, responder `200` con `{ ok: true, resultado: eventoActualizado }`; si no se puede actualizar, responder `404` con `{ ok: false, error: "Error actualizando entradas del evento X" }`, donde `X` es el ID del evento.

## 8. Servidor principal y despliegue

`index.js` debe cargar las dependencias, conectar con MongoDB mediante la URL configurada en `.env`, habilitar Express y el middleware JSON, montar los enrutadores y arrancar el servidor en el puerto configurado.

La aplicación debe poder desplegarse en Render y conectarse a MongoDB Atlas. En el entorno desplegado se deben conservar las mismas rutas que en local. La entrega debe incluir la URL pública de Render; el proyecto comprimido o su URL de GitHub debe excluir `node_modules`.
