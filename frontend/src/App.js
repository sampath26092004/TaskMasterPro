import React, { useState, useEffect } from 'react';
import './App.css';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Same domain for Vercel
  : 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('medium');
  
  const filters = [
    { id: 'all', label: 'All Tasks'},
    { id: 'active', label: 'Active'},
    { id: 'completed', label: 'Completed'},
    { id: 'high', label: 'High Priority'}
  ];

  // Load initial todos
  useEffect(() => {
    fetch(`${API_URL}/api/todos`)
    .then(res => res.json())
    .then(data => {
      console.log('Loaded todos:', data);
      setTodos(data);
    })
    .catch(err => {
      console.log('Using local storage instead');
      const savedTodos = JSON.parse(localStorage.getItem('todos')) || [
        { id: 1, text: 'Welcome to your Todo App!', completed: false, priority: 'high', date: 'Today' },
        { id: 2, text: 'Click checkbox to complete tasks', completed: true, priority: 'medium', date: 'Today' },
        { id: 3, text: 'Try adding your own tasks below', completed: false, priority: 'low', date: 'Today' },
        { id: 4, text: 'Double-click to edit any task', completed: false, priority: 'medium', date: 'Today' },
        { id: 5, text: 'Use priority badges to organize', completed: false, priority: 'high', date: 'Tomorrow' }
      ];
      setTodos(savedTodos);
    });
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add todo
  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
      priority: priority,
      date: new Date().toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      createdAt: new Date().toISOString()
    };

    setTodos([newTodo, ...todos]);
    setInput('');
    // Animation effect
    document.querySelector('.add-button').classList.add('pulse');
    setTimeout(() => {
      document.querySelector('.add-button').classList.remove('pulse');
    }, 300);
  };

  // Toggle complete
  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Toggle important
  const toggleImportant = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { 
        ...todo, 
        priority: todo.priority === 'high' ? 'medium' : 'high' 
      } : todo
    ));
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Edit todo
  const editTodo = (id, newText) => {
    if (newText.trim() === '') return;
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  // Clear completed
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'high') return todo.priority === 'high';
    return true;
  });

  // Calculate stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const remainingTodos = totalTodos - completedTodos;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const badges = {
      high: { class: 'priority-high', label: 'High', emoji: '🚨' },
      medium: { class: 'priority-medium', label: 'Medium', emoji: '⚠️' },
      low: { class: 'priority-low', label: 'Low', emoji: '📌' }
    };
    const badge = badges[priority] || badges.medium;
    return (
      <span className={`priority-badge ${badge.class}`}>
        {badge.emoji} {badge.label}
      </span>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>TaskMaster Pro</h1>
        <p className="subtitle">Organize your life, one task at a time</p>
      </header>

      <div className="main-container">
        {/* Priority Selector & Add Form */}
        <div className="form-section">
          <form onSubmit={addTodo} className="todo-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind today?"
              className="todo-input"
            />
            <div className="priority-selector">
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <button type="submit" className="add-button">
              <span>Add Task</span>
            </button>
          </form>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              className={`filter-button ${filter === filterItem.id ? 'active' : ''}`}
              onClick={() => setFilter(filterItem.id)}
            >
              {filterItem.icon} {filterItem.label}
            </button>
          ))}
        </div>

        {/* Stats Dashboard */}
        <div className="todo-stats">
          <div className="stat total">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{totalTodos}</span>
          </div>
          <div className="stat remaining">
            <span className="stat-label">Remaining</span>
            <span className="stat-value">{remainingTodos}</span>
          </div>
          <div className="stat completed">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedTodos}</span>
          </div>
          <button onClick={clearCompleted} className="clear-button">
            Clear Completed
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-label">
            <span>Completion Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Todo List */}
        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
              <p>No tasks found!</p>
              <p className="hint">Try changing filters or add a new task</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.priority === 'high' ? 'important' : ''}`}
              >
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="todo-checkbox"
                  />
                  <div className="todo-text">
                    <span>{todo.text}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                      <small className="todo-date">📅 {todo.date}</small>
                      {getPriorityBadge(todo.priority)}
                    </div>
                  </div>
                </div>
                <div className="todo-actions">
                  <button
                    onClick={() => toggleImportant(todo.id)}
                    className="action-button important-button"
                    title={todo.priority === 'high' ? 'Mark as normal' : 'Mark as important'}
                  >
                    {todo.priority === 'high' ? '⭐' : '☆'}
                  </button>
                  <button
                    onClick={() => {
                      const newText = prompt('Edit task:', todo.text);
                      if (newText !== null) editTodo(todo.id, newText);
                    }}
                    className="action-button edit-button"
                    title="Edit task"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="action-button delete-button"
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tips Panel */}
        <div className="tips-panel">
          <h3>Pro Tips</h3>
          <div className="tip-items">
            <div className="tip-item">
              <span>Use priorities to focus on what matters</span>
            </div>
            <div className="tip-item">
              <span>Check off tasks as you complete them</span>
            </div>
            <div className="tip-item">
              <span>Track progress with the completion bar</span>
            </div>
            <div className="tip-item">
              <span>Double-click any task to edit it</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <p>
          Built with React / {totalTodos} tasks managed /
          <span style={{ marginLeft: '10px', color: '#ff0000ff', fontSize: '25px', fontWeight: 'bold' }}>
            {completionPercentage}% complete
          </span>
        </p>
        <p style={{ marginTop: '10px', fontSize: '12px', opacity: 0.7 }}>
          Your tasks are saved automatically in your browser
        </p>
      </footer>

      <style jsx>{`
        .pulse {
          animation: pulse 0.3s ease-in-out;
        }
        
        .form-section {
          margin-bottom: 30px;
        }
        
        .priority-selector {
          flex: 0 0 180px;
        }
        
        .priority-select {
          width: 100%;
          padding: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .priority-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
      `}</style>
    </div>
  );
}

export default App;