import React, { useState } from 'react'
import { Button, Select } from '../../components/ui'

// Types
type ReportType = 'revenue' | 'patient' | 'financial' | 'operational'
type DateRange = 'today' | 'yesterday' | 'this-week' | 'this-month' | 'this-year' | 'custom'

// Mock Data for Reports
const mockRevenueData = {
  summary: {
    opdRevenue: 485000,
    ipdRevenue: 1250000,
    pharmacyRevenue: 320000,
    serviceRevenue: 175000,
    totalRevenue: 2230000,
  },
  dailyData: [
    { date: '2026-03-01', opd: 45000, ipd: 120000, pharmacy: 28000, services: 15000 },
    { date: '2026-03-02', opd: 52000, ipd: 135000, pharmacy: 32000, services: 18000 },
    { date: '2026-03-03', opd: 38000, ipd: 110000, pharmacy: 25000, services: 12000 },
    { date: '2026-03-04', opd: 48000, ipd: 145000, pharmacy: 35000, services: 20000 },
    { date: '2026-03-05', opd: 55000, ipd: 155000, pharmacy: 42000, services: 22000 },
    { date: '2026-03-06', opd: 42000, ipd: 125000, pharmacy: 30000, services: 16000 },
    { date: '2026-03-07', opd: 35000, ipd: 95000, pharmacy: 22000, services: 12000 },
    { date: '2026-03-08', opd: 50000, ipd: 140000, pharmacy: 38000, services: 19000 },
    { date: '2026-03-09', opd: 58000, ipd: 160000, pharmacy: 45000, services: 24000 },
    { date: '2026-03-10', opd: 62000, ipd: 165000, pharmacy: 48000, services: 28000 },
    { date: '2026-03-11', opd: 48000, ipd: 138000, pharmacy: 35000, services: 18000 },
  ],
  doctorWise: [
    { name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist', opd: 125000, ipd: 320000 },
    { name: 'Dr. Priya Sharma', specialization: 'Pediatrician', opd: 95000, ipd: 180000 },
    { name: 'Dr. Amit Patel', specialization: 'Orthopedic', opd: 85000, ipd: 280000 },
    { name: 'Dr. Sunita Desai', specialization: 'Gynecologist', opd: 110000, ipd: 250000 },
    { name: 'Dr. Vikram Singh', specialization: 'General Physician', opd: 70000, ipd: 95000 },
  ],
  paymentModes: [
    { mode: 'Cash', amount: 890000, percentage: 40 },
    { mode: 'Card', amount: 556000, percentage: 25 },
    { mode: 'UPI', amount: 668000, percentage: 30 },
    { mode: 'Cheque', amount: 116000, percentage: 5 },
  ],
}

const mockPatientData = {
  summary: {
    totalPatients: 2450,
    newPatients: 185,
    opdVisits: 1850,
    ipdAdmissions: 142,
    discharges: 128,
    readmissions: 12,
  },
  opdRegister: [
    { token: 'T001', name: 'Ramesh Kumar', age: 45, phone: '9876543210', doctor: 'Dr. Rajesh Kumar', fee: 500, date: '2026-03-11', status: 'Completed' },
    { token: 'T002', name: 'Priya Devi', age: 32, phone: '9876543211', doctor: 'Dr. Priya Sharma', fee: 400, date: '2026-03-11', status: 'In Progress' },
    { token: 'T003', name: 'Amit Singh', age: 58, phone: '9876543212', doctor: 'Dr. Amit Patel', fee: 600, date: '2026-03-11', status: 'Waiting' },
    { token: 'T004', name: 'Sneha Gupta', age: 28, phone: '9876543213', doctor: 'Dr. Sunita Desai', fee: 500, date: '2026-03-11', status: 'Completed' },
    { token: 'T005', name: 'Vijay Sharma', age: 65, phone: '9876543214', doctor: 'Dr. Vikram Singh', fee: 350, date: '2026-03-11', status: 'Completed' },
  ],
  ipdRegister: [
    { admitId: 'ADM-2026-0142', name: 'Suresh Patel', room: '101-A', doctor: 'Dr. Rajesh Kumar', admitDate: '2026-03-05', days: 6, status: 'Admitted' },
    { admitId: 'ADM-2026-0141', name: 'Kavita Sharma', room: '205-B', doctor: 'Dr. Sunita Desai', admitDate: '2026-03-08', days: 3, status: 'Admitted' },
    { admitId: 'ADM-2026-0140', name: 'Mohan Lal', room: 'ICU-03', doctor: 'Dr. Amit Patel', admitDate: '2026-03-01', days: 10, status: 'Critical' },
    { admitId: 'ADM-2026-0139', name: 'Geeta Devi', room: '302-A', doctor: 'Dr. Priya Sharma', admitDate: '2026-03-09', days: 2, status: 'Stable' },
  ],
  discharges: [
    { admitId: 'ADM-2026-0138', name: 'Rakesh Kumar', room: '101-B', doctor: 'Dr. Rajesh Kumar', admitDate: '2026-02-25', dischargeDate: '2026-03-10', totalBill: 85000 },
    { admitId: 'ADM-2026-0137', name: 'Anita Patel', room: '204-A', doctor: 'Dr. Sunita Desai', admitDate: '2026-02-28', dischargeDate: '2026-03-09', totalBill: 62000 },
  ],
}

const mockFinancialData = {
  incomeStatement: {
    revenue: {
      opd: 485000,
      ipd: 1250000,
      pharmacy: 320000,
      services: 175000,
      other: 25000,
      total: 2255000,
    },
    expenses: {
      salaries: 650000,
      utilities: 85000,
      maintenance: 45000,
      supplies: 120000,
      equipment: 75000,
      rent: 150000,
      marketing: 25000,
      insurance: 55000,
      other: 30000,
      total: 1235000,
    },
    netProfit: 1020000,
    profitMargin: 45.2,
  },
  outstanding: [
    { billId: 'BILL-2026-0542', patient: 'Ramesh Kumar', admitId: 'ADM-2026-0135', amount: 45000, dueDate: '2026-03-15', days: 4 },
    { billId: 'BILL-2026-0538', patient: 'Vijay Singh', admitId: 'ADM-2026-0129', amount: 28000, dueDate: '2026-03-10', days: -1 },
    { billId: 'BILL-2026-0535', patient: 'Kavita Devi', admitId: 'ADM-2026-0124', amount: 62000, dueDate: '2026-03-05', days: -6 },
  ],
  deposits: [
    { receiptNo: 'DEP-2026-0892', patient: 'Suresh Patel', amount: 50000, date: '2026-03-05', mode: 'Cash' },
    { receiptNo: 'DEP-2026-0891', patient: 'Kavita Sharma', amount: 30000, date: '2026-03-08', mode: 'UPI' },
    { receiptNo: 'DEP-2026-0890', patient: 'Mohan Lal', amount: 100000, date: '2026-03-01', mode: 'Bank Transfer' },
  ],
  collections: [
    { date: '2026-03-11', cash: 125000, card: 85000, upi: 95000, cheque: 15000, total: 320000 },
    { date: '2026-03-10', cash: 142000, card: 92000, upi: 108000, cheque: 28000, total: 370000 },
    { date: '2026-03-09', cash: 118000, card: 78000, upi: 88000, cheque: 12000, total: 296000 },
  ],
}

const mockOperationalData = {
  roomOccupancy: [
    { type: 'General Ward', total: 20, occupied: 16, available: 4, occupancyRate: 80 },
    { type: 'AC Room', total: 15, occupied: 9, available: 6, occupancyRate: 60 },
    { type: 'Private Room', total: 10, occupied: 4, available: 6, occupancyRate: 40 },
    { type: 'ICU', total: 5, occupied: 5, available: 0, occupancyRate: 100 },
  ],
  doctorPerformance: [
    { name: 'Dr. Rajesh Kumar', opdPatients: 250, ipdPatients: 32, revenue: 445000, avgRating: 4.8 },
    { name: 'Dr. Priya Sharma', opdPatients: 190, ipdPatients: 18, revenue: 275000, avgRating: 4.9 },
    { name: 'Dr. Amit Patel', opdPatients: 170, ipdPatients: 28, revenue: 365000, avgRating: 4.7 },
    { name: 'Dr. Sunita Desai', opdPatients: 220, ipdPatients: 25, revenue: 360000, avgRating: 4.8 },
    { name: 'Dr. Vikram Singh', opdPatients: 140, ipdPatients: 12, revenue: 165000, avgRating: 4.6 },
  ],
  serviceUsage: [
    { service: 'Nursing Care', count: 420, revenue: 126000 },
    { service: 'Blood Tests', count: 380, revenue: 38000 },
    { service: 'X-Ray', count: 145, revenue: 116000 },
    { service: 'ECG', count: 120, revenue: 60000 },
    { service: 'Physiotherapy', count: 85, revenue: 34000 },
    { service: 'Dressing', count: 210, revenue: 42000 },
  ],
}

const ReportsDashboard = () => {
  const [activeSection, setActiveSection] = useState<ReportType>('revenue')
  const [dateRange, setDateRange] = useState<DateRange>('this-month')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Export functionality placeholder
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  const handlePrint = () => {
    window.print()
  }

  // Simple bar chart component
  const SimpleBarChart = ({ data, maxValue }: { data: { label: string; value: number; color: string }[]; maxValue: number }) => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-700">{item.label}</span>
            <span className="font-medium text-slate-900">{formatCurrency(item.value)}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${item.color} rounded-full transition-all duration-500`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )

  // Revenue Reports Section
  const RevenueReports = () => (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-xl">🏥</span>
            </div>
            <span className="text-slate-600 text-sm">OPD Revenue</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(mockRevenueData.summary.opdRevenue)}</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-xl">🛏️</span>
            </div>
            <span className="text-slate-600 text-sm">IPD Revenue</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(mockRevenueData.summary.ipdRevenue)}</p>
          <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-xl">💊</span>
            </div>
            <span className="text-slate-600 text-sm">Pharmacy</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(mockRevenueData.summary.pharmacyRevenue)}</p>
          <p className="text-xs text-green-600 mt-1">↑ 15% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <span className="text-xl">🔬</span>
            </div>
            <span className="text-slate-600 text-sm">Services</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(mockRevenueData.summary.serviceRevenue)}</p>
          <p className="text-xs text-red-600 mt-1">↓ 3% from last month</p>
        </div>

        <div className="bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <span className="text-white/80 text-sm">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(mockRevenueData.summary.totalRevenue)}</p>
          <p className="text-xs text-white/80 mt-1">↑ 10% from last month</p>
        </div>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {mockRevenueData.dailyData.slice(-7).map((day, index) => {
              const total = day.opd + day.ipd + day.pharmacy + day.services
              const maxHeight = 200
              const height = (total / 300000) * maxHeight
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: maxHeight }}>
                    <div className="w-full bg-blue-500 rounded-t" style={{ height: (day.opd / total) * height }} title={`OPD: ${formatCurrency(day.opd)}`} />
                    <div className="w-full bg-purple-500" style={{ height: (day.ipd / total) * height }} title={`IPD: ${formatCurrency(day.ipd)}`} />
                    <div className="w-full bg-green-500" style={{ height: (day.pharmacy / total) * height }} title={`Pharmacy: ${formatCurrency(day.pharmacy)}`} />
                    <div className="w-full bg-orange-500 rounded-b" style={{ height: (day.services / total) * height }} title={`Services: ${formatCurrency(day.services)}`} />
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(day.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span className="text-xs text-slate-600">OPD</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-sm" />
              <span className="text-xs text-slate-600">IPD</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="text-xs text-slate-600">Pharmacy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-sm" />
              <span className="text-xs text-slate-600">Services</span>
            </div>
          </div>
        </div>

        {/* Payment Mode Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Mode Distribution</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {mockRevenueData.paymentModes.reduce((acc, mode, index) => {
                  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
                  const offset = acc.offset
                  const dash = mode.percentage
                  acc.elements.push(
                    <circle
                      key={index}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={colors[index]}
                      strokeWidth="3"
                      strokeDasharray={`${dash} ${100 - dash}`}
                      strokeDashoffset={-offset}
                    />
                  )
                  acc.offset += dash
                  return acc
                }, { elements: [] as React.ReactElement[], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(mockRevenueData.summary.totalRevenue)}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockRevenueData.paymentModes.map((mode, index) => {
              const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500']
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className={`w-3 h-3 ${colors[index]} rounded-sm`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{mode.mode}</p>
                    <p className="text-xs text-slate-500">{mode.percentage}% • {formatCurrency(mode.amount)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Doctor-wise Revenue */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Doctor-wise Revenue</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Doctor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Specialization</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">OPD Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">IPD Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {mockRevenueData.doctorWise.map((doctor, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                        {doctor.name.charAt(4)}
                      </div>
                      <span className="font-medium text-slate-800">{doctor.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{doctor.specialization}</td>
                  <td className="py-3 px-4 text-right text-slate-800">{formatCurrency(doctor.opd)}</td>
                  <td className="py-3 px-4 text-right text-slate-800">{formatCurrency(doctor.ipd)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">{formatCurrency(doctor.opd + doctor.ipd)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td colSpan={2} className="py-3 px-4 font-semibold text-slate-800">Total</td>
                <td className="py-3 px-4 text-right font-semibold text-slate-800">
                  {formatCurrency(mockRevenueData.doctorWise.reduce((sum, d) => sum + d.opd, 0))}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-slate-800">
                  {formatCurrency(mockRevenueData.doctorWise.reduce((sum, d) => sum + d.ipd, 0))}
                </td>
                <td className="py-3 px-4 text-right font-bold text-blue-600">
                  {formatCurrency(mockRevenueData.doctorWise.reduce((sum, d) => sum + d.opd + d.ipd, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )

  // Patient Reports Section
  const PatientReports = () => (
    <div className="space-y-6">
      {/* Patient Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Patients', value: mockPatientData.summary.totalPatients, icon: '👥', color: 'bg-blue-100' },
          { label: 'New Patients', value: mockPatientData.summary.newPatients, icon: '✨', color: 'bg-green-100' },
          { label: 'OPD Visits', value: mockPatientData.summary.opdVisits, icon: '🏥', color: 'bg-purple-100' },
          { label: 'IPD Admissions', value: mockPatientData.summary.ipdAdmissions, icon: '🛏️', color: 'bg-orange-100' },
          { label: 'Discharges', value: mockPatientData.summary.discharges, icon: '✅', color: 'bg-teal-100' },
          { label: 'Readmissions', value: mockPatientData.summary.readmissions, icon: '🔄', color: 'bg-red-100' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* OPD Register */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">OPD Register</h3>
          <span className="text-sm text-slate-500">Today's Patients</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Token</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Patient Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Age</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Doctor</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Fee</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPatientData.opdRegister.map((patient, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-blue-600">{patient.token}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{patient.name}</td>
                  <td className="py-3 px-4 text-slate-600">{patient.age}</td>
                  <td className="py-3 px-4 text-slate-600">{patient.phone}</td>
                  <td className="py-3 px-4 text-slate-600">{patient.doctor}</td>
                  <td className="py-3 px-4 text-right text-slate-800">{formatCurrency(patient.fee)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      patient.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IPD Register */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">IPD Register - Admitted Patients</h3>
          <span className="text-sm text-slate-500">Currently Admitted</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Admit ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Patient Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Room</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Doctor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Admit Date</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Days</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPatientData.ipdRegister.map((patient, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-purple-600">{patient.admitId}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{patient.name}</td>
                  <td className="py-3 px-4 text-slate-600">{patient.room}</td>
                  <td className="py-3 px-4 text-slate-600">{patient.doctor}</td>
                  <td className="py-3 px-4 text-slate-600">{formatDate(patient.admitDate)}</td>
                  <td className="py-3 px-4 text-center font-medium text-slate-800">{patient.days}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'Admitted' ? 'bg-blue-100 text-blue-700' :
                      patient.status === 'Stable' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Discharges */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Discharges</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Admit ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Room</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Doctor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Admit Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Discharge Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Total Bill</th>
              </tr>
            </thead>
            <tbody>
              {mockPatientData.discharges.map((discharge, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-purple-600">{discharge.admitId}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{discharge.name}</td>
                  <td className="py-3 px-4 text-slate-600">{discharge.room}</td>
                  <td className="py-3 px-4 text-slate-600">{discharge.doctor}</td>
                  <td className="py-3 px-4 text-slate-600">{formatDate(discharge.admitDate)}</td>
                  <td className="py-3 px-4 text-slate-600">{formatDate(discharge.dischargeDate)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">{formatCurrency(discharge.totalBill)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Financial Reports Section
  const FinancialReports = () => (
    <div className="space-y-6">
      {/* Income Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Breakdown</h3>
          <SimpleBarChart
            data={[
              { label: 'OPD', value: mockFinancialData.incomeStatement.revenue.opd, color: 'bg-blue-500' },
              { label: 'IPD', value: mockFinancialData.incomeStatement.revenue.ipd, color: 'bg-purple-500' },
              { label: 'Pharmacy', value: mockFinancialData.incomeStatement.revenue.pharmacy, color: 'bg-green-500' },
              { label: 'Services', value: mockFinancialData.incomeStatement.revenue.services, color: 'bg-orange-500' },
              { label: 'Other', value: mockFinancialData.incomeStatement.revenue.other, color: 'bg-slate-500' },
            ]}
            maxValue={mockFinancialData.incomeStatement.revenue.ipd}
          />
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
            <span className="font-medium text-slate-700">Total Revenue</span>
            <span className="font-bold text-green-600">{formatCurrency(mockFinancialData.incomeStatement.revenue.total)}</span>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Expense Breakdown</h3>
          <SimpleBarChart
            data={[
              { label: 'Salaries', value: mockFinancialData.incomeStatement.expenses.salaries, color: 'bg-red-500' },
              { label: 'Rent', value: mockFinancialData.incomeStatement.expenses.rent, color: 'bg-pink-500' },
              { label: 'Supplies', value: mockFinancialData.incomeStatement.expenses.supplies, color: 'bg-amber-500' },
              { label: 'Utilities', value: mockFinancialData.incomeStatement.expenses.utilities, color: 'bg-yellow-500' },
              { label: 'Equipment', value: mockFinancialData.incomeStatement.expenses.equipment, color: 'bg-indigo-500' },
            ]}
            maxValue={mockFinancialData.incomeStatement.expenses.salaries}
          />
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
            <span className="font-medium text-slate-700">Total Expenses</span>
            <span className="font-bold text-red-600">{formatCurrency(mockFinancialData.incomeStatement.expenses.total)}</span>
          </div>
        </div>
      </div>

      {/* Profit & Loss Summary */}
      <div className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-6">Profit & Loss Summary - March 2026</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-white/70 text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(mockFinancialData.incomeStatement.revenue.total)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-white/70 text-sm mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(mockFinancialData.incomeStatement.expenses.total)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-white/70 text-sm mb-1">Net Profit</p>
            <p className="text-2xl font-bold text-green-300">{formatCurrency(mockFinancialData.incomeStatement.netProfit)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-white/70 text-sm mb-1">Profit Margin</p>
            <p className="text-2xl font-bold text-green-300">{mockFinancialData.incomeStatement.profitMargin}%</p>
          </div>
        </div>
      </div>

      {/* Outstanding Bills */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Outstanding Bills</h3>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            {mockFinancialData.outstanding.length} Pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Bill ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Admit ID</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Due Date</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockFinancialData.outstanding.map((bill, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-blue-600">{bill.billId}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{bill.patient}</td>
                  <td className="py-3 px-4 text-slate-600">{bill.admitId}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">{formatCurrency(bill.amount)}</td>
                  <td className="py-3 px-4 text-slate-600">{formatDate(bill.dueDate)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bill.days > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {bill.days > 0 ? `Due in ${bill.days} days` : `Overdue ${Math.abs(bill.days)} days`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-slate-600">Total Outstanding</span>
          <span className="text-xl font-bold text-red-600">
            {formatCurrency(mockFinancialData.outstanding.reduce((sum, b) => sum + b.amount, 0))}
          </span>
        </div>
      </div>

      {/* Daily Collections */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Collections</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Cash</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Card</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">UPI</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Cheque</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {mockFinancialData.collections.map((collection, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">{formatDate(collection.date)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(collection.cash)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(collection.card)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(collection.upi)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(collection.cheque)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">{formatCurrency(collection.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Operational Reports Section
  const OperationalReports = () => (
    <div className="space-y-6">
      {/* Room Occupancy */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Room Occupancy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {mockOperationalData.roomOccupancy.map((room, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-700">{room.type}</h4>
                <span className={`text-sm font-bold ${
                  room.occupancyRate >= 90 ? 'text-red-600' : 
                  room.occupancyRate >= 70 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {room.occupancyRate}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full rounded-full ${
                    room.occupancyRate >= 90 ? 'bg-red-500' : 
                    room.occupancyRate >= 70 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${room.occupancyRate}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  <span className="text-green-600 font-medium">{room.available}</span> Available
                </span>
                <span className="text-slate-500">
                  <span className="text-red-600 font-medium">{room.occupied}</span> Occupied
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Room Type</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Total Beds</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Occupied</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Available</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Occupancy Rate</th>
              </tr>
            </thead>
            <tbody>
              {mockOperationalData.roomOccupancy.map((room, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">{room.type}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{room.total}</td>
                  <td className="py-3 px-4 text-center text-red-600 font-medium">{room.occupied}</td>
                  <td className="py-3 px-4 text-center text-green-600 font-medium">{room.available}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.occupancyRate >= 90 ? 'bg-red-100 text-red-700' : 
                      room.occupancyRate >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {room.occupancyRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Doctor Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Doctor</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">OPD Patients</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">IPD Patients</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Revenue</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Rating</th>
              </tr>
            </thead>
            <tbody>
              {mockOperationalData.doctorPerformance.map((doctor, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                        {doctor.name.charAt(4)}
                      </div>
                      <span className="font-medium text-slate-800">{doctor.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">{doctor.opdPatients}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{doctor.ipdPatients}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">{formatCurrency(doctor.revenue)}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span className="font-medium text-slate-700">{doctor.avgRating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Utilization */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Service Utilization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockOperationalData.serviceUsage.map((service, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-lg">🔬</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{service.service}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-slate-500">{service.count} times</span>
                  <span className="text-sm font-semibold text-green-600">{formatCurrency(service.revenue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Comprehensive reports and insights for your hospital</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Date Range:</span>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              options={[
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'this-week', label: 'This Week' },
                { value: 'this-month', label: 'This Month' },
                { value: 'this-year', label: 'This Year' },
                { value: 'custom', label: 'Custom Range' },
              ]}
              className="w-40"
            />
          </div>
          {dateRange === 'custom' && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">From:</span>
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">To:</span>
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Report Section Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="border-b border-slate-200">
          <div className="flex flex-wrap">
            {[
              { id: 'revenue', label: 'Revenue Reports', icon: '💰' },
              { id: 'patient', label: 'Patient Reports', icon: '👥' },
              { id: 'financial', label: 'Financial Reports', icon: '📊' },
              { id: 'operational', label: 'Operational Reports', icon: '🏥' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as ReportType)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeSection === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {activeSection === 'revenue' && <RevenueReports />}
          {activeSection === 'patient' && <PatientReports />}
          {activeSection === 'financial' && <FinancialReports />}
          {activeSection === 'operational' && <OperationalReports />}
        </div>
      </div>
    </div>
  )
}

export default ReportsDashboard
