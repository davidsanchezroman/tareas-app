# 📋 Gestor de Tareas - Full Stack App

Aplicación web full-stack para gestión de tareas con React, Flask y PostgreSQL, completamente containerizada con Docker.

[![Deploy Status](https://img.shields.io/badge/deploy-ready-success)]()
[![Docker](https://img.shields.io/badge/docker-compose-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## 🚀 Demo

- **Frontend (Netlify)**: [Próximamente - Configurar tras deploy]
- **Backend (Render)**: [Próximamente - Configurar tras deploy]

---

## 🎯 Características

- ✅ **CRUD Completo** - Crear, listar, actualizar y eliminar tareas
- ✅ **Toggle de completadas** - Marca tareas como completadas/pendientes
- ✅ **Filtros dinámicos** - Ver todas, pendientes o completadas
- ✅ **Persistencia** - Datos guardados en PostgreSQL
- ✅ **Contador en tiempo real** - Estadísticas de tareas
- ✅ **Fechas relativas** - "Hace 2h", "Hace 3d"
- ✅ **UI moderna** - Diseño responsive con gradientes y animaciones
- ✅ **Docker** - Stack completo containerizado
- ✅ **Validaciones** - UI y backend

---

## 🛠️ Tecnologías

### Frontend
- **React 18** - UI Library
- **CSS3** - Estilos modernos con gradientes y animaciones
- **Fetch API** - Comunicación con backend

### Backend
- **Flask 3.0** - Framework web Python
- **PostgreSQL 15** - Base de datos relacional
- **psycopg2** - Driver PostgreSQL para Python
- **Flask-CORS** - Manejo de CORS
- **Gunicorn** - WSGI server para producción

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación de servicios
- **Render.com** - Deploy del backend y base de datos
- **Netlify** - Deploy del frontend

---

## 📦 Requisitos Previos

Para desarrollo local:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)

Para deploy:
- Cuenta en [Render.com](https://render.com) (gratis)
- Cuenta en [Netlify](https://netlify.com) (gratis)
- Cuenta en [GitHub](https://github.com)

---

## 🚀 Instalación y Uso Local

### 1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd tareas-app
```

### 2. Configurar variables de entorno (opcional en local)

El proyecto ya viene con valores por defecto para desarrollo local, pero puedes personalizar:

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgres://admin:admin123@db:5432/tareas
FLASK_ENV=development
FLASK_DEBUG=True
PORT=8000
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:8000
```

### 3. Iniciar la aplicación con Docker

```bash
docker-compose up -d
```

Esto iniciará 3 servicios:
- **PostgreSQL** (puerto 5432)
- **Backend Flask** (puerto 8000)
- **Frontend React** (puerto 3000)

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/tareas
- **Health Check**: http://localhost:8000/health

### 5. Detener la aplicación

```bash
docker-compose down
```

Para eliminar también los datos de la base de datos:
```bash
docker-compose down -v
```

---

## 📋 Comandos Útiles

### Ver logs de los contenedores
```bash
docker-compose logs -f              # Todos los servicios
docker-compose logs -f frontend     # Solo frontend
docker-compose logs -f backend      # Solo backend
docker-compose logs -f db           # Solo base de datos
```

### Reiniciar servicios
```bash
docker-compose restart frontend
docker-compose restart backend
```

### Reconstruir después de cambios
```bash
docker-compose up --build
```

### Estado de los contenedores
```bash
docker-compose ps
```

---

## 🌐 Deploy en Producción

### Opción Recomendada: Backend en Render + Frontend en Netlify

Esta configuración permite aprovechar los tiers gratuitos y la especialización de cada plataforma.

---

### 📤 Deploy del Backend en Render.com

#### 1. Preparar el repositorio

Asegúrate de que tu código esté en GitHub y que los archivos `.env` **NO** estén commiteados.

```bash
git add .
git commit -m "Preparado para deploy en Render"
git push origin main
```

#### 2. Crear la Base de Datos PostgreSQL en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"PostgreSQL"**
3. Configuración:
   - **Name**: `tareas-db`
   - **Database**: `tareas`
   - **User**: (se genera automáticamente)
   - **Region**: Oregon (o el más cercano)
   - **Plan**: **Free**
4. Click en **"Create Database"**
5. **Guarda la "Internal Database URL"** (la necesitarás)

#### 3. Crear el Web Service (Backend)

1. En Render Dashboard, click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name**: `tareas-backend`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: **Free**

4. **Variables de entorno** (Environment):
   ```
   DATABASE_URL = [Pegar Internal Database URL de paso 2]
   FLASK_ENV = production
   FLASK_DEBUG = False
   FRONTEND_URL = [URL de tu Netlify, ej: https://tu-app.netlify.app]
   ```

5. Click en **"Create Web Service"**

6. Espera a que el deploy termine (5-10 minutos)

7. **Guarda la URL de tu backend**: `https://tareas-backend-xxxx.onrender.com`

#### 4. Verificar el backend

Accede a: `https://tu-backend.onrender.com/health`

Deberías ver:
```json
{
  "status": "healthy",
  "database": "connected",
  "message": "Backend funcionando correctamente"
}
```

---

### 📤 Deploy del Frontend en Netlify

#### 1. Preparar el build

Asegúrate de tener los archivos `netlify.toml` y `frontend/public/_redirects` (ya creados).

#### 2. Conectar con GitHub

1. Ve a [Netlify](https://app.netlify.com/)
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub** y autoriza
4. Selecciona tu repositorio `tareas-app`

#### 3. Configurar el build

Netlify detectará automáticamente la configuración de `netlify.toml`, pero verifica:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/build`

#### 4. Configurar variables de entorno

En la sección **"Site settings"** → **"Environment variables"**, agrega:

```
REACT_APP_API_URL = https://tu-backend.onrender.com
```

⚠️ **MUY IMPORTANTE**: Usa la URL de tu backend de Render (del paso anterior)

#### 5. Deploy

Click en **"Deploy site"**

El deploy tomará 2-3 minutos. Una vez completado, tendrás una URL como:
`https://tu-app-random.netlify.app`

#### 6. Actualizar CORS en Render

Vuelve a Render y actualiza la variable `FRONTEND_URL` con tu URL de Netlify:

```
FRONTEND_URL = https://tu-app-random.netlify.app
```

Esto permitirá que el backend acepte requests desde tu frontend.

#### 7. Verificar la aplicación

Accede a tu URL de Netlify y prueba crear, completar y eliminar tareas.

---

## 📁 Estructura del Proyecto

```
tareas-app/
│
├── docker-compose.yml          # Orquestación de servicios Docker
├── render.yaml                 # Blueprint para Render (opcional)
├── netlify.toml                # Configuración Netlify
├── .gitignore                  # Archivos a ignorar en Git
├── README.md                   # Este archivo
├── DEVELOPMENT.md              # Contexto de desarrollo
│
├── backend/                    # API Flask
│   ├── Dockerfile              # Imagen Docker del backend
│   ├── requirements.txt        # Dependencias Python
│   ├── app.py                  # Aplicación Flask principal
│   ├── .env.example            # Ejemplo de variables de entorno
│   ├── .env                    # Variables locales (no commitear)
│   ├── .dockerignore           # Archivos a ignorar en build
│   └── Procfile                # Config para Render
│
└── frontend/                   # App React
    ├── Dockerfile              # Imagen Docker del frontend
    ├── package.json            # Dependencias Node.js
    ├── .env.example            # Ejemplo de variables de entorno
    ├── .env                    # Variables locales (no commitear)
    ├── .dockerignore           # Archivos a ignorar en build
    ├── public/
    │   ├── index.html          # HTML principal
    │   └── _redirects          # Redirects para SPA en Netlify
    └── src/
        ├── App.js              # Componente principal
        ├── App.css             # Estilos principales
        ├── index.js            # Entry point
        └── index.css           # Estilos globales
```

---

## 🔧 API Endpoints

### Base URL (Local)
```
http://localhost:8000
```

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/tareas` | Listar todas las tareas |
| POST | `/api/tareas` | Crear una nueva tarea |
| PUT | `/api/tareas/:id` | Actualizar una tarea |
| DELETE | `/api/tareas/:id` | Eliminar una tarea |

### Ejemplos

**GET /api/tareas**
```json
[
  {
    "id": 1,
    "titulo": "Estudiar Docker",
    "completada": false,
    "fecha_creacion": "2026-03-05T10:30:00"
  }
]
```

**POST /api/tareas**
```json
{
  "titulo": "Nueva tarea",
  "completada": false
}
```

**PUT /api/tareas/1**
```json
{
  "completada": true
}
```

---

## 🗄️ Base de Datos

### Schema

```sql
CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    completada BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Conexión Local

- **Host**: localhost
- **Puerto**: 5432
- **Usuario**: admin
- **Contraseña**: admin123
- **Base de datos**: tareas

---

## 🐛 Troubleshooting

### El frontend no puede conectarse al backend

1. Verifica que `REACT_APP_API_URL` esté configurado correctamente
2. Revisa la consola del navegador para errores de CORS
3. Confirma que el backend esté funcionando: `curl http://localhost:8000/health`

### Error al iniciar Docker

```bash
# Detener todos los contenedores
docker-compose down

# Limpiar volúmenes
docker-compose down -v

# Reconstruir
docker-compose up --build
```

### El contenedor del frontend se reinicia constantemente

Verifica que el volumen de `node_modules` esté configurado en `docker-compose.yml`:
```yaml
volumes:
  - ./frontend:/app
  - /app/node_modules  # Esta línea es crucial
```

### Render: El backend no se conecta a la base de datos

1. Verifica que la variable `DATABASE_URL` esté configurada en Render
2. Asegúrate de usar la **Internal Database URL** (no la External)
3. Revisa los logs en Render Dashboard

---

## 📝 Próximas Mejoras (v2.0)

- [ ] Sistema de autenticación (JWT)
- [ ] Multi-usuario (asignador + receptores)
- [ ] Fechas de vencimiento
- [ ] Prioridades y etiquetas
- [ ] Búsqueda y ordenamiento
- [ ] Tests automatizados
- [ ] CI/CD con GitHub Actions
- [ ] Dashboard de administrador

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👤 Autor

**Tu Nombre**
- Portfolio: [tu-portfolio.com]
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Nombre](https://linkedin.com/in/tu-perfil)

---

## ⭐ Agradecimientos

- Proyecto creado como parte de mi portafolio de desarrollo full-stack
- Enfoque en demostrar conocimientos de Docker y arquitectura cloud

---

**¿Te gustó el proyecto? ¡Dale una ⭐ en GitHub!**
