import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Doughnut } from 'react-chartjs-2';

interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
}

interface Budget {
  id: string;
  name: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  totalBudget: number;
  totalSpent: number;
}

const Budget = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Sample data - replace with actual data from API
  const budgets: Budget[] = [
    {
      id: '1',
      name: 'Monthly Budget',
      period: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      categories: [
        {
          id: '1',
          name: 'Food & Drinks',
          limit: 2000000,
          spent: 1500000,
          color: 'rgb(255, 99, 132)',
        },
        {
          id: '2',
          name: 'Transportation',
          limit: 1000000,
          spent: 800000,
          color: 'rgb(54, 162, 235)',
        },
        // Add more categories...
      ],
      totalBudget: 5000000,
      totalSpent: 3500000,
    },
  ];

  const handleAddBudget = (formData: Partial<Budget>) => {
    // TODO: Implement add budget API call
    setIsAddModalOpen(false);
  };

  const handleEditBudget = (budget: Budget) => {
    // TODO: Implement edit budget API call
    setSelectedBudget(null);
  };

  const handleDeleteBudget = (id: string) => {
    // TODO: Implement delete budget API call
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Budget</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          Create Budget
        </button>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {budget.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(budget.startDate).toLocaleDateString()} -{' '}
                  {new Date(budget.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedBudget(budget)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBudget(budget.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart */}
              <div className="aspect-square">
                <Doughnut
                  data={{
                    labels: budget.categories.map((cat) => cat.name),
                    datasets: [
                      {
                        data: budget.categories.map((cat) => cat.spent),
                        backgroundColor: budget.categories.map((cat) => cat.color),
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        display: false,
                      },
                    },
                    cutout: '70%',
                  }}
                />
              </div>

              {/* Categories */}
              <div className="space-y-4">
                {budget.categories.map((category) => {
                  const percentage = (category.spent / category.limit) * 100;
                  return (
                    <div key={category.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage > 90
                              ? 'bg-red-600'
                              : percentage > 70
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Rp {category.spent.toLocaleString('id-ID')} /{' '}
                        Rp {category.limit.toLocaleString('id-ID')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Rp {budget.totalSpent.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">
                    Total Budget
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    Rp {budget.totalBudget.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (budget.totalSpent / budget.totalBudget) * 100 > 90
                        ? 'bg-red-600'
                        : (budget.totalSpent / budget.totalBudget) * 100 > 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        (budget.totalSpent / budget.totalBudget) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Budget Modal */}
      <Dialog
        open={isAddModalOpen || selectedBudget !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedBudget(null);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {selectedBudget ? 'Edit Budget' : 'Create Budget'}
            </Dialog.Title>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">
                  Budget Name
                </label>
                <input type="text" id="name" className="input-field" />
              </div>

              <div>
                <label htmlFor="period" className="form-label">
                  Period
                </label>
                <select id="period" className="input-field">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input type="date" id="startDate" className="input-field" />
                </div>
                <div>
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input type="date" id="endDate" className="input-field" />
                </div>
              </div>

              <div>
                <label className="form-label">Categories</label>
                <div className="space-y-2">
                  {/* Add dynamic category fields here */}
                </div>
                <button
                  type="button"
                  className="mt-2 text-sm text-primary-600 hover:text-primary-500"
                >
                  + Add Category
                </button>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setSelectedBudget(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedBudget ? 'Save Changes' : 'Create Budget'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Budget;
