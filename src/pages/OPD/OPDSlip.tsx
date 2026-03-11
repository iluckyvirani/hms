import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui'

// Simple barcode generation using CSS (for demo purposes)
// In production, use a proper barcode library like JsBarcode
const Barcode = ({ value }: { value: string }) => {
  // Generate a simple visual barcode pattern
  const pattern = value.split('').map((char, i) => {
    const width = (char.charCodeAt(0) % 3) + 1
    return (
      <div
        key={i}
        className="bg-black"
        style={{ 
          width: `${width}px`, 
          height: '40px',
          marginRight: '1px'
        }}
      />
    )
  })

  return (
    <div className="flex items-center justify-center my-2">
      <div className="flex">{pattern}</div>
    </div>
  )
}

const OPDSlip = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const printRef = useRef<HTMLDivElement>(null)
  
  const patient = location.state?.patient

  // Mock doctors data (should match the one in OPDRegistration)
  const doctors = [
    { id: 1, name: 'Dr. Rajesh Patel', specialty: 'General Physician', fee: 300 },
    { id: 2, name: 'Dr. Priya Shah', specialty: 'Cardiologist', fee: 500 },
    { id: 3, name: 'Dr. Amit Kumar', specialty: 'Orthopedic', fee: 400 },
    { id: 4, name: 'Dr. Sunita Gupta', specialty: 'Pediatrician', fee: 350 },
    { id: 5, name: 'Dr. Vikram Singh', specialty: 'ENT Specialist', fee: 450 },
  ]

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-500">No patient data found</p>
        <Button onClick={() => navigate('/opd')}>
          Go to OPD List
        </Button>
      </div>
    )
  }

  const doctor = patient.doctorName 
    ? { name: patient.doctorName, specialty: patient.specialty }
    : doctors.find(d => d.id === Number(patient.doctorId))

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>OPD Slip - ${patient.tokenNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
            }
            .slip {
              max-width: 400px;
              margin: 0 auto;
              border: 2px solid #000;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .hospital-name {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
            }
            .hospital-address {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            .token-section {
              display: flex;
              justify-content: space-between;
              padding: 10px;
              background: #f0f9ff;
              border-radius: 8px;
              margin-bottom: 15px;
            }
            .token-number {
              font-size: 20px;
              font-weight: bold;
              color: #1e40af;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px dashed #ddd;
            }
            .info-label {
              color: #666;
              font-size: 12px;
            }
            .info-value {
              font-weight: 600;
              font-size: 14px;
            }
            .doctor-section {
              background: #ecfdf5;
              padding: 12px;
              border-radius: 8px;
              margin: 15px 0;
            }
            .doctor-name {
              font-weight: bold;
              color: #047857;
            }
            .barcode-section {
              text-align: center;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px dashed #000;
            }
            .barcode {
              display: flex;
              justify-content: center;
              gap: 1px;
            }
            .barcode-bar {
              background: #000;
              height: 40px;
            }
            .payment-badge {
              display: inline-block;
              padding: 4px 12px;
              background: #dcfce7;
              color: #166534;
              font-weight: bold;
              border-radius: 20px;
              font-size: 12px;
            }
            .payment-badge.pending {
              background: #fef3c7;
              color: #92400e;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              font-size: 10px;
              color: #666;
            }
            @media print {
              body { padding: 0; }
              .slip { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatAadhar = (aadhar: string) => {
    return `XXXX-XXXX-${aadhar?.slice(-4) || '****'}`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">OPD Slip</h1>
          <p className="text-slate-500 mt-1">Print patient registration slip</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/opd')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to OPD
          </Button>
          <Button onClick={handlePrint}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Slip
          </Button>
        </div>
      </div>

      {/* Slip Preview */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          {/* Printable Content */}
          <div ref={printRef} className="slip">
            {/* Hospital Header */}
            <div className="header text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h1 className="hospital-name text-xl font-bold text-blue-700">MEDICARE PRO HOSPITAL</h1>
              <p className="hospital-address text-xs text-slate-500 mt-1">
                123 Medical Street, Healthcare District<br />
                Phone: +91 9876543210
              </p>
            </div>

            {/* Token & Date */}
            <div className="token-section flex items-center justify-between p-3 bg-blue-50 rounded-xl mb-4">
              <div>
                <span className="text-xs text-slate-500">TOKEN</span>
                <p className="token-number text-lg font-bold text-blue-600">
                  #{patient.tokenNumber?.slice(-6) || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Date</span>
                <p className="font-semibold text-slate-700">{formatDate(patient.visitDate)}</p>
              </div>
            </div>

            {/* Patient Information */}
            <div className="space-y-2 mb-4">
              <div className="info-row flex justify-between py-2 border-b border-dashed border-slate-200">
                <span className="info-label text-xs text-slate-500">Patient Name</span>
                <span className="info-value font-semibold text-slate-800">{patient.patientName}</span>
              </div>
              <div className="info-row flex justify-between py-2 border-b border-dashed border-slate-200">
                <span className="info-label text-xs text-slate-500">Age / Gender</span>
                <span className="info-value font-medium text-slate-700">
                  {patient.age} years / {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other'}
                </span>
              </div>
              <div className="info-row flex justify-between py-2 border-b border-dashed border-slate-200">
                <span className="info-label text-xs text-slate-500">Phone</span>
                <span className="info-value font-medium text-slate-700">{patient.phone}</span>
              </div>
              <div className="info-row flex justify-between py-2 border-b border-dashed border-slate-200">
                <span className="info-label text-xs text-slate-500">Aadhar</span>
                <span className="info-value font-medium text-slate-700">{formatAadhar(patient.aadhar)}</span>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="doctor-section p-3 bg-emerald-50 rounded-xl mb-4">
              <span className="text-xs text-emerald-600">Consulting Doctor</span>
              <p className="doctor-name font-bold text-emerald-700">{doctor?.name || 'N/A'}</p>
              <p className="text-sm text-slate-600">{doctor?.specialty || ''}</p>
            </div>

            {/* Symptoms */}
            {patient.symptoms && (
              <div className="mb-4">
                <span className="text-xs text-slate-500">Symptoms / Chief Complaint</span>
                <p className="text-sm text-slate-700 mt-1 p-2 bg-slate-50 rounded-lg">{patient.symptoms}</p>
              </div>
            )}

            {/* Fee & Payment */}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl mb-4">
              <div>
                <span className="text-xs text-slate-500">Consultation Fee</span>
                <p className="text-xl font-bold text-slate-800">₹{patient.consultationFee}</p>
              </div>
              <span className={`payment-badge px-3 py-1 rounded-full text-xs font-bold ${
                patient.paymentStatus === 'paid' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {patient.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
              </span>
            </div>

            {/* Barcode */}
            <div className="barcode-section text-center pt-4 border-t-2 border-dashed border-slate-300">
              <Barcode value={patient.tokenNumber || 'OPD000000'} />
              <p className="text-xs text-slate-400 mt-2">{patient.tokenNumber}</p>
            </div>

            {/* Footer */}
            <div className="footer text-center mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400">
                Thank you for choosing MediCare Pro Hospital<br />
                Please retain this slip for future reference
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate('/opd/register')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Registration
        </Button>
        <Button variant="secondary" onClick={() => navigate('/ipd/admit', { state: { patient } })}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Admit Patient
        </Button>
      </div>
    </div>
  )
}

export default OPDSlip
