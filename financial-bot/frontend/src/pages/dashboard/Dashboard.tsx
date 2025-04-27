import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('month');

  // Sample data - replace with actual data from API
  const balanceHistory = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Balance',
        data: [1000, 1500, 1300, 1700, 1600, 2000],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const expensesByCategory = {
    labels: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'],
    datasets: [
      {
        data: [300, 200, 150, 400, 250],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  const incomeVsExpense = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Income',
        data: [500, 600, 550, 700],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Expense',
        data: [400, 450, 500, 400],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 rounded-md ${
              timeframe === 'week'
                ? 'bg-primary-100 text-primary-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-md ${
              timeframe === 'month'
                ? 'bg-primary-100 text-primary-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1 rounded-md ${
              timeframe === 'year'
                ? 'bg-primary-100 text-primary-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-900">Current Balance</h3>
          <p className="mt-2 text-3xl font-semibold text-primary-600">
            Rp 2,000,000
          </p>
          <p className="mt-1 text-sm text-gray-500">Updated just now</p>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            Rp 2,350,000
          </p>
          <p className="mt-1 text-sm text-gray-500">This month</p>
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">
            Rp 1,300,000
          </p>
          <p className="mt-1 text-sm text-gray-500">This month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Balance History
          </h3>
          <Line
            data={balanceHistory}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Expenses by Category
          </h3>
          <div className="aspect-square">
            <Doughnut
              data={expensesByCategory}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Income vs Expenses
        </h3>
        <Bar
          data={incomeVsExpense}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>

      {/* Recent Transactions */}
      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Transactions
          </h3>
          <Link
            to="/transactions"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {index % 2 === 0 ? 'Food & Drinks' : 'Transportation'}
                </p>
                <p className="text-xs text-gray-500">Today at 3:45 PM</p>
              </div>
              <p
                className={`text-sm font-medium ${
                  index % 2 === 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {index % 2 === 0 ? '-' : '+'}Rp 50,000
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
