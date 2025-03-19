import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Receipt className="w-16 h-16 text-teal-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">SplitWise</h2>
          <p className="text-gray-600 mt-2">Split expenses with friends effortlessly</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-200 flex items-center justify-center space-x-2"
          >
            <User className="w-5 h-5" />
            <span>Start Splitting Expenses</span>
          </button>
        </form>
      </div>
    </div>
  );
}