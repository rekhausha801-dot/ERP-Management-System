# Universal Multi-Tenant Sales & Service ERP Platform
## Phase 1 – Frontend Architecture & UI Foundation

### 1. Overview
The **Universal Multi-Tenant ERP** is an enterprise-grade web application built to serve multiple client organizations (tenants) across three ERP packages from a **single, unified frontend application codebase**:

1. **Complete ERP (`BOTH`)**: Full commercial sales lifecycle + field service management & AMC tracking.
2. **Sales ERP (`SALES`)**: CRM, Leads, Enquiries, Quotations, Orders, Invoicing, Payments, Inventory & Returns.
3. **Service ERP (`SERVICE`)**: Helpdesk Tickets, Job Dispatch, Scheduling, Technicians, AMC Contracts, Warranty, Spares & Billing.

---

### 2. Design System & Tokens
Designed using the **Enterprise Purple & White Theme**:
- **Primary:** `#51258C`
- **Secondary:** `#7546B8`
- **Background:** `#F5F1FA`
- **Surface:** `#FFFFFF`

---

### 3. Architecture & Package Dynamic Gating
- **Centralized Package Definition**: [`src/config/erpPackages.ts`](file:///D:/ERP%20SYSTEM/frontend/src/config/erpPackages.ts)
- **Dynamic Navigation Filter**: `getNavForPackage(packageType)` returns only the sections and modules permitted for that active tenant.
- **Route Guards**:
  - `ProtectedRoute`: Verifies user session.
  - `SuperAdminRoute`: Restricts HQ platform controls to platform super-administrators.
  - `PackageRoute`: Checks whether the active tenant's subscription tier permits accessing `/sales/*` or `/service/*` modules; redirects to `/unauthorized` (HTTP 403 equivalent) if unsubscribed.

---

### 4. Sample Verification Companies
The frontend is pre-configured with three live sample companies to verify multi-tenant tier behavior:

| Company Name | Tenant Code | Package Assigned | Modules Available |
| :--- | :--- | :--- | :--- |
| **ABC Traders Ltd** | `ABC` | `BOTH` | Dashboard, CRM, Sales, Inventory, Field Service, Tickets, AMC, Spares, Settings |
| **XYZ Agencies Pvt Ltd** | `XYZ` | `SALES` | Dashboard, CRM, Leads, Enquiries, Quotes, Orders, Invoices, Payments, Products, Returns, Settings |
| **PQR Solutions & Services**| `PQR` | `SERVICE` | Dashboard, Service Requests, Tickets, Jobs, Dispatch, AMC Contracts, Warranty, Spares, Billing, Settings |

---

### 5. Running the Application

1. Navigate to the frontend directory:
   ```powershell
   cd "D:\ERP SYSTEM\frontend"
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```

3. Open the provided localhost URL in your browser:
   ```
   http://localhost:5173
   ```

4. **Testing Features:**
   - **One-Click Tenant Switcher**: In the top navbar, use the tenant selector dropdown to instantly switch between **ABC Traders (BOTH)**, **XYZ Agencies (SALES)**, and **PQR Solutions (SERVICE)**.
   - **Live Dynamic Package Simulator**: Use the header simulator badge (`Test Package: [BOTH | SALES | SERVICE]`) to dynamically reconfigure the sidebar and permissions in real-time.
   - **Super Admin HQ Portal**: Accessible via `/superadmin` or clicking the purple **"Super Admin"** button in the header.
