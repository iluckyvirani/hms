import { useState } from 'react'
import { Button, Input, Select } from '../../components/ui'

// Hospital Settings Tab
const HospitalSettings = () => {
  const [settings, setSettings] = useState({
    hospitalName: 'Medicare Pro Hospital',
    tagline: 'Your Health, Our Priority',
    address: '123 Healthcare Avenue, Medical District',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 22 1234 5678',
    mobile: '+91 98765 43210',
    email: 'care@medicarepro.com',
    website: 'www.medicarepro.com',
    gstNumber: '27AABCU9603R1ZM',
    registrationNo: 'MH/HC/2020/1234',
    printHeader: 'MEDICARE PRO HOSPITAL\n123 Healthcare Avenue, Medical District, Mumbai - 400001\nPhone: 1800-MEDICARE | Email: care@medicarepro.com',
    printFooter: 'Thank you for choosing Medicare Pro Hospital!\nFor queries, contact our billing desk.',
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Settings saved successfully!')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name *</label>
            <Input
              value={settings.hospitalName}
              onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
            <Input
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
            <Input
              value={settings.city}
              onChange={(e) => setSettings({ ...settings, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
            <Input
              value={settings.state}
              onChange={(e) => setSettings({ ...settings, state: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pincode *</label>
            <Input
              value={settings.pincode}
              onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <Input
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
            <Input
              value={settings.mobile}
              onChange={(e) => setSettings({ ...settings, mobile: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
            <Input
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Legal Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Legal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">GST Number</label>
            <Input
              value={settings.gstNumber}
              onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration No.</label>
            <Input
              value={settings.registrationNo}
              onChange={(e) => setSettings({ ...settings, registrationNo: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Print Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Print Settings</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Print Header (appears on bills/slips)</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
              rows={3}
              value={settings.printHeader}
              onChange={(e) => setSettings({ ...settings, printHeader: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Print Footer (appears on bills/slips)</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
              rows={2}
              value={settings.printFooter}
              onChange={(e) => setSettings({ ...settings, printFooter: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Hospital Logo</h3>
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <svg className="w-8 h-8 text-slate-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-slate-500">No logo</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600 mb-3">Upload your hospital logo. Recommended size: 200x200px. Supported formats: PNG, JPG.</p>
            <Button variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Logo
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Team Management Tab
const TeamManagement = () => {
  const [staff, setStaff] = useState([
    { id: 1, name: 'Dr. Rajesh Patel', role: 'Doctor', email: 'rajesh@medicarepro.com', phone: '+91 98765 43210', status: 'active', lastLogin: '2026-03-11 09:30 AM' },
    { id: 2, name: 'Dr. Priya Shah', role: 'Doctor', email: 'priya@medicarepro.com', phone: '+91 98765 43211', status: 'active', lastLogin: '2026-03-11 10:15 AM' },
    { id: 3, name: 'Anita Sharma', role: 'Reception', email: 'anita@medicarepro.com', phone: '+91 98765 43212', status: 'active', lastLogin: '2026-03-11 08:00 AM' },
    { id: 4, name: 'Rahul Verma', role: 'Pharmacy', email: 'rahul@medicarepro.com', phone: '+91 98765 43213', status: 'active', lastLogin: '2026-03-10 06:00 PM' },
    { id: 5, name: 'Sneha Kulkarni', role: 'Reception', email: 'sneha@medicarepro.com', phone: '+91 98765 43214', status: 'inactive', lastLogin: '2026-03-05 05:30 PM' },
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<typeof staff[0] | null>(null)
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Reception',
    email: '',
    phone: '',
    username: '',
    password: '',
    status: 'active',
  })

  const handleAddStaff = () => {
    const newId = Math.max(...staff.map(s => s.id)) + 1
    setStaff([...staff, {
      id: newId,
      name: newStaff.name,
      role: newStaff.role,
      email: newStaff.email,
      phone: newStaff.phone,
      status: newStaff.status,
      lastLogin: 'Never',
    }])
    setNewStaff({ name: '', role: 'Reception', email: '', phone: '', username: '', password: '', status: 'active' })
    setShowAddModal(false)
  }

  const handleUpdateStaff = () => {
    if (!editingStaff) return
    setStaff(staff.map(s => s.id === editingStaff.id ? editingStaff : s))
    setEditingStaff(null)
  }

  const toggleStatus = (id: number) => {
    setStaff(staff.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Doctor': return 'bg-blue-100 text-blue-700'
      case 'Reception': return 'bg-purple-100 text-purple-700'
      case 'Pharmacy': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Team Members</h3>
          <p className="text-sm text-slate-500">Manage staff accounts and permissions</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Staff
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-2xl font-bold text-slate-800">{staff.length}</p>
          <p className="text-sm text-slate-500">Total Staff</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-2xl font-bold text-blue-600">{staff.filter(s => s.role === 'Doctor').length}</p>
          <p className="text-sm text-slate-500">Doctors</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-2xl font-bold text-emerald-600">{staff.filter(s => s.status === 'active').length}</p>
          <p className="text-sm text-slate-500">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-2xl font-bold text-slate-400">{staff.filter(s => s.status === 'inactive').length}</p>
          <p className="text-sm text-slate-500">Inactive</p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Phone</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Last Login</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        member.role === 'Doctor' ? 'bg-blue-500' :
                        member.role === 'Reception' ? 'bg-purple-500' : 'bg-emerald-500'
                      }`}>
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{member.email}</td>
                  <td className="px-6 py-4 text-slate-600">{member.phone}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(member.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{member.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingStaff(member)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Reset password for this user?')) {
                            alert('Password reset link sent to email')
                          }
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Reset Password"
                      >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Add Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <Input
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
                <Select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  options={[
                    { value: 'Reception', label: 'Reception' },
                    { value: 'Doctor', label: 'Doctor' },
                    { value: 'Pharmacy', label: 'Pharmacy' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <Input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <Input
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
                <Input
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                <Input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <Select
                  value={newStaff.status}
                  onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value })}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAddStaff}>Add Staff</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Edit Staff Member</h3>
              <button onClick={() => setEditingStaff(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <Input
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
                <Select
                  value={editingStaff.role}
                  onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                  options={[
                    { value: 'Reception', label: 'Reception' },
                    { value: 'Doctor', label: 'Doctor' },
                    { value: 'Pharmacy', label: 'Pharmacy' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <Input
                  type="email"
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <Input
                  value={editingStaff.phone}
                  onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <Select
                  value={editingStaff.status}
                  onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setEditingStaff(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleUpdateStaff}>Update</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Master Data Tab
const MasterData = () => {
  const [activeSection, setActiveSection] = useState('roomTypes')
  
  // Room Types
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, name: 'General Ward', rate: 500, beds: 20, description: 'Basic shared ward' },
    { id: 2, name: 'Non-AC', rate: 1000, beds: 15, description: 'Private room without AC' },
    { id: 3, name: 'AC', rate: 1500, beds: 10, description: 'Private room with AC' },
    { id: 4, name: 'Deluxe', rate: 2500, beds: 5, description: 'Premium room with amenities' },
    { id: 5, name: 'ICU', rate: 5000, beds: 8, description: 'Intensive Care Unit' },
  ])
  
  // Service Categories
  const [serviceCategories, setServiceCategories] = useState([
    { id: 1, name: 'Laboratory', count: 25 },
    { id: 2, name: 'Radiology', count: 10 },
    { id: 3, name: 'Cardiology', count: 8 },
    { id: 4, name: 'Nursing', count: 5 },
    { id: 5, name: 'Physiotherapy', count: 12 },
  ])
  
  // Payment Modes
  const [paymentModes, setPaymentModes] = useState([
    { id: 1, name: 'Cash', status: 'active' },
    { id: 2, name: 'Card', status: 'active' },
    { id: 3, name: 'UPI', status: 'active' },
    { id: 4, name: 'Bank Transfer', status: 'active' },
    { id: 5, name: 'Cheque', status: 'active' },
    { id: 6, name: 'Insurance', status: 'inactive' },
  ])
  
  // Specializations
  const [specializations, setSpecializations] = useState([
    { id: 1, name: 'Cardiology', doctors: 2 },
    { id: 2, name: 'Neurology', doctors: 1 },
    { id: 3, name: 'Orthopedics', doctors: 2 },
    { id: 4, name: 'Pediatrics', doctors: 1 },
    { id: 5, name: 'General Medicine', doctors: 3 },
    { id: 6, name: 'ENT', doctors: 1 },
  ])
  
  // Expense Categories
  const [expenseCategories, setExpenseCategories] = useState([
    { id: 1, name: 'Salaries', icon: '👥', color: 'bg-blue-500', description: 'Staff salaries, doctor payments' },
    { id: 2, name: 'Utilities', icon: '💡', color: 'bg-yellow-500', description: 'Electricity, water, internet' },
    { id: 3, name: 'Maintenance', icon: '🔧', color: 'bg-orange-500', description: 'Equipment repair, building maintenance' },
    { id: 4, name: 'Medical Supplies', icon: '💊', color: 'bg-red-500', description: 'Consumables, disposables' },
    { id: 5, name: 'Equipment', icon: '🏥', color: 'bg-purple-500', description: 'New machines, instruments' },
    { id: 6, name: 'Rent', icon: '🏢', color: 'bg-indigo-500', description: 'Building rent, lease' },
    { id: 7, name: 'Marketing', icon: '📢', color: 'bg-pink-500', description: 'Advertising, promotions' },
    { id: 8, name: 'Insurance', icon: '🛡️', color: 'bg-teal-500', description: 'Staff insurance, hospital insurance' },
    { id: 9, name: 'Miscellaneous', icon: '📦', color: 'bg-slate-500', description: 'Other expenses' },
  ])
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', rate: '', beds: '', description: '', count: 0, status: 'active', doctors: 0, icon: '📦', color: 'bg-slate-500' })

  const handleAddItem = () => {
    switch (activeSection) {
      case 'roomTypes':
        setRoomTypes([...roomTypes, {
          id: roomTypes.length + 1,
          name: newItem.name,
          rate: parseInt(newItem.rate) || 0,
          beds: parseInt(newItem.beds) || 0,
          description: newItem.description,
        }])
        break
      case 'serviceCategories':
        setServiceCategories([...serviceCategories, {
          id: serviceCategories.length + 1,
          name: newItem.name,
          count: 0,
        }])
        break
      case 'paymentModes':
        setPaymentModes([...paymentModes, {
          id: paymentModes.length + 1,
          name: newItem.name,
          status: 'active',
        }])
        break
      case 'specializations':
        setSpecializations([...specializations, {
          id: specializations.length + 1,
          name: newItem.name,
          doctors: 0,
        }])
        break
      case 'expenseCategories':
        setExpenseCategories([...expenseCategories, {
          id: expenseCategories.length + 1,
          name: newItem.name,
          icon: newItem.icon,
          color: newItem.color,
          description: newItem.description,
        }])
        break
    }
    setNewItem({ name: '', rate: '', beds: '', description: '', count: 0, status: 'active', doctors: 0, icon: '📦', color: 'bg-slate-500' })
    setShowAddModal(false)
  }

  const sections = [
    { id: 'roomTypes', label: 'Room Types', icon: '🛏️' },
    { id: 'serviceCategories', label: 'Service Categories', icon: '⚕️' },
    { id: 'paymentModes', label: 'Payment Modes', icon: '💳' },
    { id: 'specializations', label: 'Specializations', icon: '🩺' },
    { id: 'expenseCategories', label: 'Expense Categories', icon: '💰' },
  ]

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
        <div className="flex flex-wrap gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Types */}
      {activeSection === 'roomTypes' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Room Types</h3>
              <p className="text-sm text-slate-500">Manage room types and their rates</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Room Type
            </Button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Room Type</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Rate/Day</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Total Beds</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Description</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roomTypes.map(room => (
                <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{room.name}</td>
                  <td className="px-6 py-4 text-slate-600">₹{room.rate.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600">{room.beds}</td>
                  <td className="px-6 py-4 text-slate-500">{room.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Service Categories */}
      {activeSection === 'serviceCategories' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Service Categories</h3>
              <p className="text-sm text-slate-500">Manage service categories for medical services</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {serviceCategories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                <div>
                  <p className="font-medium text-slate-800">{cat.name}</p>
                  <p className="text-sm text-slate-500">{cat.count} services</p>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modes */}
      {activeSection === 'paymentModes' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Payment Modes</h3>
              <p className="text-sm text-slate-500">Manage accepted payment methods</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Payment Mode
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {paymentModes.map(mode => (
              <div key={mode.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    mode.status === 'active' ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}>
                    <svg className={`w-5 h-5 ${mode.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{mode.name}</p>
                    <p className={`text-xs ${mode.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {mode.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPaymentModes(paymentModes.map(m => 
                    m.id === mode.id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
                  ))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    mode.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    mode.status === 'active' ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specializations */}
      {activeSection === 'specializations' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Doctor Specializations</h3>
              <p className="text-sm text-slate-500">Manage medical specializations for doctors</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Specialization
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {specializations.map(spec => (
              <div key={spec.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{spec.name}</p>
                    <p className="text-sm text-slate-500">{spec.doctors} doctors</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense Categories */}
      {activeSection === 'expenseCategories' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Expense Categories</h3>
              <p className="text-sm text-slate-500">Manage expense categories for tracking hospital expenses</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {expenseCategories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center text-lg`}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{cat.name}</p>
                    <p className="text-xs text-slate-500">{cat.description}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">
                Add {activeSection === 'roomTypes' ? 'Room Type' : 
                     activeSection === 'serviceCategories' ? 'Service Category' :
                     activeSection === 'paymentModes' ? 'Payment Mode' :
                     activeSection === 'expenseCategories' ? 'Expense Category' : 'Specialization'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              {activeSection === 'roomTypes' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rate per Day (₹) *</label>
                    <Input
                      type="number"
                      value={newItem.rate}
                      onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
                      placeholder="Enter rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Beds</label>
                    <Input
                      type="number"
                      value={newItem.beds}
                      onChange={(e) => setNewItem({ ...newItem, beds: e.target.value })}
                      placeholder="Enter number of beds"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <Input
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Enter description"
                    />
                  </div>
                </>
              )}
              {activeSection === 'expenseCategories' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {['👥', '💡', '🔧', '💊', '🏥', '🏢', '📢', '🛡️', '📦', '🚗', '📱', '🍽️'].map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setNewItem({ ...newItem, icon })}
                          className={`w-10 h-10 rounded-lg border-2 text-xl flex items-center justify-center transition-colors ${
                            newItem.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'bg-blue-500', label: 'Blue' },
                        { value: 'bg-emerald-500', label: 'Green' },
                        { value: 'bg-yellow-500', label: 'Yellow' },
                        { value: 'bg-orange-500', label: 'Orange' },
                        { value: 'bg-red-500', label: 'Red' },
                        { value: 'bg-purple-500', label: 'Purple' },
                        { value: 'bg-pink-500', label: 'Pink' },
                        { value: 'bg-teal-500', label: 'Teal' },
                        { value: 'bg-slate-500', label: 'Gray' },
                      ].map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setNewItem({ ...newItem, color: color.value })}
                          className={`w-8 h-8 rounded-lg ${color.value} transition-transform ${
                            newItem.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                          }`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <Input
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="e.g., Staff salaries, doctor payments"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAddItem}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Settings Dashboard
const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('hospital')

  const tabs = [
    { id: 'hospital', label: 'Hospital Settings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )},
    { id: 'team', label: 'Team Management', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { id: 'master', label: 'Master Data', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    )},
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage hospital settings, team, and master data</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'hospital' && <HospitalSettings />}
      {activeTab === 'team' && <TeamManagement />}
      {activeTab === 'master' && <MasterData />}
    </div>
  )
}

export default SettingsDashboard
