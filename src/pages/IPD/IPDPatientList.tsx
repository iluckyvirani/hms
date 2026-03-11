import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Badge, Input, Select } from '../../components/ui'

// Mock IPD patients data
const mockIPDPatients = [
  {
    id: 1,
    admitId: 'IPD20260311001',
    patientName: 'Rahul Sharma',
    age: 45,
    gender: 'male',
    phone: '9876543210',
    roomNumber: '201',
    bedNumber: 'A',
    roomType: 'non-ac',
    doctorId: 2,
    doctorName: 'Dr. Priya Shah',
    admissionDate: '2026-03-09',
    expectedDischarge: '2026-03-14',
    diagnosis: 'Chest pain, requires cardiac monitoring',
    deposit: 15000,
    totalBill: 8500,
    status: 'admitted',
  },
  {
    id: 2,
    admitId: 'IPD20260310002',
    patientName: 'Sunita Devi',
    age: 52,
    gender: 'female',
    phone: '9876543211',
    roomNumber: '101',
    bedNumber: 'B',
    roomType: 'general',
    doctorId: 1,
    doctorName: 'Dr. Rajesh Patel',
    admissionDate: '2026-03-10',
    expectedDischarge: '2026-03-12',
    diagnosis: 'Post-surgery recovery',
    deposit: 5000,
    totalBill: 4200,
    status: 'admitted',
  },
  {
    id: 3,
    admitId: 'IPD20260308003',
    patientName: 'Amit Kumar',
    age: 38,
    gender: 'male',
    phone: '9876543212',
    roomNumber: 'ICU-1',
    bedNumber: '2',
    roomType: 'icu',
    doctorId: 2,
    doctorName: 'Dr. Priya Shah',
    admissionDate: '2026-03-08',
    expectedDischarge: '2026-03-15',
    diagnosis: 'Critical care - Heart surgery recovery',
    deposit: 50000,
    totalBill: 45000,
    status: 'critical',
  },
  {
    id: 4,
    admitId: 'IPD20260311004',
    patientName: 'Priya Singh',
    age: 28,
    gender: 'female',
    phone: '9876543213',
    roomNumber: '301',
    bedNumber: 'A',
    roomType: 'private',
    doctorId: 4,
    doctorName: 'Dr. Sunita Gupta',
    admissionDate: '2026-03-11',
    expectedDischarge: '2026-03-13',
    diagnosis: 'Maternity - Delivery',
    deposit: 25000,
    totalBill: 5000,
    status: 'admitted',
  },
  {
    id: 5,
    admitId: 'IPD20260307005',
    patientName: 'Vikram Joshi',
    age: 62,
    gender: 'male',
    phone: '9876543214',
    roomNumber: '202',
    bedNumber: 'A',
    roomType: 'ac',
    doctorId: 3,
    doctorName: 'Dr. Amit Kumar',
    admissionDate: '2026-03-07',
    expectedDischarge: '2026-03-11',
    diagnosis: 'Knee replacement surgery',
    deposit: 30000,
    totalBill: 28000,
    status: 'ready-discharge',
  },
]

const roomTypes: Record<string, { label: string; color: string }> = {
  general: { label: 'General', color: 'bg-slate-100 text-slate-700' },
  'non-ac': { label: 'Non-AC', color: 'bg-blue-100 text-blue-700' },
  ac: { label: 'AC', color: 'bg-emerald-100 text-emerald-700' },
  private: { label: 'Private', color: 'bg-amber-100 text-amber-700' },
  icu: { label: 'ICU', color: 'bg-red-100 text-red-700' },
}

interface IPDPatient {
  id: number
  admitId: string
  patientName: string
  age: number
  gender: string
  phone: string
  roomNumber: string
  bedNumber: string
  roomType: string
  doctorId: number
  doctorName: string
  admissionDate: string
  expectedDischarge: string
  diagnosis: string
  deposit: number
  totalBill: number
  status: string
}

const IPDPatientList = () => {
  const navigate = useNavigate()
  const [patients] = useState<IPDPatient[]>(mockIPDPatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roomTypeFilter, setRoomTypeFilter] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<IPDPatient | null>(null)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')

  // Stats
  const totalAdmitted = patients.filter(p => p.status !== 'discharged').length
  const criticalPatients = patients.filter(p => p.status === 'critical').length
  const readyDischarge = patients.filter(p => p.status === 'ready-discharge').length
  const totalDeposits = patients.reduce((sum, p) => sum + p.deposit, 0)

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.admitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    
    const matchesStatus = !statusFilter || patient.status === statusFilter
    const matchesRoomType = !roomTypeFilter || patient.roomType === roomTypeFilter

    return matchesSearch && matchesStatus && matchesRoomType
  })

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info' | 'default'; label: string }> = {
      admitted: { variant: 'info', label: 'Admitted' },
      critical: { variant: 'danger', label: 'Critical' },
      'ready-discharge': { variant: 'warning', label: 'Ready for Discharge' },
      discharged: { variant: 'success', label: 'Discharged' },
    }
    const config = statusConfig[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getDaysAdmitted = (admissionDate: string) => {
    const admission = new Date(admissionDate)
    const today = new Date()
    const diff = Math.ceil((today.getTime() - admission.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleAddDeposit = () => {
    // In real app, this would call an API
    alert(`Added ₹${depositAmount} deposit for ${selectedPatient?.patientName}`)
    setShowDepositModal(false)
    setDepositAmount('')
    setSelectedPatient(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">IPD - Admitted Patients</h1>
          <p className="text-slate-500 mt-1">Manage inpatient admissions</p>
        </div>
        <Button onClick={() => navigate('/ipd/admit')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          New Admission
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Admitted</p>
              <p className="text-xl font-bold text-slate-800">{totalAdmitted}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Critical</p>
              <p className="text-xl font-bold text-red-600">{criticalPatients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Ready to Discharge</p>
              <p className="text-xl font-bold text-amber-600">{readyDischarge}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Deposits</p>
              <p className="text-xl font-bold text-emerald-600">₹{(totalDeposits / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, admit ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="All Status"
              options={[
                { value: '', label: 'All Status' },
                { value: 'admitted', label: 'Admitted' },
                { value: 'critical', label: 'Critical' },
                { value: 'ready-discharge', label: 'Ready to Discharge' },
              ]}
              className="w-44"
            />
            <Select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              placeholder="All Rooms"
              options={[
                { value: '', label: 'All Rooms' },
                { value: 'general', label: 'General Ward' },
                { value: 'non-ac', label: 'Non-AC' },
                { value: 'ac', label: 'AC' },
                { value: 'private', label: 'Private' },
                { value: 'icu', label: 'ICU' },
              ]}
              className="w-40"
            />
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Room/Bed</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Admitted</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Deposit/Bill</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-slate-500">No patients found</p>
                      <Button size="sm" onClick={() => navigate('/ipd/admit')}>
                        New Admission
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                          {patient.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{patient.patientName}</p>
                          <p className="text-xs text-slate-500">
                            {patient.age}y • {patient.gender === 'male' ? 'M' : 'F'} • {patient.admitId.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-800">Room {patient.roomNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">Bed {patient.bedNumber}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${roomTypes[patient.roomType]?.color || ''}`}>
                            {roomTypes[patient.roomType]?.label}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-700">{patient.doctorName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-slate-700">{formatDate(patient.admissionDate)}</p>
                        <p className="text-xs text-slate-500">{getDaysAdmitted(patient.admissionDate)} days</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-emerald-600">₹{patient.deposit.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Bill: ₹{patient.totalBill.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(patient.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatient(patient)
                            setShowDepositModal(true)
                          }}
                          className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Add Deposit"
                        >
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Add Service"
                        >
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Discharge"
                        >
                          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPatients.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium">{filteredPatients.length}</span> patients
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && !showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-slate-800">Patient Details</h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedPatient.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold text-slate-800">{selectedPatient.patientName}</h4>
                    {getStatusBadge(selectedPatient.status)}
                  </div>
                  <p className="text-sm text-slate-500">
                    {selectedPatient.age} years • {selectedPatient.gender === 'male' ? 'Male' : 'Female'} • {selectedPatient.phone}
                  </p>
                  <p className="text-sm font-mono text-purple-600 mt-1">{selectedPatient.admitId}</p>
                </div>
              </div>

              {/* Room & Doctor Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Room / Bed</p>
                  <p className="font-semibold text-slate-800">Room {selectedPatient.roomNumber} / Bed {selectedPatient.bedNumber}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${roomTypes[selectedPatient.roomType]?.color}`}>
                    {roomTypes[selectedPatient.roomType]?.label}
                  </span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="text-xs text-emerald-600 mb-1">Attending Doctor</p>
                  <p className="font-semibold text-slate-800">{selectedPatient.doctorName}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Admission Date</p>
                  <p className="font-medium text-slate-800">{formatDate(selectedPatient.admissionDate)}</p>
                  <p className="text-sm text-slate-500">{getDaysAdmitted(selectedPatient.admissionDate)} days admitted</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Expected Discharge</p>
                  <p className="font-medium text-slate-800">{formatDate(selectedPatient.expectedDischarge)}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <p className="text-xs text-slate-500 mb-1">Diagnosis</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{selectedPatient.diagnosis}</p>
              </div>

              {/* Financial Summary */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                <h5 className="text-sm font-semibold text-slate-700 mb-3">Financial Summary</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Total Deposit</p>
                    <p className="text-lg font-bold text-emerald-600">₹{selectedPatient.deposit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Current Bill</p>
                    <p className="text-lg font-bold text-slate-800">₹{selectedPatient.totalBill.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Balance</p>
                    <p className={`text-lg font-bold ${selectedPatient.deposit - selectedPatient.totalBill >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ₹{(selectedPatient.deposit - selectedPatient.totalBill).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedPatient(null)}>
                Close
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowDepositModal(true)}
              >
                Add Deposit
              </Button>
              <Button className="flex-1">
                Discharge
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Deposit Modal */}
      {showDepositModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Add Deposit</h3>
              <button
                onClick={() => {
                  setShowDepositModal(false)
                  setDepositAmount('')
                }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">Patient</p>
                <p className="font-semibold text-slate-800">{selectedPatient.patientName}</p>
                <p className="text-xs text-slate-500">{selectedPatient.admitId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Current Deposit</p>
                  <p className="font-bold text-emerald-600">₹{selectedPatient.deposit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Current Bill</p>
                  <p className="font-bold text-slate-800">₹{selectedPatient.totalBill.toLocaleString()}</p>
                </div>
              </div>

              <Input
                label="Deposit Amount (₹)"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />

              <Select
                label="Payment Mode"
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'card', label: 'Card' },
                  { value: 'upi', label: 'UPI' },
                  { value: 'online', label: 'Online Transfer' },
                ]}
              />
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowDepositModal(false)
                  setDepositAmount('')
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleAddDeposit}
                disabled={!depositAmount}
              >
                Add ₹{depositAmount || '0'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IPDPatientList
