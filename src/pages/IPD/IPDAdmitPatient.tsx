import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Input, Select, Textarea, Button } from '../../components/ui'

// Mock data
const doctors = [
  { id: 1, name: 'Dr. Rajesh Patel', specialty: 'General Physician' },
  { id: 2, name: 'Dr. Priya Shah', specialty: 'Cardiologist' },
  { id: 3, name: 'Dr. Amit Kumar', specialty: 'Orthopedic' },
  { id: 4, name: 'Dr. Sunita Gupta', specialty: 'Pediatrician' },
  { id: 5, name: 'Dr. Vikram Singh', specialty: 'ENT Specialist' },
]

const roomTypes = [
  { value: 'general', label: 'General Ward', rent: 500 },
  { value: 'non-ac', label: 'Non-AC Room', rent: 1000 },
  { value: 'ac', label: 'AC Room', rent: 1500 },
  { value: 'private', label: 'Private Room', rent: 2500 },
  { value: 'icu', label: 'ICU', rent: 5000 },
]

const rooms = [
  { id: 1, roomNumber: '101', type: 'general', beds: [
    { id: 1, bedNumber: 'A', status: 'occupied' },
    { id: 2, bedNumber: 'B', status: 'available' },
    { id: 3, bedNumber: 'C', status: 'occupied' },
    { id: 4, bedNumber: 'D', status: 'available' },
  ]},
  { id: 2, roomNumber: '102', type: 'general', beds: [
    { id: 5, bedNumber: 'A', status: 'available' },
    { id: 6, bedNumber: 'B', status: 'occupied' },
  ]},
  { id: 3, roomNumber: '201', type: 'non-ac', beds: [
    { id: 7, bedNumber: 'A', status: 'available' },
    { id: 8, bedNumber: 'B', status: 'occupied' },
  ]},
  { id: 4, roomNumber: '202', type: 'ac', beds: [
    { id: 9, bedNumber: 'A', status: 'occupied' },
    { id: 10, bedNumber: 'B', status: 'available' },
  ]},
  { id: 5, roomNumber: '301', type: 'private', beds: [
    { id: 11, bedNumber: 'A', status: 'available' },
  ]},
  { id: 6, roomNumber: 'ICU-1', type: 'icu', beds: [
    { id: 12, bedNumber: '1', status: 'occupied' },
    { id: 13, bedNumber: '2', status: 'available' },
    { id: 14, bedNumber: '3', status: 'occupied' },
    { id: 15, bedNumber: '4', status: 'available' },
  ]},
]

// Generate admission ID
const generateAdmitId = () => {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `IPD${dateStr}${random}`
}

interface AdmitFormData {
  admitId: string
  // Patient Info
  patientName: string
  age: string
  gender: string
  phone: string
  aadhar: string
  address: string
  // Admission Details
  admissionDate: string
  admissionTime: string
  roomType: string
  roomNumber: string
  bedNumber: string
  doctorId: string
  expectedDischarge: string
  diagnosis: string
  // Payment
  roomRentPerDay: number
  initialDeposit: string
  paymentMode: string
}

const IPDAdmitPatient = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const patientFromOPD = location.state?.patient

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastAdmission, setLastAdmission] = useState<AdmitFormData | null>(null)

  const [formData, setFormData] = useState<AdmitFormData>({
    admitId: generateAdmitId(),
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    aadhar: '',
    address: '',
    admissionDate: new Date().toISOString().slice(0, 10),
    admissionTime: new Date().toTimeString().slice(0, 5),
    roomType: '',
    roomNumber: '',
    bedNumber: '',
    doctorId: '',
    expectedDischarge: '',
    diagnosis: '',
    roomRentPerDay: 0,
    initialDeposit: '',
    paymentMode: 'cash',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AdmitFormData, string>>>({})
  const [availableRooms, setAvailableRooms] = useState<typeof rooms>([])
  const [availableBeds, setAvailableBeds] = useState<{ id: number; bedNumber: string; status: string }[]>([])

  // Pre-fill from OPD patient
  useEffect(() => {
    if (patientFromOPD) {
      setFormData(prev => ({
        ...prev,
        patientName: patientFromOPD.patientName || '',
        age: patientFromOPD.age?.toString() || '',
        gender: patientFromOPD.gender || '',
        phone: patientFromOPD.phone || '',
        aadhar: patientFromOPD.aadhar || '',
        address: patientFromOPD.address || '',
        diagnosis: patientFromOPD.symptoms || '',
        doctorId: patientFromOPD.doctorId?.toString() || '',
      }))
    }
  }, [patientFromOPD])

  // Filter rooms by type
  useEffect(() => {
    if (formData.roomType) {
      const filtered = rooms.filter(r => r.type === formData.roomType)
      setAvailableRooms(filtered)
      setFormData(prev => ({ ...prev, roomNumber: '', bedNumber: '' }))
      
      const roomType = roomTypes.find(t => t.value === formData.roomType)
      setFormData(prev => ({ ...prev, roomRentPerDay: roomType?.rent || 0 }))
    } else {
      setAvailableRooms([])
    }
  }, [formData.roomType])

  // Filter beds by room
  useEffect(() => {
    if (formData.roomNumber) {
      const room = rooms.find(r => r.roomNumber === formData.roomNumber)
      const available = room?.beds.filter(b => b.status === 'available') || []
      setAvailableBeds(available)
      setFormData(prev => ({ ...prev, bedNumber: '' }))
    } else {
      setAvailableBeds([])
    }
  }, [formData.roomNumber])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof AdmitFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AdmitFormData, string>> = {}

    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required'
    if (!formData.age || Number(formData.age) <= 0) newErrors.age = 'Valid age is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Valid phone number required'
    if (!formData.aadhar || !/^\d{12}$/.test(formData.aadhar)) newErrors.aadhar = 'Valid 12-digit Aadhar required'
    if (!formData.roomType) newErrors.roomType = 'Select room type'
    if (!formData.roomNumber) newErrors.roomNumber = 'Select room'
    if (!formData.bedNumber) newErrors.bedNumber = 'Select bed'
    if (!formData.doctorId) newErrors.doctorId = 'Select doctor'
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required'
    if (!formData.initialDeposit || Number(formData.initialDeposit) < 0) newErrors.initialDeposit = 'Initial deposit required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setLastAdmission(formData)
    setShowSuccessModal(true)
    setIsSubmitting(false)
  }

  const handleNewAdmission = () => {
    setShowSuccessModal(false)
    setLastAdmission(null)
    setFormData({
      admitId: generateAdmitId(),
      patientName: '',
      age: '',
      gender: '',
      phone: '',
      aadhar: '',
      address: '',
      admissionDate: new Date().toISOString().slice(0, 10),
      admissionTime: new Date().toTimeString().slice(0, 5),
      roomType: '',
      roomNumber: '',
      bedNumber: '',
      doctorId: '',
      expectedDischarge: '',
      diagnosis: '',
      roomRentPerDay: 0,
      initialDeposit: '',
      paymentMode: 'cash',
    })
  }

  const selectedDoctor = doctors.find(d => d.id === Number(formData.doctorId))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admit Patient (IPD)</h1>
          <p className="text-slate-500 mt-1">Register new inpatient admission</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-purple-50 rounded-xl">
            <span className="text-sm text-slate-500">Admit ID: </span>
            <span className="text-sm font-bold text-purple-600">{formData.admitId}</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/ipd')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View All IPD
          </Button>
        </div>
      </div>

      {/* From OPD Notice */}
      {patientFromOPD && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Patient referred from OPD</p>
            <p className="text-sm text-blue-600">Token: {patientFromOPD.tokenNumber}</p>
          </div>
        </div>
      )}

      {/* Admission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Patient Information */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              error={errors.patientName}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Years"
                required
                error={errors.age}
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Select"
                required
                error={errors.gender}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </div>
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit number"
              maxLength={10}
              required
              error={errors.phone}
            />
            <Input
              label="Aadhar Number"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              placeholder="12-digit Aadhar"
              maxLength={12}
              required
              error={errors.aadhar}
            />
            <div className="lg:col-span-2">
              <Textarea
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Complete address"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Room & Bed Assignment */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">2</span>
            Room & Bed Assignment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Room Type"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              placeholder="Select type"
              required
              error={errors.roomType}
              options={roomTypes.map(t => ({
                value: t.value,
                label: `${t.label} (₹${t.rent}/day)`,
              }))}
            />
            <Select
              label="Room Number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder={formData.roomType ? "Select room" : "Select type first"}
              required
              error={errors.roomNumber}
              disabled={!formData.roomType}
              options={availableRooms.map(r => ({
                value: r.roomNumber,
                label: `Room ${r.roomNumber}`,
              }))}
            />
            <Select
              label="Bed Number"
              name="bedNumber"
              value={formData.bedNumber}
              onChange={handleChange}
              placeholder={formData.roomNumber ? "Select bed" : "Select room first"}
              required
              error={errors.bedNumber}
              disabled={!formData.roomNumber}
              options={availableBeds.map(b => ({
                value: b.bedNumber,
                label: `Bed ${b.bedNumber}`,
              }))}
            />
            <div>
              <Input
                label="Rent per Day"
                value={formData.roomRentPerDay ? `₹${formData.roomRentPerDay}` : ''}
                disabled
                className="bg-slate-50 font-semibold"
              />
            </div>
          </div>

          {/* Available Beds Visual */}
          {formData.roomNumber && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl">
              <p className="text-sm font-medium text-slate-700 mb-3">Bed Availability in Room {formData.roomNumber}</p>
              <div className="flex flex-wrap gap-2">
                {rooms.find(r => r.roomNumber === formData.roomNumber)?.beds.map(bed => (
                  <div
                    key={bed.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      bed.status === 'available'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    Bed {bed.bedNumber} - {bed.status}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor & Diagnosis */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">3</span>
            Doctor & Diagnosis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Admission Date"
              name="admissionDate"
              type="date"
              value={formData.admissionDate}
              onChange={handleChange}
              required
            />
            <Input
              label="Admission Time"
              name="admissionTime"
              type="time"
              value={formData.admissionTime}
              onChange={handleChange}
              required
            />
            <Input
              label="Expected Discharge"
              name="expectedDischarge"
              type="date"
              value={formData.expectedDischarge}
              onChange={handleChange}
              helperText="Optional"
            />
            <Select
              label="Visiting Doctor"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              placeholder="Select doctor"
              required
              error={errors.doctorId}
              options={doctors.map(d => ({
                value: d.id,
                label: `${d.name} (${d.specialty})`,
              }))}
            />
            {selectedDoctor && (
              <div className="p-3 bg-emerald-50 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                  {selectedDoctor.name.split(' ')[1]?.[0] || 'D'}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{selectedDoctor.name}</p>
                  <p className="text-sm text-slate-500">{selectedDoctor.specialty}</p>
                </div>
              </div>
            )}
            <div className="lg:col-span-3">
              <Textarea
                label="Diagnosis / Reason for Admission"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Detailed diagnosis or reason for admission"
                rows={3}
                required
                error={errors.diagnosis}
              />
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">4</span>
            Initial Payment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Initial Deposit (₹)"
              name="initialDeposit"
              type="number"
              value={formData.initialDeposit}
              onChange={handleChange}
              placeholder="Enter amount"
              required
              error={errors.initialDeposit}
            />
            <Select
              label="Payment Mode"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'card', label: 'Card' },
                { value: 'upi', label: 'UPI' },
                { value: 'online', label: 'Online Transfer' },
              ]}
            />
            <div className="lg:col-span-2">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Room Rent</p>
                    <p className="text-lg font-bold text-slate-800">₹{formData.roomRentPerDay}/day</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Initial Deposit</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{formData.initialDeposit || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All required fields are marked with <span className="text-red-500">*</span>
          </p>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/ipd')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Admit Patient
            </Button>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && lastAdmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Patient Admitted!</h3>
              <p className="text-purple-100 mt-1">Admission completed successfully</p>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Admit ID</span>
                <span className="font-bold text-purple-600">{lastAdmission.admitId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Patient</span>
                <span className="font-medium text-slate-800">{lastAdmission.patientName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Room / Bed</span>
                <span className="font-medium text-slate-800">
                  {lastAdmission.roomNumber} / Bed {lastAdmission.bedNumber}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Doctor</span>
                <span className="font-medium text-slate-800">
                  {doctors.find(d => d.id === Number(lastAdmission.doctorId))?.name}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Deposit Paid</span>
                <span className="font-bold text-emerald-600">₹{lastAdmission.initialDeposit}</span>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleNewAdmission}>
                New Admission
              </Button>
              <Button className="flex-1" onClick={() => navigate('/ipd')}>
                View All IPD
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IPDAdmitPatient
