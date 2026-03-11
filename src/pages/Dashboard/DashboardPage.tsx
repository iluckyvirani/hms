import { useState } from 'react'
import { 
  StatCard, 
  QuickAction, 
  ActivityItem, 
  RoomStatus, 
  UpcomingAppointment 
} from '../../components/dashboard'

// Main Dashboard Page
const DashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')

  // Mock data for stats
  const stats = [
    {
      title: "Today's OPD",
      value: 42,
      change: '+12% from yesterday',
      changeType: 'increase' as const,
      color: 'bg-blue-100',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: 'Admitted Patients',
      value: 28,
      change: '3 new today',
      changeType: 'neutral' as const,
      color: 'bg-purple-100',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Available Beds',
      value: '15/50',
      change: '30% available',
      changeType: 'neutral' as const,
      color: 'bg-emerald-100',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: "Today's Revenue",
      value: '₹85,400',
      change: '+8% from yesterday',
      changeType: 'increase' as const,
      color: 'bg-amber-100',
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  // Mock data for room status
  const roomData = [
    { type: 'General Ward', total: 20, occupied: 16, available: 3, cleaning: 1 },
    { type: 'AC Room', total: 15, occupied: 9, available: 5, cleaning: 1 },
    { type: 'ICU', total: 8, occupied: 8, available: 0, cleaning: 0 },
    { type: 'Private Room', total: 7, occupied: 3, available: 4, cleaning: 0 },
  ]

  // Mock data for recent activities
  const activities = [
    { title: 'New OPD Registration', description: 'Rahul Sharma - Dr. Patel', time: '2 min ago', type: 'opd' as const },
    { title: 'Patient Admitted', description: 'Priya Singh - Room 204', time: '15 min ago', type: 'ipd' as const },
    { title: 'Payment Received', description: '₹12,500 - Cash', time: '32 min ago', type: 'payment' as const },
    { title: 'Patient Discharged', description: 'Amit Kumar - Room 108', time: '1 hour ago', type: 'discharge' as const },
    { title: 'New OPD Registration', description: 'Neha Gupta - Dr. Shah', time: '1.5 hours ago', type: 'opd' as const },
  ]

  // Mock data for upcoming appointments
  const appointments = [
    { patient: 'Rajesh Kumar', doctor: 'Dr. Patel', time: '10:30 AM', type: 'Consultation' },
    { patient: 'Sunita Devi', doctor: 'Dr. Shah', time: '11:00 AM', type: 'Follow-up' },
    { patient: 'Vikram Singh', doctor: 'Dr. Patel', time: '11:30 AM', type: 'New Patient' },
    { patient: 'Meera Joshi', doctor: 'Dr. Gupta', time: '12:00 PM', type: 'Consultation' },
  ]

  // Revenue data for chart (mock)
  const revenueData = [
    { day: 'Mon', opd: 45000, ipd: 120000 },
    { day: 'Tue', opd: 52000, ipd: 98000 },
    { day: 'Wed', opd: 48000, ipd: 145000 },
    { day: 'Thu', opd: 61000, ipd: 132000 },
    { day: 'Fri', opd: 55000, ipd: 115000 },
    { day: 'Sat', opd: 67000, ipd: 88000 },
    { day: 'Sun', opd: 32000, ipd: 76000 },
  ]

  const maxRevenue = Math.max(...revenueData.map(d => d.opd + d.ipd))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, Dr. Smith! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {(['today', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedPeriod === period
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
          <QuickAction
            title="New OPD"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
          />
          <QuickAction
            title="Admit Patient"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
          />
          <QuickAction
            title="Add Service"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
          />
          <QuickAction
            title="New Bill"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>}
          />
          <QuickAction
            title="Pharmacy"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
          />
          <QuickAction
            title="Discharge"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>}
          />
          <QuickAction
            title="Reports"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <QuickAction
            title="Add Expense"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Revenue Overview</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                OPD
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                IPD
              </span>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-52">
            {revenueData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1" style={{ height: '180px' }}>
                  <div 
                    className="w-full bg-cyan-500 rounded-t-lg transition-all duration-500 hover:bg-cyan-400"
                    style={{ height: `${(item.ipd / maxRevenue) * 100}%` }}
                    title={`IPD: ₹${item.ipd.toLocaleString()}`}
                  />
                  <div 
                    className="w-full bg-blue-500 rounded-b-lg transition-all duration-500 hover:bg-blue-400"
                    style={{ height: `${(item.opd / maxRevenue) * 100}%` }}
                    title={`OPD: ₹${item.opd.toLocaleString()}`}
                  />
                </div>
                <span className="text-xs text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-xl font-bold text-slate-800">₹6,50,000</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">OPD Revenue</p>
              <p className="text-xl font-bold text-blue-600">₹3,60,000</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">IPD Revenue</p>
              <p className="text-xl font-bold text-cyan-600">₹2,90,000</p>
            </div>
          </div>
        </div>

        {/* Room Occupancy */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Room Occupancy</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Occupied
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Cleaning
            </span>
          </div>

          <div className="space-y-1">
            {roomData.map((room, index) => (
              <RoomStatus key={index} {...room} />
            ))}
          </div>

          {/* Total Summary */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Total Beds</span>
              <span className="text-sm font-bold text-slate-800">50</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-medium text-slate-600">Overall Occupancy</span>
              <span className="text-sm font-bold text-blue-600">72%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-1">
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Upcoming Appointments</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {appointments.map((appointment, index) => (
              <UpcomingAppointment key={index} {...appointment} />
            ))}
          </div>
          
          {/* Today Summary */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Today's Appointments</span>
              <span className="font-semibold text-slate-800">24 total</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-500">Completed</span>
              <span className="font-semibold text-emerald-600">18</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-500">Remaining</span>
              <span className="font-semibold text-blue-600">6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Summary Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Monthly Financial Summary</h2>
            <p className="text-slate-400 text-sm">March 2026</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-slate-400 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-emerald-400">₹6,50,000</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">₹3,25,000</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Net Profit</p>
              <p className="text-2xl font-bold text-cyan-400">₹3,25,000</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Pending Bills</p>
              <p className="text-2xl font-bold text-amber-400">₹45,000</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage