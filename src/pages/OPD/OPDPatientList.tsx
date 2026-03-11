import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Select, Button, Badge } from '../../components/ui'

// Mock OPD data (will be replaced with API)
const mockOPDPatients = [
  {
    id: 1,
    tokenNumber: 'OPD20260311001',
    patientName: 'Rahul Sharma',
    age: 35,
    gender: 'male',
    phone: '9876543210',
    aadhar: '123456789012',
    doctorId: 2,
    doctorName: 'Dr. Priya Shah',
    specialty: 'Cardiologist',
    consultationFee: 500,
    symptoms: 'Chest pain, shortness of breath',
    visitDate: '2026-03-11',
    paymentStatus: 'paid',
    paymentMode: 'cash',
    status: 'waiting',
    createdAt: '2026-03-11T09:30:00',
  },
  {
    id: 2,
    tokenNumber: 'OPD20260311002',
    patientName: 'Priya Singh',
    age: 28,
    gender: 'female',
    phone: '9876543211',
    aadhar: '123456789013',
    doctorId: 1,
    doctorName: 'Dr. Rajesh Patel',
    specialty: 'General Physician',
    consultationFee: 300,
    symptoms: 'Fever, body ache',
    visitDate: '2026-03-11',
    paymentStatus: 'paid',
    paymentMode: 'upi',
    status: 'in-consultation',
    createdAt: '2026-03-11T09:45:00',
  },
  {
    id: 3,
    tokenNumber: 'OPD20260311003',
    patientName: 'Amit Kumar',
    age: 45,
    gender: 'male',
    phone: '9876543212',
    aadhar: '123456789014',
    doctorId: 3,
    doctorName: 'Dr. Amit Kumar',
    specialty: 'Orthopedic',
    consultationFee: 400,
    symptoms: 'Knee pain, difficulty walking',
    visitDate: '2026-03-11',
    paymentStatus: 'pending',
    paymentMode: 'cash',
    status: 'waiting',
    createdAt: '2026-03-11T10:00:00',
  },
  {
    id: 4,
    tokenNumber: 'OPD20260311004',
    patientName: 'Sunita Devi',
    age: 52,
    gender: 'female',
    phone: '9876543213',
    aadhar: '123456789015',
    doctorId: 4,
    doctorName: 'Dr. Sunita Gupta',
    specialty: 'Pediatrician',
    consultationFee: 350,
    symptoms: 'Regular checkup',
    visitDate: '2026-03-11',
    paymentStatus: 'paid',
    paymentMode: 'card',
    status: 'completed',
    createdAt: '2026-03-11T08:30:00',
  },
  {
    id: 5,
    tokenNumber: 'OPD20260310005',
    patientName: 'Vikram Joshi',
    age: 38,
    gender: 'male',
    phone: '9876543214',
    aadhar: '123456789016',
    doctorId: 5,
    doctorName: 'Dr. Vikram Singh',
    specialty: 'ENT Specialist',
    consultationFee: 450,
    symptoms: 'Ear infection, hearing difficulty',
    visitDate: '2026-03-10',
    paymentStatus: 'paid',
    paymentMode: 'online',
    status: 'completed',
    createdAt: '2026-03-10T11:15:00',
  },
]

interface OPDPatient {
  id: number
  tokenNumber: string
  patientName: string
  age: number
  gender: string
  phone: string
  aadhar: string
  doctorId: number
  doctorName: string
  specialty: string
  consultationFee: number
  symptoms: string
  visitDate: string
  paymentStatus: string
  paymentMode: string
  status: string
  createdAt: string
}

const OPDPatientList = () => {
  const navigate = useNavigate()
  const [patients] = useState<OPDPatient[]>(mockOPDPatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().slice(0, 10))
  const [selectedPatient, setSelectedPatient] = useState<OPDPatient | null>(null)

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    
    const matchesStatus = !statusFilter || patient.status === statusFilter
    const matchesDate = !dateFilter || patient.visitDate === dateFilter

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'success' | 'warning' | 'info' | 'default'; label: string }> = {
      waiting: { variant: 'warning', label: 'Waiting' },
      'in-consultation': { variant: 'info', label: 'In Consultation' },
      completed: { variant: 'success', label: 'Completed' },
    }
    const config = statusConfig[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentBadge = (status: string) => {
    return status === 'paid' 
      ? <Badge variant="success">Paid</Badge>
      : <Badge variant="danger">Pending</Badge>
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">OPD Patients</h1>
          <p className="text-slate-500 mt-1">Manage outpatient registrations</p>
        </div>
        <Button onClick={() => navigate('/opd/register')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Registration
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Today</p>
              <p className="text-xl font-bold text-slate-800">
                {patients.filter(p => p.visitDate === new Date().toISOString().slice(0, 10)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Waiting</p>
              <p className="text-xl font-bold text-amber-600">
                {patients.filter(p => p.status === 'waiting').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">In Consultation</p>
              <p className="text-xl font-bold text-cyan-600">
                {patients.filter(p => p.status === 'in-consultation').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-xl font-bold text-emerald-600">
                {patients.filter(p => p.status === 'completed').length}
              </p>
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
                placeholder="Search by name, token, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="All Status"
              options={[
                { value: '', label: 'All Status' },
                { value: 'waiting', label: 'Waiting' },
                { value: 'in-consultation', label: 'In Consultation' },
                { value: 'completed', label: 'Completed' },
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Token</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-500">No patients found</p>
                      <Button size="sm" onClick={() => navigate('/opd/register')}>
                        Register New Patient
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-blue-600">
                        {patient.tokenNumber.slice(-6)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-800">{patient.patientName}</p>
                        <p className="text-xs text-slate-500">
                          {patient.age}y • {patient.gender === 'male' ? 'M' : 'F'} • {patient.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{patient.doctorName}</p>
                        <p className="text-xs text-slate-500">{patient.specialty}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">₹{patient.consultationFee}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getPaymentBadge(patient.paymentStatus)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(patient.status)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{formatTime(patient.createdAt)}</span>
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
                          onClick={() => navigate(`/pharmacy/add-prescription?patientId=${patient.id}&type=OPD&token=${patient.tokenNumber}`)}
                          className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Add Prescription"
                        >
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate(`/opd/slip/${patient.tokenNumber}`, { state: { patient } })}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Print Slip"
                        >
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate('/ipd/admit', { state: { patient } })}
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Admit Patient"
                        >
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title="More Actions"
                        >
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
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
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
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

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Token & Status */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500">Token Number</p>
                  <p className="font-mono font-bold text-blue-600">{selectedPatient.tokenNumber}</p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedPatient.status)}
                  {getPaymentBadge(selectedPatient.paymentStatus)}
                </div>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Patient Name</p>
                  <p className="font-medium text-slate-800">{selectedPatient.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Age / Gender</p>
                  <p className="font-medium text-slate-800">
                    {selectedPatient.age} years / {selectedPatient.gender === 'male' ? 'Male' : 'Female'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="font-medium text-slate-800">{selectedPatient.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Aadhar</p>
                  <p className="font-medium text-slate-800">
                    XXXX-XXXX-{selectedPatient.aadhar.slice(-4)}
                  </p>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-600 mb-1">Consulting Doctor</p>
                <p className="font-medium text-slate-800">{selectedPatient.doctorName}</p>
                <p className="text-sm text-slate-600">{selectedPatient.specialty}</p>
              </div>

              {/* Symptoms */}
              {selectedPatient.symptoms && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Symptoms / Diagnosis</p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{selectedPatient.symptoms}</p>
                </div>
              )}

              {/* Fee & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Consultation Fee</p>
                  <p className="text-xl font-bold text-emerald-600">₹{selectedPatient.consultationFee}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Visit Date</p>
                  <p className="font-medium text-slate-800">
                    {new Date(selectedPatient.visitDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedPatient(null)}>
                Close
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => {
                  navigate(`/opd/slip/${selectedPatient.tokenNumber}`, { state: { patient: selectedPatient } })
                  setSelectedPatient(null)
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Slip
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OPDPatientList
