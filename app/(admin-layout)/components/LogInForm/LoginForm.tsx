'use client';

import {  useState } from "react";
import { useAdminStore } from "../../store";

export default  function LoginForm({ secret }: { secret: string 
}) {
  const { setAdmin } = useAdminStore();
  
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`/api/app-control/${secret}/login`, {
        method: "POST",
        body: JSON.stringify({ userName, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: {
        message: string;
        updateLogin: {
          userName: string;
          LastDateLogIn: string;
          _id: string | number;
        };
      } = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setAdmin( {
        userName: data.updateLogin.userName,
        id: data.updateLogin._id,
        lastDateLogIn: data.updateLogin.LastDateLogIn,
      });
      window.location.href = `/app-control/${secret}/admin`;
    } catch (err: unknown) {
      setError(`${err}`);
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>

        <div>
          <label htmlFor="user-name" className="block mb-1">Username</label>
          <input
            id="user-name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Login
        </button>
      </form>
    </div>
  );
}
