import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Input, Select } from '../../components/ui'

// Mock admitted patients data (dischargeable)
const mockAdmittedPatients = [
  {
    patientId: 'PT-2026-0045',
    patientName: 'Vikram Joshi',
    age: 38,
    gender: 'Male',
    phone: '+91 98765 12345',
    aadhar: '9876-5432-1098',
    admitId: 'IPD20260309001',
    admitDate: '2026-03-09',
    roomNo: '201',
    roomType: 'Non-AC',
    roomRate: 1000,
    bed: 'A',
    doctor: 'Dr. Priya Shah',
    diagnosis: 'Viral Fever, Weakness',
    status: 'admitted',
    services: [
      { date: '2026-03-09', name: 'Nursing Care', qty: 3, rate: 300, total: 900 },
      { date: '2026-03-10', name: 'Blood Tests', qty: 2, rate: 100, total: 200 },
      { date: '2026-03-10', name: 'ECG', qty: 1, rate: 500, total: 500 },
      { date: '2026-03-11', name: 'X-Ray', qty: 1, rate: 800, total: 800 },
    ],
    otherCharges: [
      { name: 'Doctor Visits', qty: 3, rate: 500, total: 1500 },
      { name: 'Emergency Charges', qty: 1, rate: 500, total: 500 },
    ],
    deposits: [
      { date: '2026-03-09', mode: 'Cash', amount: 10000 },
      { date: '2026-03-10', mode: 'UPI', amount: 5000 },
    ],
  },
  {
    patientId: 'PT-2026-0042',
    patientName: 'Ramesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    aadhar: '1234-5678-9012',
    admitId: 'IPD20260311001',
    admitDate: '2026-03-11',
    roomNo: '105',
    roomType: 'AC',
    roomRate: 1500,
    bed: 'B',
    doctor: 'Dr. Rajesh Patel',
    diagnosis: 'Chest Pain, Hypertension',
    status: 'admitted',
    services: [
      { date: '2026-03-11', name: 'ECG', qty: 2, rate: 500, total: 1000 },
      { date: '2026-03-11', name: 'Blood Tests', qty: 3, rate: 100, total: 300 },
      { date: '2026-03-11', name: 'Nursing Care', qty: 1, rate: 300, total: 300 },
    ],
    otherCharges: [
      { name: 'Doctor Visits', qty: 2, rate: 500, total: 1000 },
    ],
    deposits: [
      { date: '2026-03-11', mode: 'Card', amount: 15000 },
    ],
  },
]

const GenerateBill = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedPatient, setSelectedPatient] = useState<typeof mockAdmittedPatients[0] | null>(null)
  const [dischargeDate, setDischargeDate] = useState(new Date().toISOString().slice(0, 10))
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [showPreview, setShowPreview] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof mockAdmittedPatients>([])

  // Search for patient when initialSearch is provided
  useEffect(() => {
    if (initialSearch) {
      handleSearch()
    }
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }
    
    const results = mockAdmittedPatients.filter(p => 
      p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.admitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
    )
    setSearchResults(results)
  }

  const calculateBill = () => {
    if (!selectedPatient) return null

    const admitDate = new Date(selectedPatient.admitDate)
    const discharge = new Date(dischargeDate)
    const days = Math.max(1, Math.ceil((discharge.getTime() - admitDate.getTime()) / (1000 * 60 * 60 * 24)))
    
    const roomCharges = days * selectedPatient.roomRate
    const serviceTotal = selectedPatient.services.reduce((sum, s) => sum + s.total, 0)
    const otherTotal = selectedPatient.otherCharges.reduce((sum, c) => sum + c.total, 0)
    const grossTotal = roomCharges + serviceTotal + otherTotal
    const totalDeposits = selectedPatient.deposits.reduce((sum, d) => sum + d.amount, 0)
    const balanceDue = Math.max(0, grossTotal - totalDeposits)
    const refundDue = Math.max(0, totalDeposits - grossTotal)

    return {
      days,
      roomCharges,
      serviceTotal,
      otherTotal,
      grossTotal,
      totalDeposits,
      balanceDue,
      refundDue,
    }
  }

  const billData = selectedPatient ? calculateBill() : null

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const generateBillNumber = () => {
    const year = new Date().getFullYear()
    const num = Math.floor(Math.random() * 9000) + 1000
    return `FNF-${year}-${num}`
  }

  const handleGenerateBill = () => {
    const billNo = generateBillNumber()
    alert(`Bill ${billNo} generated successfully!`)
    navigate('/billing')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/billing')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Generate Final Bill</h1>
          <p className="text-slate-500">Search patient and generate discharge bill</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Search & Select */}
        <div className="space-y-6">
          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Search Patient</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Patient ID / Admit ID / Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-slate-500">{searchResults.length} patient(s) found</p>
                {searchResults.map(patient => (
                  <button
                    key={patient.admitId}
                    onClick={() => {
                      setSelectedPatient(patient)
                      setSearchResults([])
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-colors ${
                      selectedPatient?.admitId === patient.admitId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-800">{patient.patientName}</p>
                        <p className="text-sm text-slate-500">{patient.patientId}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        patient.status === 'admitted' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {patient.status === 'admitted' ? 'Admitted' : 'Discharged'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{patient.admitId} • Room {patient.roomNo}</p>
                  </button>
                ))}
              </div>
            )}

            {searchTerm && searchResults.length === 0 && (
              <p className="mt-4 text-sm text-slate-500 text-center py-4">No patients found</p>
            )}
          </div>

          {/* Selected Patient Info */}
          {selectedPatient && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Patient Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {selectedPatient.patientName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{selectedPatient.patientName}</p>
                    <p className="text-sm text-slate-500">{selectedPatient.age} yrs / {selectedPatient.gender}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-slate-100">
                  <div>
                    <p className="text-slate-500">Patient ID</p>
                    <p className="font-mono font-medium">{selectedPatient.patientId}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Admit ID</p>
                    <p className="font-mono font-medium">{selectedPatient.admitId}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Admit Date</p>
                    <p className="font-medium">{formatDate(selectedPatient.admitDate)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Room</p>
                    <p className="font-medium">{selectedPatient.roomNo} ({selectedPatient.roomType})</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500">Doctor</p>
                    <p className="font-medium">{selectedPatient.doctor}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500">Diagnosis</p>
                    <p className="font-medium">{selectedPatient.diagnosis}</p>
                  </div>
                </div>

                {/* Discharge Date */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Discharge Date</label>
                  <Input
                    type="date"
                    value={dischargeDate}
                    min={selectedPatient.admitDate}
                    onChange={(e) => setDischargeDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right - Bill Calculation */}
        <div className="lg:col-span-2">
          {selectedPatient && billData ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Bill Calculation</h3>
                <p className="text-sm text-slate-500">Review charges before generating final bill</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Room Charges */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                    <h4 className="font-medium text-slate-700">Room Charges</h4>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">
                        {selectedPatient.roomType} Room × {billData.days} days @ ₹{selectedPatient.roomRate}/day
                      </span>
                      <span className="font-semibold text-slate-800">₹{billData.roomCharges.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                    <h4 className="font-medium text-slate-700">Services</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    {selectedPatient.services.map((svc, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">
                          {svc.name} × {svc.qty} @ ₹{svc.rate}
                          <span className="text-xs text-slate-400 ml-2">({formatDate(svc.date)})</span>
                        </span>
                        <span>₹{svc.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-semibold">
                      <span>Services Subtotal</span>
                      <span>₹{billData.serviceTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Other Charges */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                    <h4 className="font-medium text-slate-700">Other Charges</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    {selectedPatient.otherCharges.map((charge, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">{charge.name} × {charge.qty} @ ₹{charge.rate}</span>
                        <span>₹{charge.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-semibold">
                      <span>Other Subtotal</span>
                      <span>₹{billData.otherTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Gross Total */}
                <div className="bg-slate-800 text-white rounded-xl p-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>GROSS TOTAL</span>
                    <span>₹{billData.grossTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deposits */}
                <div className="border border-emerald-200 bg-emerald-50 rounded-xl overflow-hidden">
                  <div className="bg-emerald-100 px-4 py-2 border-b border-emerald-200">
                    <h4 className="font-medium text-emerald-700">Deposits Received</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    {selectedPatient.deposits.map((dep, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-emerald-700">{formatDate(dep.date)} ({dep.mode})</span>
                        <span className="font-semibold text-emerald-700">₹{dep.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-emerald-200 font-semibold text-emerald-800">
                      <span>Total Deposits</span>
                      <span>₹{billData.totalDeposits.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Balance/Refund */}
                {billData.balanceDue > 0 ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex justify-between items-center text-lg font-bold text-red-700">
                      <span>BALANCE DUE</span>
                      <span>₹{billData.balanceDue.toLocaleString()}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-red-200">
                      <label className="block text-sm font-medium text-red-700 mb-2">Payment Mode</label>
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
                  </div>
                ) : billData.refundDue > 0 ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex justify-between items-center text-lg font-bold text-orange-700">
                      <span>REFUND DUE TO PATIENT</span>
                      <span>₹{billData.refundDue.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-orange-600 mt-2">
                      Excess deposit will be refunded after bill generation
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex justify-between items-center text-lg font-bold text-emerald-700">
                      <span>BALANCE</span>
                      <span>₹0 (Fully Settled)</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowPreview(true)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview Bill
                  </Button>
                  <Button className="flex-1" onClick={handleGenerateBill}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generate & Print Bill
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Search Patient to Generate Bill</h3>
              <p className="text-slate-500">Enter Patient ID, Admit ID, or Name to search and select a patient for billing</p>
            </div>
          )}
        </div>
      </div>

      {/* Bill Preview Modal */}
      {showPreview && selectedPatient && billData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Bill Preview</h3>
              <div className="flex items-center gap-2">
                <Button onClick={() => window.print()}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </Button>
                <button
                  onClick={() => setShowPreview(false)}
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

              {/* Bill Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p><span className="font-semibold">Bill No:</span> {generateBillNumber()}</p>
                  <p><span className="font-semibold">Date:</span> {formatDate(new Date().toISOString())}</p>
                  <p><span className="font-semibold">Admission ID:</span> {selectedPatient.admitId}</p>
                </div>
                <div className="text-right">
                  <p><span className="font-semibold">Admit Date:</span> {formatDate(selectedPatient.admitDate)}</p>
                  <p><span className="font-semibold">Discharge Date:</span> {formatDate(dischargeDate)}</p>
                  <p><span className="font-semibold">Duration:</span> {billData.days} days</p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-slate-800 mb-2">Patient Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-slate-600">Name:</span> {selectedPatient.patientName}</p>
                  <p><span className="text-slate-600">Patient ID:</span> {selectedPatient.patientId}</p>
                  <p><span className="text-slate-600">Age/Gender:</span> {selectedPatient.age} yrs / {selectedPatient.gender}</p>
                  <p><span className="text-slate-600">Phone:</span> {selectedPatient.phone}</p>
                  <p><span className="text-slate-600">Room:</span> {selectedPatient.roomNo} (Bed {selectedPatient.bed})</p>
                  <p><span className="text-slate-600">Room Type:</span> {selectedPatient.roomType}</p>
                  <p className="col-span-2"><span className="text-slate-600">Doctor:</span> {selectedPatient.doctor}</p>
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
                  {/* Room */}
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="px-3 py-2 font-semibold text-blue-800 border-b border-slate-200">Room Charges</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-slate-100">{selectedPatient.roomType} Room</td>
                    <td className="text-center px-3 py-2 border-b border-slate-100">{billData.days}</td>
                    <td className="text-right px-3 py-2 border-b border-slate-100">{selectedPatient.roomRate.toLocaleString()}</td>
                    <td className="text-right px-3 py-2 border-b border-slate-100 font-medium">{billData.roomCharges.toLocaleString()}</td>
                  </tr>

                  {/* Services */}
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="px-3 py-2 font-semibold text-blue-800 border-b border-slate-200">Services</td>
                  </tr>
                  {selectedPatient.services.map((svc, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 border-b border-slate-100">{svc.name}</td>
                      <td className="text-center px-3 py-2 border-b border-slate-100">{svc.qty}</td>
                      <td className="text-right px-3 py-2 border-b border-slate-100">{svc.rate.toLocaleString()}</td>
                      <td className="text-right px-3 py-2 border-b border-slate-100">{svc.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50">
                    <td colSpan={3} className="px-3 py-2 text-right font-medium border-b border-slate-200">Services Subtotal</td>
                    <td className="text-right px-3 py-2 font-medium border-b border-slate-200">₹{billData.serviceTotal.toLocaleString()}</td>
                  </tr>

                  {/* Other Charges */}
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="px-3 py-2 font-semibold text-blue-800 border-b border-slate-200">Other Charges</td>
                  </tr>
                  {selectedPatient.otherCharges.map((charge, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 border-b border-slate-100">{charge.name}</td>
                      <td className="text-center px-3 py-2 border-b border-slate-100">{charge.qty}</td>
                      <td className="text-right px-3 py-2 border-b border-slate-100">{charge.rate.toLocaleString()}</td>
                      <td className="text-right px-3 py-2 border-b border-slate-100">{charge.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50">
                    <td colSpan={3} className="px-3 py-2 text-right font-medium border-b border-slate-200">Other Subtotal</td>
                    <td className="text-right px-3 py-2 font-medium border-b border-slate-200">₹{billData.otherTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-800 text-white">
                    <td colSpan={3} className="px-3 py-3 font-bold text-lg">GROSS TOTAL</td>
                    <td className="text-right px-3 py-3 font-bold text-lg">₹{billData.grossTotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Deposits */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-emerald-800 mb-2">Deposits Received</h4>
                <table className="w-full text-sm">
                  <tbody>
                    {selectedPatient.deposits.map((dep, idx) => (
                      <tr key={idx}>
                        <td className="py-1">{formatDate(dep.date)}</td>
                        <td className="py-1">{dep.mode}</td>
                        <td className="py-1 text-right font-medium">₹{dep.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-emerald-300 font-semibold">
                      <td colSpan={2} className="py-2">Total Deposits</td>
                      <td className="py-2 text-right">₹{billData.totalDeposits.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Balance Summary */}
              <div className={`rounded-lg p-4 mb-4 ${
                billData.balanceDue > 0 ? 'bg-red-50 border border-red-200' :
                billData.refundDue > 0 ? 'bg-orange-50 border border-orange-200' :
                'bg-emerald-50 border border-emerald-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-lg ${
                    billData.balanceDue > 0 ? 'text-red-800' :
                    billData.refundDue > 0 ? 'text-orange-800' :
                    'text-emerald-800'
                  }`}>
                    {billData.balanceDue > 0 ? 'BALANCE DUE' :
                     billData.refundDue > 0 ? 'REFUND DUE' :
                     'FULLY SETTLED'}
                  </span>
                  <span className={`text-2xl font-bold ${
                    billData.balanceDue > 0 ? 'text-red-800' :
                    billData.refundDue > 0 ? 'text-orange-800' :
                    'text-emerald-800'
                  }`}>
                    ₹{(billData.balanceDue > 0 ? billData.balanceDue :
                       billData.refundDue > 0 ? billData.refundDue : 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-slate-500 border-t border-slate-200 pt-4">
                <p>Generated by: Reception | Date: {formatDate(new Date().toISOString())}</p>
                <p className="mt-1 text-xs">This is a computer generated bill. For queries, contact billing desk.</p>
                <p className="mt-1 text-xs font-medium">Thank you for choosing Medicare Pro Hospital!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GenerateBill
