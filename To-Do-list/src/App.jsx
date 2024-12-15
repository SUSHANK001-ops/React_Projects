import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [todo, setTodo] = useState("");
  const [time, setTime] = useState("");
  const [notificationTime, setNotificationTime] = useState("");
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const interval = setInterval(() => {
      todos.forEach((item) => {
        if (!item.notified && !item.isCompleted) {
          const dueTime = new Date(item.time).getTime();
          const currentTime = new Date().getTime();
          const notifyOffset = item.notificationTime * 60000; // Convert minutes to milliseconds

          if (dueTime && dueTime - currentTime <= 3600000 && dueTime > currentTime) {
            alert(`Reminder: The task "${item.todo}" is due within an hour!`);
          }

          if (dueTime && currentTime >= dueTime - notifyOffset && currentTime <= dueTime - notifyOffset + 60000) {
            alert(`Notification: The task "${item.todo}" needs attention (${item.notificationTime} minutes before due time)`);
            // Mark as notified to prevent multiple notifications
            const updatedTodos = todos.map(t => 
              t.id === item.id ? { ...t, notified: true } : t
            );
            setTodos(updatedTodos);
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [todos]);

  const handleStartAdd = () => {
    setIsAddingTodo(true);
    setTodo("");
    setTime("");
    setNotificationTime("");
  };

  const handleAdd = () => {
    if (todo.trim()) {
      const newTodo = {
        id: uuidv4(),
        todo,
        time: time.trim() || null,
        notificationTime: notificationTime ? parseInt(notificationTime) : null,
        isCompleted: false,
        notified: false
      };

      if (editIndex !== null) {
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = { 
          ...updatedTodos[editIndex], 
          todo, 
          time: newTodo.time, 
          notificationTime: newTodo.notificationTime,
          notified: false
        };
        setTodos(updatedTodos);
        setEditIndex(null);
      } else {
        setTodos([...todos, newTodo]);
      }
      
      setIsAddingTodo(false);
      setTodo("");
      setTime("");
      setNotificationTime("");
    }
  };

  const handleCancel = () => {
    setIsAddingTodo(false);
    setTodo("");
    setTime("");
    setNotificationTime("");
    setEditIndex(null);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleNotificationTimeChange = (e) => {
    setNotificationTime(e.target.value);
  };

  const handleCheckbox = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted;
    setTodos(updatedTodos);
  };

  const handleEdit = (index) => {
    setTodo(todos[index].todo);
    setTime(todos[index].time || "");
    setNotificationTime(todos[index].notificationTime?.toString() || "");
    setEditIndex(index);
    setIsAddingTodo(true);
  };

  const handleDelete = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 rounded-xl p-5 bg-gradient-to-br from-violet-200 via-violet-300 to-violet-400 shadow-lg min-h-[80vh]">
        <div className="addTodo text-center">
          <h2 className="text-2xl font-bold text-violet-800 mb-5">Add a To-Do</h2>
          {!isAddingTodo ? (
            <button
              onClick={handleStartAdd}
              className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              Add New Todo
            </button>
          ) : (
            <div className="flex flex-col gap-4">
              <input
                onChange={handleChange}
                value={todo}
                type="text"
                className="w-full p-2 border-2 border-violet-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="What do you need to do?"
              />
              <input
                onChange={handleTimeChange}
                value={time}
                type="datetime-local"
                className="w-full p-2 border-2 border-violet-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Set due time"
              />
              <select
                onChange={handleNotificationTimeChange}
                value={notificationTime}
                className="w-full p-2 border-2 border-violet-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
              >
                <option value="">Select notification time</option>
                <option value="5"> After 5 minutes </option>
                <option value="10">After 10 minutes </option>
                <option value="15"> After 15 minutes </option>
                <option value="30"> After 30 minutes </option>
                <option value="60"> After 1 hour</option>
              </select>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  {editIndex !== null ? "Update" : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-violet-800 mt-10 mb-5 text-center">Your To-Do List</h2>

        <div className="todos grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.map((item, index) => (
            <div
              key={item.id}
              className="todo flex flex-col items-start justify-between p-4 bg-white rounded-md shadow-md hover:shadow-lg transition-all border-l-4 border-violet-500"
            >
              <div className="flex items-center gap-3 w-full">
                <input
                  onChange={() => handleCheckbox(index)}
                  type="checkbox"
                  checked={item.isCompleted}
                  className="w-5 h-5 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <div
                  className={`text-lg ${item.isCompleted ? "line-through text-gray-500" : "text-gray-800"}`}
                >
                  {item.todo}
                </div>
              </div>
              {item.time && (
                <div className="text-sm text-gray-500 mt-2">
                  Due: {new Date(item.time).toLocaleString()}
                </div>
              )}
              {item.notificationTime && (
                <div className="text-sm text-gray-500 mt-1">
                  Notify: {item.notificationTime} minutes before
                </div>
              )}
              <div className="buttons flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;