import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useExpenseStore } from '../store/expenseStore';
import { PlusCircle, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { expenses, addExpense, getSettlements } = useExpenseStore();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    participants: [''],
    items: [{ description: '', amount: '', sharedBy: [''] }],
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addExpense({
      id: Math.random().toString(36).substr(2, 9),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      paidBy: user.id,
      date: new Date(),
      participants: [...new Set([user.id, ...newExpense.participants])],
      items: newExpense.items.map(item => ({
        description: item.description,
        amount: parseFloat(item.amount) || 0,
        sharedBy: item.sharedBy,
      })),
    });

    setShowAddExpense(false);
    setNewExpense({
      description: '',
      amount: '',
      participants: [''],
      items: [{ description: '', amount: '', sharedBy: [''] }],
    });
  };

  const settlements = getSettlements();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-gray-600">Manage your shared expenses</p>
          </div>
          <button
            onClick={() => setShowAddExpense(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>

        {showAddExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participants (emails)
                  </label>
                  {newExpense.participants.map((participant, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="email"
                        className="flex-1 px-4 py-2 border rounded-lg"
                        value={participant}
                        onChange={(e) => {
                          const newParticipants = [...newExpense.participants];
                          newParticipants[index] = e.target.value;
                          setNewExpense({ ...newExpense, participants: newParticipants });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newParticipants = [...newExpense.participants, ''];
                          setNewExpense({ ...newExpense, participants: newParticipants });
                        }}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <ShoppingBag className="w-6 h-6 text-teal-600 mr-2" />
              Recent Expenses
            </h2>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{expense.description}</h3>
                      <p className="text-sm text-gray-500">
                        {format(expense.date, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-teal-600">
                        ₹{expense.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Paid by {expense.paidBy === user?.id ? 'you' : expense.paidBy}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {expense.items.length} items • {expense.participants.length} participants
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <DollarSign className="w-6 h-6 text-teal-600 mr-2" />
              Settlements
            </h2>
            <div className="space-y-4">
              {settlements.map((settlement, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">{settlement.from}</p>
                      <p className="text-sm text-gray-500">needs to pay</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-teal-600">
                      ₹{settlement.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">to {settlement.to}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}