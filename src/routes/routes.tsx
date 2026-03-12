import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// Layouts
const DashboardLayout = lazy(() => import('../Dashboard Layout/DashboardLayout'))

// Pages
const LoginPage = lazy(() => import('../pages/Login/LoginPage'))
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'))

// OPD Pages
const OPDPatientList = lazy(() => import('../pages/OPD/OPDPatientList'))
const OPDRegistration = lazy(() => import('../pages/OPD/OPDRegistration'))
const OPDSlip = lazy(() => import('../pages/OPD/OPDSlip'))

// IPD Pages
const IPDPatientList = lazy(() => import('../pages/IPD/IPDPatientList'))
const IPDAdmitPatient = lazy(() => import('../pages/IPD/IPDAdmitPatient'))
const DischargeCard = lazy(() => import('../pages/IPD/DischargeCard'))

// Room Management
const RoomManagement = lazy(() => import('../pages/Rooms/RoomManagement'))

// Doctor Management
const DoctorManagement = lazy(() => import('../pages/Doctors/DoctorManagement'))

// Services
const ServiceList = lazy(() => import('../pages/Services/ServiceList'))
const AssignService = lazy(() => import('../pages/Services/AssignService'))

// Patient Management
const PatientList = lazy(() => import('../pages/Patients/PatientList'))
const PatientDetail = lazy(() => import('../pages/Patients/PatientDetail'))

// Pharmacy
const PharmacyDashboard = lazy(() => import('../pages/Pharmacy/PharmacyDashboard'))
const AddPrescription = lazy(() => import('../pages/Pharmacy/AddPrescription'))
const MedicineInventory = lazy(() => import('../pages/Pharmacy/MedicineInventory'))
const AddMedicine = lazy(() => import('../pages/Pharmacy/AddMedicine'))
const SupplierManagement = lazy(() => import('../pages/Pharmacy/SupplierManagement'))
const PharmacyExpenses = lazy(() => import('../pages/Pharmacy/PharmacyExpenses'))

// Billing
const BillingDashboard = lazy(() => import('../pages/Billing/BillingDashboard'))
const GenerateBill = lazy(() => import('../pages/Billing/GenerateBill'))

// Settings
const SettingsDashboard = lazy(() => import('../pages/Settings/SettingsDashboard'))

// Expenses
const ExpenseDashboard = lazy(() => import('../pages/Expenses/ExpenseDashboard'))

// Reports
const ReportsDashboard = lazy(() => import('../pages/Reports/ReportsDashboard'))

// Route configuration
const routes = [
  // Public Routes
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  
  // Protected Routes (Dashboard Layout)
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
    ],
  },
  {
    path: '/opd',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <OPDPatientList /> },
      { path: 'register', element: <OPDRegistration /> },
      { path: 'slip/:tokenNumber', element: <OPDSlip /> },
    ],
  },
  {
    path: '/ipd',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <IPDPatientList /> },
      { path: 'admit', element: <IPDAdmitPatient /> },
      { path: 'discharge-card', element: <DischargeCard /> },
    ],
  },
  {
    path: '/patients',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <PatientList /> },
      { path: ':id', element: <PatientDetail /> },
    ],
  },
  {
    path: '/rooms',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <RoomManagement /> },
    ],
  },
  {
    path: '/doctors',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DoctorManagement /> },
    ],
  },
  {
    path: '/services',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ServiceList /> },
      { path: 'assign', element: <AssignService /> },
    ],
  },
  {
    path: '/pharmacy',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <PharmacyDashboard /> },
      { path: 'add-prescription', element: <AddPrescription /> },
      { path: 'inventory', element: <MedicineInventory /> },
      { path: 'add-medicine', element: <AddMedicine /> },
      { path: 'edit-medicine/:id', element: <AddMedicine /> },
      { path: 'add-stock/:id', element: <AddMedicine /> },
      { path: 'suppliers', element: <SupplierManagement /> },
      { path: 'expenses', element: <PharmacyExpenses /> },
    ],
  },
  {
    path: '/billing',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <BillingDashboard /> },
      { path: 'generate', element: <GenerateBill /> },
    ],
  },
  {
    path: '/expenses',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ExpenseDashboard /> },
    ],
  },
  {
    path: '/reports',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ReportsDashboard /> },
    ],
  },
  {
    path: '/settings',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <SettingsDashboard /> },
    ],
  },
  {
    path: '/support',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Support Module - Coming Soon</div> },
    ],
  },
]

export default routes