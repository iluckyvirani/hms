import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Badge, Input, Select, Textarea } from '../../components/ui'

// Mock pharmacy expenses data
const mockPharmacyExpenses = [
  {
    id: 1,
    expenseCode: 'PHX-2026-0045',
    title: 'Medicine Refrigerator Repair',
    category: 'Equipment Maintenance',
    amount: 5000,
    expenseDate: '2026-03-10',
    paymentMode: 'UPI',
    paidTo: 'CoolTech Services',
    description: 'Repair of medicine storage refrigerator compressor',
    receipt: true,
    createdBy: 'Pharmacy Staff',
    createdAt: '2026-03-10T14:30:00',
  },
  {
    id: 2,
    expenseCode: 'PHX-2026-0044',
    title: 'Monthly Electricity Bill',
    category: 'Utilities',
    amount: 8500,
    expenseDate: '2026-03-05',
    paymentMode: 'Bank Transfer',
    paidTo: 'State Electricity Board',
    description: 'Pharmacy section electricity charges for February',
    receipt: true,
    createdBy: 'Admin',
    createdAt: '2026-03-05T11:00:00',
  },
  {
    id: 3,
    expenseCode: 'PHX-2026-0043',
    title: 'Medicine Labels & Stickers',
    category: 'Stationery',
    amount: 1200,
    expenseDate: '2026-03-03',
    paymentMode: 'Cash',
    paidTo: 'Print Zone',
    description: 'Medicine labels, warning stickers, dosage labels',
    receipt: false,
    createdBy: 'Pharmacy Staff',
    createdAt: '2026-03-03T09:15:00',
  },
  {
    id: 4,
    expenseCode: 'PHX-2026-0042',
    title: 'Pest Control Service',
    category: 'Maintenance',
    amount: 2500,
    expenseDate: '2026-03-01',
    paymentMode: 'Cash',
    paidTo: 'SafeGuard Pest Control',
    description: 'Monthly pest control service for pharmacy storage',
    receipt: true,
    createdBy: 'Admin',
    createdAt: '2026-03-01T10:00:00',
  },
  {
    id: 5,
    expenseCode: 'PHX-2026-0041',
    title: 'Staff Salary - Pharmacist',
    category: 'Salaries',
    amount: 35000,
    expenseDate: '2026-02-28',
    paymentMode: 'Bank Transfer',
    paidTo: 'Rajesh Kumar (Pharmacist)',
    description: 'February 2026 salary',
    receipt: true,
    createdBy: 'Admin',
    createdAt: '2026-02-28T16:00:00',
  },
  {
    id: 6,
    expenseCode: 'PHX-2026-0040',
    title: 'Medicine Disposal Service',
    category: 'Waste Management',
    amount: 3500,
    expenseDate: '2026-02-25',
    paymentMode: 'UPI',
    paidTo: 'BioMed Waste Solutions',
    description: 'Expired medicine disposal as per regulations',
    receipt: true,
    createdBy: 'Pharmacy Staff',
    createdAt: '2026-02-25T14:00:00',
  },
  {
    id: 7,
    expenseCode: 'PHX-2026-0039',
    title: 'New Medicine Shelves',
    category: 'Equipment',
    amount: 15000,
    expenseDate: '2026-02-20',
    paymentMode: 'Cash',
    paidTo: 'Industrial Furniture Co',
    description: 'Steel shelving units for medicine storage',
    receipt: true,
    createdBy: 'Admin',
    createdAt: '2026-02-20T11:30:00',
  },
  {
    id: 8,
    expenseCode: 'PHX-2026-0038',
    title: 'Billing Software Subscription',
    category: 'Software',
    amount: 2000,
    expenseDate: '2026-02-15',
    paymentMode: 'UPI',
    paidTo: 'PharmaBill Solutions',
    description: 'Monthly subscription for pharmacy billing software',
    receipt: true,
    createdBy: 'Admin',
    createdAt: '2026-02-15T09:00:00',
  },
]

const expenseCategories = [
  'All',
  'Salaries',
  'Utilities',
  'Equipment',
  'Equipment Maintenance',
  'Maintenance',
  'Stationery',
  'Software',
  'Waste Management',
  'Insurance',
  'Transportation',
  'Miscellaneous',
]

interface PharmacyExpense {
  id: number
  expenseCode: string
  title: string
  category: string
  amount: number
  expenseDate: string
  paymentMode: string
  paidTo: string
  description: string
  receipt: boolean
  createdBy: string
  createdAt: string
}

const PharmacyExpenses = () => {
  const navigate = useNavigate()
  const [expenses] = useState<PharmacyExpense[]>(mockPharmacyExpenses)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [dateRangeFilter, setDateRangeFilter] = useState('this-month')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<PharmacyExpense | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // New expense form state
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    paidTo: '',
    description: '',
    receipt: false,
  })

  // Calculate stats based on filter
  const getFilteredExpenses = () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.expenseDate)
      
      let inDateRange = true
      if (dateRangeFilter === 'this-month') {
        inDateRange = expenseDate >= startOfMonth
      } else if (dateRangeFilter === 'last-month') {
        inDateRange = expenseDate >= startOfLastMonth && expenseDate <= endOfLastMonth
      } else if (dateRangeFilter === 'this-year') {
        inDateRange = expenseDate >= startOfYear
      }

      const matchesSearch = 
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.expenseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.paidTo.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter

      return inDateRange && matchesSearch && matchesCategory
    })
  }

  const filteredExpenses = getFilteredExpenses()
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
  const expenseCount = filteredExpenses.length

  // Category-wise breakdown
  const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getPaymentModeBadge = (mode: string) => {
    const config: Record<string, { color: string }> = {
      'Cash': { color: 'bg-emerald-100 text-emerald-700' },
      'Bank Transfer': { color: 'bg-blue-100 text-blue-700' },
      'UPI': { color: 'bg-purple-100 text-purple-700' },
      'Card': { color: 'bg-amber-100 text-amber-700' },
      'Cheque': { color: 'bg-cyan-100 text-cyan-700' },
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${config[mode]?.color || 'bg-slate-100 text-slate-700'}`}>
        {mode}
      </span>
    )
  }

  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.category || !newExpense.amount) {
      alert('Please fill all required fields')
      return
    }

    const expense = {
      ...newExpense,
      id: Date.now(),
      expenseCode: `PHX-2026-${String(expenses.length + 1).padStart(4, '0')}`,
      amount: Number(newExpense.amount),
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
    }

    console.log('Adding expense:', expense)
    alert('Expense added successfully!')
    setShowAddModal(false)
    setNewExpense({
      title: '',
      category: '',
      amount: '',
      expenseDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash',
      paidTo: '',
      description: '',
      receipt: false,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pharmacy')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Pharmacy Expenses</h1>
            <p className="text-slate-500">Track and manage pharmacy-specific expenses</p>
          </div>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(totalExpenses)}</p>
              <p className="text-sm text-slate-500">Total Expenses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{expenseCount}</p>
              <p className="text-sm text-slate-500">Transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(categoryBreakdown['Salaries'] || 0)}</p>
              <p className="text-sm text-slate-500">Salaries</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(categoryBreakdown['Utilities'] || 0)}</p>
              <p className="text-sm text-slate-500">Utilities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Category-wise Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(categoryBreakdown).map(([category, amount]) => (
            <div key={category} className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 truncate">{category}</p>
              <p className="font-semibold text-slate-800">{formatCurrency(amount)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search expense title, code, vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={expenseCategories.map(cat => ({ value: cat, label: cat }))}
          />
          <Select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            options={[
              { value: 'this-month', label: 'This Month' },
              { value: 'last-month', label: 'Last Month' },
              { value: 'this-year', label: 'This Year' },
              { value: 'all', label: 'All Time' },
            ]}
          />
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Expense</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Paid To</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Payment Mode</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Receipt</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-800">{expense.title}</p>
                      <p className="text-xs text-slate-500">{expense.expenseCode}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{expense.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{formatDate(expense.expenseDate)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-red-600">{formatCurrency(expense.amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{expense.paidTo}</span>
                  </td>
                  <td className="px-4 py-3">
                    {getPaymentModeBadge(expense.paymentMode)}
                  </td>
                  <td className="px-4 py-3">
                    {expense.receipt ? (
                      <Badge variant="success">Yes</Badge>
                    ) : (
                      <Badge variant="warning">No</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedExpense(expense)
                          setShowDetailModal(true)
                        }}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredExpenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No expenses found</p>
            <p className="text-slate-400 text-sm">Try adjusting your filters or add a new expense</p>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Add Pharmacy Expense</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Expense Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  placeholder="e.g., Medicine Refrigerator Repair"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    options={[
                      { value: '', label: 'Select Category' },
                      ...expenseCategories.filter(c => c !== 'All').map(c => ({ value: c, label: c }))
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="₹0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Expense Date
                  </label>
                  <Input
                    type="date"
                    value={newExpense.expenseDate}
                    onChange={(e) => setNewExpense({...newExpense, expenseDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Mode
                  </label>
                  <Select
                    value={newExpense.paymentMode}
                    onChange={(e) => setNewExpense({...newExpense, paymentMode: e.target.value})}
                    options={[
                      { value: 'Cash', label: 'Cash' },
                      { value: 'Bank Transfer', label: 'Bank Transfer' },
                      { value: 'UPI', label: 'UPI' },
                      { value: 'Card', label: 'Card' },
                      { value: 'Cheque', label: 'Cheque' },
                    ]}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Paid To
                </label>
                <Input
                  value={newExpense.paidTo}
                  onChange={(e) => setNewExpense({...newExpense, paidTo: e.target.value})}
                  placeholder="Vendor/Person name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Additional details about the expense..."
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasReceipt"
                  checked={newExpense.receipt}
                  onChange={(e) => setNewExpense({...newExpense, receipt: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hasReceipt" className="text-sm text-slate-700">
                  Receipt/Bill available
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleAddExpense}>
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Detail Modal */}
      {showDetailModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Expense Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Expense Code</p>
                  <p className="font-mono text-slate-800">{selectedExpense.expenseCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(selectedExpense.amount)}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-medium text-slate-800 text-lg">{selectedExpense.title}</p>
                <p className="text-slate-500 text-sm mt-1">{selectedExpense.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="font-medium text-slate-800">{selectedExpense.category}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="font-medium text-slate-800">{formatDate(selectedExpense.expenseDate)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Paid To</p>
                  <p className="font-medium text-slate-800">{selectedExpense.paidTo}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Payment Mode</p>
                  {getPaymentModeBadge(selectedExpense.paymentMode)}
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Receipt</p>
                  {selectedExpense.receipt ? (
                    <Badge variant="success">Available</Badge>
                  ) : (
                    <Badge variant="warning">Not Available</Badge>
                  )}
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Created By</p>
                  <p className="font-medium text-slate-800">{selectedExpense.createdBy}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button variant="outline" className="flex-1">
                Edit
              </Button>
              <Button className="flex-1">
                Print
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PharmacyExpenses
