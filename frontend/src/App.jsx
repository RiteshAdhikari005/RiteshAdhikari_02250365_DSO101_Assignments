import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState('');

  const fetchTodos = async () => {
    const res = await fetch(`${API}/todos`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async () => {
    if (!task.trim()) return;
    await fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });
    setTask('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await fetch(`${API}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: todo.task, completed: !todo.completed })
    });
    fetchTodos();
  };

  const saveEdit = async (id) => {
    const todo = todos.find(t => t.id === id);
    await fetch(`${API}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: editTask, completed: todo.completed })
    });
    setEditId(null);
    fetchTodos();
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>📝 My Todo List</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: '10px', fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button onClick={addTodo}
          style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>
          Add
        </button>
      </div>

      {todos.map(todo => (
        <div key={todo.id} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px', marginBottom: 8,
          background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee'
        }}>
          <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo)} />

          {editId === todo.id ? (
            <>
              <input value={editTask} onChange={e => setEditTask(e.target.value)}
                style={{ flex: 1, padding: 6, fontSize: 15, borderRadius: 4, border: '1px solid #ccc' }} />
              <button onClick={() => saveEdit(todo.id)}
                style={{ padding: '6px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Save
              </button>
              <button onClick={() => setEditId(null)}
                style={{ padding: '6px 12px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <span style={{ flex: 1, fontSize: 15, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#999' : '#111' }}>
                {todo.task}
              </span>
              <button onClick={() => { setEditId(todo.id); setEditTask(todo.task); }}
                style={{ padding: '6px 12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => deleteTodo(todo.id)}
                style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}

      {todos.length === 0 && <p style={{ color: '#999', textAlign: 'center' }}>No tasks yet. Add one above!</p>}
    </div>
  );
}