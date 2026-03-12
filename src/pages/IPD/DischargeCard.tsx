import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Input, Textarea } from '../../components/ui'

// Mock patient data
const mockPatientData = {
  patientId: 'PT20260001',
  name: 'Rahul Sharma',
  age: 45,
  gender: 'Male',
  phone: '9876543210',
  address: '123 Main Street, Andheri West, Mumbai - 400058',
  admitId: 'IPD20260311001',
  admissionDate: '2026-03-09',
  dischargeDate: '2026-03-12',
  roomNo: '201',
  roomType: 'Non-AC',
  bedNo: 'A',
  doctor: 'Dr. Priya Shah',
  doctorSpecialization: 'Cardiologist',
  diagnosis: 'Chest pain, requires cardiac monitoring',
  conditionOnAdmission: 'Patient presented with acute chest pain radiating to left arm. Blood pressure: 150/95 mmHg. Heart rate: 95 bpm.',
  conditionOnDischarge: 'Patient is stable. Blood pressure: 125/80 mmHg. Heart rate: 72 bpm. No chest pain reported for last 24 hours.',
  treatmentGiven: 'IV fluids, Cardiac monitoring, ECG x 3, Troponin test, Blood tests, Chest X-ray, Echocardiography',
  investigations: [
    { name: 'ECG', result: 'Normal sinus rhythm, no ST changes' },
    { name: 'Troponin-I', result: 'Negative' },
    { name: 'Lipid Profile', result: 'Cholesterol: 210 mg/dL (borderline high)' },
    { name: 'Chest X-ray', result: 'Normal cardiac silhouette' },
    { name: 'Echo', result: 'EF: 60%, No regional wall motion abnormality' },
  ],
  medicinesOnDischarge: [
    { name: 'Atorvastatin 10mg', dosage: '1 tablet at night', duration: '30 days' },
    { name: 'Aspirin 75mg', dosage: '1 tablet after breakfast', duration: '30 days' },
    { name: 'Metoprolol 25mg', dosage: '1 tablet twice daily', duration: '15 days' },
    { name: 'Pantoprazole 40mg', dosage: '1 tablet before breakfast', duration: '15 days' },
  ],
  dietaryAdvice: 'Low salt, low fat diet. Avoid oily and fried foods. Increase intake of fruits and vegetables.',
  followUpDate: '2026-03-26',
  followUpInstructions: 'Visit OPD with all reports. Repeat ECG if chest pain recurs.',
  emergencyInstructions: 'Report immediately if: chest pain recurs, breathlessness, excessive sweating, or palpitations.',
}

const DischargeCard = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const admitId = searchParams.get('admitId') || 'IPD20260311001' // Get admitId from URL or use default
  const isViewMode = searchParams.get('view') === 'true' // Check if viewing existing discharge card
  const printRef = useRef<HTMLDivElement>(null)
  
  // In real implementation, fetch patient data based on admitId
  console.log('Loading discharge card for admission:', admitId, 'View mode:', isViewMode)
  
  const [formData, setFormData] = useState({
    diagnosis: mockPatientData.diagnosis,
    conditionOnAdmission: mockPatientData.conditionOnAdmission,
    conditionOnDischarge: mockPatientData.conditionOnDischarge,
    treatmentGiven: mockPatientData.treatmentGiven,
    investigations: mockPatientData.investigations,
    medicinesOnDischarge: mockPatientData.medicinesOnDischarge,
    dietaryAdvice: mockPatientData.dietaryAdvice,
    followUpDate: mockPatientData.followUpDate,
    followUpInstructions: mockPatientData.followUpInstructions,
    emergencyInstructions: mockPatientData.emergencyInstructions,
    additionalNotes: '',
  })

  const [newInvestigation, setNewInvestigation] = useState({ name: '', result: '' })
  const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', duration: '' })
  const [showPreview, setShowPreview] = useState(isViewMode) // Auto-show preview if viewing

  const handleAddInvestigation = () => {
    if (!newInvestigation.name || !newInvestigation.result) return
    setFormData({
      ...formData,
      investigations: [...formData.investigations, newInvestigation]
    })
    setNewInvestigation({ name: '', result: '' })
  }

  const handleRemoveInvestigation = (index: number) => {
    setFormData({
      ...formData,
      investigations: formData.investigations.filter((_, i) => i !== index)
    })
  }

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage) return
    setFormData({
      ...formData,
      medicinesOnDischarge: [...formData.medicinesOnDischarge, newMedicine]
    })
    setNewMedicine({ name: '', dosage: '', duration: '' })
  }

  const handleRemoveMedicine = (index: number) => {
    setFormData({
      ...formData,
      medicinesOnDischarge: formData.medicinesOnDischarge.filter((_, i) => i !== index)
    })
  }

  const handleSaveDischargeCard = () => {
    // In real app, save to backend
    const dischargeData = {
      ...formData,
      patientId: mockPatientData.patientId,
      admitId: mockPatientData.admitId,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
    }
    
    console.log('Saving discharge card:', dischargeData)
    alert('Discharge Card saved successfully!')
    navigate(-1)
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
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
            <h1 className="text-2xl font-bold text-slate-800">Discharge Card</h1>
            <p className="text-slate-500">Create discharge summary for {mockPatientData.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </Button>
          <Button onClick={handleSaveDischargeCard}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Card
          </Button>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 print:shadow-none print:border-none">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {mockPatientData.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{mockPatientData.name}</h2>
                <p className="text-slate-500">{mockPatientData.age} years • {mockPatientData.gender}</p>
                <p className="text-sm text-slate-500">{mockPatientData.patientId}</p>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Admission</p>
            <p className="font-medium text-slate-800">{formatDate(mockPatientData.admissionDate)}</p>
            <p className="text-sm text-slate-500">{mockPatientData.admitId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Discharge</p>
            <p className="font-medium text-slate-800">{formatDate(mockPatientData.dischargeDate)}</p>
            <p className="text-sm text-slate-500">Room {mockPatientData.roomNo} ({mockPatientData.roomType})</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-500">Attending Doctor</p>
            <p className="font-medium text-slate-800">{mockPatientData.doctor}</p>
            <p className="text-xs text-slate-500">{mockPatientData.doctorSpecialization}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="font-medium text-slate-800">{mockPatientData.phone}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Address</p>
            <p className="font-medium text-slate-800 text-sm">{mockPatientData.address}</p>
          </div>
        </div>
      </div>

      {showPreview ? (
        /* Preview Mode - Discharge Card */
        <div ref={printRef} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 print:shadow-none print:border-none">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-200 pb-6 mb-6">
            <h1 className="text-2xl font-bold text-blue-600">MEDICARE PRO HOSPITAL</h1>
            <p className="text-slate-500">123 Medical Street, Healthcare City - 400001</p>
            <p className="text-slate-500">Phone: +91 22 1234 5678 | Email: info@medicarepro.com</p>
            <div className="mt-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg">
                DISCHARGE SUMMARY
              </span>
            </div>
          </div>

          {/* Patient Info */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Patient Name</p>
                <p className="font-medium">{mockPatientData.name}</p>
              </div>
              <div>
                <p className="text-slate-500">Age/Gender</p>
                <p className="font-medium">{mockPatientData.age} years / {mockPatientData.gender}</p>
              </div>
              <div>
                <p className="text-slate-500">Admission Date</p>
                <p className="font-medium">{formatDate(mockPatientData.admissionDate)}</p>
              </div>
              <div>
                <p className="text-slate-500">Discharge Date</p>
                <p className="font-medium">{formatDate(mockPatientData.dischargeDate)}</p>
              </div>
              <div>
                <p className="text-slate-500">IPD No</p>
                <p className="font-medium">{mockPatientData.admitId}</p>
              </div>
              <div>
                <p className="text-slate-500">Room/Bed</p>
                <p className="font-medium">{mockPatientData.roomNo} / {mockPatientData.bedNo}</p>
              </div>
              <div>
                <p className="text-slate-500">Doctor</p>
                <p className="font-medium">{mockPatientData.doctor}</p>
              </div>
              <div>
                <p className="text-slate-500">Contact</p>
                <p className="font-medium">{mockPatientData.phone}</p>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Diagnosis
            </h3>
            <p className="text-slate-700 bg-slate-50 rounded-xl p-4">{formData.diagnosis}</p>
          </div>

          {/* Condition on Admission */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Condition on Admission
            </h3>
            <p className="text-slate-700 bg-slate-50 rounded-xl p-4">{formData.conditionOnAdmission}</p>
          </div>

          {/* Treatment Given */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Treatment Given
            </h3>
            <p className="text-slate-700 bg-slate-50 rounded-xl p-4">{formData.treatmentGiven}</p>
          </div>

          {/* Investigations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              Investigations & Results
            </h3>
            <div className="bg-slate-50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Investigation</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.investigations.map((inv, idx) => (
                    <tr key={idx} className="border-t border-slate-200">
                      <td className="px-4 py-2 font-medium text-slate-700">{inv.name}</td>
                      <td className="px-4 py-2 text-slate-600">{inv.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Condition on Discharge */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Condition on Discharge
            </h3>
            <p className="text-slate-700 bg-slate-50 rounded-xl p-4">{formData.conditionOnDischarge}</p>
          </div>

          {/* Medicines on Discharge */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              Medicines on Discharge
            </h3>
            <div className="bg-slate-50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">#</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Medicine</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Dosage</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.medicinesOnDischarge.map((med, idx) => (
                    <tr key={idx} className="border-t border-slate-200">
                      <td className="px-4 py-2 text-slate-600">{idx + 1}</td>
                      <td className="px-4 py-2 font-medium text-slate-700">{med.name}</td>
                      <td className="px-4 py-2 text-slate-600">{med.dosage}</td>
                      <td className="px-4 py-2 text-slate-600">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dietary Advice */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Dietary Advice
            </h3>
            <p className="text-slate-700 bg-slate-50 rounded-xl p-4">{formData.dietaryAdvice}</p>
          </div>

          {/* Follow-up */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Follow-up
            </h3>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-700"><strong>Date:</strong> {formatDate(formData.followUpDate)}</p>
              <p className="text-slate-700 mt-2">{formData.followUpInstructions}</p>
            </div>
          </div>

          {/* Emergency Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Emergency Instructions
            </h3>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-red-700">{formData.emergencyInstructions}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-slate-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Prepared By</p>
                <p className="font-medium text-slate-800">Medical Records Department</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Attending Physician</p>
                <p className="font-medium text-slate-800">{mockPatientData.doctor}</p>
                <p className="text-sm text-slate-500">{mockPatientData.doctorSpecialization}</p>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-slate-500">
              <p>This is a computer generated discharge summary.</p>
              <p>For any queries, please contact: +91 22 1234 5678</p>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6 print:hidden">
          {/* Diagnosis */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Diagnosis</h3>
            <Textarea
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              rows={3}
              placeholder="Enter diagnosis..."
            />
          </div>

          {/* Condition on Admission */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Condition on Admission</h3>
            <Textarea
              value={formData.conditionOnAdmission}
              onChange={(e) => setFormData({...formData, conditionOnAdmission: e.target.value})}
              rows={4}
              placeholder="Describe patient's condition on admission..."
            />
          </div>

          {/* Treatment Given */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Treatment Given</h3>
            <Textarea
              value={formData.treatmentGiven}
              onChange={(e) => setFormData({...formData, treatmentGiven: e.target.value})}
              rows={4}
              placeholder="Describe treatments, procedures, medications given..."
            />
          </div>

          {/* Investigations */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Investigations & Results</h3>
            <div className="space-y-4">
              {formData.investigations.map((inv, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{inv.name}</p>
                    <p className="text-sm text-slate-500">{inv.result}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveInvestigation(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Investigation name"
                  value={newInvestigation.name}
                  onChange={(e) => setNewInvestigation({...newInvestigation, name: e.target.value})}
                />
                <Input
                  placeholder="Result"
                  value={newInvestigation.result}
                  onChange={(e) => setNewInvestigation({...newInvestigation, result: e.target.value})}
                />
                <Button variant="outline" onClick={handleAddInvestigation}>
                  Add Investigation
                </Button>
              </div>
            </div>
          </div>

          {/* Condition on Discharge */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Condition on Discharge</h3>
            <Textarea
              value={formData.conditionOnDischarge}
              onChange={(e) => setFormData({...formData, conditionOnDischarge: e.target.value})}
              rows={4}
              placeholder="Describe patient's condition on discharge..."
            />
          </div>

          {/* Medicines on Discharge */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Medicines on Discharge</h3>
            <div className="space-y-4">
              {formData.medicinesOnDischarge.map((med, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Medicine</p>
                      <p className="font-medium text-slate-800">{med.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Dosage</p>
                      <p className="text-sm text-slate-600">{med.dosage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="text-sm text-slate-600">{med.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMedicine(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Medicine name"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                />
                <Input
                  placeholder="Dosage (e.g., 1 tablet twice daily)"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
                />
                <Input
                  placeholder="Duration (e.g., 15 days)"
                  value={newMedicine.duration}
                  onChange={(e) => setNewMedicine({...newMedicine, duration: e.target.value})}
                />
                <Button variant="outline" onClick={handleAddMedicine}>
                  Add Medicine
                </Button>
              </div>
            </div>
          </div>

          {/* Dietary Advice */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Dietary Advice</h3>
            <Textarea
              value={formData.dietaryAdvice}
              onChange={(e) => setFormData({...formData, dietaryAdvice: e.target.value})}
              rows={3}
              placeholder="Diet recommendations..."
            />
          </div>

          {/* Follow-up */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Follow-up</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date</label>
                <Input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                />
              </div>
            </div>
            <Textarea
              value={formData.followUpInstructions}
              onChange={(e) => setFormData({...formData, followUpInstructions: e.target.value})}
              rows={3}
              placeholder="Follow-up instructions..."
            />
          </div>

          {/* Emergency Instructions */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Emergency Instructions</h3>
            <Textarea
              value={formData.emergencyInstructions}
              onChange={(e) => setFormData({...formData, emergencyInstructions: e.target.value})}
              rows={3}
              placeholder="When to report to emergency..."
              className="border-red-200 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Additional Notes</h3>
            <Textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
              rows={3}
              placeholder="Any additional notes or comments..."
            />
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          [ref="printRef"], [ref="printRef"] * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  )
}

export default DischargeCard
