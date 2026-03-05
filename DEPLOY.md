# 🚀 Guía Rápida de Deploy

Esta es una guía condensada para deploy rápido. Para más detalles, ver [README.md](README.md).

---

## ✅ Pre-requisitos

- [ ] Código en GitHub
- [ ] Cuenta en [Render.com](https://render.com)
- [ ] Cuenta en [Netlify](https://netlify.com)
- [ ] Archivos `.env` NO commiteados

---

## 📤 Paso 1: Deploy Backend en Render

### 1.1 Crear PostgreSQL Database

1. Ir a Render Dashboard → **New +** → **PostgreSQL**
2. Configurar:
   - Name: `tareas-db`
   - Database: `tareas`
   - Region: Oregon
   - Plan: **Free**
3. **Copiar la "Internal Database URL"**

### 1.2 Crear Web Service

1. Render Dashboard → **New +** → **Web Service**
2. Conectar repositorio GitHub
3. Configurar:
   - Name: `tareas-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Plan: **Free**

4. **Environment Variables**:
   ```
   DATABASE_URL = [Pegar Internal URL del paso 1.1]
   FLASK_ENV = production
   FLASK_DEBUG = False
   FRONTEND_URL = [Dejar vacío por ahora, completar después]
   ```

5. Deploy → Esperar 5-10 minutos

6. **Guardar URL**: `https://tareas-backend-xxxx.onrender.com`

7. Verificar: `https://tareas-backend-xxxx.onrender.com/health`

---

## 📤 Paso 2: Deploy Frontend en Netlify

### 2.1 Conectar Repositorio

1. Netlify Dashboard → **Add new site** → **Import from Git**
2. Seleccionar repositorio GitHub `tareas-app`

### 2.2 Configurar Build

Auto-detectado por `netlify.toml`, verificar:
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/build`

### 2.3 Environment Variables

En **Site settings** → **Environment variables**:
```
REACT_APP_API_URL = https://tareas-backend-xxxx.onrender.com
```
(Usar la URL del Paso 1.2)

### 2.4 Deploy

Click **Deploy site** → Esperar 2-3 minutos

**Guardar URL**: `https://tu-app-xxxx.netlify.app`

---

## 🔄 Paso 3: Actualizar CORS

Volver a Render → Backend → Environment:

Actualizar variable:
```
FRONTEND_URL = https://tu-app-xxxx.netlify.app
```

Render redesplegará automáticamente (2-3 minutos).

---

## ✅ Paso 4: Verificar

1. Ir a tu URL de Netlify
2. Crear algunas tareas
3. Marcar como completadas
4. Eliminar tareas
5. Recargar página (verificar persistencia)

---

## 📝 Checklist Final

- [ ] Backend responde en `/health`
- [ ] Frontend carga correctamente
- [ ] Se pueden crear tareas
- [ ] Se pueden completar tareas
- [ ] Se pueden eliminar tareas
- [ ] Los datos persisten al recargar
- [ ] No hay errores de CORS en consola

---

## 🐛 Problemas Comunes

### Error de CORS
→ Verifica que `FRONTEND_URL` en Render coincida con tu URL de Netlify

### Backend no conecta a DB
→ Usa la **Internal Database URL**, no la External

### Frontend muestra error de red
→ Verifica que `REACT_APP_API_URL` en Netlify tenga la URL correcta de Render

### Render muestra "Service Unavailable"
→ Los servicios gratuitos se duermen después de 15 min. Espera 30 seg al primer acceso.

---

## 🎉 ¡Listo!

Tu aplicación está desplegada y funcionando.

**Próximos pasos:**
- Actualizar README con tus URLs
- Agregar link a tu portafolio
- Compartir en LinkedIn/redes

---

**Tiempo estimado total: 20-30 minutos**
