import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Badge, Input, Select } from '../../components/ui'

// Mock suppliers data
const mockSuppliers = [
  {
    id: 1,
    supplierCode: 'SUP-001',
    name: 'MedSupply India Pvt Ltd',
    contactPerson: 'Rajesh Sharma',
    phone: '9876543210',
    email: 'contact@medsupplyindia.com',
    address: '123 Industrial Area, Phase 2, Delhi - 110001',
    gstNo: '07AAAAA0000A1Z5',
    panNo: 'AAAAA0000A',
    bankName: 'HDFC Bank',
    accountNo: '1234567890123',
    ifscCode: 'HDFC0001234',
    totalPurchases: 125000,
    totalPaid: 100000,
    pendingAmount: 25000,
    lastPurchaseDate: '2026-03-01',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    supplierCode: 'SUP-002',
    name: 'PharmaCare Distributors',
    contactPerson: 'Amit Patel',
    phone: '9876543211',
    email: 'sales@pharmacare.com',
    address: '456 Medicine Market, Ahmedabad - 380001',
    gstNo: '24BBBBB0000B1Z6',
    panNo: 'BBBBB0000B',
    bankName: 'ICICI Bank',
    accountNo: '9876543210987',
    ifscCode: 'ICIC0001234',
    totalPurchases: 85000,
    totalPaid: 85000,
    pendingAmount: 0,
    lastPurchaseDate: '2026-03-08',
    status: 'active',
    createdAt: '2024-03-20',
  },
  {
    id: 3,
    supplierCode: 'SUP-003',
    name: 'Global Pharma Ltd',
    contactPerson: 'Sunita Verma',
    phone: '9876543212',
    email: 'orders@globalpharma.co.in',
    address: '789 Pharma Hub, Mumbai - 400001',
    gstNo: '27CCCCC0000C1Z7',
    panNo: 'CCCCC0000C',
    bankName: 'State Bank of India',
    accountNo: '5678901234567',
    ifscCode: 'SBIN0001234',
    totalPurchases: 200000,
    totalPaid: 150000,
    pendingAmount: 50000,
    lastPurchaseDate: '2026-03-05',
    status: 'active',
    createdAt: '2023-11-10',
  },
  {
    id: 4,
    supplierCode: 'SUP-004',
    name: 'HealthCare Suppliers',
    contactPerson: 'Priya Singh',
    phone: '9876543213',
    email: 'info@healthcaresuppliers.in',
    address: '321 Medical Complex, Bangalore - 560001',
    gstNo: '29DDDDD0000D1Z8',
    panNo: 'DDDDD0000D',
    bankName: 'Axis Bank',
    accountNo: '2468013579246',
    ifscCode: 'UTIB0001234',
    totalPurchases: 45000,
    totalPaid: 45000,
    pendingAmount: 0,
    lastPurchaseDate: '2026-02-20',
    status: 'inactive',
    createdAt: '2024-06-05',
  },
]

// Mock purchase history data
const mockPurchaseHistory = [
  { id: 1, invoiceNo: 'INV-2026-0089', supplierId: 1, supplierName: 'MedSupply India Pvt Ltd', date: '2026-03-01', medicines: 5, totalAmount: 15000, paidAmount: 10000, pendingAmount: 5000, status: 'partial' },
  { id: 2, invoiceNo: 'INV-2026-0088', supplierId: 2, supplierName: 'PharmaCare Distributors', date: '2026-03-08', medicines: 3, totalAmount: 8500, paidAmount: 8500, pendingAmount: 0, status: 'paid' },
  { id: 3, invoiceNo: 'INV-2026-0087', supplierId: 3, supplierName: 'Global Pharma Ltd', date: '2026-03-05', medicines: 8, totalAmount: 25000, paidAmount: 15000, pendingAmount: 10000, status: 'partial' },
  { id: 4, invoiceNo: 'INV-2026-0086', supplierId: 1, supplierName: 'MedSupply India Pvt Ltd', date: '2026-02-28', medicines: 4, totalAmount: 12000, paidAmount: 12000, pendingAmount: 0, status: 'paid' },
  { id: 5, invoiceNo: 'INV-2026-0085', supplierId: 3, supplierName: 'Global Pharma Ltd', date: '2026-02-25', medicines: 6, totalAmount: 18000, paidAmount: 8000, pendingAmount: 10000, status: 'partial' },
]

interface Supplier {
  id: number
  supplierCode: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  gstNo: string
  panNo: string
  bankName: string
  accountNo: string
  ifscCode: string
  totalPurchases: number
  totalPaid: number
  pendingAmount: number
  lastPurchaseDate: string
  status: string
  createdAt: string
}

const SupplierManagement = () => {
  const navigate = useNavigate()
  const [suppliers] = useState<Supplier[]>(mockSuppliers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [activeTab, setActiveTab] = useState<'suppliers' | 'purchases'>('suppliers')

  // Stats
  const totalSuppliers = suppliers.filter(s => s.status === 'active').length
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0)
  const totalPaid = suppliers.reduce((sum, s) => sum + s.totalPaid, 0)
  const totalPending = suppliers.reduce((sum, s) => sum + s.pendingAmount, 0)

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)
    
    const matchesStatus = !statusFilter || supplier.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'success' | 'danger' | 'warning'; label: string }> = {
      'active': { variant: 'success', label: 'Active' },
      'inactive': { variant: 'danger', label: 'Inactive' },
      'paid': { variant: 'success', label: 'Paid' },
      'partial': { variant: 'warning', label: 'Partial' },
      'pending': { variant: 'danger', label: 'Pending' },
    }
    const statusInfo = config[status] || { variant: 'warning' as const, label: status }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

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

  const handleMakePayment = () => {
    if (!selectedSupplier || !paymentAmount) return
    
    console.log('Payment:', {
      supplierId: selectedSupplier.id,
      amount: paymentAmount,
      mode: paymentMode,
      date: new Date().toISOString(),
    })
    
    alert(`Payment of ${formatCurrency(Number(paymentAmount))} recorded for ${selectedSupplier.name}`)
    setShowPaymentModal(false)
    setPaymentAmount('')
    setSelectedSupplier(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pharmacy/inventory')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Supplier Management</h1>
            <p className="text-slate-500">Manage suppliers, purchases and payments</p>
          </div>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Supplier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalSuppliers}</p>
              <p className="text-sm text-slate-500">Active Suppliers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(totalPurchases)}</p>
              <p className="text-sm text-slate-500">Total Purchases</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(totalPaid)}</p>
              <p className="text-sm text-slate-500">Total Paid</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">{formatCurrency(totalPending)}</p>
              <p className="text-sm text-slate-500">Pending Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'suppliers'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Suppliers
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'purchases'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Purchase History
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search supplier name, code, contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>
      </div>

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Total Purchases</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Pending</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Last Purchase</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.map(supplier => (
                  <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-800">{supplier.name}</p>
                        <p className="text-xs text-slate-500">{supplier.supplierCode}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-slate-800">{supplier.contactPerson}</p>
                        <p className="text-xs text-slate-500">{supplier.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-800">{formatCurrency(supplier.totalPurchases)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-emerald-600">{formatCurrency(supplier.totalPaid)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${supplier.pendingAmount > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                        {formatCurrency(supplier.pendingAmount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{formatDate(supplier.lastPurchaseDate)}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(supplier.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedSupplier(supplier)
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
                        {supplier.pendingAmount > 0 && (
                          <button
                            onClick={() => {
                              setSelectedSupplier(supplier)
                              setShowPaymentModal(true)
                            }}
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Make Payment"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/pharmacy/suppliers/${supplier.id}/edit`)}
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
          {filteredSuppliers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">No suppliers found</p>
              <p className="text-slate-400 text-sm">Try adjusting your search or add a new supplier</p>
            </div>
          )}
        </div>
      )}

      {/* Purchase History Tab */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Medicines</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Total Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Pending</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockPurchaseHistory.map(purchase => (
                  <tr key={purchase.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">{purchase.invoiceNo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{purchase.supplierName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{formatDate(purchase.date)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{purchase.medicines} items</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-800">{formatCurrency(purchase.totalAmount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-emerald-600">{formatCurrency(purchase.paidAmount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${purchase.pendingAmount > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                        {formatCurrency(purchase.pendingAmount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(purchase.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Print"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Supplier Detail Modal */}
      {showDetailModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Supplier Details</h2>
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
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800">{selectedSupplier.name}</h3>
                  <p className="text-slate-500">{selectedSupplier.supplierCode}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(selectedSupplier.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Contact Person</p>
                  <p className="font-medium text-slate-800">{selectedSupplier.contactPerson}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium text-slate-800">{selectedSupplier.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-slate-800">{selectedSupplier.email}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">GST No</p>
                  <p className="font-medium text-slate-800">{selectedSupplier.gstNo}</p>
                </div>
                <div className="md:col-span-2 bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium text-slate-800">{selectedSupplier.address}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-semibold text-slate-800 mb-3">Financial Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-purple-600">Total Purchases</p>
                    <p className="text-xl font-bold text-purple-700">{formatCurrency(selectedSupplier.totalPurchases)}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-sm text-emerald-600">Total Paid</p>
                    <p className="text-xl font-bold text-emerald-700">{formatCurrency(selectedSupplier.totalPaid)}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-sm text-red-600">Pending Amount</p>
                    <p className="text-xl font-bold text-red-700">{formatCurrency(selectedSupplier.pendingAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-semibold text-slate-800 mb-3">Bank Details</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Bank Name</p>
                    <p className="font-medium text-slate-800">{selectedSupplier.bankName}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Account No</p>
                    <p className="font-medium text-slate-800">{selectedSupplier.accountNo}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">IFSC Code</p>
                    <p className="font-medium text-slate-800">{selectedSupplier.ifscCode}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              {selectedSupplier.pendingAmount > 0 && (
                <Button className="flex-1" onClick={() => {
                  setShowDetailModal(false)
                  setShowPaymentModal(true)
                }}>
                  Make Payment
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Make Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Supplier</p>
                <p className="font-medium text-slate-800">{selectedSupplier.name}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-sm text-red-600">Pending Amount</p>
                <p className="text-xl font-bold text-red-700">{formatCurrency(selectedSupplier.pendingAmount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Payment Amount
                </label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Payment Mode
                </label>
                <Select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  options={[
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                    { value: 'UPI', label: 'UPI' },
                    { value: 'Cheque', label: 'Cheque' },
                  ]}
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleMakePayment} disabled={!paymentAmount}>
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Add New Supplier</h2>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name *</label>
                  <Input placeholder="Enter supplier name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person *</label>
                  <Input placeholder="Enter contact person name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <Input type="email" placeholder="Enter email" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <Input placeholder="Enter full address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GST No</label>
                  <Input placeholder="Enter GST number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">PAN No</label>
                  <Input placeholder="Enter PAN number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                  <Input placeholder="Enter bank name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account No</label>
                  <Input placeholder="Enter account number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                  <Input placeholder="Enter IFSC code" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <Select
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => {
                alert('Supplier added successfully!')
                setShowAddModal(false)
              }}>
                Add Supplier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierManagement
