import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  source: 'web' | 'whatsapp';
}

const Transactions = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  // Sample data - replace with actual data from API
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 5000000,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01',
      source: 'web',
    },
    {
      id: '2',
      type: 'expense',
      amount: 50000,
      category: 'Food',
      description: 'Lunch',
      date: '2024-01-02',
      source: 'whatsapp',
    },
    // Add more sample transactions...
  ];

  const handleAddTransaction = (formData: Partial<Transaction>) => {
    // TODO: Implement add transaction API call
    setIsAddModalOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    // TODO: Implement edit transaction API call
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    // TODO: Implement delete transaction API call
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType !== 'all' && transaction.type !== filterType) return false;
    if (dateRange.start && new Date(transaction.date) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(transaction.date) > new Date(dateRange.end)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <select
              id="type"
              className="input-field"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
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
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
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
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      Rp {transaction.amount.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      <Dialog
        open={isAddModalOpen || selectedTransaction !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedTransaction(null);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </Dialog.Title>

            <form className="space-y-4">
              {/* Form fields */}
              <div>
                <label htmlFor="type" className="form-label">
                  Type
                </label>
                <select id="type" className="input-field">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  className="input-field"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <input type="text" id="category" className="input-field" />
              </div>

              <div>
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea id="description" className="input-field" rows={3} />
              </div>

              <div>
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input type="date" id="date" className="input-field" />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setSelectedTransaction(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedTransaction ? 'Save Changes' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Transactions;
