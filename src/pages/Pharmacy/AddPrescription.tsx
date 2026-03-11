import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui'

// Mock medicine database
const medicineDatabase = [
  { id: 1, name: 'Paracetamol 500mg', form: 'Tablet', price: 2 },
  { id: 2, name: 'Paracetamol 650mg', form: 'Tablet', price: 3 },
  { id: 3, name: 'Amoxicillin 250mg', form: 'Capsule', price: 8 },
  { id: 4, name: 'Amoxicillin 500mg', form: 'Capsule', price: 12 },
  { id: 5, name: 'Azithromycin 500mg', form: 'Tablet', price: 25 },
  { id: 6, name: 'Cetirizine 10mg', form: 'Tablet', price: 3 },
  { id: 7, name: 'Pantoprazole 40mg', form: 'Tablet', price: 5 },
  { id: 8, name: 'Metformin 500mg', form: 'Tablet', price: 2 },
  { id: 9, name: 'Atorvastatin 10mg', form: 'Tablet', price: 8 },
  { id: 10, name: 'Amlodipine 5mg', form: 'Tablet', price: 4 },
  { id: 11, name: 'Cough Syrup 100ml', form: 'Syrup', price: 65 },
  { id: 12, name: 'Multivitamin', form: 'Tablet', price: 5 },
  { id: 13, name: 'Vitamin D3 60K', form: 'Capsule', price: 30 },
  { id: 14, name: 'B-Complex', form: 'Tablet', price: 2 },
  { id: 15, name: 'Omeprazole 20mg', form: 'Capsule', price: 4 },
  { id: 16, name: 'Diclofenac 50mg', form: 'Tablet', price: 3 },
  { id: 17, name: 'Ibuprofen 400mg', form: 'Tablet', price: 3 },
  { id: 18, name: 'Ranitidine 150mg', form: 'Tablet', price: 2 },
  { id: 19, name: 'Montelukast 10mg', form: 'Tablet', price: 12 },
  { id: 20, name: 'Levocetirizine 5mg', form: 'Tablet', price: 4 },
]

// Mock patient data (from URL params or fetched)
const mockPatient = {
  id: 1,
  patientId: 'PT-2026-0042',
  name: 'Ramesh Kumar',
  age: 45,
  gender: 'Male',
  phone: '+91 98765 43210',
  visitType: 'OPD',
  tokenNumber: '0042',
  diagnosis: 'Fever, Cough, Cold',
  doctor: 'Dr. Priya Shah',
}

interface PrescriptionItem {
  id: number
  medicineId: number
  medicineName: string
  form: string
  dosage: string
  frequency: string
  duration: number
  durationUnit: string
  quantity: number
  price: number
  instructions: string
}

const AddPrescription = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')
  const visitType = searchParams.get('type') || 'OPD'
  
  // In real app, fetch patient by patientId
  const patient = { ...mockPatient, id: patientId ? Number(patientId) : mockPatient.id, visitType }

  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showMedicineSearch, setShowMedicineSearch] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<typeof medicineDatabase[0] | null>(null)
  const [medicineForm, setMedicineForm] = useState({
    dosage: '1',
    frequency: '3',
    frequencyType: 'times/day',
    duration: 5,
    durationUnit: 'days',
    quantity: 0,
    instructions: '',
  })
  const [notes, setNotes] = useState('')
  const [advice, setAdvice] = useState('')

  const filteredMedicines = medicineDatabase.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateQuantity = () => {
    const freq = parseInt(medicineForm.frequency) || 1
    const dur = medicineForm.duration || 1
    
    if (medicineForm.frequencyType === 'times/day') {
      return freq * dur
    } else if (medicineForm.frequencyType === 'times/week') {
      return Math.ceil(freq * (dur / 7))
    }
    return freq * dur
  }

  const handleSelectMedicine = (medicine: typeof medicineDatabase[0]) => {
    setSelectedMedicine(medicine)
    setShowMedicineSearch(false)
    setSearchTerm('')
    setMedicineForm({
      ...medicineForm,
      quantity: calculateQuantity(),
    })
  }

  const handleAddMedicine = () => {
    if (!selectedMedicine) return

    const quantity = calculateQuantity()
    const newItem: PrescriptionItem = {
      id: Date.now(),
      medicineId: selectedMedicine.id,
      medicineName: selectedMedicine.name,
      form: selectedMedicine.form,
      dosage: medicineForm.dosage,
      frequency: `${medicineForm.frequency} ${medicineForm.frequencyType}`,
      duration: medicineForm.duration,
      durationUnit: medicineForm.durationUnit,
      quantity: quantity,
      price: selectedMedicine.price * quantity,
      instructions: medicineForm.instructions,
    }

    setPrescriptionItems([...prescriptionItems, newItem])
    setSelectedMedicine(null)
    setMedicineForm({
      dosage: '1',
      frequency: '3',
      frequencyType: 'times/day',
      duration: 5,
      durationUnit: 'days',
      quantity: 0,
      instructions: '',
    })
  }

  const handleRemoveMedicine = (id: number) => {
    setPrescriptionItems(prescriptionItems.filter(item => item.id !== id))
  }

  const totalAmount = prescriptionItems.reduce((sum, item) => sum + item.price, 0)

  const handleSavePrescription = () => {
    if (prescriptionItems.length === 0) {
      alert('Please add at least one medicine')
      return
    }

    // In real app, save to backend
    const prescription = {
      patientId: patient.patientId,
      patientName: patient.name,
      visitType: patient.visitType,
      tokenNumber: patient.tokenNumber,
      doctor: patient.doctor,
      diagnosis: patient.diagnosis,
      medicines: prescriptionItems,
      notes,
      advice,
      totalAmount,
      status: 'pending', // pending, dispensed, cancelled
      createdAt: new Date().toISOString(),
    }

    console.log('Saving prescription:', prescription)
    alert('Prescription saved successfully! Sent to Pharmacy.')
    navigate(-1)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add Prescription</h1>
            <p className="text-slate-500">Write prescription for patient</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Medicine Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    patient.visitType === 'OPD' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {patient.visitType}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {patient.patientId} • {patient.age} yrs / {patient.gender} • Token #{patient.tokenNumber}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-medium">Diagnosis:</span> {patient.diagnosis}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Consulting Doctor</p>
                <p className="font-medium text-slate-700">{patient.doctor}</p>
              </div>
            </div>
          </div>

          {/* Add Medicine Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Add Medicine</h3>
            
            {/* Medicine Search */}
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Search Medicine</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type medicine name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowMedicineSearch(true)
                  }}
                  onFocus={() => setShowMedicineSearch(true)}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Search Results Dropdown */}
              {showMedicineSearch && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {filteredMedicines.length === 0 ? (
                    <p className="p-4 text-sm text-slate-500">No medicines found</p>
                  ) : (
                    filteredMedicines.map(med => (
                      <button
                        key={med.id}
                        onClick={() => handleSelectMedicine(med)}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0"
                      >
                        <p className="font-medium text-slate-800">{med.name}</p>
                        <p className="text-sm text-slate-500">{med.form} • ₹{med.price}/unit</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Medicine */}
            {selectedMedicine && (
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-blue-800">{selectedMedicine.name}</p>
                    <p className="text-sm text-blue-600">{selectedMedicine.form} • ₹{selectedMedicine.price}/unit</p>
                  </div>
                  <button
                    onClick={() => setSelectedMedicine(null)}
                    className="p-1 hover:bg-blue-100 rounded-lg"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Dosage</label>
                    <select
                      value={medicineForm.dosage}
                      onChange={(e) => setMedicineForm({ ...medicineForm, dosage: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="1/2">1/2</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="5ml">5ml</option>
                      <option value="10ml">10ml</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Frequency</label>
                    <div className="flex gap-1">
                      <select
                        value={medicineForm.frequency}
                        onChange={(e) => setMedicineForm({ ...medicineForm, frequency: e.target.value })}
                        className="w-16 px-2 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                      <select
                        value={medicineForm.frequencyType}
                        onChange={(e) => setMedicineForm({ ...medicineForm, frequencyType: e.target.value })}
                        className="flex-1 px-2 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="times/day">times/day</option>
                        <option value="times/week">times/week</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Duration</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min="1"
                        value={medicineForm.duration}
                        onChange={(e) => setMedicineForm({ ...medicineForm, duration: parseInt(e.target.value) || 1 })}
                        className="w-16 px-2 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <select
                        value={medicineForm.durationUnit}
                        onChange={(e) => setMedicineForm({ ...medicineForm, durationUnit: e.target.value })}
                        className="flex-1 px-2 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="days">days</option>
                        <option value="weeks">weeks</option>
                        <option value="months">months</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Qty (Auto)</label>
                    <div className="px-3 py-2 rounded-lg bg-blue-100 text-blue-800 text-sm font-semibold">
                      {calculateQuantity()} units
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-blue-700 mb-1">Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., After meals, Before sleep"
                    value={medicineForm.instructions}
                    onChange={(e) => setMedicineForm({ ...medicineForm, instructions: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-200">
                  <p className="text-sm text-blue-700">
                    Price: ₹{selectedMedicine.price} × {calculateQuantity()} = <span className="font-semibold">₹{selectedMedicine.price * calculateQuantity()}</span>
                  </p>
                  <Button onClick={handleAddMedicine}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add to Prescription
                  </Button>
                </div>
              </div>
            )}

            {/* Prescription List */}
            {prescriptionItems.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Medicines Added ({prescriptionItems.length})</h4>
                <div className="space-y-2">
                  {prescriptionItems.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{item.medicineName}</p>
                        <p className="text-sm text-slate-500">
                          {item.dosage} × {item.frequency} × {item.duration} {item.durationUnit} = {item.quantity} {item.form}s
                          {item.instructions && <span className="text-slate-400"> • {item.instructions}</span>}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-700">₹{item.price}</span>
                      <button
                        onClick={() => handleRemoveMedicine(item.id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes for Pharmacy</label>
                <textarea
                  rows={3}
                  placeholder="Any special instructions for pharmacy..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Advice for Patient</label>
                <textarea
                  rows={3}
                  placeholder="Diet, exercise, follow-up instructions..."
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Prescription Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <h3 className="font-semibold text-slate-800 mb-4">Prescription Summary</h3>
            
            {prescriptionItems.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="text-slate-500">No medicines added yet</p>
                <p className="text-sm text-slate-400 mt-1">Search and add medicines above</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {prescriptionItems.map((item, index) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {index + 1}. {item.medicineName.split(' ')[0]} × {item.quantity}
                      </span>
                      <span className="font-medium text-slate-800">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-slate-700">Total Amount</span>
                    <span className="text-blue-600">₹{totalAmount}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {prescriptionItems.length} medicine(s) • {prescriptionItems.reduce((sum, item) => sum + item.quantity, 0)} total units
                  </p>
                </div>
              </>
            )}

            <div className="mt-6 space-y-3">
              <Button
                className="w-full"
                onClick={handleSavePrescription}
                disabled={prescriptionItems.length === 0}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Save & Send to Pharmacy
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>

            {/* Quick Add Common Medicines */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-2">QUICK ADD</p>
              <div className="flex flex-wrap gap-2">
                {['Paracetamol', 'Cetirizine', 'Pantoprazole', 'B-Complex'].map(med => (
                  <button
                    key={med}
                    onClick={() => {
                      const found = medicineDatabase.find(m => m.name.includes(med))
                      if (found) handleSelectMedicine(found)
                    }}
                    className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                  >
                    + {med}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPrescription
