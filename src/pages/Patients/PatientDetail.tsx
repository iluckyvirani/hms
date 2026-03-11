import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Badge } from '../../components/ui'

// Mock patient data
const mockPatient = {
  id: 1,
  patientId: 'PT20260001',
  name: 'Rahul Sharma',
  age: 45,
  gender: 'male',
  phone: '9876543210',
  aadhar: '123456789012',
  address: '123 Main Street, Andheri West, Mumbai - 400058',
  emergencyContact: '9876543211',
  emergencyName: 'Priya Sharma (Wife)',
  email: 'rahul.sharma@email.com',
  bloodGroup: 'O+',
  allergies: 'Penicillin',
  lastVisit: '2026-03-11',
  totalVisits: 8,
  totalAdmits: 2,
  status: 'active',
  createdAt: '2024-05-15',
}

// Mock admit history
const mockAdmitHistory = [
  { id: 1, admitId: 'IPD20260311001', admitDate: '2026-03-09', dischargeDate: null, room: '201', roomType: 'Non-AC', bed: 'A', doctor: 'Dr. Priya Shah', days: 3, totalBill: 8500, status: 'admitted' },
  { id: 2, admitId: 'IPD20250815002', admitDate: '2025-08-15', dischargeDate: '2025-08-20', room: '105', roomType: 'AC', bed: 'B', doctor: 'Dr. Rajesh Patel', days: 5, totalBill: 15000, status: 'discharged' },
]

// Mock reports
const mockReports = [
  { id: 1, name: 'Blood Test Report', type: 'Lab Report', date: '2026-03-10', uploadedBy: 'Dr. Priya Shah', fileType: 'pdf' },
  { id: 2, name: 'Chest X-Ray', type: 'Radiology', date: '2026-03-09', uploadedBy: 'Radiology Dept', fileType: 'image' },
  { id: 3, name: 'ECG Report', type: 'Cardiology', date: '2026-03-09', uploadedBy: 'Dr. Priya Shah', fileType: 'pdf' },
  { id: 4, name: 'Previous Discharge Summary', type: 'Document', date: '2025-08-20', uploadedBy: 'Reception', fileType: 'pdf' },
]

// Mock medicine history
const mockMedicineHistory = [
  { id: 1, date: '2026-03-10', medicines: ['Paracetamol 500mg', 'Amoxicillin 250mg', 'Omeprazole 20mg'], prescribedBy: 'Dr. Priya Shah', dispensed: true, amount: 350 },
  { id: 2, date: '2026-03-09', medicines: ['Aspirin 75mg', 'Atorvastatin 10mg'], prescribedBy: 'Dr. Priya Shah', dispensed: true, amount: 180 },
  { id: 3, date: '2025-08-18', medicines: ['Metformin 500mg', 'Losartan 50mg'], prescribedBy: 'Dr. Rajesh Patel', dispensed: true, amount: 420 },
]

// Mock services
const mockServices = [
  { id: 1, date: '2026-03-11', service: 'Nursing Care', fee: 300, admitId: 'IPD20260311001' },
  { id: 2, date: '2026-03-10', service: 'ECG', fee: 500, admitId: 'IPD20260311001' },
  { id: 3, date: '2026-03-10', service: 'BP Monitoring', fee: 50, admitId: 'IPD20260311001' },
  { id: 4, date: '2026-03-09', service: 'Blood Sugar Test', fee: 100, admitId: 'IPD20260311001' },
  { id: 5, date: '2025-08-17', service: 'X-Ray', fee: 800, admitId: 'IPD20250815002' },
]

// Mock payments
const mockPayments = [
  { id: 1, date: '2026-03-11', type: 'Deposit', amount: 15000, mode: 'UPI', receipt: 'RCP-2026-0342', reference: 'IPD20260311001' },
  { id: 2, date: '2026-03-09', type: 'OPD Fee', amount: 500, mode: 'Cash', receipt: 'RCP-2026-0340', reference: 'OPD-0042' },
  { id: 3, date: '2025-08-20', type: 'Final Bill', amount: 5000, mode: 'Card', receipt: 'RCP-2025-1523', reference: 'IPD20250815002' },
  { id: 4, date: '2025-08-15', type: 'Deposit', amount: 10000, mode: 'Cash', receipt: 'RCP-2025-1480', reference: 'IPD20250815002' },
]

// Mock final bills (FnF)
const mockFinalBills = [
  {
    id: 1,
    billNo: 'FNF-2025-0892',
    admitId: 'IPD20250815002',
    admitDate: '2025-08-15',
    dischargeDate: '2025-08-20',
    room: '105',
    roomType: 'AC',
    bed: 'B',
    doctor: 'Dr. Rajesh Patel',
    days: 5,
    roomCharges: 7500,
    services: [
      { name: 'Nursing Care', qty: 5, rate: 300, total: 1500 },
      { name: 'X-Ray', qty: 1, rate: 800, total: 800 },
      { name: 'Blood Tests', qty: 2, rate: 100, total: 200 },
      { name: 'Dressing', qty: 3, rate: 200, total: 600 },
    ],
    serviceTotal: 3100,
    otherCharges: [
      { name: 'Doctor Visits', qty: 3, rate: 500, total: 1500 },
      { name: 'Emergency Charges', qty: 1, rate: 500, total: 500 },
    ],
    otherTotal: 2000,
    grossTotal: 12600,
    deposits: [
      { date: '2025-08-15', mode: 'Cash', amount: 10000 },
    ],
    totalDeposits: 10000,
    balanceDue: 2600,
    refundDue: 0,
    paymentReceived: 2600,
    paymentMode: 'Card',
    status: 'paid',
    generatedDate: '2025-08-20',
    generatedBy: 'Reception',
  },
]

// Current admission bill data (for generate bill)
const currentAdmissionBillData = {
  admitId: 'IPD20260311001',
  admitDate: '2026-03-09',
  room: '201',
  roomType: 'Non-AC',
  roomRate: 1000,
  bed: 'A',
  doctor: 'Dr. Priya Shah',
  days: 3,
  roomCharges: 3000,
  services: [
    { name: 'Nursing Care', qty: 3, rate: 300, total: 900 },
    { name: 'ECG', qty: 1, rate: 500, total: 500 },
    { name: 'BP Monitoring', qty: 2, rate: 50, total: 100 },
    { name: 'Blood Sugar Test', qty: 1, rate: 100, total: 100 },
  ],
  serviceTotal: 1600,
  otherCharges: [
    { name: 'Doctor Visits', qty: 2, rate: 500, total: 1000 },
  ],
  otherTotal: 1000,
  grossTotal: 5600,
  deposits: [
    { date: '2026-03-09', mode: 'UPI', amount: 15000 },
  ],
  totalDeposits: 15000,
}

type TabType = 'profile' | 'admits' | 'reports' | 'medicines' | 'services' | 'payments' | 'bills'

const PatientDetail = () => {
  const navigate = useNavigate()
  const { id: patientId } = useParams()
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showGenerateBillModal, setShowGenerateBillModal] = useState(false)
  const [showPrintBill, setShowPrintBill] = useState<typeof mockFinalBills[0] | null>(null)
  const [billPaymentMode, setBillPaymentMode] = useState('Cash')

  // In real app, fetch patient by patientId
  const patient = { ...mockPatient, id: Number(patientId) || mockPatient.id }

  const tabs: { id: TabType; label: string; icon: ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { id: 'admits', label: 'Admit History', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { id: 'reports', label: 'Reports', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: 'medicines', label: 'Medicines', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
    { id: 'services', label: 'Services', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
    { id: 'payments', label: 'Payments', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'bills', label: 'Final Bills', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg> },
  ]

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const maskAadhar = (aadhar: string) => {
    return `${aadhar.slice(0, 4)}-${aadhar.slice(4, 8)}-${aadhar.slice(8)}`
  }

  const getPaymentTypeBadge = (type: string) => {
    const config: Record<string, { color: string }> = {
      'OPD Fee': { color: 'bg-blue-100 text-blue-700' },
      'Deposit': { color: 'bg-emerald-100 text-emerald-700' },
      'Final Bill': { color: 'bg-purple-100 text-purple-700' },
      'Service': { color: 'bg-amber-100 text-amber-700' },
      'Medicine': { color: 'bg-cyan-100 text-cyan-700' },
      'Refund': { color: 'bg-red-100 text-red-700' },
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${config[type]?.color || 'bg-slate-100 text-slate-700'}`}>
        {type}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/patients')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">Patient Details</h1>
          <p className="text-slate-500">{patient.patientId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/opd/register')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New OPD
          </Button>
          <Button onClick={() => navigate('/ipd/admit')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Admit Patient
          </Button>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-slate-800">{patient.name}</h2>
              <Badge variant={patient.status === 'admitted' ? 'info' : 'success'}>
                {patient.status === 'admitted' ? 'Currently Admitted' : 'Active'}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span>{patient.age} years • {patient.gender === 'male' ? 'Male' : 'Female'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {patient.phone}
              </span>
              <span>•</span>
              <span className="font-mono">{maskAadhar(patient.aadhar)}</span>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div className="px-4 py-2 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{patient.totalVisits}</p>
              <p className="text-xs text-blue-600">OPD Visits</p>
            </div>
            <div className="px-4 py-2 bg-purple-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">{patient.totalAdmits}</p>
              <p className="text-xs text-purple-600">Admissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Basic Information
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Full Name</span>
                    <span className="font-medium text-slate-800">{patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Age</span>
                    <span className="font-medium text-slate-800">{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gender</span>
                    <span className="font-medium text-slate-800">{patient.gender === 'male' ? 'Male' : 'Female'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Group</span>
                    <span className="font-medium text-slate-800">{patient.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Allergies</span>
                    <span className="font-medium text-red-600">{patient.allergies || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Details
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-medium text-slate-800">{patient.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-800">{patient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aadhar</span>
                    <span className="font-medium font-mono text-slate-800">{maskAadhar(patient.aadhar)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Address</span>
                    <p className="font-medium text-slate-800 mt-1">{patient.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Emergency Contact
                </h3>
                <div className="bg-red-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-red-600">Name</span>
                    <span className="font-medium text-slate-800">{patient.emergencyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Phone</span>
                    <span className="font-medium text-slate-800">{patient.emergencyContact}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Registration Info
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient ID</span>
                    <span className="font-medium font-mono text-slate-800">{patient.patientId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registered On</span>
                    <span className="font-medium text-slate-800">{formatDate(patient.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Visit</span>
                    <span className="font-medium text-slate-800">{formatDate(patient.lastVisit)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admit History Tab */}
          {activeTab === 'admits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Admission History</h3>
                <span className="text-sm text-slate-500">{mockAdmitHistory.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Admit ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Admit Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Discharge</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Room</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Doctor</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Days</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Bill</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockAdmitHistory.map(admit => (
                      <tr key={admit.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-blue-600">{admit.admitId}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{formatDate(admit.admitDate)}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {admit.dischargeDate ? formatDate(admit.dischargeDate) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-700">{admit.room}/{admit.bed}</span>
                          <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">{admit.roomType}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{admit.doctor}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{admit.days}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">₹{admit.totalBill.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <Badge variant={admit.status === 'admitted' ? 'info' : 'success'}>
                            {admit.status === 'admitted' ? 'Admitted' : 'Discharged'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Medical Reports & Documents</h3>
                <Button size="sm" onClick={() => setShowUploadModal(true)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Report
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockReports.map(report => (
                  <div key={report.id} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${report.fileType === 'pdf' ? 'bg-red-100' : 'bg-blue-100'}`}>
                        {report.fileType === 'pdf' ? (
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{report.name}</p>
                        <p className="text-xs text-slate-500">{report.type}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(report.date)} • {report.uploadedBy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medicine History Tab */}
          {activeTab === 'medicines' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Medicine History</h3>
                <span className="text-sm text-slate-500">{mockMedicineHistory.length} prescriptions</span>
              </div>
              <div className="space-y-4">
                {mockMedicineHistory.map(record => (
                  <div key={record.id} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-slate-800">{formatDate(record.date)}</p>
                        <p className="text-sm text-slate-500">Prescribed by {record.prescribedBy}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">₹{record.amount}</p>
                        <Badge variant={record.dispensed ? 'success' : 'warning'}>
                          {record.dispensed ? 'Dispensed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {record.medicines.map((med, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white rounded-lg text-sm text-slate-700 border border-slate-200">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Services Taken</h3>
                <span className="text-sm text-slate-500">
                  Total: ₹{mockServices.reduce((sum, s) => sum + s.fee, 0).toLocaleString()}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Fee</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Admit ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockServices.map(service => (
                      <tr key={service.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">{formatDate(service.date)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{service.service}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">₹{service.fee}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-blue-600">{service.admitId}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Payment History</h3>
                <span className="text-sm text-slate-500">
                  Total Paid: ₹{mockPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Mode</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Receipt</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">{formatDate(payment.date)}</td>
                        <td className="px-4 py-3">{getPaymentTypeBadge(payment.type)}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-emerald-600">₹{payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{payment.mode}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-slate-600">{payment.receipt}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-blue-600">{payment.reference}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Final Bills Tab */}
          {activeTab === 'bills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Final Bill History (FnF)</h3>
                <Button onClick={() => setShowGenerateBillModal(true)}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                  Generate Final Bill
                </Button>
              </div>
              
              {mockFinalBills.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                  <p className="text-slate-500">No final bills generated yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Bill No</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Admission</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stay Period</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Gross Total</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Deposits</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Balance</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockFinalBills.map(bill => (
                        <tr key={bill.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm font-semibold text-blue-600">{bill.billNo}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-slate-600">{bill.admitId}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {formatDate(bill.admitDate)} - {formatDate(bill.dischargeDate)}
                            <span className="text-xs text-slate-400 ml-1">({bill.days} days)</span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">₹{bill.grossTotal.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-emerald-600">₹{bill.totalDeposits.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            {bill.balanceDue > 0 ? (
                              <span className="text-sm font-semibold text-red-600">₹{bill.balanceDue.toLocaleString()} Due</span>
                            ) : bill.refundDue > 0 ? (
                              <span className="text-sm font-semibold text-orange-600">₹{bill.refundDue.toLocaleString()} Refund</span>
                            ) : (
                              <span className="text-sm font-semibold text-emerald-600">Settled</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              bill.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                              bill.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {bill.status === 'paid' ? 'Paid' : bill.status === 'partial' ? 'Partial' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setShowPrintBill(bill)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                              Print
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Upload Report</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Report Name</label>
                <input
                  type="text"
                  placeholder="e.g., Blood Test Report"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Report Type</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>Lab Report</option>
                  <option>Radiology</option>
                  <option>Cardiology</option>
                  <option>Document</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload File</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => setShowUploadModal(false)}>
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Final Bill Modal */}
      {showGenerateBillModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Generate Final Bill (FnF)</h3>
              <button
                onClick={() => setShowGenerateBillModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Admission Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-800 mb-2">Current Admission</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-blue-600">Admit ID:</span> <span className="font-mono">{currentAdmissionBillData.admitId}</span></div>
                  <div><span className="text-blue-600">Admit Date:</span> {formatDate(currentAdmissionBillData.admitDate)}</div>
                  <div><span className="text-blue-600">Room:</span> {currentAdmissionBillData.room} ({currentAdmissionBillData.roomType})</div>
                  <div><span className="text-blue-600">Doctor:</span> {currentAdmissionBillData.doctor}</div>
                </div>
              </div>

              {/* Room Charges */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h4 className="font-medium text-slate-700">Room Charges</h4>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">{currentAdmissionBillData.roomType} Room × {currentAdmissionBillData.days} days @ ₹{currentAdmissionBillData.roomRate}/day</span>
                    <span className="font-semibold">₹{currentAdmissionBillData.roomCharges.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h4 className="font-medium text-slate-700">Services</h4>
                </div>
                <div className="p-4 space-y-2">
                  {currentAdmissionBillData.services.map((svc, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{svc.name} × {svc.qty} @ ₹{svc.rate}</span>
                      <span>₹{svc.total.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-slate-100">
                    <span>Service Total</span>
                    <span>₹{currentAdmissionBillData.serviceTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Other Charges */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h4 className="font-medium text-slate-700">Other Charges</h4>
                </div>
                <div className="p-4 space-y-2">
                  {currentAdmissionBillData.otherCharges.map((charge, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{charge.name} × {charge.qty} @ ₹{charge.rate}</span>
                      <span>₹{charge.total.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-slate-100">
                    <span>Other Total</span>
                    <span>₹{currentAdmissionBillData.otherTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-slate-800 text-white rounded-xl p-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Gross Total</span>
                  <span>₹{currentAdmissionBillData.grossTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Deposits */}
              <div className="border border-emerald-200 bg-emerald-50 rounded-xl overflow-hidden">
                <div className="bg-emerald-100 px-4 py-2 border-b border-emerald-200">
                  <h4 className="font-medium text-emerald-700">Deposits Received</h4>
                </div>
                <div className="p-4 space-y-2">
                  {currentAdmissionBillData.deposits.map((dep, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-emerald-700">{formatDate(dep.date)} ({dep.mode})</span>
                      <span className="font-semibold text-emerald-700">₹{dep.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-emerald-200">
                    <span className="text-emerald-800">Total Deposits</span>
                    <span className="text-emerald-800">₹{currentAdmissionBillData.totalDeposits.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Balance/Refund */}
              {currentAdmissionBillData.totalDeposits > currentAdmissionBillData.grossTotal ? (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex justify-between items-center text-lg font-semibold text-orange-700">
                    <span>Refund Due to Patient</span>
                    <span>₹{(currentAdmissionBillData.totalDeposits - currentAdmissionBillData.grossTotal).toLocaleString()}</span>
                  </div>
                </div>
              ) : currentAdmissionBillData.totalDeposits < currentAdmissionBillData.grossTotal ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex justify-between items-center text-lg font-semibold text-red-700">
                    <span>Balance Due from Patient</span>
                    <span>₹{(currentAdmissionBillData.grossTotal - currentAdmissionBillData.totalDeposits).toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex justify-between items-center text-lg font-semibold text-emerald-700">
                    <span>Balance</span>
                    <span>₹0 (Fully Settled)</span>
                  </div>
                </div>
              )}

              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode for Balance</label>
                <select 
                  value={billPaymentMode}
                  onChange={(e) => setBillPaymentMode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3 border-t border-slate-100">
              <Button variant="outline" className="flex-1" onClick={() => setShowGenerateBillModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => {
                alert('Final Bill Generated Successfully!')
                setShowGenerateBillModal(false)
              }}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Generate & Print Bill
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Print Bill View */}
      {showPrintBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 print:hidden">
              <h3 className="text-lg font-semibold text-slate-800">Final Bill - {showPrintBill.billNo}</h3>
              <div className="flex items-center gap-2">
                <Button onClick={() => window.print()}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </Button>
                <button
                  onClick={() => setShowPrintBill(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[75vh] print:max-h-none print:overflow-visible" id="printable-bill">
              {/* Hospital Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                <h1 className="text-2xl font-bold text-slate-800">MEDICARE PRO HOSPITAL</h1>
                <p className="text-sm text-slate-600">123 Healthcare Avenue, Medical District, City - 400001</p>
                <p className="text-sm text-slate-600">Phone: 1800-MEDICARE | Email: care@medicarepro.com</p>
                <p className="text-lg font-semibold text-blue-600 mt-2">FINAL BILL / DISCHARGE SUMMARY</p>
              </div>

              {/* Bill Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p><span className="font-semibold">Bill No:</span> {showPrintBill.billNo}</p>
                  <p><span className="font-semibold">Date:</span> {formatDate(showPrintBill.generatedDate)}</p>
                  <p><span className="font-semibold">Admission ID:</span> {showPrintBill.admitId}</p>
                </div>
                <div className="text-right">
                  <p><span className="font-semibold">Admit Date:</span> {formatDate(showPrintBill.admitDate)}</p>
                  <p><span className="font-semibold">Discharge Date:</span> {formatDate(showPrintBill.dischargeDate)}</p>
                  <p><span className="font-semibold">Stay Duration:</span> {showPrintBill.days} days</p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-slate-800 mb-2">Patient Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-slate-600">Name:</span> {patient.name}</p>
                  <p><span className="text-slate-600">Patient ID:</span> {patient.patientId}</p>
                  <p><span className="text-slate-600">Age/Gender:</span> {patient.age} yrs / {patient.gender}</p>
                  <p><span className="text-slate-600">Phone:</span> {patient.phone}</p>
                  <p><span className="text-slate-600">Room:</span> {showPrintBill.room} (Bed {showPrintBill.bed})</p>
                  <p><span className="text-slate-600">Room Type:</span> {showPrintBill.roomType}</p>
                  <p className="col-span-2"><span className="text-slate-600">Doctor:</span> {showPrintBill.doctor}</p>
                </div>
              </div>

              {/* Charges Table */}
              <table className="w-full text-sm mb-4 border border-slate-200">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left px-3 py-2 border-b border-slate-200">Description</th>
                    <th className="text-center px-3 py-2 border-b border-slate-200">Qty</th>
                    <th className="text-right px-3 py-2 border-b border-slate-200">Rate (₹)</th>
                    <th className="text-right px-3 py-2 border-b border-slate-200">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Room Charges */}
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="px-3 py-2 font-semibold text-blue-800 border-b border-slate-200">Room Charges</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-slate-100">{showPrintBill.roomType} Room</td>
                    <td className="text-center px-3 py-2 border-b border-slate-100">{showPrintBill.days}</td>
                    <td className="text-right px-3 py-2 border-b border-slate-100">{(showPrintBill.roomCharges / showPrintBill.days).toLocaleString()}</td>
                    <td className="text-right px-3 py-2 border-b border-slate-100 font-medium">{showPrintBill.roomCharges.toLocaleString()}</td>
                  </tr>

                  {/* Services */}
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="px-3 py-2 font-semibold text-blue-800 border-b border-slate-200">Services</td>
                  </tr>
                  {showPrintBill.services.map((svc, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 border-b border-slate-100">{svc.name}</td>
                      <td className="text-center px-3 py-2 border-b border-slate-100">{svc.qty}</td>
                      <td className="text-right px-3 py-2 border-b border-slate-100">{svc.rate.toLocaleString()}</td>
                      <td className="text-right px-3 py-2 border-b border-slate-100">{svc.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50">
                    <td colSpan={3} className="px-3 py-2 text-right font-medium border-b border-slate-200">Services Subtotal</td>
                    <td className="text-right px-3 py-2 font-medium border-b border-slate-200">₹{showPrintBill.serviceTotal.toLocaleString()}</td>
                  </tr>

                  {/* Other Charges */}
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="px-3 py-2 font-semibold text-blue-800 border-b border-slate-200">Other Charges</td>
                  </tr>
                  {showPrintBill.otherCharges.map((charge, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 border-b border-slate-100">{charge.name}</td>
                      <td className="text-center px-3 py-2 border-b border-slate-100">{charge.qty}</td>
                      <td className="text-right px-3 py-2 border-b border-slate-100">{charge.rate.toLocaleString()}</td>
                      <td className="text-right px-3 py-2 border-b border-slate-100">{charge.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50">
                    <td colSpan={3} className="px-3 py-2 text-right font-medium border-b border-slate-200">Other Subtotal</td>
                    <td className="text-right px-3 py-2 font-medium border-b border-slate-200">₹{showPrintBill.otherTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-800 text-white">
                    <td colSpan={3} className="px-3 py-3 text-right font-bold text-lg">GROSS TOTAL</td>
                    <td className="text-right px-3 py-3 font-bold text-lg">₹{showPrintBill.grossTotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Deposits */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-emerald-800 mb-2">Deposits Received</h4>
                <table className="w-full text-sm">
                  <tbody>
                    {showPrintBill.deposits.map((dep, idx) => (
                      <tr key={idx}>
                        <td className="py-1">{formatDate(dep.date)}</td>
                        <td className="py-1">{dep.mode}</td>
                        <td className="py-1 text-right font-medium">₹{dep.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-emerald-300 font-semibold">
                      <td colSpan={2} className="py-2">Total Deposits</td>
                      <td className="py-2 text-right">₹{showPrintBill.totalDeposits.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Balance Summary */}
              <div className={`rounded-lg p-4 mb-4 ${
                showPrintBill.balanceDue > 0 ? 'bg-red-50 border border-red-200' :
                showPrintBill.refundDue > 0 ? 'bg-orange-50 border border-orange-200' :
                'bg-emerald-50 border border-emerald-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-lg ${
                    showPrintBill.balanceDue > 0 ? 'text-red-800' :
                    showPrintBill.refundDue > 0 ? 'text-orange-800' :
                    'text-emerald-800'
                  }`}>
                    {showPrintBill.balanceDue > 0 ? 'BALANCE DUE' :
                     showPrintBill.refundDue > 0 ? 'REFUND DUE' :
                     'FULLY SETTLED'}
                  </span>
                  <span className={`font-bold text-xl ${
                    showPrintBill.balanceDue > 0 ? 'text-red-800' :
                    showPrintBill.refundDue > 0 ? 'text-orange-800' :
                    'text-emerald-800'
                  }`}>
                    ₹{(showPrintBill.balanceDue > 0 ? showPrintBill.balanceDue :
                       showPrintBill.refundDue > 0 ? showPrintBill.refundDue : 0).toLocaleString()}
                  </span>
                </div>
                {showPrintBill.status === 'paid' && (
                  <p className="text-sm text-emerald-700 mt-2">
                    Payment received via {showPrintBill.paymentMode} on {formatDate(showPrintBill.generatedDate)}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-slate-500 border-t border-slate-200 pt-4">
                <p>Generated by: {showPrintBill.generatedBy} | Generated on: {formatDate(showPrintBill.generatedDate)}</p>
                <p className="mt-2 text-xs">This is a computer generated bill. For any queries, please contact the billing desk.</p>
                <p className="mt-1 text-xs font-medium">Thank you for choosing Medicare Pro Hospital. Wishing you good health!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientDetail
