import React, { useEffect, useState } from 'react';
import service from './service.js';
import Login from './Login.js';
import Register from './Register.js';
import './index.css';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // בדיקה אם המשתמש מחובר
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = service.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        getTodos();
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  async function getTodos() {
    try {
      setLoading(true);
      setError(null);
      const todos = await service.getTasks();
      setTodos(todos);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  async function createTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    try {
      await service.addTask(newTodo);
      setNewTodo("");
      await getTodos();
    } catch (err) {
      console.error('Error creating todo:', err);
      setError('Failed to create task');
    }
  }

  async function updateCompleted(todo, isComplete) {
    try {
      await service.setCompleted(todo.id, isComplete);
      await getTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update task');
    }
  }

  async function deleteTodo(id) {
    try {
      await service.deleteTask(id);
      await getTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete task');
    }
  }

  function handleLogout() {
    service.logout();
    setIsAuthenticated(false);
    setTodos([]);
    setShowRegister(false);
  }

  function handleLoginSuccess() {
    setIsAuthenticated(true);
    getTodos();
  }

  function handleRegisterSuccess() {
    setIsAuthenticated(true);
    getTodos();
  }

  // אם לא מחובר - הצג Login או Register
  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    } else {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      );
    }
  }

  // אם מחובר - הצג Todo App
  if (loading) {
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      </section>
    );
  }

  return (
    <section className="todoapp">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ margin: 0 }}>todos</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Welcome, {service.getUsername()}!
            </span>
            <button 
              onClick={handleLogout}
              style={{ 
                background: '#d32f2f', 
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              Logout
            </button>
          </div>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={createTodo}>
          <input 
            className="new-todo" 
            placeholder="Well, let's take on the day" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
          />
        </form>
      </header>
      <section className="main" style={{ display: "block" }}>
        <ul className="todo-list">
          {todos.map(todo => {
            return (
              <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                <div className="view">
                  <input 
                    className="toggle" 
                    type="checkbox" 
                    checked={todo.isComplete} 
                    onChange={(e) => updateCompleted(todo, e.target.checked)} 
                  />
                  <label>{todo.name}</label>
                  <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}

export default App;