import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Select, Textarea } from '../../components/ui'

// Mock admitted patients
const mockAdmittedPatients = [
  { id: 1, admitId: 'IPD20260311001', name: 'Rahul Sharma', room: '201', bed: 'A', doctor: 'Dr. Priya Shah' },
  { id: 2, admitId: 'IPD20260310002', name: 'Sunita Devi', room: '101', bed: 'B', doctor: 'Dr. Rajesh Patel' },
  { id: 3, admitId: 'IPD20260308003', name: 'Amit Kumar', room: 'ICU-1', bed: '2', doctor: 'Dr. Priya Shah' },
  { id: 4, admitId: 'IPD20260311004', name: 'Priya Singh', room: '301', bed: 'A', doctor: 'Dr. Sunita Gupta' },
  { id: 5, admitId: 'IPD20260307005', name: 'Vikram Joshi', room: '202', bed: 'A', doctor: 'Dr. Amit Kumar' },
]

// Mock services
const mockServices = [
  { id: 1, name: 'Nursing Care (per day)', category: 'nursing', fee: 300 },
  { id: 2, name: 'BP Monitoring', category: 'nursing', fee: 50 },
  { id: 3, name: 'Blood Sugar Test', category: 'diagnostic', fee: 100 },
  { id: 4, name: 'ECG', category: 'diagnostic', fee: 500 },
  { id: 5, name: 'X-Ray', category: 'diagnostic', fee: 800 },
  { id: 6, name: 'Injection', category: 'procedure', fee: 100 },
  { id: 7, name: 'Dressing', category: 'procedure', fee: 200 },
  { id: 8, name: 'Physiotherapy', category: 'therapy', fee: 400 },
  { id: 9, name: 'Nebulization', category: 'procedure', fee: 150 },
]

// Mock recent service assignments
const mockRecentAssignments = [
  { id: 1, patientName: 'Rahul Sharma', admitId: 'IPD20260311001', services: ['ECG', 'BP Monitoring'], total: 550, date: '2026-03-11', assignedBy: 'Nurse Priya' },
  { id: 2, patientName: 'Amit Kumar', admitId: 'IPD20260308003', services: ['Nursing Care (per day)', 'Injection', 'Dressing'], total: 600, date: '2026-03-11', assignedBy: 'Nurse Kavita' },
  { id: 3, patientName: 'Sunita Devi', admitId: 'IPD20260310002', services: ['Blood Sugar Test'], total: 100, date: '2026-03-10', assignedBy: 'Nurse Priya' },
]

interface SelectedService {
  id: number
  name: string
  fee: number
  quantity: number
}

const AssignService = () => {
  const navigate = useNavigate()
  const [selectedPatient, setSelectedPatient] = useState('')
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [notes, setNotes] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [searchService, setSearchService] = useState('')

  // Get selected patient details
  const patientDetails = mockAdmittedPatients.find(p => p.admitId === selectedPatient)

  // Filter services based on search
  const filteredServices = mockServices.filter(s => 
    s.name.toLowerCase().includes(searchService.toLowerCase())
  )

  // Calculate total
  const totalAmount = selectedServices.reduce((sum, s) => sum + (s.fee * s.quantity), 0)

  const handleAddService = (service: typeof mockServices[0]) => {
    const existing = selectedServices.find(s => s.id === service.id)
    if (existing) {
      setSelectedServices(selectedServices.map(s => 
        s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s
      ))
    } else {
      setSelectedServices([...selectedServices, { 
        id: service.id, 
        name: service.name, 
        fee: service.fee, 
        quantity: 1 
      }])
    }
    setSearchService('')
  }

  const handleRemoveService = (id: number) => {
    setSelectedServices(selectedServices.filter(s => s.id !== id))
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) {
      handleRemoveService(id)
      return
    }
    setSelectedServices(selectedServices.map(s => 
      s.id === id ? { ...s, quantity } : s
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || selectedServices.length === 0) {
      alert('Please select a patient and at least one service')
      return
    }
    setShowSuccessModal(true)
  }

  const handleReset = () => {
    setSelectedPatient('')
    setServiceDate(new Date().toISOString().split('T')[0])
    setSelectedServices([])
    setNotes('')
    setShowSuccessModal(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      diagnostic: 'bg-blue-100 text-blue-700',
      nursing: 'bg-emerald-100 text-emerald-700',
      therapy: 'bg-purple-100 text-purple-700',
      procedure: 'bg-amber-100 text-amber-700',
    }
    return colors[category] || 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assign Services</h1>
          <p className="text-slate-500 mt-1">Assign services to admitted patients</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/services')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Services
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            {/* Patient Selection */}
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Select Patient</h3>
              <Select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                placeholder="Select admitted patient"
                options={[
                  { value: '', label: 'Select Patient' },
                  ...mockAdmittedPatients.map(p => ({ 
                    value: p.admitId, 
                    label: `${p.name} (${p.admitId}) - Room ${p.room}` 
                  }))
                ]}
                required
              />

              {/* Patient Details Card */}
              {patientDetails && (
                <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {patientDetails.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{patientDetails.name}</p>
                      <p className="text-sm text-slate-500">
                        Room {patientDetails.room} / Bed {patientDetails.bed} • {patientDetails.doctor}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Admit ID</p>
                      <p className="text-sm font-mono text-purple-600">{patientDetails.admitId}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Service Date */}
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Service Date</h3>
              <Input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Service Selection */}
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Select Services</h3>
              
              {/* Search Services */}
              <div className="relative mb-4">
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search services to add..."
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              {/* Service List */}
              {searchService && (
                <div className="mb-4 max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {filteredServices.length === 0 ? (
                    <p className="p-3 text-sm text-slate-500 text-center">No services found</p>
                  ) : (
                    filteredServices.map(service => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleAddService(service)}
                        className="w-full p-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(service.category)}`}>
                            {service.category}
                          </span>
                          <span className="text-sm font-medium text-slate-700">{service.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">₹{service.fee}</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Quick Add Buttons */}
              {!searchService && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockServices.slice(0, 6).map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleAddService(service)}
                      className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      + {service.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Services */}
              {selectedServices.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase">Selected Services</p>
                  <div className="space-y-2">
                    {selectedServices.map(service => (
                      <div key={service.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{service.name}</p>
                          <p className="text-sm text-slate-500">₹{service.fee} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(service.id, service.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-semibold text-slate-800">{service.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(service.id, service.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        <div className="w-20 text-right">
                          <p className="font-semibold text-slate-800">₹{service.fee * service.quantity}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(service.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Notes (Optional)</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about the services..."
                rows={3}
              />
            </div>

            {/* Total & Submit */}
            <div className="p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-slate-700">Total Amount</span>
                <span className="text-2xl font-bold text-purple-600">₹{totalAmount.toLocaleString()}</span>
              </div>
              <Button type="submit" className="w-full" disabled={!selectedPatient || selectedServices.length === 0}>
                Assign Services
              </Button>
            </div>
          </form>
        </div>

        {/* Recent Assignments Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Recent Assignments</h3>
              <p className="text-sm text-slate-500">Today's service assignments</p>
            </div>
            <div className="divide-y divide-slate-100">
              {mockRecentAssignments.map(assignment => (
                <div key={assignment.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-800">{assignment.patientName}</p>
                      <p className="text-xs text-slate-500">{assignment.admitId}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">₹{assignment.total}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {assignment.services.map((service, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    {formatDate(assignment.date)} • {assignment.assignedBy}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Button variant="outline" size="sm" className="w-full">
                View All Assignments
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-linear-to-br from-purple-500 to-blue-500 rounded-xl p-4 text-white">
            <h4 className="font-semibold mb-3">Today's Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-100">Services Assigned</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Patients Served</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Total Revenue</span>
                <span className="font-semibold">₹8,450</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && patientDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-linear-to-r from-purple-500 to-blue-500 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Services Assigned!</h3>
              <p className="text-purple-100">Services have been added to patient's bill</p>
            </div>

            <div className="p-4 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {patientDetails.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{patientDetails.name}</p>
                    <p className="text-xs text-slate-500">Room {patientDetails.room} / Bed {patientDetails.bed}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-slate-500">Date</p>
                    <p className="font-medium text-slate-800">{formatDate(serviceDate)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Services</p>
                    <p className="font-medium text-slate-800">{selectedServices.length} items</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {selectedServices.map(service => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{service.name} × {service.quantity}</span>
                    <span className="font-medium text-slate-800">₹{service.fee * service.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="font-semibold text-slate-700">Total</span>
                  <span className="font-bold text-purple-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/ipd')}>
                Back to IPD
              </Button>
              <Button className="flex-1" onClick={handleReset}>
                Assign More
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssignService
