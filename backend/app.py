import os
import psycopg2
from psycopg2.extras import RealDictCursor
from flask import Flask, jsonify, request
from flask_cors import CORS
import time
from dotenv import load_dotenv

# Cargar variables de entorno desde .env (solo en desarrollo)
load_dotenv()

app = Flask(__name__)

# Configurar CORS para permitir requests desde el frontend
frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
CORS(app, resources={
    r"/api/*": {
        "origins": [frontend_url, "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

def get_db_connection():
    """Conecta a la base de datos PostgreSQL"""
    max_retries = 5
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            database_url = os.environ.get('DATABASE_URL', 'postgres://admin:admin123@db:5432/tareas')
            conn = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
            return conn
        except psycopg2.OperationalError:
            retry_count += 1
            if retry_count < max_retries:
                print(f"No se pudo conectar a la base de datos. Reintentando {retry_count}/{max_retries}...")
                time.sleep(2)
            else:
                raise

def init_db():
    """Inicializa la base de datos y crea la tabla si no existe"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS tareas (
            id SERIAL PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            completada BOOLEAN DEFAULT FALSE,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()

# Inicializar la base de datos al arrancar
init_db()

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de health check para Render y monitoreo"""
    try:
        # Verificar conexión a la base de datos
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT 1')
        cur.close()
        conn.close()
        
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'message': 'Backend funcionando correctamente'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 503

@app.route('/api/tareas', methods=['GET'])
def obtener_tareas():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM tareas ORDER BY fecha_creacion DESC')
    tareas = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(tareas)

@app.route('/api/tareas', methods=['POST'])
def crear_tarea():
    tarea = request.json
    titulo = tarea.get('titulo')
    completada = tarea.get('completada', False)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO tareas (titulo, completada) VALUES (%s, %s) RETURNING *',
        (titulo, completada)
    )
    nueva_tarea = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify(nueva_tarea), 201

@app.route('/api/tareas/<int:id>', methods=['PUT'])
def actualizar_tarea(id):
    tarea = request.json
    completada = tarea.get('completada')
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'UPDATE tareas SET completada = %s WHERE id = %s RETURNING *',
        (completada, id)
    )
    tarea_actualizada = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    if tarea_actualizada:
        return jsonify(tarea_actualizada)
    return jsonify({'error': 'Tarea no encontrada'}), 404

@app.route('/api/tareas/<int:id>', methods=['DELETE'])
def eliminar_tarea(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM tareas WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return '', 204

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
    app.run(host='0.0.0.0', port=8000, debug=True)
