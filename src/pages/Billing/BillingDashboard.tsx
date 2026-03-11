import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Select, Badge } from '../../components/ui'

// Mock bills data
const mockBills = [
  {
    id: 1,
    billNo: 'FNF-2026-0156',
    patientId: 'PT-2026-0042',
    patientName: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    admitId: 'IPD20260301001',
    admitDate: '2026-03-01',
    dischargeDate: '2026-03-10',
    roomNo: '201',
    roomType: 'AC',
    bed: 'A',
    doctor: 'Dr. Priya Shah',
    days: 9,
    roomCharges: 13500,
    serviceCharges: 4500,
    otherCharges: 2500,
    grossTotal: 20500,
    totalDeposits: 15000,
    balanceDue: 5500,
    refundDue: 0,
    paidAmount: 5500,
    paymentMode: 'Card',
    status: 'paid',
    generatedDate: '2026-03-10',
    generatedBy: 'Reception',
  },
  {
    id: 2,
    billNo: 'FNF-2026-0155',
    patientId: 'PT-2026-0038',
    patientName: 'Sunita Devi',
    phone: '+91 87654 32109',
    admitId: 'IPD20260228002',
    admitDate: '2026-02-28',
    dischargeDate: '2026-03-08',
    roomNo: '105',
    roomType: 'Non-AC',
    bed: 'B',
    doctor: 'Dr. Rajesh Patel',
    days: 8,
    roomCharges: 8000,
    serviceCharges: 3200,
    otherCharges: 1800,
    grossTotal: 13000,
    totalDeposits: 15000,
    balanceDue: 0,
    refundDue: 2000,
    paidAmount: 0,
    paymentMode: '',
    status: 'refund-pending',
    generatedDate: '2026-03-08',
    generatedBy: 'Admin',
  },
  {
    id: 3,
    billNo: 'FNF-2026-0154',
    patientId: 'PT-2026-0035',
    patientName: 'Amit Sharma',
    phone: '+91 76543 21098',
    admitId: 'IPD20260225003',
    admitDate: '2026-02-25',
    dischargeDate: '2026-03-05',
    roomNo: '301',
    roomType: 'Private',
    bed: 'A',
    doctor: 'Dr. Meera Gupta',
    days: 8,
    roomCharges: 20000,
    serviceCharges: 8500,
    otherCharges: 4000,
    grossTotal: 32500,
    totalDeposits: 25000,
    balanceDue: 7500,
    refundDue: 0,
    paidAmount: 0,
    paymentMode: '',
    status: 'pending',
    generatedDate: '2026-03-05',
    generatedBy: 'Reception',
  },
  {
    id: 4,
    billNo: 'FNF-2026-0153',
    patientId: 'PT-2026-0030',
    patientName: 'Priya Verma',
    phone: '+91 65432 10987',
    admitId: 'IPD20260220004',
    admitDate: '2026-02-20',
    dischargeDate: '2026-02-28',
    roomNo: '102',
    roomType: 'AC',
    bed: 'A',
    doctor: 'Dr. Vikram Singh',
    days: 8,
    roomCharges: 12000,
    serviceCharges: 5600,
    otherCharges: 2400,
    grossTotal: 20000,
    totalDeposits: 20000,
    balanceDue: 0,
    refundDue: 0,
    paidAmount: 0,
    paymentMode: '',
    status: 'paid',
    generatedDate: '2026-02-28',
    generatedBy: 'Reception',
  },
]

// Mock deposits data
const mockDeposits = [
  { id: 1, patientId: 'PT-2026-0042', admitId: 'IPD20260301001', date: '2026-03-01', amount: 10000, mode: 'Cash', receipt: 'DEP-2026-0312', status: 'received' },
  { id: 2, patientId: 'PT-2026-0042', admitId: 'IPD20260301001', date: '2026-03-05', amount: 5000, mode: 'UPI', receipt: 'DEP-2026-0318', status: 'received' },
  { id: 3, patientId: 'PT-2026-0035', admitId: 'IPD20260225003', date: '2026-02-25', amount: 15000, mode: 'Cash', receipt: 'DEP-2026-0285', status: 'received' },
  { id: 4, patientId: 'PT-2026-0035', admitId: 'IPD20260225003', date: '2026-03-01', amount: 10000, mode: 'Card', receipt: 'DEP-2026-0300', status: 'received' },
]

// Mock refunds data  
const mockRefunds = [
  { id: 1, billNo: 'FNF-2026-0155', patientId: 'PT-2026-0038', patientName: 'Sunita Devi', amount: 2000, status: 'pending', requestDate: '2026-03-08', processedDate: '', mode: '' },
]

const BillingDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'bills' | 'deposits' | 'refunds'>('bills')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [patientIdSearch, setPatientIdSearch] = useState('')
  const [showBillPreview, setShowBillPreview] = useState<typeof mockBills[0] | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState<typeof mockBills[0] | null>(null)
  const [showRefundModal, setShowRefundModal] = useState<typeof mockRefunds[0] | null>(null)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [refundMode, setRefundMode] = useState('Cash')

  // Filter bills
  const filteredBills = mockBills.filter(bill => {
    const matchesSearch = 
      bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.admitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.phone.includes(searchTerm)
    
    const matchesStatus = !statusFilter || bill.status === statusFilter
    
    const billDate = new Date(bill.generatedDate)
    const matchesDateFrom = !dateFrom || billDate >= new Date(dateFrom)
    const matchesDateTo = !dateTo || billDate <= new Date(dateTo)
    
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
  })

  // Stats calculations
  const totalBills = mockBills.length
  const pendingBills = mockBills.filter(b => b.status === 'pending').length
  const pendingAmount = mockBills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.balanceDue, 0)
  const totalRevenue = mockBills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.grossTotal, 0)
  const pendingRefunds = mockRefunds.filter(r => r.status === 'pending').length
  const refundAmount = mockRefunds.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
      'paid': { variant: 'success', label: 'Paid' },
      'pending': { variant: 'danger', label: 'Pending' },
      'partial': { variant: 'warning', label: 'Partial' },
      'refund-pending': { variant: 'info', label: 'Refund Pending' },
      'refund-processed': { variant: 'success', label: 'Refund Done' },
    }
    const c = config[status] || { variant: 'default' as const, label: status }
    return <Badge variant={c.variant}>{c.label}</Badge>
  }

  const handleGenerateBill = () => {
    if (!patientIdSearch.trim()) {
      alert('Please enter Patient ID or Admit ID')
      return
    }
    navigate(`/billing/generate?search=${patientIdSearch}`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Billing Management</h1>
          <p className="text-slate-500">Generate final bills, manage deposits and refunds</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Quick Generate Bill */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter Patient ID / Admit ID"
              value={patientIdSearch}
              onChange={(e) => setPatientIdSearch(e.target.value)}
              className="w-56"
            />
            <Button onClick={handleGenerateBill}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              Generate Bill
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalBills}</p>
              <p className="text-sm text-slate-500">Total Bills</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{pendingBills}</p>
              <p className="text-sm text-slate-500">Pending Bills</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">₹{pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Pending Amount</p>
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
              <p className="text-2xl font-bold text-emerald-600">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Collected</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">₹{refundAmount.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Refunds ({pendingRefunds})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="border-b border-slate-100">
          <div className="flex">
            {[
              { id: 'bills', label: 'Final Bills', count: totalBills },
              { id: 'deposits', label: 'Deposits', count: mockDeposits.length },
              { id: 'refunds', label: 'Refunds', count: pendingRefunds },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bills Tab */}
        {activeTab === 'bills' && (
          <div className="p-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by Bill No, Patient ID, Admit ID, Name, Phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-11 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex gap-3">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="From Date"
                  className="w-36"
                />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="To Date"
                  className="w-36"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: '', label: 'All Status' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'refund-pending', label: 'Refund Pending' },
                  ]}
                  className="w-40"
                />
              </div>
            </div>

            {/* Bills Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Bill No</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Admit ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stay Period</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Gross Total</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Deposits</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Balance</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBills.map(bill => (
                    <tr key={bill.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-blue-600">{bill.billNo}</span>
                        <p className="text-xs text-slate-400">{formatDate(bill.generatedDate)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{bill.patientName}</p>
                        <p className="text-xs text-slate-500">{bill.patientId} • {bill.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-slate-600">{bill.admitId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-700">{formatDate(bill.admitDate)}</p>
                        <p className="text-xs text-slate-500">to {formatDate(bill.dischargeDate)} ({bill.days} days)</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-slate-800">₹{bill.grossTotal.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-emerald-600">₹{bill.totalDeposits.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        {bill.balanceDue > 0 ? (
                          <span className="text-sm font-semibold text-red-600">₹{bill.balanceDue.toLocaleString()}</span>
                        ) : bill.refundDue > 0 ? (
                          <span className="text-sm font-semibold text-orange-600">-₹{bill.refundDue.toLocaleString()}</span>
                        ) : (
                          <span className="text-sm font-semibold text-emerald-600">₹0</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(bill.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setShowBillPreview(bill)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Bill"
                          >
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Print Bill"
                          >
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </button>
                          {bill.status === 'pending' && (
                            <button
                              onClick={() => setShowPaymentModal(bill)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              Collect
                            </button>
                          )}
                          {bill.status === 'refund-pending' && (
                            <button
                              onClick={() => {
                                const refund = mockRefunds.find(r => r.billNo === bill.billNo)
                                if (refund) setShowRefundModal(refund)
                              }}
                              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBills.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
                <p className="text-slate-500">No bills found</p>
              </div>
            )}
          </div>
        )}

        {/* Deposits Tab */}
        {activeTab === 'deposits' && (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Deposit Records</h3>
              <Button onClick={() => setShowDepositModal(true)}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Deposit
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Receipt No</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Patient ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Admit ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Mode</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockDeposits.map(deposit => (
                    <tr key={deposit.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-blue-600">{deposit.receipt}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-slate-600">{deposit.patientId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-slate-600">{deposit.admitId}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{formatDate(deposit.date)}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-emerald-600">₹{deposit.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{deposit.mode}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success">Received</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Print Receipt">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Refunds Tab */}
        {activeTab === 'refunds' && (
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-slate-800">Refund Management</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Bill No</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Refund Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Request Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockRefunds.map(refund => (
                    <tr key={refund.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-blue-600">{refund.billNo}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{refund.patientName}</p>
                        <p className="text-xs text-slate-500">{refund.patientId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-orange-600">₹{refund.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{formatDate(refund.requestDate)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={refund.status === 'pending' ? 'warning' : 'success'}>
                          {refund.status === 'pending' ? 'Pending' : 'Processed'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {refund.status === 'pending' && (
                          <button
                            onClick={() => setShowRefundModal(refund)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Process Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mockRefunds.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <p className="text-slate-500">No pending refunds</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bill Preview Modal */}
      {showBillPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Bill Preview - {showBillPreview.billNo}</h3>
              <div className="flex items-center gap-2">
                <Button onClick={() => window.print()}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </Button>
                <button
                  onClick={() => setShowBillPreview(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]" id="printable-bill">
              {/* Hospital Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                <h1 className="text-2xl font-bold text-slate-800">MEDICARE PRO HOSPITAL</h1>
                <p className="text-sm text-slate-600">123 Healthcare Avenue, Medical District, City - 400001</p>
                <p className="text-sm text-slate-600">Phone: 1800-MEDICARE | Email: care@medicarepro.com</p>
                <p className="text-lg font-semibold text-blue-600 mt-2">FINAL BILL / DISCHARGE SUMMARY</p>
              </div>

              {/* Bill & Patient Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p><span className="font-semibold">Bill No:</span> {showBillPreview.billNo}</p>
                  <p><span className="font-semibold">Date:</span> {formatDate(showBillPreview.generatedDate)}</p>
                  <p><span className="font-semibold">Admission ID:</span> {showBillPreview.admitId}</p>
                </div>
                <div className="text-right">
                  <p><span className="font-semibold">Admit Date:</span> {formatDate(showBillPreview.admitDate)}</p>
                  <p><span className="font-semibold">Discharge Date:</span> {formatDate(showBillPreview.dischargeDate)}</p>
                  <p><span className="font-semibold">Duration:</span> {showBillPreview.days} days</p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-slate-600">Patient Name:</span> <span className="font-medium">{showBillPreview.patientName}</span></p>
                  <p><span className="text-slate-600">Patient ID:</span> {showBillPreview.patientId}</p>
                  <p><span className="text-slate-600">Phone:</span> {showBillPreview.phone}</p>
                  <p><span className="text-slate-600">Doctor:</span> {showBillPreview.doctor}</p>
                  <p><span className="text-slate-600">Room:</span> {showBillPreview.roomNo} ({showBillPreview.roomType}, Bed {showBillPreview.bed})</p>
                </div>
              </div>

              {/* Charges Table */}
              <table className="w-full text-sm mb-4 border border-slate-200">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left px-3 py-2 border-b">Description</th>
                    <th className="text-right px-3 py-2 border-b">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-b">Room Charges ({showBillPreview.roomType} × {showBillPreview.days} days)</td>
                    <td className="text-right px-3 py-2 border-b">{showBillPreview.roomCharges.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">Service Charges</td>
                    <td className="text-right px-3 py-2 border-b">{showBillPreview.serviceCharges.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b">Other Charges (Doctor Visits, etc.)</td>
                    <td className="text-right px-3 py-2 border-b">{showBillPreview.otherCharges.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-800 text-white">
                    <td className="px-3 py-3 font-bold">GROSS TOTAL</td>
                    <td className="text-right px-3 py-3 font-bold">₹{showBillPreview.grossTotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Deposits */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-emerald-800 mb-2">Total Deposits Received</h4>
                <p className="text-xl font-bold text-emerald-700">₹{showBillPreview.totalDeposits.toLocaleString()}</p>
              </div>

              {/* Balance/Refund */}
              <div className={`rounded-lg p-4 mb-4 ${
                showBillPreview.balanceDue > 0 ? 'bg-red-50 border border-red-200' :
                showBillPreview.refundDue > 0 ? 'bg-orange-50 border border-orange-200' :
                'bg-emerald-50 border border-emerald-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-lg ${
                    showBillPreview.balanceDue > 0 ? 'text-red-800' :
                    showBillPreview.refundDue > 0 ? 'text-orange-800' :
                    'text-emerald-800'
                  }`}>
                    {showBillPreview.balanceDue > 0 ? 'BALANCE DUE' :
                     showBillPreview.refundDue > 0 ? 'REFUND DUE' :
                     'FULLY SETTLED'}
                  </span>
                  <span className={`text-2xl font-bold ${
                    showBillPreview.balanceDue > 0 ? 'text-red-800' :
                    showBillPreview.refundDue > 0 ? 'text-orange-800' :
                    'text-emerald-800'
                  }`}>
                    ₹{(showBillPreview.balanceDue > 0 ? showBillPreview.balanceDue :
                       showBillPreview.refundDue > 0 ? showBillPreview.refundDue : 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              {showBillPreview.status === 'paid' && (
                <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-3 text-center">
                  <p className="text-emerald-800 font-semibold">
                    ✓ PAID IN FULL - {showBillPreview.paymentMode} on {formatDate(showBillPreview.generatedDate)}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-sm text-slate-500 border-t border-slate-200 pt-4 mt-4">
                <p>Generated by: {showBillPreview.generatedBy}</p>
                <p className="mt-1 text-xs">This is a computer generated bill.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Collection Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Collect Payment</h3>
              <button
                onClick={() => setShowPaymentModal(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Bill No</p>
                <p className="font-semibold text-slate-800">{showPaymentModal.billNo}</p>
                <p className="text-sm text-slate-500 mt-2">Patient</p>
                <p className="font-medium text-slate-800">{showPaymentModal.patientName}</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-medium">Balance Due</span>
                  <span className="text-2xl font-bold text-red-700">₹{showPaymentModal.balanceDue.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode</label>
                <Select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  options={[
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Card', label: 'Card' },
                    { value: 'UPI', label: 'UPI' },
                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                    { value: 'Cheque', label: 'Cheque' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount Received</label>
                <Input
                  type="number"
                  defaultValue={showPaymentModal.balanceDue}
                  className="text-lg font-semibold"
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => {
                alert(`Payment of ₹${showPaymentModal.balanceDue} collected via ${paymentMode}`)
                setShowPaymentModal(null)
              }}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Process Refund</h3>
              <button
                onClick={() => setShowRefundModal(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Bill No</p>
                <p className="font-semibold text-slate-800">{showRefundModal.billNo}</p>
                <p className="text-sm text-slate-500 mt-2">Patient</p>
                <p className="font-medium text-slate-800">{showRefundModal.patientName}</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-orange-700 font-medium">Refund Amount</span>
                  <span className="text-2xl font-bold text-orange-700">₹{showRefundModal.amount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Refund Mode</label>
                <Select
                  value={refundMode}
                  onChange={(e) => setRefundMode(e.target.value)}
                  options={[
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Bank Transfer', label: 'Bank Transfer (NEFT/IMPS)' },
                    { value: 'UPI', label: 'UPI' },
                    { value: 'Cheque', label: 'Cheque' },
                  ]}
                />
              </div>

              {refundMode === 'Bank Transfer' && (
                <div className="space-y-3">
                  <Input placeholder="Account Number" />
                  <Input placeholder="IFSC Code" />
                  <Input placeholder="Account Holder Name" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                <Input placeholder="Optional remarks..." />
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRefundModal(null)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => {
                alert(`Refund of ₹${showRefundModal.amount} processed via ${refundMode}`)
                setShowRefundModal(null)
              }}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Process Refund
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Add Deposit</h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID / Admit ID</label>
                <Input placeholder="Enter Patient ID or Admit ID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <Input type="number" placeholder="Enter deposit amount" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode</label>
                <Select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  options={[
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Card', label: 'Card' },
                    { value: 'UPI', label: 'UPI' },
                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                    { value: 'Cheque', label: 'Cheque' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                <Input placeholder="Optional remarks..." />
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDepositModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => {
                alert('Deposit added successfully!')
                setShowDepositModal(false)
              }}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Add Deposit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillingDashboard
