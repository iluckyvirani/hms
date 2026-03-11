import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Badge, Select } from '../../components/ui'

// Mock patients data
const mockPatients = [
  {
    id: 1,
    patientId: 'PT20260001',
    name: 'Rahul Sharma',
    age: 45,
    gender: 'male',
    phone: '9876543210',
    aadhar: '123456789012',
    address: '123 Main Street, Mumbai',
    emergencyContact: '9876543211',
    lastVisit: '2026-03-11',
    totalVisits: 8,
    totalAdmits: 2,
    status: 'active',
    createdAt: '2024-05-15',
  },
  {
    id: 2,
    patientId: 'PT20260002',
    name: 'Sunita Devi',
    age: 52,
    gender: 'female',
    phone: '9876543211',
    aadhar: '234567890123',
    address: '456 Park Road, Delhi',
    emergencyContact: '9876543212',
    lastVisit: '2026-03-10',
    totalVisits: 5,
    totalAdmits: 1,
    status: 'active',
    createdAt: '2025-01-20',
  },
  {
    id: 3,
    patientId: 'PT20260003',
    name: 'Amit Kumar',
    age: 38,
    gender: 'male',
    phone: '9876543212',
    aadhar: '345678901234',
    address: '789 Lake View, Bangalore',
    emergencyContact: '9876543213',
    lastVisit: '2026-03-08',
    totalVisits: 12,
    totalAdmits: 3,
    status: 'admitted',
    createdAt: '2023-11-10',
  },
  {
    id: 4,
    patientId: 'PT20260004',
    name: 'Priya Singh',
    age: 28,
    gender: 'female',
    phone: '9876543213',
    aadhar: '456789012345',
    address: '321 Green Avenue, Chennai',
    emergencyContact: '9876543214',
    lastVisit: '2026-03-11',
    totalVisits: 3,
    totalAdmits: 1,
    status: 'admitted',
    createdAt: '2026-01-05',
  },
  {
    id: 5,
    patientId: 'PT20260005',
    name: 'Vikram Joshi',
    age: 62,
    gender: 'male',
    phone: '9876543214',
    aadhar: '567890123456',
    address: '654 Hill Road, Pune',
    emergencyContact: '9876543215',
    lastVisit: '2026-03-07',
    totalVisits: 15,
    totalAdmits: 4,
    status: 'active',
    createdAt: '2022-08-20',
  },
  {
    id: 6,
    patientId: 'PT20260006',
    name: 'Meera Patel',
    age: 35,
    gender: 'female',
    phone: '9876543215',
    aadhar: '678901234567',
    address: '987 River Side, Ahmedabad',
    emergencyContact: '9876543216',
    lastVisit: '2026-02-28',
    totalVisits: 2,
    totalAdmits: 0,
    status: 'active',
    createdAt: '2026-02-15',
  },
]

interface Patient {
  id: number
  patientId: string
  name: string
  age: number
  gender: string
  phone: string
  aadhar: string
  address: string
  emergencyContact: string
  lastVisit: string
  totalVisits: number
  totalAdmits: number
  status: string
  createdAt: string
}

const PatientList = () => {
  const navigate = useNavigate()
  const [patients] = useState<Patient[]>(mockPatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')

  // Stats
  const totalPatients = patients.length
  const activePatients = patients.filter(p => p.status === 'active').length
  const admittedPatients = patients.filter(p => p.status === 'admitted').length
  const newThisMonth = patients.filter(p => {
    const created = new Date(p.createdAt)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  }).length

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.aadhar.includes(searchTerm) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || patient.status === statusFilter
    const matchesGender = !genderFilter || patient.gender === genderFilter

    return matchesSearch && matchesStatus && matchesGender
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const maskAadhar = (aadhar: string) => {
    return `XXXX-XXXX-${aadhar.slice(-4)}`
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'success' | 'info' | 'default'; label: string }> = {
      active: { variant: 'success', label: 'Active' },
      admitted: { variant: 'info', label: 'Admitted' },
      inactive: { variant: 'default', label: 'Inactive' },
    }
    const { variant, label } = config[status] || { variant: 'default', label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Patients</h1>
          <p className="text-slate-500 mt-1">Complete patient registry</p>
        </div>
        <Button onClick={() => navigate('/opd/register')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Register New Patient
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
              <p className="text-sm text-slate-500">Total Patients</p>
              <p className="text-xl font-bold text-slate-800">{totalPatients}</p>
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
              <p className="text-sm text-slate-500">Active</p>
              <p className="text-xl font-bold text-emerald-600">{activePatients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Currently Admitted</p>
              <p className="text-xl font-bold text-purple-600">{admittedPatients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">New This Month</p>
              <p className="text-xl font-bold text-amber-600">{newThisMonth}</p>
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
                placeholder="Search by name, phone, Aadhar, or patient ID..."
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
                { value: 'active', label: 'Active' },
                { value: 'admitted', label: 'Admitted' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="w-36"
            />
            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              placeholder="All Gender"
              options={[
                { value: '', label: 'All Gender' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
              className="w-36"
            />
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Aadhar</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Last Visit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Visits</th>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{patient.name}</p>
                          <p className="text-xs text-slate-500">
                            {patient.age}y • {patient.gender === 'male' ? 'M' : 'F'} • {patient.patientId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700">{patient.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-500 font-mono">{maskAadhar(patient.aadhar)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700">{formatDate(patient.lastVisit)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-800">{patient.totalVisits}</p>
                          <p className="text-xs text-slate-400">OPD</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-purple-600">{patient.totalAdmits}</p>
                          <p className="text-xs text-slate-400">IPD</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(patient.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate('/opd/register')}
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                          title="New OPD Visit"
                        >
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate('/ipd/admit')}
                          className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Admit Patient"
                        >
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
              Showing <span className="font-medium">{filteredPatients.length}</span> of <span className="font-medium">{patients.length}</span> patients
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientList
