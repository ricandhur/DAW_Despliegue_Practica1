# API REST - Gestión de Eventos y Entradas

API REST desarrollada con **Node.js**, **Express** y **Mongoose** para gestionar eventos, sus entradas y los recintos donde se celebran.

> Práctica 1 - Despliegue de Aplicaciones Web (DAW 2)

## Despliegue

| Servicio | URL |
|----------|-----|
| Aplicación | [daw-despliegue-practica1.onrender.com](https://daw-despliegue-practica1.onrender.com) |
| Base de datos | MongoDB Atlas |

## Estructura del proyecto

```
├── index.js              # Servidor principal
├── .env                  # Variables de entorno (puerto + URL BD)
├── package.json
├── seed.js               # Script para rellenar la BD con datos de prueba
├── models/
│   ├── evento.js         # Esquema de eventos + subdocumento de entradas
│   └── recinto.js        # Esquema de recintos
└── routes/
    ├── eventos.js        # Endpoints de eventos y entradas
    └── recintos.js       # Endpoints de recintos
```

## Tecnologías

- **Node.js** + **Express** - Servidor y enrutamiento
- **Mongoose** - ODM para MongoDB
- **dotenv** - Variables de entorno
- **MongoDB Atlas** - Base de datos en la nube
- **Render** - Despliegue

## Endpoints

### Recintos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/recintos` | Obtener todos los recintos |
| GET | `/recintos/:id` | Obtener un recinto por ID |
| GET | `/recintos/localidad/:nombre` | Obtener recintos por localidad |
| POST | `/recintos` | Crear un nuevo recinto |
| DELETE | `/recintos/:id` | Eliminar un recinto |

### Eventos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/eventos` | Obtener todos los eventos (con populate) |
| GET | `/eventos/:id` | Obtener un evento por ID |
| GET | `/eventos/localidad/:nombre` | Obtener eventos futuros por localidad |
| POST | `/eventos` | Crear un nuevo evento |
| PUT | `/eventos/:id` | Actualizar un evento |
| DELETE | `/eventos/:id` | Eliminar un evento |

### Entradas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/eventos/entradas/:idEvento/:tipoEntrada` | Obtener precio y disponibles |
| PUT | `/eventos/entradas/:idEvento/:tipoEntrada/:cantidad` | Restar entradas disponibles |

## Instalación y uso en local

```bash
# Clonar el repositorio
git clone https://github.com/ricandhur/DAW_Despliegue_Practica1.git

# Instalar dependencias
npm install

# Configurar variables de entorno en .env
PUERTO=8080
URL_BD=mongodb+srv://usuario:password@cluster.mongodb.net/eventos

# Rellenar la base de datos con datos de prueba
npm run seed

# Arrancar el servidor
npm start
```

## Capturas de pantalla

### GET todos los recintos
![GET recintos](capturas%20pantalla%20puerbas%20ECHOPI%20-%20VS%20code/Prueba_GET_todos_los_recintos.jpg)

### POST crear evento
![POST evento](capturas%20pantalla%20puerbas%20ECHOPI%20-%20VS%20code/Prueba_POST_crear_evento.jpg)

### DELETE eliminar evento
![DELETE evento](capturas%20pantalla%20puerbas%20ECHOPI%20-%20VS%20code/Prueba_DELETE_eliminar_evento.jpg)

### PUT restar entradas (error 404)
![PUT entradas error](capturas%20pantalla%20puerbas%20ECHOPI%20-%20VS%20code/Prueba_PUT_restar_entradas_error404.jpg)
