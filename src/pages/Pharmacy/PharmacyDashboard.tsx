import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui'

// Mock prescriptions data
const mockPrescriptions = [
  {
    id: 1,
    prescriptionId: 'RX-2026-0142',
    patientId: 'PT-2026-0042',
    patientName: 'Ramesh Kumar',
    patientPhone: '+91 98765 43210',
    age: 45,
    gender: 'Male',
    visitType: 'OPD',
    tokenNumber: '0042',
    doctor: 'Dr. Priya Shah',
    diagnosis: 'Fever, Cough, Cold',
    medicines: [
      { name: 'Paracetamol 500mg', form: 'Tablet', dosage: '1', frequency: '3 times/day', duration: 5, quantity: 15, price: 30, instructions: 'After meals' },
      { name: 'Cetirizine 10mg', form: 'Tablet', dosage: '1', frequency: '1 times/day', duration: 5, quantity: 5, price: 15, instructions: 'At night' },
      { name: 'Cough Syrup 100ml', form: 'Syrup', dosage: '10ml', frequency: '3 times/day', duration: 5, quantity: 1, price: 65, instructions: '' },
    ],
    totalAmount: 110,
    status: 'pending',
    createdAt: '2026-03-11T10:30:00',
    notes: 'Patient has mild allergy to dust',
  },
  {
    id: 2,
    prescriptionId: 'RX-2026-0141',
    patientId: 'PT-2026-0038',
    patientName: 'Sunita Devi',
    patientPhone: '+91 87654 32109',
    age: 52,
    gender: 'Female',
    visitType: 'OPD',
    tokenNumber: '0041',
    doctor: 'Dr. Rajesh Patel',
    diagnosis: 'Hypertension',
    medicines: [
      { name: 'Amlodipine 5mg', form: 'Tablet', dosage: '1', frequency: '1 times/day', duration: 30, quantity: 30, price: 120, instructions: 'Morning' },
      { name: 'Atorvastatin 10mg', form: 'Tablet', dosage: '1', frequency: '1 times/day', duration: 30, quantity: 30, price: 240, instructions: 'At night' },
    ],
    totalAmount: 360,
    status: 'pending',
    createdAt: '2026-03-11T09:45:00',
    notes: '',
  },
  {
    id: 3,
    prescriptionId: 'RX-2026-0140',
    patientId: 'PT-2026-0035',
    patientName: 'Amit Sharma',
    patientPhone: '+91 76543 21098',
    age: 28,
    gender: 'Male',
    visitType: 'IPD',
    admitId: 'IPD20260310005',
    doctor: 'Dr. Meera Gupta',
    diagnosis: 'Post-surgery recovery',
    medicines: [
      { name: 'Amoxicillin 500mg', form: 'Capsule', dosage: '1', frequency: '3 times/day', duration: 7, quantity: 21, price: 252, instructions: 'After meals' },
      { name: 'Diclofenac 50mg', form: 'Tablet', dosage: '1', frequency: '2 times/day', duration: 5, quantity: 10, price: 30, instructions: 'After meals' },
      { name: 'Pantoprazole 40mg', form: 'Tablet', dosage: '1', frequency: '1 times/day', duration: 7, quantity: 7, price: 35, instructions: 'Before breakfast' },
    ],
    totalAmount: 317,
    status: 'pending',
    createdAt: '2026-03-11T08:15:00',
    notes: 'Patient is admitted. Send to Room 105.',
  },
  {
    id: 4,
    prescriptionId: 'RX-2026-0139',
    patientId: 'PT-2026-0030',
    patientName: 'Priya Verma',
    patientPhone: '+91 65432 10987',
    age: 35,
    gender: 'Female',
    visitType: 'OPD',
    tokenNumber: '0039',
    doctor: 'Dr. Priya Shah',
    diagnosis: 'Vitamin deficiency',
    medicines: [
      { name: 'Vitamin D3 60K', form: 'Capsule', dosage: '1', frequency: '1 times/week', duration: 8, quantity: 8, price: 240, instructions: 'After breakfast on Sunday' },
      { name: 'B-Complex', form: 'Tablet', dosage: '1', frequency: '1 times/day', duration: 30, quantity: 30, price: 60, instructions: 'After lunch' },
    ],
    totalAmount: 300,
    status: 'dispensed',
    createdAt: '2026-03-10T16:30:00',
    dispensedAt: '2026-03-10T17:00:00',
    dispensedBy: 'Pharmacy Staff',
    paymentMode: 'UPI',
  },
]

const PharmacyDashboard = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'dispensed'>('all')
  const [selectedPrescription, setSelectedPrescription] = useState<typeof mockPrescriptions[0] | null>(null)
  const [showDispenseModal, setShowDispenseModal] = useState(false)
  const [paymentMode, setPaymentMode] = useState('Cash')

  const filteredPrescriptions = mockPrescriptions.filter(rx => {
    const matchesSearch = 
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.patientPhone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || rx.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const pendingCount = mockPrescriptions.filter(rx => rx.status === 'pending').length
  const todayDispensed = mockPrescriptions.filter(rx => rx.status === 'dispensed').length
  const todayRevenue = mockPrescriptions.filter(rx => rx.status === 'dispensed').reduce((sum, rx) => sum + rx.totalAmount, 0)

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    })
  }

  const handleDispense = () => {
    if (!selectedPrescription) return
    
    // In real app, save to backend
    console.log('Dispensing:', {
      prescriptionId: selectedPrescription.prescriptionId,
      paymentMode,
      dispensedAt: new Date().toISOString(),
    })
    
    alert(`Prescription ${selectedPrescription.prescriptionId} dispensed successfully!`)
    setShowDispenseModal(false)
    setSelectedPrescription(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pharmacy</h1>
          <p className="text-slate-500">Manage prescriptions and dispense medicines</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/pharmacy/inventory')}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Inventory
          </Button>
          <Button onClick={() => navigate('/pharmacy/add-prescription')}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Prescription
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
              <p className="text-sm text-slate-500">Pending</p>
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
              <p className="text-2xl font-bold text-slate-800">{todayDispensed}</p>
              <p className="text-sm text-slate-500">Dispensed Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">₹{todayRevenue}</p>
              <p className="text-sm text-slate-500">Today's Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{mockPrescriptions.length}</p>
              <p className="text-sm text-slate-500">Total Prescriptions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by patient name, phone, or prescription ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'dispensed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Prescription</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Medicines</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPrescriptions.map(rx => (
                <tr key={rx.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm font-semibold text-blue-600">{rx.prescriptionId}</span>
                    <p className="text-xs text-slate-500">{formatDate(rx.createdAt)} {formatTime(rx.createdAt)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-800">{rx.patientName}</p>
                    <p className="text-sm text-slate-500">{rx.age} yrs / {rx.gender}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        rx.visitType === 'OPD' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {rx.visitType}
                      </span>
                      <span className="text-xs text-slate-400">
                        {rx.visitType === 'OPD' ? `Token #${rx.tokenNumber}` : rx.admitId}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700">{rx.doctor}</p>
                    <p className="text-xs text-slate-500">{rx.diagnosis}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-800">{rx.medicines.length} items</p>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">
                      {rx.medicines.map(m => m.name.split(' ')[0]).join(', ')}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-emerald-600">₹{rx.totalAmount}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      rx.status === 'pending' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {rx.status === 'pending' ? (
                        <>
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse" />
                          Pending
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Dispensed
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPrescription(rx)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {rx.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedPrescription(rx)
                            setShowDispenseModal(true)
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Dispense
                        </button>
                      )}
                      {rx.status === 'dispensed' && (
                        <button
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                          title="Print Bill"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-500">No prescriptions found</p>
          </div>
        )}
      </div>

      {/* View Prescription Modal */}
      {selectedPrescription && !showDispenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{selectedPrescription.prescriptionId}</h3>
                <p className="text-sm text-slate-500">{formatDate(selectedPrescription.createdAt)} {formatTime(selectedPrescription.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Patient Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {selectedPrescription.patientName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{selectedPrescription.patientName}</p>
                    <p className="text-sm text-slate-500">
                      {selectedPrescription.patientId} • {selectedPrescription.age} yrs / {selectedPrescription.gender}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedPrescription.visitType === 'OPD' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {selectedPrescription.visitType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor & Diagnosis */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Prescribing Doctor</p>
                  <p className="font-medium text-slate-800">{selectedPrescription.doctor}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Diagnosis</p>
                  <p className="font-medium text-slate-800">{selectedPrescription.diagnosis}</p>
                </div>
              </div>

              {/* Medicines */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h4 className="font-medium text-slate-700">Medicines ({selectedPrescription.medicines.length})</h4>
                </div>
                <div className="divide-y divide-slate-100">
                  {selectedPrescription.medicines.map((med, idx) => (
                    <div key={idx} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-800">{med.name}</p>
                          <p className="text-sm text-slate-500">
                            {med.dosage} × {med.frequency} × {med.duration} days = {med.quantity} {med.form}s
                          </p>
                          {med.instructions && (
                            <p className="text-xs text-blue-600 mt-1">📝 {med.instructions}</p>
                          )}
                        </div>
                        <span className="font-semibold text-slate-700">₹{med.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedPrescription.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs font-medium text-amber-700 mb-1">📋 Notes</p>
                  <p className="text-sm text-amber-800">{selectedPrescription.notes}</p>
                </div>
              )}

              {/* Total */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-emerald-800">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-700">₹{selectedPrescription.totalAmount}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedPrescription(null)}>
                Close
              </Button>
              {selectedPrescription.status === 'pending' && (
                <Button className="flex-1" onClick={() => setShowDispenseModal(true)}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dispense Medicines
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {showDispenseModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Dispense Medicines</h3>
              <button
                onClick={() => {
                  setShowDispenseModal(false)
                  setSelectedPrescription(null)
                }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-sm text-slate-500">Patient</p>
                <p className="font-semibold text-slate-800">{selectedPrescription.patientName}</p>
                <p className="text-xs text-slate-500">{selectedPrescription.prescriptionId}</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-700">₹{selectedPrescription.totalAmount}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Add to Bill">Add to IPD Bill</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">📦 Items to dispense:</span> {selectedPrescription.medicines.length} medicines
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => {
                setShowDispenseModal(false)
                setSelectedPrescription(null)
              }}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleDispense}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm & Print Bill
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PharmacyDashboard
