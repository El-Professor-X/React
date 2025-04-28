import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Check, Plus, Calendar, Clock } from 'lucide-react';

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange }) => {
  return (
    <div className="border rounded-md p-2 shadow-sm bg-white">
      <div
        className="min-h-24 outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onBlur={(e) => onChange(e.target.innerHTML)}
      />
      <div className="flex gap-2 mt-2 border-t pt-2">
        <button 
          className="p-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors" 
          onClick={() => onChange(value + '<ul><li>List item</li></ul>')}
        >
          List
        </button>
        <button 
          className="p-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          onClick={() => onChange(value + '<a href="#">Link</a>')}
        >
          Link
        </button>
        <button 
          className="p-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          onClick={() => onChange(value + '<div><img src="/api/placeholder/200/150" alt="placeholder" /></div>')}
        >
          Image
        </button>
        <button 
          className="p-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          onClick={() => onChange(value + '<code>HTML code</code>')}
        >
          Code
        </button>
      </div>
    </div>
  );
};

// Todo Form Component
const TodoForm = ({ todo, onSubmit, onClose }) => {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [status, setStatus] = useState(todo?.status || 'TODO');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: todo?.id || Date.now(),
      title,
      description,
      status,
      completed: todo?.completed || false,
      createdAt: todo?.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">{todo ? 'Edit Todo' : 'Add Todo'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Title</label>
            <input
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter title"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <RichTextEditor 
              value={description} 
              onChange={setDescription} 
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-700">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={todo?.completed}
            >
              <option value="TODO">TODO</option>
              <option value="STARTING SOON">STARTING SOON</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="IN QA">IN QA</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              {todo ? 'Update' : 'Add'} Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl transform transition-all">
        <h3 className="text-lg font-medium mb-4 text-gray-800">{message}</h3>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={onConfirm}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

// Todo Card Component
const TodoCard = ({ todo, onEdit, onDelete, onComplete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN QA': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'STARTING SOON': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className={`border rounded-lg p-4 mb-4 shadow-md transition-all hover:shadow-lg ${
        todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-l-4 ' + getStatusColor(todo.status)
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-medium ${todo.completed ? 'text-gray-500' : 'text-gray-800'}`}>
          {todo.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(todo.status)}`}>
          {todo.status}
        </span>
      </div>
      
      <div 
        className={`mb-4 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}
        dangerouslySetInnerHTML={{ __html: todo.description }}
      />
      
      {todo.createdAt && (
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar size={12} className="mr-1" />
          {formatDate(todo.createdAt)}
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        {!todo.completed && (
          <>
            <button
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              onClick={() => onEdit(todo)}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
              onClick={() => onComplete(todo)}
              title="Mark as Completed"
            >
              <Check size={16} />
            </button>
          </>
        )}
        <button
          className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          onClick={() => onDelete(todo)}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// Main App Component
export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [confirmation, setConfirmation] = useState({ show: false, type: null, todo: null });
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  const handleUpdateTodo = (updatedTodo) => {
    setTodos(todos.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
  };

  const handleDeleteTodo = (todo) => {
    setConfirmation({
      show: true,
      type: 'delete',
      todo,
      message: 'Are you sure you want to delete this todo?',
      onConfirm: () => {
        setTodos(todos.filter(t => t.id !== todo.id));
        setConfirmation({ show: false });
      }
    });
  };

  const handleCompleteTodo = (todo) => {
    setConfirmation({
      show: true,
      type: 'complete',
      todo,
      message: 'Mark this todo as completed? You won\'t be able to edit it afterward.',
      onConfirm: () => {
        setTodos(todos.map(t => 
          t.id === todo.id ? { ...t, status: 'COMPLETED', completed: true } : t
        ));
        setConfirmation({ show: false });
      }
    });
  };

  const handleEditTodo = (todo) => {
    setCurrentTodo(todo);
    setIsFormOpen(true);
  };

  const handleSubmit = (todo) => {
    if (currentTodo) {
      handleUpdateTodo(todo);
    } else {
      handleAddTodo(todo);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentTodo(null);
  };

  // Filter todos based on status
  const filteredTodos = filterStatus === 'ALL' 
    ? todos 
    : todos.filter(todo => todo.status === filterStatus);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-700">Todo List</h1>
        <button
          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={16} /> TODO
        </button>
      </div>

      {/* Filter buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            filterStatus === 'ALL' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setFilterStatus('ALL')}
        >
          All
        </button>
        <button
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            filterStatus === 'TODO' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setFilterStatus('TODO')}
        >
          Todo
        </button>
        <button
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            filterStatus === 'STARTING SOON' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setFilterStatus('STARTING SOON')}
        >
          Starting Soon
        </button>
        <button
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            filterStatus === 'IN PROGRESS' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setFilterStatus('IN PROGRESS')}
        >
          In Progress
        </button>
        <button
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            filterStatus === 'IN QA' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setFilterStatus('IN QA')}
        >
          In QA
        </button>
        <button
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            filterStatus === 'COMPLETED' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setFilterStatus('COMPLETED')}
        >
          Completed
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          <div className="mb-2">
            {todos.length === 0 ? (
              <>No todos yet. Click the "+ TODO" button to add one.</>
            ) : (
              <>No todos match the selected filter.</>
            )}
          </div>
        </div>
      ) : (
        <div>
          {filteredTodos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
              onComplete={handleCompleteTodo}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <TodoForm
          todo={currentTodo}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {confirmation.show && (
        <ConfirmationModal
          message={confirmation.message}
          onConfirm={confirmation.onConfirm}
          onCancel={() => setConfirmation({ show: false })}
        />
      )}
    </div>
  );
}