import React, { useEffect, useState } from 'react';
import service from './service.js';
import Login from './Login.js';
import Register from './Register.js';
import './index.css';
import dotenv from 'dotenv';
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
        <div className="loading">
          <div>⏳ Loading your tasks...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="todoapp">
      <header className="header">
        <div className="header-top">
          <h1>todos</h1>
          <div className="user-info">
            <span className="username">
              👤 {service.getUsername()}
            </span>
            <button 
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={createTodo}>
          <input 
            className="new-todo" 
            placeholder="What needs to be done today? ✨" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
          />
        </form>
      </header>
      <section className="main">
        {todos.length === 0 ? (
          <div className="empty-state">
            No tasks yet! Add one above to get started.
          </div>
        ) : (
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
        )}
      </section>
    </section>
  );
}

export default App;