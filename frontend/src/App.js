import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [filtro, setFiltro] = useState('todas'); // todas, pendientes, completadas
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  // Usar variable de entorno para la URL del API
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const API_ENDPOINT = `${API_URL}/api/tareas`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINT);
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      alert('Error al cargar las tareas. Verifica que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const agregarTarea = async (e) => {
    e.preventDefault();
    const tituloLimpio = nuevaTarea.trim();
    
    if (!tituloLimpio) {
      alert('Por favor ingresa una tarea válida');
      return;
    }

    try {
      setProcesando(true);
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: tituloLimpio,
          completada: false
        })
      });
      const tarea = await response.json();
      setTareas([tarea, ...tareas]); // Agregar al principio
      setNuevaTarea('');
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      alert('Error al agregar la tarea');
    } finally {
      setProcesando(false);
    }
  };

  const toggleCompletada = async (id, completadaActual) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completada: !completadaActual })
      });
      
      if (response.ok) {
        const tareaActualizada = await response.json();
        setTareas(tareas.map(t => t.id === id ? tareaActualizada : t));
      }
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea');
    }
  };

  const eliminarTarea = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      return;
    }

    try {
      await fetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
      setTareas(tareas.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea');
    }
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diff = ahora - fecha;
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias < 7) return `Hace ${dias}d`;
    
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  // Filtrar tareas según el filtro activo
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtro === 'pendientes') return !tarea.completada;
    if (filtro === 'completadas') return tarea.completada;
    return true; // todas
  });

  // Estadísticas
  const totalTareas = tareas.length;
  const tareasPendientes = tareas.filter(t => !t.completada).length;
  const tareasCompletadas = tareas.filter(t => t.completada).length;

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>📋 Gestor de Tareas</h1>
          <div className="stats">
            <span className="stat">Total: {totalTareas}</span>
            <span className="stat pendientes">Pendientes: {tareasPendientes}</span>
            <span className="stat completadas">Completadas: {tareasCompletadas}</span>
          </div>
        </header>

        <form onSubmit={agregarTarea} className="task-form">
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="¿Qué necesitas hacer?"
            disabled={procesando}
            maxLength={255}
          />
          <button type="submit" disabled={procesando || !nuevaTarea.trim()}>
            {procesando ? '...' : '+ Agregar'}
          </button>
        </form>

        <div className="filters">
          <button 
            className={filtro === 'todas' ? 'active' : ''} 
            onClick={() => setFiltro('todas')}
          >
            Todas ({totalTareas})
          </button>
          <button 
            className={filtro === 'pendientes' ? 'active' : ''} 
            onClick={() => setFiltro('pendientes')}
          >
            Pendientes ({tareasPendientes})
          </button>
          <button 
            className={filtro === 'completadas' ? 'active' : ''} 
            onClick={() => setFiltro('completadas')}
          >
            Completadas ({tareasCompletadas})
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando tareas...</div>
        ) : tareasFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>
              {filtro === 'todas' && 'No hay tareas aún. ¡Crea tu primera tarea!'}
              {filtro === 'pendientes' && '¡Genial! No tienes tareas pendientes'}
              {filtro === 'completadas' && 'No hay tareas completadas todavía'}
            </p>
          </div>
        ) : (
          <ul className="task-list">
            {tareasFiltradas.map(tarea => (
              <li key={tarea.id} className={tarea.completada ? 'completed' : ''}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => toggleCompletada(tarea.id, tarea.completada)}
                    className="task-checkbox"
                  />
                  <div className="task-info">
                    <span className="task-title">{tarea.titulo}</span>
                    <span className="task-date">
                      {formatearFecha(tarea.fecha_creacion)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => eliminarTarea(tarea.id)} 
                  className="delete-btn"
                  title="Eliminar tarea"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
