import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Manager = () => {
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordsArray, setPasswordsArray] = useState([]);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [notifications, setNotifications] = useState({
    edit: { show: false, message: "" },
    copy: { show: false, index: null },
    delete: { show: false, index: null },
    general: { show: false, message: "", type: "" }
  });

  useEffect(() => {
    const storedPasswords = localStorage.getItem("passwords");
    if (storedPasswords) {
      setPasswordsArray(JSON.parse(storedPasswords));
    }
  }, []);

  const handleChange = (e) => {
    if (editIndex !== null) {
      const updatedPasswords = [...passwordsArray];
      updatedPasswords[editIndex] = { ...updatedPasswords[editIndex], [e.target.name]: e.target.value };
      setPasswordsArray(updatedPasswords);
      localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    if (!form.site.trim() || !form.username.trim() || !form.password.trim()) {
      showGeneralNotification("Please fill all fields!", "error");
      return false;
    }
    return true;
  };

  const savePassword = () => {
    if (editIndex !== null || validateForm()) {
      if (editIndex !== null) {
        showGeneralNotification("Password updated successfully!", "success");
        setEditIndex(null);
      } else {
        const updatedArray = [...passwordsArray, form];
        setPasswordsArray(updatedArray);
        localStorage.setItem("passwords", JSON.stringify(updatedArray));
        setForm({ site: "", username: "", password: "" });
        showGeneralNotification("Password added successfully!", "success");
      }
    }
  };

  const showGeneralNotification = (message, type = "info") => {
    setNotifications(prev => ({
      ...prev,
      general: { show: true, message, type }
    }));
    setTimeout(() => {
      setNotifications(prev => ({
        ...prev,
        general: { show: false, message: "", type: "" }
      }));
    }, 3000);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNotifications(prev => ({
      ...prev,
      edit: { show: true, message: "You can now edit the fields above" }
    }));
    setTimeout(() => {
      setNotifications(prev => ({
        ...prev,
        edit: { show: false, message: "" }
      }));
    }, 3000);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setNotifications(prev => ({
      ...prev,
      copy: { show: true, index }
    }));
    setTimeout(() => {
      setNotifications(prev => ({
        ...prev,
        copy: { show: false, index: null }
      }));
    }, 3000);
  };

  const deletePassword = (index) => {
    setNotifications(prev => ({
      ...prev,
      delete: { show: true, index }
    }));
  };

  const confirmDelete = () => {
    const indexToRemove = notifications.delete.index;
    const updatedArray = passwordsArray.filter((_, index) => index !== indexToRemove);
    setPasswordsArray(updatedArray);
    localStorage.setItem("passwords", JSON.stringify(updatedArray));
    setNotifications(prev => ({
      ...prev,
      delete: { show: false, index: null }
    }));
    showGeneralNotification("Password deleted successfully!", "success");
  };

  const togglePasswordVisibility = (index) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const truncateText = (text, maxLength = 15) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };

  const DeleteConfirmation = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
        <p className="text-center mb-4 text-lg">Are you sure you want to delete this password?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
          <button
            onClick={() => setNotifications(prev => ({ ...prev, delete: { show: false, index: null } }))}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
      </div>

      {notifications.general.show && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-2 shadow-lg ${
          notifications.general.type === 'success' ? 'bg-green-500' :
          notifications.general.type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        }`}>
          <p className="text-white text-sm md:text-base">{notifications.general.message}</p>
        </div>
      )}

      {notifications.delete.show && <DeleteConfirmation />}

      <div className="p-2 sm:p-4 md:p-8 rounded-lg shadow-lg max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          <span className="text-indigo-500">{"<"}</span>
          <span className="text-emerald-600">Sen</span>
          <span className="text-indigo-500">{"OP />"}</span>
        </h1>
        <p className="text-indigo-500 text-lg text-center mb-6">
          Your own password manager
        </p>

        {notifications.edit.show && (
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 text-center text-sm md:text-base">
            {notifications.edit.message}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <input
            onChange={handleChange}
            value={editIndex !== null ? passwordsArray[editIndex].site : form.site}
            className="rounded-full w-full p-2 md:p-4 border border-emerald-600 text-black text-sm md:text-base"
            type="text"
            name="site"
            placeholder="Enter service name (e.g., Gmail, Facebook, Netflix)"
          />
          <div className="flex flex-col md:flex-row gap-4">
            <input
              onChange={handleChange}
              value={editIndex !== null ? passwordsArray[editIndex].username : form.username}
              className="rounded-full w-full p-2 md:p-4 border border-emerald-600 text-black text-sm md:text-base"
              type="text"
              name="username"
              placeholder="Enter username "
            />
            <div className="relative w-full">
              <input
                onChange={handleChange}
                value={editIndex !== null ? passwordsArray[editIndex].password : form.password}
                className="rounded-full w-full p-2 md:p-4 border border-emerald-600 text-black pr-10 text-sm md:text-base"
                type={passwordVisibility.new ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
              />
              <button
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {passwordVisibility.new ? (
                  <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={savePassword}
              className="flex items-center bg-rose-600 hover:bg-rose-700 rounded-full px-4 py-2 gap-2 text-white"
            >
              <lord-icon
                src="https://cdn.lordicon.com/dxoycpzg.json"
                trigger="hover"
                colors="primary:#ffffff,secondary:#ffffff"
                style={{ width: "25px", height: "25px" }}
              ></lord-icon>
              {editIndex !== null ? 'Update password' : 'Add password'}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-bold text-center text-emerald-600 mb-4">
            Your Passwords
          </h2>
          {passwordsArray.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 shadow-md rounded-md bg-white">
                <thead>
                  <tr className="bg-emerald-500 text-white">
                    <th className="p-2 md:p-4 text-xs md:text-base">Service</th>
                    <th className="p-2 md:p-4 text-xs md:text-base">User</th>
                    <th className="p-2 md:p-4 text-xs md:text-base">Password</th>
                    <th className="p-2 md:p-4 text-xs md:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passwordsArray.map((password, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-2 md:p-4 text-center">
                        <span className="text-gray-800 text-xs md:text-base block truncate" title={password.site}>
                          {truncateText(password.site)}
                        </span>
                      </td>
                      <td className="p-2 md:p-4 text-center">
                        <span className="text-xs md:text-base block truncate" title={password.username}>
                          {truncateText(password.username)}
                        </span>
                      </td>
                      <td className="p-2 md:p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs md:text-base truncate">
                            {passwordVisibility[index] ? password.password : "•••"}
                          </span>
                          <button onClick={() => togglePasswordVisibility(index)}>
                            {passwordVisibility[index] ? (
                              <EyeOff className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                            ) : (
                              <Eye className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="relative flex items-center justify-center gap-2">
                          {notifications.copy.show && notifications.copy.index === index && (
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded text-sm">
                              Copied!
                            </div>
                          )}
                          <button
                            onClick={() => copyToClipboard(password.password, index)}
                            className="bg-blue-600 hover:bg-blue-700 rounded-full p-1 text-white"
                            title="Copy Password"
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/wfadduyp.json"
                              trigger="hover"
                              colors="primary:#ffffff,secondary:#ffffff"
                              style={{ width: "20px", height: "20px" }}
                            ></lord-icon>
                          </button>
                          <button
                            onClick={() => handleEdit(index)}
                            className="bg-amber-600 hover:bg-amber-700 rounded-full p-1 text-white"
                            title="Edit Password"
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/puvaffet.json"
                              trigger="hover"
                              colors="primary:#ffffff,secondary:#ffffff"
                              style={{ width: "20px", height: "20px" }}
                            ></lord-icon>
                          </button>
                          <button
                            onClick={() => deletePassword(index)}
                            className="bg-rose-600 hover:bg-rose-700 rounded-full p-1 text-white"
                            title="Delete Password"
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/jmkrnisz.json"
                              trigger="hover"
                              colors="primary:#ffffff,secondary:#ffffff"
                              style={{ width: "20px", height: "20px" }}
                            ></lord-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No passwords to show</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;