import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';

type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
type ReportType = 'income-expense' | 'category' | 'trend';

const Reports = () => {
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  const [reportType, setReportType] = useState<ReportType>('income-expense');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  // Sample data - replace with actual data from API
  const incomeExpenseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [5000000, 5500000, 4800000, 6000000, 5200000, 5800000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Expense',
        data: [3500000, 4000000, 3800000, 4200000, 3900000, 4100000],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const categoryData = {
    labels: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'],
    datasets: [
      {
        label: 'Expenses by Category',
        data: [2000000, 1500000, 1000000, 3000000, 800000],
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

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Net Savings',
        data: [1500000, 1800000, 1000000, 1800000, 1300000, 1700000],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <button className="btn-primary">Download Report</button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="reportType" className="form-label">
              Report Type
            </label>
            <select
              id="reportType"
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
            >
              <option value="income-expense">Income vs Expense</option>
              <option value="category">Category Analysis</option>
              <option value="trend">Trend Analysis</option>
            </select>
          </div>
          <div>
            <label htmlFor="period" className="form-label">
              Period
            </label>
            <select
              id="period"
              className="input-field"
              value={period}
              onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="form-label">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="input-field"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
            />
          </div>
          <div>
            <label htmlFor="endDate" className="form-label">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="input-field"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-primary-50 rounded-lg">
            <h3 className="text-sm font-medium text-primary-900">Total Income</h3>
            <p className="mt-2 text-2xl font-semibold text-primary-900">
              Rp 32,300,000
            </p>
            <p className="mt-1 text-sm text-primary-700">+12% from last period</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="text-sm font-medium text-red-900">Total Expenses</h3>
            <p className="mt-2 text-2xl font-semibold text-red-900">
              Rp 23,500,000
            </p>
            <p className="mt-1 text-sm text-red-700">+8% from last period</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-medium text-green-900">Net Savings</h3>
            <p className="mt-2 text-2xl font-semibold text-green-900">
              Rp 8,800,000
            </p>
            <p className="mt-1 text-sm text-green-700">+25% from last period</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-900">
              Largest Expense
            </h3>
            <p className="mt-2 text-2xl font-semibold text-yellow-900">Bills</p>
            <p className="mt-1 text-sm text-yellow-700">32% of total expenses</p>
          </div>
        </div>

        {/* Charts */}
        <div className="h-96">
          {reportType === 'income-expense' && (
            <Line
              data={incomeExpenseData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Income vs Expense Analysis',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}

          {reportType === 'category' && (
            <Bar
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Expense by Category',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}

          {reportType === 'trend' && (
            <Line
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Savings Trend Analysis',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>

        {/* Additional Analysis */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Top Spending Categories
              </h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Bills</span>
                  <span className="text-sm font-medium text-gray-900">32%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Food</span>
                  <span className="text-sm font-medium text-gray-900">25%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Transport</span>
                  <span className="text-sm font-medium text-gray-900">18%</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Budget Status
              </h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Categories Over Budget
                  </span>
                  <span className="text-sm font-medium text-red-600">2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Categories Near Limit
                  </span>
                  <span className="text-sm font-medium text-yellow-600">3</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Categories Under Budget
                  </span>
                  <span className="text-sm font-medium text-green-600">5</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
