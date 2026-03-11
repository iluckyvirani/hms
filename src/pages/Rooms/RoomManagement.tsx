import { useState } from 'react'
import { Button, Badge, Input, Select } from '../../components/ui'

// Mock room data
const initialRooms = [
  { id: 1, roomNumber: '101', type: 'general', totalBeds: 6, occupied: 4, available: 1, cleaning: 1, rentPerDay: 500, status: 'active' },
  { id: 2, roomNumber: '102', type: 'general', totalBeds: 6, occupied: 5, available: 1, cleaning: 0, rentPerDay: 500, status: 'active' },
  { id: 3, roomNumber: '201', type: 'non-ac', totalBeds: 2, occupied: 1, available: 1, cleaning: 0, rentPerDay: 1000, status: 'active' },
  { id: 4, roomNumber: '202', type: 'ac', totalBeds: 2, occupied: 2, available: 0, cleaning: 0, rentPerDay: 1500, status: 'active' },
  { id: 5, roomNumber: '301', type: 'private', totalBeds: 1, occupied: 1, available: 0, cleaning: 0, rentPerDay: 2500, status: 'active' },
  { id: 6, roomNumber: '302', type: 'private', totalBeds: 1, occupied: 0, available: 1, cleaning: 0, rentPerDay: 2500, status: 'active' },
  { id: 7, roomNumber: 'ICU-1', type: 'icu', totalBeds: 4, occupied: 4, available: 0, cleaning: 0, rentPerDay: 5000, status: 'active' },
  { id: 8, roomNumber: 'ICU-2', type: 'icu', totalBeds: 4, occupied: 3, available: 1, cleaning: 0, rentPerDay: 5000, status: 'active' },
]

const roomTypes = [
  { value: 'general', label: 'General Ward', rent: 500 },
  { value: 'non-ac', label: 'Non-AC Room', rent: 1000 },
  { value: 'ac', label: 'AC Room', rent: 1500 },
  { value: 'private', label: 'Private Room', rent: 2500 },
  { value: 'icu', label: 'ICU', rent: 5000 },
]

interface Room {
  id: number
  roomNumber: string
  type: string
  totalBeds: number
  occupied: number
  available: number
  cleaning: number
  rentPerDay: number
  status: string
}

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [filterType, setFilterType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    totalBeds: '',
    rentPerDay: '',
  })

  // Stats
  const totalBeds = rooms.reduce((sum, r) => sum + r.totalBeds, 0)
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupied, 0)
  const availableBeds = rooms.reduce((sum, r) => sum + r.available, 0)
  const cleaningBeds = rooms.reduce((sum, r) => sum + r.cleaning, 0)

  const filteredRooms = rooms.filter(room => {
    const matchesType = !filterType || room.type === filterType
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room)
      setFormData({
        roomNumber: room.roomNumber,
        type: room.type,
        totalBeds: room.totalBeds.toString(),
        rentPerDay: room.rentPerDay.toString(),
      })
    } else {
      setEditingRoom(null)
      setFormData({ roomNumber: '', type: '', totalBeds: '', rentPerDay: '' })
    }
    setShowModal(true)
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value
    const roomType = roomTypes.find(t => t.value === type)
    setFormData(prev => ({
      ...prev,
      type,
      rentPerDay: roomType?.rent.toString() || '',
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingRoom) {
      setRooms(prev => prev.map(r => 
        r.id === editingRoom.id 
          ? { 
              ...r, 
              roomNumber: formData.roomNumber,
              type: formData.type,
              totalBeds: Number(formData.totalBeds),
              available: Number(formData.totalBeds) - r.occupied - r.cleaning,
              rentPerDay: Number(formData.rentPerDay),
            }
          : r
      ))
    } else {
      const newRoom: Room = {
        id: Math.max(...rooms.map(r => r.id)) + 1,
        roomNumber: formData.roomNumber,
        type: formData.type,
        totalBeds: Number(formData.totalBeds),
        occupied: 0,
        available: Number(formData.totalBeds),
        cleaning: 0,
        rentPerDay: Number(formData.rentPerDay),
        status: 'active',
      }
      setRooms(prev => [...prev, newRoom])
    }
    
    setShowModal(false)
    setFormData({ roomNumber: '', type: '', totalBeds: '', rentPerDay: '' })
    setEditingRoom(null)
  }

  const getRoomTypeLabel = (type: string) => {
    return roomTypes.find(t => t.value === type)?.label || type
  }

  const getRoomTypeBadge = (type: string) => {
    const colors: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
      general: 'default',
      'non-ac': 'info',
      ac: 'success',
      private: 'warning',
      icu: 'danger',
    }
    return <Badge variant={colors[type] || 'default'}>{getRoomTypeLabel(type)}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Room Management</h1>
          <p className="text-slate-500 mt-1">Manage hospital rooms and beds</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Room
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Beds</p>
              <p className="text-xl font-bold text-slate-800">{totalBeds}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Occupied</p>
              <p className="text-xl font-bold text-red-600">{occupiedBeds}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Available</p>
              <p className="text-xl font-bold text-emerald-600">{availableBeds}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Cleaning</p>
              <p className="text-xl font-bold text-amber-600">{cleaningBeds}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Type Summary */}
      <div className="bg-white rounded-xl p-6 border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Room Types Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {roomTypes.map(type => {
            const typeRooms = rooms.filter(r => r.type === type.value)
            const typeTotalBeds = typeRooms.reduce((sum, r) => sum + r.totalBeds, 0)
            const typeAvailable = typeRooms.reduce((sum, r) => sum + r.available, 0)
            
            return (
              <div key={type.value} className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-700">{type.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{typeAvailable}/{typeTotalBeds}</p>
                <p className="text-xs text-slate-500 mt-1">₹{type.rent}/day</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by room number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            placeholder="All Types"
            options={[
              { value: '', label: 'All Types' },
              ...roomTypes.map(t => ({ value: t.value, label: t.label }))
            ]}
            className="w-40"
          />
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Room #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total Beds</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Rent/Day</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800">{room.roomNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    {getRoomTypeBadge(room.type)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-700">{room.totalBeds}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {room.available}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        {room.occupied}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        {room.cleaning}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800">₹{room.rentPerDay}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenModal(room)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Room"
                      >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Room"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      {/* Add/Edit Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <Input
                label="Room Number"
                value={formData.roomNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                placeholder="e.g., 101, ICU-1"
                required
              />
              <Select
                label="Room Type"
                value={formData.type}
                onChange={handleTypeChange}
                placeholder="Select type"
                options={roomTypes.map(t => ({ value: t.value, label: `${t.label} (₹${t.rent}/day)` }))}
                required
              />
              <Input
                label="Total Beds"
                type="number"
                value={formData.totalBeds}
                onChange={(e) => setFormData(prev => ({ ...prev, totalBeds: e.target.value }))}
                placeholder="Number of beds"
                min={1}
                required
              />
              <Input
                label="Rent per Day (₹)"
                type="number"
                value={formData.rentPerDay}
                onChange={(e) => setFormData(prev => ({ ...prev, rentPerDay: e.target.value }))}
                placeholder="Daily rent"
                required
              />

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomManagement
