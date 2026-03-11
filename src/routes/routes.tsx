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
      { index: true, element: <div className="p-6 text-slate-600">IPD Module - Coming Soon</div> },
    ],
  },
  {
    path: '/patients',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Patients Module - Coming Soon</div> },
    ],
  },
  {
    path: '/rooms',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Rooms Module - Coming Soon</div> },
    ],
  },
  {
    path: '/doctors',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Doctors Module - Coming Soon</div> },
    ],
  },
  {
    path: '/services',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Services Module - Coming Soon</div> },
    ],
  },
  {
    path: '/pharmacy',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Pharmacy Module - Coming Soon</div> },
    ],
  },
  {
    path: '/billing',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Billing Module - Coming Soon</div> },
    ],
  },
  {
    path: '/expenses',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Expenses Module - Coming Soon</div> },
    ],
  },
  {
    path: '/reports',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Reports Module - Coming Soon</div> },
    ],
  },
  {
    path: '/settings',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="p-6 text-slate-600">Settings Module - Coming Soon</div> },
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