import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const API_URL = "/api";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await fetch(`${API_URL}/todos`);
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const title = newTodo;
    setNewTodo(""); // Clear input immediately

    // Optimistic update: add temporary todo
    const tempId = Date.now();
    const optimisticTodo: Todo = {
      id: tempId,
      title,
      completed: false,
      created_at: new Date().toISOString(),
    };
    setTodos([...todos, optimisticTodo]);

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();

      // Replace optimistic todo with real one from server
      setTodos((current) =>
        current.map((t) => (t.id === tempId ? data.todo : t))
      );
    } catch (error) {
      console.error("Failed to add todo:", error);
      // Rollback on error
      setTodos((current) => current.filter((t) => t.id !== tempId));
      setNewTodo(title); // Restore input
    }
  }

  async function toggleTodo(id: number) {
    // Optimistic update: toggle immediately
    setTodos((current) =>
      current.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
      });
      const data = await res.json();

      // Update with server response
      setTodos((current) => current.map((t) => (t.id === id ? data.todo : t)));
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      // Rollback on error
      setTodos((current) =>
        current.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    }
  }

  async function deleteTodo(id: number) {
    // Optimistic update: remove immediately
    const todoToDelete = todos.find((t) => t.id === id);
    setTodos((current) => current.filter((t) => t.id !== id));

    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      // Rollback on error
      if (todoToDelete) {
        setTodos((current) => [...current, todoToDelete]);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📝 Todo App
          </h1>
          <p className="text-gray-600">
            Built with Bun, React, and Tailwind CSS
          </p>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No todos yet!</p>
              <p className="text-sm mt-1">Add one above to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />

                  {/* Todo Text */}
                  <span
                    className={`flex-1 text-lg ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-900"
                    }`}
                  >
                    {todo.title}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Delete todo"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <span className="font-medium">{remaining}</span> of{" "}
            <span className="font-medium">{todos.length}</span>{" "}
            {todos.length === 1 ? "task" : "tasks"} remaining
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
