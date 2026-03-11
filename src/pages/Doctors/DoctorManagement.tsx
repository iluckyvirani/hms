import { useState } from 'react'
import { Button, Badge, Input, Select } from '../../components/ui'

// Mock doctors data
const initialDoctors = [
  { 
    id: 1, 
    name: 'Dr. Rajesh Patel', 
    specialization: 'General Physician',
    qualification: 'MBBS, MD',
    phone: '9876543201',
    email: 'rajesh.patel@medicare.com',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timingFrom: '09:00',
    timingTo: '17:00',
    consultationFee: 300,
    opdLimit: 30,
    status: 'active',
    patientsToday: 12,
  },
  { 
    id: 2, 
    name: 'Dr. Priya Shah', 
    specialization: 'Cardiologist',
    qualification: 'MBBS, DM Cardiology',
    phone: '9876543202',
    email: 'priya.shah@medicare.com',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timingFrom: '10:00',
    timingTo: '16:00',
    consultationFee: 500,
    opdLimit: 20,
    status: 'active',
    patientsToday: 8,
  },
  { 
    id: 3, 
    name: 'Dr. Amit Kumar', 
    specialization: 'Orthopedic',
    qualification: 'MBBS, MS Ortho',
    phone: '9876543203',
    email: 'amit.kumar@medicare.com',
    availableDays: ['Tue', 'Thu', 'Sat'],
    timingFrom: '11:00',
    timingTo: '18:00',
    consultationFee: 400,
    opdLimit: 25,
    status: 'active',
    patientsToday: 5,
  },
  { 
    id: 4, 
    name: 'Dr. Sunita Gupta', 
    specialization: 'Pediatrician',
    qualification: 'MBBS, DCH',
    phone: '9876543204',
    email: 'sunita.gupta@medicare.com',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timingFrom: '09:00',
    timingTo: '14:00',
    consultationFee: 350,
    opdLimit: 35,
    status: 'active',
    patientsToday: 18,
  },
  { 
    id: 5, 
    name: 'Dr. Vikram Singh', 
    specialization: 'ENT Specialist',
    qualification: 'MBBS, MS ENT',
    phone: '9876543205',
    email: 'vikram.singh@medicare.com',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timingFrom: '10:00',
    timingTo: '17:00',
    consultationFee: 450,
    opdLimit: 25,
    status: 'inactive',
    patientsToday: 0,
  },
]

const specializations = [
  'General Physician',
  'Cardiologist',
  'Orthopedic',
  'Pediatrician',
  'ENT Specialist',
  'Dermatologist',
  'Neurologist',
  'Gynecologist',
  'Ophthalmologist',
  'Psychiatrist',
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface Doctor {
  id: number
  name: string
  specialization: string
  qualification: string
  phone: string
  email: string
  availableDays: string[]
  timingFrom: string
  timingTo: string
  consultationFee: number
  opdLimit: number
  status: string
  patientsToday: number
}

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors)
  const [showModal, setShowModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    phone: '',
    email: '',
    availableDays: [] as string[],
    timingFrom: '09:00',
    timingTo: '17:00',
    consultationFee: '',
    opdLimit: '',
    status: 'active',
  })

  // Stats
  const totalDoctors = doctors.length
  const activeDoctors = doctors.filter(d => d.status === 'active').length
  const todayPatients = doctors.reduce((sum, d) => sum + d.patientsToday, 0)
  const avgFee = Math.round(doctors.reduce((sum, d) => sum + d.consultationFee, 0) / doctors.length)

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || doctor.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleOpenModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor)
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        phone: doctor.phone,
        email: doctor.email,
        availableDays: doctor.availableDays,
        timingFrom: doctor.timingFrom,
        timingTo: doctor.timingTo,
        consultationFee: doctor.consultationFee.toString(),
        opdLimit: doctor.opdLimit.toString(),
        status: doctor.status,
      })
    } else {
      setEditingDoctor(null)
      setFormData({
        name: '',
        specialization: '',
        qualification: '',
        phone: '',
        email: '',
        availableDays: [],
        timingFrom: '09:00',
        timingTo: '17:00',
        consultationFee: '',
        opdLimit: '30',
        status: 'active',
      })
    }
    setShowModal(true)
  }

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingDoctor) {
      setDoctors(prev => prev.map(d => 
        d.id === editingDoctor.id 
          ? { 
              ...d,
              ...formData,
              consultationFee: Number(formData.consultationFee),
              opdLimit: Number(formData.opdLimit),
            }
          : d
      ))
    } else {
      const newDoctor: Doctor = {
        id: Math.max(...doctors.map(d => d.id)) + 1,
        name: formData.name,
        specialization: formData.specialization,
        qualification: formData.qualification,
        phone: formData.phone,
        email: formData.email,
        availableDays: formData.availableDays,
        timingFrom: formData.timingFrom,
        timingTo: formData.timingTo,
        consultationFee: Number(formData.consultationFee),
        opdLimit: Number(formData.opdLimit),
        status: formData.status,
        patientsToday: 0,
      }
      setDoctors(prev => [...prev, newDoctor])
    }
    
    setShowModal(false)
    setEditingDoctor(null)
  }

  const getInitials = (name: string) => {
    return name.split(' ').slice(1).map(n => n[0]).join('')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Management</h1>
          <p className="text-slate-500 mt-1">Manage doctor profiles and schedules</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Doctor
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
              <p className="text-sm text-slate-500">Total Doctors</p>
              <p className="text-xl font-bold text-slate-800">{totalDoctors}</p>
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
              <p className="text-sm text-slate-500">Active Today</p>
              <p className="text-xl font-bold text-emerald-600">{activeDoctors}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Patients Today</p>
              <p className="text-xl font-bold text-purple-600">{todayPatients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg. Fee</p>
              <p className="text-xl font-bold text-amber-600">₹{avgFee}</p>
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
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            placeholder="All Status"
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            className="w-40"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(doctor.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800 truncate">{doctor.name}</h3>
                    <Badge variant={doctor.status === 'active' ? 'success' : 'default'} size="sm">
                      {doctor.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">{doctor.specialization}</p>
                  <p className="text-xs text-slate-400">{doctor.qualification}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-slate-600">{doctor.timingFrom} - {doctor.timingTo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-wrap gap-1">
                  {weekDays.map(day => (
                    <span 
                      key={day}
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        doctor.availableDays.includes(day)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Consultation Fee</p>
                  <p className="font-bold text-emerald-600">₹{doctor.consultationFee}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Today's Patients</p>
                  <p className="font-bold text-slate-800">{doctor.patientsToday}/{doctor.opdLimit}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 bg-slate-50 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenModal(doctor)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dr. Full Name"
                  required
                />
                <Select
                  label="Specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Select specialization"
                  options={specializations.map(s => ({ value: s, label: s }))}
                  required
                />
                <Input
                  label="Qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                  placeholder="MBBS, MD, etc."
                  required
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
              </div>

              {/* Available Days */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Available Days <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.availableDays.includes(day)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Timing From"
                  type="time"
                  value={formData.timingFrom}
                  onChange={(e) => setFormData(prev => ({ ...prev, timingFrom: e.target.value }))}
                  required
                />
                <Input
                  label="Timing To"
                  type="time"
                  value={formData.timingTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, timingTo: e.target.value }))}
                  required
                />
              </div>

              {/* Fee & Limit */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Consultation Fee (₹)"
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: e.target.value }))}
                  placeholder="300"
                  required
                />
                <Input
                  label="OPD Limit/Day"
                  type="number"
                  value={formData.opdLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, opdLimit: e.target.value }))}
                  placeholder="30"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorManagement
