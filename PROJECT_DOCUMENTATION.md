# MediCare Pro - Hospital Management System (HMS)
## Complete Project Documentation

---

## 📋 Project Overview

A comprehensive Hospital Management System designed for doctors who own/manage hospitals. The system handles OPD (Outpatient Department), IPD (Inpatient/Admit), Pharmacy, Billing, and Staff Management.

---

## 👥 User Roles & Permissions

| Role | Access Level | Responsibilities |
|------|-------------|------------------|
| **Super Admin/Doctor** | Full Access | All modules, settings, reports, team management |
| **Reception** | Limited | OPD registration, patient search, basic info |
| **Pharmacy** | Limited | Medicine dispensing, pharmacy billing (separate revenue) |

---

## 🏗️ Module Breakdown

### 1. Authentication Module
- [x] Login Page (Created)
- [ ] Role-based login (Doctor, Reception, Pharmacy)
- [ ] Session management
- [ ] Password reset

---

### 2. Dashboard Module
- [ ] Overview statistics cards
  - Today's OPD count
  - Current admitted patients
  - Available beds
  - Today's revenue
  - Pending bills
- [ ] Quick actions
- [ ] Recent activities
- [ ] Upcoming appointments
- [ ] Revenue charts

---

### 3. OPD (Outpatient Department) Module

#### 3.1 OPD Registration Form
**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Patient Name | Text | Yes |
| Age | Number | Yes |
| Gender | Select | Yes |
| Phone Number | Text | Yes |
| Aadhar Number | Text (12 digits) | Yes |
| Address | Textarea | No |
| Select Doctor | Dropdown | Yes |
| Consultation Fee | Auto-fill (based on doctor) | Yes |
| Diagnosis/Symptoms | Textarea | No |
| Visit Date | Date | Yes |
| Token Number | Auto-generate | Yes |

#### 3.2 OPD Slip (Print)
```
┌─────────────────────────────────────────┐
│         MEDICARE PRO HOSPITAL           │
│         123 Medical Street              │
│         Phone: +91 9876543210           │
├─────────────────────────────────────────┤
│  TOKEN: #0042        Date: 11-03-2026   │
├─────────────────────────────────────────┤
│  Patient: John Doe                      │
│  Age/Gender: 35 / Male                  │
│  Aadhar: XXXX-XXXX-1234                 │
│  Phone: +91 9876543210                  │
├─────────────────────────────────────────┤
│  Doctor: Dr. Smith (Cardiologist)       │
│  Fee: ₹500                              │
│  Symptoms: Chest Pain, Fatigue          │
├─────────────────────────────────────────┤
│  [BARCODE]                              │
│  Payment: PAID                          │
└─────────────────────────────────────────┘
```

#### 3.3 OPD Patient List
**Table Columns:**
- Token # | Patient Name | Phone | Doctor | Fee | Status | Date | Actions

**Actions:** View Details, Admit Patient, Print Slip, Prescription

---

### 4. IPD (Inpatient/Admit) Module

#### 4.1 Admit Patient Form
**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Select Patient | Search/Dropdown (from OPD or new) | Yes |
| Admission Date | Date/Time | Yes |
| Room Type | Dropdown | Yes |
| Room Number | Dropdown (filtered) | Yes |
| Bed Number | Dropdown (available only) | Yes |
| Visiting Doctor | Dropdown | Yes |
| Expected Discharge | Date | No |
| Diagnosis | Textarea | Yes |
| Initial Deposit | Number | Yes |
| Payment Mode | Select | Yes |

#### 4.2 Admitted Patient List
**Table Columns:**
- Admit ID | Patient Name | Room/Bed | Doctor | Admit Date | Expected Discharge | Deposit | Status | Actions

**Actions:** View Details, Add Service, Add Deposit, Discharge, Print

#### 4.3 Patient Status Flow
```
OPD Visit → Admit → In Treatment → Ready for Discharge → Discharged
                  ↓
            Add Services
            Add Deposits
            Doctor Visits
```

---

### 5. Room Management Module

#### 5.1 Room Types
| Type | Rent/Day | Facilities |
|------|----------|------------|
| General Ward | ₹500 | Basic bed, shared bathroom |
| Non-AC | ₹1000 | Private room, attached bathroom |
| AC | ₹1500 | AC, TV, attached bathroom |
| Private | ₹2500 | Deluxe amenities, visitor sofa |
| ICU | ₹5000 | 24/7 monitoring, ventilator access |

#### 5.2 Room Management Table
**Columns:**
- Room # | Room Type | Total Beds | Available | Occupied | Cleaning | Rent/Day | Actions

#### 5.3 Bed Status
- 🟢 **Available** - Ready for admission
- 🔴 **Occupied** - Patient admitted
- 🟡 **Cleaning** - Under maintenance/cleaning

#### 5.4 Room CRUD Operations
- Add new room
- Edit room details
- Change bed count
- Update rent
- View room history

---

### 6. Doctor Management Module

#### 6.1 Doctor Profile Form
**Fields:**
| Field | Type |
|-------|------|
| Full Name | Text |
| Specialization | Dropdown |
| Qualification | Text |
| Phone | Text |
| Email | Email |
| Photo | Image Upload |
| Available Days | Multi-select (Mon-Sun) |
| Timing (From-To) | Time pickers |
| Consultation Fee | Number |
| OPD Limit/Day | Number |
| Status | Active/Inactive |

#### 6.2 Doctor List
**Columns:**
- Photo | Name | Specialization | Available Days | Fee | Status | Actions

---

### 7. Services Module

#### 7.1 Service CRUD
**Service Fields:**
| Field | Type |
|-------|------|
| Service Name | Text |
| Description | Textarea |
| Category | Dropdown |
| Fee | Number |
| Status | Active/Inactive |

**Sample Services:**
| Service | Fee |
|---------|-----|
| Nursing Care (per day) | ₹300 |
| BP Monitoring | ₹50 |
| Blood Sugar Test | ₹100 |
| ECG | ₹500 |
| X-Ray | ₹800 |
| Injection | ₹100 |
| Dressing | ₹200 |
| Physiotherapy | ₹400 |

#### 7.2 Assign Service to Patient
**Form:**
- Select Admitted Patient
- Select Date
- Select Services (multiple)
- Auto-calculate total
- Notes

#### 7.3 Patient Service Records
**Table:**
- Date | Service Name | Fee | Assigned By | Notes

---

### 8. Pharmacy Module

#### 8.1 Pharmacy Dashboard
- Search patient (by name, phone, Aadhar)
- Recent prescriptions
- Pending medicines to dispense

#### 8.2 Medicine Slip Creation
**Medicine Entry Format:**
```
┌──────────────────────────────────────────────────────┐
│ Medicine: Paracetamol 500mg                          │
│ Form: Tablet                                         │
│ Quantity: 30                                         │
│ Dosage: 3 times/day × 4 days = 12 doses             │
│ Price: ₹50                                           │
├──────────────────────────────────────────────────────┤
│ Medicine: Amoxicillin 250mg                          │
│ Form: Capsule                                        │
│ Quantity: 21                                         │
│ Dosage: 3 times/day × 7 days = 21 doses             │
│ Price: ₹150                                          │
└──────────────────────────────────────────────────────┘
Total: ₹200
Payment Mode: Cash/Card/UPI
```

#### 8.3 Pharmacy Slip (Print)
```
┌─────────────────────────────────────────┐
│       MEDICARE PRO PHARMACY             │
│       Date: 11-03-2026                  │
├─────────────────────────────────────────┤
│ Patient: John Doe                       │
│ Phone: +91 9876543210                   │
├─────────────────────────────────────────┤
│ MEDICINES:                              │
│ 1. Paracetamol 500mg × 30     ₹50      │
│    (3×4 days)                           │
│ 2. Amoxicillin 250mg × 21     ₹150     │
│    (3×7 days)                           │
├─────────────────────────────────────────┤
│ Total: ₹200                             │
│ Payment: Cash                           │
│ Status: PAID                            │
└─────────────────────────────────────────┘
```

**Important:** Pharmacy revenue is tracked separately from Doctor's OPD/IPD revenue.

#### 8.4 Doctor Prescription
- Doctor writes prescription from patient view
- Saved to patient record
- Pharmacy sees pending prescriptions
- Pharmacy dispenses and marks complete

---

### 9. Patient Management Module

#### 9.1 Patient Lists

**a) All Patients List**
- Patient ID | Name | Phone | Aadhar | Last Visit | Total Visits | Actions

**b) OPD Patients List**
- Token | Name | Doctor | Date | Fee | Status | Actions

**c) Admitted Patients List**
- Admit ID | Name | Room/Bed | Doctor | Days | Deposit | Actions

#### 9.2 Patient Detail Page (Tabbed View)

**Tab 1: Profile**
- Basic information
- Contact details
- Aadhar number
- Emergency contact

**Tab 2: Admit History**
| Admit ID | Admit Date | Discharge Date | Room | Doctor | Days | Total Bill |
|----------|------------|----------------|------|--------|------|------------|

**Tab 3: Reports/Documents**
- Upload/View medical reports
- Lab results
- X-rays, scans
- Date | Report Name | Type | Uploaded By | Actions

**Tab 4: Medicine History**
| Date | Medicines | Prescribed By | Dispensed | Amount |
|------|-----------|---------------|-----------|--------|

**Tab 5: Services Taken**
| Date | Service | Fee | During Admit ID |
|------|---------|-----|-----------------|

**Tab 6: Payments**
| Date | Type | Amount | Mode | Receipt # | Admit/OPD |
|------|------|--------|------|-----------|-----------|

Types: OPD Fee, Deposit, Service, Medicine, Final Bill, Refund

---

### 10. Billing Module

#### 10.1 Generate Final Bill (For Discharged Patients)

**Bill Calculation:**
```
┌─────────────────────────────────────────────────────┐
│              MEDICARE PRO HOSPITAL                  │
│                 FINAL BILL                          │
├─────────────────────────────────────────────────────┤
│ Patient: John Doe          Admit ID: ADM-2026-0042  │
│ Admit: 01-03-2026          Discharge: 11-03-2026   │
│ Room: 101 (AC)             Bed: B                   │
│ Doctor: Dr. Smith                                   │
├─────────────────────────────────────────────────────┤
│ ROOM CHARGES:                                       │
│   AC Room × 10 days @ ₹1500/day         ₹15,000    │
├─────────────────────────────────────────────────────┤
│ SERVICES:                                           │
│   Nursing Care × 10 days @ ₹300          ₹3,000    │
│   ECG × 2                                  ₹1,000    │
│   Blood Tests × 3                            ₹600    │
│   Dressing × 5                             ₹1,000    │
│                              Subtotal:     ₹5,600    │
├─────────────────────────────────────────────────────┤
│ OTHER CHARGES:                                      │
│   Doctor Visits × 5 @ ₹500                ₹2,500    │
│   Emergency charges                        ₹1,000    │
│                              Subtotal:     ₹3,500    │
├─────────────────────────────────────────────────────┤
│ GROSS TOTAL:                              ₹24,100    │
├─────────────────────────────────────────────────────┤
│ DEPOSITS RECEIVED:                                  │
│   01-03-2026 (Cash)                       ₹10,000   │
│   05-03-2026 (UPI)                         ₹5,000   │
│                              Total:       ₹15,000    │
├─────────────────────────────────────────────────────┤
│ BALANCE DUE:                               ₹9,100    │
│ (or) REFUND DUE:                              ₹0     │
├─────────────────────────────────────────────────────┤
│ Payment Received: ₹9,100 (Card)                     │
│ Status: PAID IN FULL                                │
└─────────────────────────────────────────────────────┘
```

#### 10.2 Deposit Management
- Add deposit during admission
- Add additional deposits anytime
- Track all deposits with payment mode
- Calculate refund if excess deposit

---

### 11. Settings Module

#### 11.1 Hospital Settings
- Hospital name, address, logo
- Contact information
- GST number
- Print header/footer

#### 11.2 Team Management
**Add Staff Form:**
| Field | Type |
|-------|------|
| Full Name | Text |
| Role | Dropdown (Reception, Doctor, Pharmacy) |
| Email | Email |
| Phone | Text |
| Username | Text |
| Password | Password |
| Status | Active/Inactive |

**Staff List:**
- Name | Role | Email | Phone | Status | Last Login | Actions

#### 11.3 Master Data
- Room Types (CRUD)
- Service Categories (CRUD)
- Payment Modes (CRUD)
- Doctor Specializations (CRUD)

---

### 12. Expense Management Module

#### 12.1 Expense Categories
| Category | Examples |
|----------|----------|
| Salaries | Staff salaries, doctor payments |
| Utilities | Electricity, water, internet |
| Maintenance | Equipment repair, building maintenance |
| Medical Supplies | Consumables, disposables |
| Equipment | New machines, instruments |
| Rent | Building rent, lease |
| Marketing | Advertising, promotions |
| Insurance | Staff insurance, hospital insurance |
| Miscellaneous | Other expenses |

#### 12.2 Add Expense Form
**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Expense Title | Text | Yes |
| Category | Dropdown | Yes |
| Amount | Number | Yes |
| Expense Date | Date | Yes |
| Payment Mode | Select | Yes |
| Paid To | Text | No |
| Description | Textarea | No |
| Receipt/Bill | File Upload | No |
| Recurring | Yes/No | No |
| Frequency | Monthly/Yearly (if recurring) | No |

#### 12.3 Expense List
**Table Columns:**
- Date | Title | Category | Amount | Paid To | Mode | Receipt | Actions

**Filters:**
- Date range
- Category
- Payment mode
- Amount range

#### 12.4 Expense Dashboard
- Total expenses (Today/Week/Month/Year)
- Category-wise breakdown (Pie Chart)
- Monthly expense trend (Line Chart)
- Recent expenses list
- Recurring expenses due

---

### 13. Reports Module

#### 13.1 Report Types

**A. Revenue Reports**

| Report | Description | Filters |
|--------|-------------|---------|
| OPD Revenue | Income from consultations | Date range, Doctor |
| IPD Revenue | Room + Services + Other charges | Date range, Room type |
| Pharmacy Revenue | Medicine sales (separate) | Date range |
| Service Revenue | Service-wise earnings | Date range, Service type |
| Doctor-wise Revenue | Earnings per doctor | Date range, Doctor |
| Daily Collection | All collections by date | Single date |
| Payment Mode Report | Cash/Card/UPI breakdown | Date range |

**B. Patient Reports**

| Report | Description | Filters |
|--------|-------------|---------|
| Patient Register | All patients list | Date range |
| OPD Register | All OPD visits | Date range, Doctor |
| IPD Register | All admissions | Date range, Room type |
| Discharge Summary | Discharged patients | Date range |
| Patient Visit History | Individual patient history | Patient selection |
| Readmission Report | Patients readmitted | Date range |

**C. Financial Reports**

| Report | Description | Filters |
|--------|-------------|---------|
| Income Statement | Revenue - Expenses | Month/Year |
| Expense Report | All expenses detailed | Date range, Category |
| Profit & Loss | Net profit calculation | Month/Year |
| Outstanding Bills | Pending payments | As of date |
| Deposit Report | All deposits received | Date range |
| Refund Report | All refunds issued | Date range |
| Collection Report | All payments received | Date range, Mode |

**D. Operational Reports**

| Report | Description | Filters |
|--------|-------------|---------|
| Room Occupancy | Bed utilization stats | Date range |
| Doctor Performance | Patients seen, revenue | Date range, Doctor |
| Service Utilization | Which services used most | Date range |
| Staff Activity | Login history, actions | Date range, Staff |

#### 13.2 Report Filters (Common)
- **Date Range:** Today, Yesterday, This Week, This Month, This Year, Custom Range
- **Export Options:** PDF, Excel, Print

#### 13.3 Report Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  REPORTS CENTER                                             │
├──────────────────┬──────────────────┬───────────────────────┤
│  📊 Revenue      │  👥 Patients      │  💰 Financial         │
│  Reports         │  Reports          │  Reports              │
├──────────────────┼──────────────────┼───────────────────────┤
│  • OPD Revenue   │  • Patient List   │  • Income Statement   │
│  • IPD Revenue   │  • OPD Register   │  • Expense Report     │
│  • Pharmacy      │  • IPD Register   │  • P&L Statement      │
│  • Services      │  • Discharge      │  • Outstanding        │
│  • Doctor-wise   │  • Visit History  │  • Collections        │
├──────────────────┴──────────────────┴───────────────────────┤
│  🏥 Operational Reports                                     │
│  • Room Occupancy  • Doctor Performance  • Service Usage    │
└─────────────────────────────────────────────────────────────┘
```

#### 13.4 Sample Report View
```
┌─────────────────────────────────────────────────────────────┐
│  MONTHLY REVENUE REPORT - MARCH 2026                        │
│  Generated: 11-03-2026 10:30 AM                             │
├─────────────────────────────────────────────────────────────┤
│  SUMMARY                                                    │
│  ┌─────────────┬─────────────┬─────────────┬──────────────┐ │
│  │ OPD Revenue │ IPD Revenue │ Services    │ Total        │ │
│  │ ₹1,25,000   │ ₹4,50,000   │ ₹75,000     │ ₹6,50,000    │ │
│  └─────────────┴─────────────┴─────────────┴──────────────┘ │
│                                                             │
│  [📈 Chart: Daily Revenue Trend]                            │
│                                                             │
│  DETAILED BREAKDOWN                                         │
│  ┌────────┬────────────┬─────────┬──────────┬─────────────┐ │
│  │ Date   │ OPD        │ IPD     │ Services │ Total       │ │
│  ├────────┼────────────┼─────────┼──────────┼─────────────┤ │
│  │ 01-Mar │ ₹12,000    │ ₹45,000 │ ₹8,000   │ ₹65,000     │ │
│  │ 02-Mar │ ₹10,500    │ ₹42,000 │ ₹7,500   │ ₹60,000     │ │
│  │ ...    │ ...        │ ...     │ ...      │ ...         │ │
│  └────────┴────────────┴─────────┴──────────┴─────────────┘ │
│                                                             │
│  [Export PDF] [Export Excel] [Print]                        │
└─────────────────────────────────────────────────────────────┘
```

#### 13.5 Comparison Reports
- Month vs Month comparison
- Year vs Year comparison
- Doctor performance comparison
- Room type revenue comparison

---

## 📊 Dashboard Analytics

### Key Metrics Dashboard
```
┌──────────────────────────────────────────────────────────────────┐
│  TODAY'S OVERVIEW                                    March 11    │
├────────────────┬────────────────┬────────────────┬───────────────┤
│  👥 OPD Today  │  🏥 Admitted   │  🛏️ Beds Free  │  💰 Revenue   │
│     42         │     28         │     15/50      │   ₹85,000     │
├────────────────┴────────────────┴────────────────┴───────────────┤
│                                                                  │
│  📈 REVENUE TREND (Last 7 Days)    📊 REVENUE SPLIT             │
│  ┌──────────────────────────┐      ┌──────────────────────┐     │
│  │    ▃▅▇▆▄▅█               │      │  OPD: 35%            │     │
│  │    ─────────             │      │  IPD: 50%            │     │
│  │    M T W T F S S         │      │  Services: 15%       │     │
│  └──────────────────────────┘      └──────────────────────┘     │
│                                                                  │
│  🏥 ROOM OCCUPANCY                 💵 EXPENSES (This Month)     │
│  ┌──────────────────────────┐      ┌──────────────────────┐     │
│  │  General: ████████░░ 80% │      │  Salaries: ₹2,00,000 │     │
│  │  AC:      ██████░░░░ 60% │      │  Utilities: ₹50,000  │     │
│  │  ICU:     ██████████ 100%│      │  Supplies: ₹75,000   │     │
│  │  Private: ████░░░░░░ 40% │      │  Total: ₹3,25,000    │     │
│  └──────────────────────────┘      └──────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 💡 Suggestions & Future Enhancements

### High Priority Recommendations

| Feature | Description | Benefit |
|---------|-------------|---------|
| **SMS/WhatsApp Alerts** | Send appointment reminders, bill notifications | Better patient engagement |
| **Online Appointment Booking** | Patient portal for booking | Reduce reception workload |
| **Lab Integration** | Connect with lab management system | Auto-fetch reports |
| **Insurance Module** | Cashless claim processing | Attract insured patients |
| **Inventory Management** | Track medical supplies stock | Avoid shortages |

### Medium Priority

| Feature | Description |
|---------|-------------|
| **Mobile App** | Doctor/Staff mobile app for quick access |
| **Patient App** | Patients view reports, book appointments |
| **Telemedicine** | Video consultation feature |
| **E-Prescription** | Digital prescriptions with QR code |
| **Referral Tracking** | Track patient referrals from other doctors |
| **Follow-up Reminders** | Auto-remind patients for follow-ups |

### Nice to Have

| Feature | Description |
|---------|-------------|
| **Multi-branch Support** | Manage multiple hospital locations |
| **AI Diagnosis Assist** | Suggest possible diagnoses based on symptoms |
| **Voice Notes** | Doctor can record voice notes for patients |
| **Document OCR** | Auto-extract text from uploaded documents |
| **Biometric Attendance** | Staff attendance integration |
| **CCTV Integration** | View cameras from dashboard |

### Additional Modules to Consider

#### 14. Appointment Scheduling
- Online/Phone appointment booking
- Doctor availability calendar
- Reschedule/Cancel appointments
- Waiting list management
- Send reminders (SMS/Email)

#### 15. Inventory/Stock Management
- Medical supplies tracking
- Pharmacy stock management
- Low stock alerts
- Purchase orders
- Vendor management
- Stock valuation reports

#### 16. Lab Management
- Lab test orders
- Sample collection tracking
- Report entry
- Auto-link to patient records
- Print lab reports

#### 17. Ambulance Management
- Ambulance fleet tracking
- Trip logging
- Driver assignment
- Emergency dispatch

#### 18. Canteen/Food Management
- Patient meal tracking
- Diet chart per patient
- Meal billing
- Kitchen inventory

#### 19. Housekeeping Module
- Room cleaning schedule
- Task assignment
- Status tracking
- Laundry management

#### 20. Visitor Management
- Visitor registration
- Pass generation
- Visiting hours enforcement
- Visitor history

---

## 🔒 Security Considerations

| Feature | Implementation |
|---------|----------------|
| Role-based Access | Different permissions per role |
| Audit Logs | Track all user actions |
| Data Encryption | Encrypt sensitive data (Aadhar, etc.) |
| Session Timeout | Auto-logout after inactivity |
| Password Policy | Strong password requirements |
| Backup System | Regular automated backups |
| HIPAA Compliance | Healthcare data standards |

---

## 📱 Responsive Design Requirements

| Screen | Layout |
|--------|--------|
| Desktop (>1024px) | Full sidebar, multi-column |
| Tablet (768-1024px) | Collapsible sidebar |
| Mobile (<768px) | Bottom navigation, single column |

---

## 🔄 Development Phases

### Phase 1: Foundation ✅ (Current)
- [x] Project setup (Vite + React + TypeScript + Tailwind)
- [x] Login page design
- [x] Dashboard layout (Sidebar, Topbar)
- [ ] Dashboard page with statistics
- [ ] Routing setup

### Phase 2: Core OPD Module
- [ ] OPD registration form
- [ ] OPD patient list
- [ ] OPD slip print
- [ ] Token generation
- [ ] Barcode generation

### Phase 3: Room & Doctor Management
- [ ] Room types CRUD
- [ ] Room/Bed management
- [ ] Doctor profiles CRUD
- [ ] Doctor schedule management

### Phase 4: IPD Module
- [ ] Admit patient form
- [ ] Admitted patient list
- [ ] Room/Bed assignment
- [ ] Deposit management

### Phase 5: Services Module
- [ ] Services CRUD
- [ ] Assign services to patients
- [ ] Service billing

### Phase 6: Pharmacy Module
- [ ] Pharmacy dashboard
- [ ] Medicine slip creation
- [ ] Prescription from doctor
- [ ] Pharmacy billing (separate)

### Phase 7: Patient Management
- [ ] All patients list
- [ ] Patient detail page with tabs
- [ ] Medical history
- [ ] Reports upload

### Phase 8: Billing Module
- [ ] Final bill generation
- [ ] Payment tracking
- [ ] Deposit/Refund management
- [ ] Bill printing

### Phase 9: Settings & Team
- [ ] Hospital settings
- [ ] Team management (roles)
- [ ] Master data management

### Phase 10: Expense Management
- [ ] Expense categories
- [ ] Add/Edit expenses
- [ ] Expense list with filters
- [ ] Recurring expenses
- [ ] Receipt upload

### Phase 11: Reports & Analytics
- [ ] Revenue reports (OPD, IPD, Services)
- [ ] Patient reports
- [ ] Financial reports (P&L, Income Statement)
- [ ] Expense reports
- [ ] Comparison reports
- [ ] Export (PDF, Excel)
- [ ] Dashboard analytics charts

---

## 🗃️ Database Schema (Reference)

### Core Tables
```
patients
├── id
├── name
├── age
├── gender
├── phone
├── aadhar
├── address
├── emergency_contact
├── created_at

doctors
├── id
├── name
├── specialization
├── qualification
├── phone
├── email
├── photo
├── available_days
├── timing_from
├── timing_to
├── consultation_fee
├── status

rooms
├── id
├── room_number
├── room_type
├── total_beds
├── rent_per_day
├── facilities
├── status

beds
├── id
├── room_id
├── bed_number
├── status (available/occupied/cleaning)

opd_visits
├── id
├── patient_id
├── doctor_id
├── token_number
├── visit_date
├── symptoms
├── diagnosis
├── fee
├── payment_status
├── payment_mode

admissions
├── id
├── patient_id
├── doctor_id
├── room_id
├── bed_id
├── admission_date
├── expected_discharge
├── actual_discharge
├── diagnosis
├── status

services
├── id
├── name
├── category
├── description
├── fee
├── status

patient_services
├── id
├── admission_id
├── service_id
├── service_date
├── quantity
├── total_fee
├── assigned_by

deposits
├── id
├── admission_id
├── amount
├── payment_mode
├── payment_date
├── receipt_number

prescriptions
├── id
├── patient_id
├── opd_visit_id / admission_id
├── prescribed_by
├── prescription_date
├── notes

prescription_medicines
├── id
├── prescription_id
├── medicine_name
├── dosage
├── quantity
├── frequency
├── days
├── instructions

pharmacy_bills
├── id
├── patient_id
├── prescription_id (optional)
├── bill_date
├── total_amount
├── payment_mode
├── billed_by

pharmacy_bill_items
├── id
├── pharmacy_bill_id
├── medicine_name
├── dosage
├── quantity
├── unit_price
├── total_price

final_bills
├── id
├── admission_id
├── room_charges
├── service_charges
├── other_charges
├── total_amount
├── total_deposits
├── balance_due
├── refund_amount
├── payment_status
├── generated_date

users
├── id
├── name
├── email
├── phone
├── role (super_admin/doctor/reception/pharmacy)
├── username
├── password
├── status
├── last_login

expense_categories
├── id
├── name
├── description
├── status

expenses
├── id
├── title
├── category_id
├── amount
├── expense_date
├── payment_mode
├── paid_to
├── description
├── receipt_file
├── is_recurring
├── frequency (monthly/yearly/null)
├── created_by
├── created_at

audit_logs
├── id
├── user_id
├── action
├── module
├── record_id
├── old_data (JSON)
├── new_data (JSON)
├── ip_address
├── created_at
```

---

## 🎨 UI/UX Guidelines

### Color Theme (From Login Page)
- **Primary:** Blue (#2563eb to #0891b2 gradient)
- **Secondary:** Cyan (#06b6d4)
- **Dark Background:** #0f172a (sidebar)
- **Light Background:** #f8fafc (content area)
- **Text Primary:** #1e293b
- **Text Secondary:** #64748b

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold (600-700)
- **Body:** Regular (400)

### Components Style
- Rounded corners (xl, 2xl)
- Subtle shadows
- Gradient accents
- Smooth transitions (300ms)
- Glass morphism for cards

---

## 📝 Notes

1. **Pharmacy Revenue Separation:** Medicine billing through pharmacy is tracked separately and NOT included in doctor's main revenue from OPD/IPD.

2. **Token System:** Auto-increment daily, resets each day.

3. **Barcode:** Generate unique barcode for each OPD slip for quick scanning.

4. **Print Layouts:** All slips and bills should have proper print CSS for thermal/A4 printing.

5. **Data Validation:** Aadhar number validation (12 digits), phone validation (10 digits).

---

## 🚀 Next Steps

1. Complete Dashboard page with statistics
2. Set up routing for all modules
3. Create OPD registration form
4. Build patient list components
5. Implement print functionality

---

*Document Version: 1.0*
*Last Updated: March 11, 2026*
