export type ServiceRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'More Information Required';

export interface ServiceRequestRecord {
  id: string;
  requestNumber: string;
  customerName: string;
  contactNumber: string;
  companyName?: string;
  serviceType: string;
  serviceLocation: string;
  requestDescription: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  requestSource: 'Phone Call';
  attachments?: string[];
  submittedBy: string;
  submittedByRole?: string;
  requestDate: string;
  status: ServiceRequestStatus;
  
  // Approval metadata
  adminComments?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  moreInfoRequestedAt?: string;
  
  // Link to generated ticket
  generatedTicketId?: string;
  assignedTechnician?: string;
  
  // Activity / Audit timeline
  timeline: {
    title: string;
    description: string;
    timestamp: string;
    actor: string;
    status: ServiceRequestStatus;
  }[];
}

const STORAGE_KEY = 'universal_erp_service_requests_v1';

export const INITIAL_SERVICE_REQUESTS: ServiceRequestRecord[] = [
  {
    id: 'req-101',
    requestNumber: 'SR-2026-001',
    customerName: 'K. Senthil Nathan',
    contactNumber: '+91 98401 55667',
    companyName: 'Apex Precision Engineering',
    serviceType: 'Breakdown Repair',
    serviceLocation: 'Plot 45, Ambattur Industrial Estate, Chennai',
    requestDescription: 'CNC Mill spindle motor tripping overload protection relay frequently during cycle start.',
    priority: 'Urgent',
    requestSource: 'Phone Call',
    attachments: ['spindle_motor_panel_photo.jpg'],
    submittedBy: 'Kavitha S. (Office Staff)',
    submittedByRole: 'office_staff',
    requestDate: '2026-11-19 09:30 AM',
    status: 'Pending Approval',
    timeline: [
      {
        title: 'Customer Phone Call Received',
        description: 'Customer reported machine outage on phone line 2. Staff noted critical symptoms.',
        timestamp: '2026-11-19 09:20 AM',
        actor: 'Kavitha S. (Office Staff)',
        status: 'Draft',
      },
      {
        title: 'Service Request Submitted for Admin Approval',
        description: 'Intake form completed and forwarded to Service Admin for validation and technician assignment.',
        timestamp: '2026-11-19 09:30 AM',
        actor: 'Kavitha S. (Office Staff)',
        status: 'Pending Approval',
      },
    ],
  },
  {
    id: 'req-102',
    requestNumber: 'SR-2026-002',
    customerName: 'Praveen Chandran',
    contactNumber: '+91 98200 44332',
    companyName: 'Supreme Auto Components',
    serviceType: 'Quarterly Maintenance (AMC)',
    serviceLocation: 'Survey 112, Sriperumbudur Corridor, Kanchipuram',
    requestDescription: 'Routine 500-hour hydraulic oil filtration, pressure valve inspection, and filter replacement.',
    priority: 'Medium',
    requestSource: 'Phone Call',
    attachments: ['maintenance_checklist.pdf'],
    submittedBy: 'Kavitha S. (Office Staff)',
    submittedByRole: 'office_staff',
    requestDate: '2026-11-18 03:15 PM',
    status: 'Approved',
    adminComments: 'Approved under active Platinum AMC contract. Assigned to senior hydraulic technician.',
    approvedAt: '2026-11-18 03:45 PM',
    approvedBy: 'Murugan Selvam (Service Admin)',
    generatedTicketId: 'TCK-2026-701',
    assignedTechnician: 'Murugan Selvam',
    timeline: [
      {
        title: 'Phone Call Intake',
        description: 'Customer requested AMC maintenance slot for upcoming weekend.',
        timestamp: '2026-11-18 03:00 PM',
        actor: 'Kavitha S. (Office Staff)',
        status: 'Draft',
      },
      {
        title: 'Submitted for Approval',
        description: 'Forwarded with verified contract details.',
        timestamp: '2026-11-18 03:15 PM',
        actor: 'Kavitha S. (Office Staff)',
        status: 'Pending Approval',
      },
      {
        title: 'Request Approved & Service Ticket Generated',
        description: 'Admin approved request. Unique Service Ticket TCK-2026-701 generated and assigned to Murugan Selvam.',
        timestamp: '2026-11-18 03:45 PM',
        actor: 'Murugan Selvam (Service Admin)',
        status: 'Approved',
      },
    ],
  },
  {
    id: 'req-103',
    requestNumber: 'SR-2026-003',
    customerName: 'Rajaraman S.',
    contactNumber: '+91 97910 88990',
    companyName: 'Metro Plastic Moulds',
    serviceType: 'Electrical Inspection',
    serviceLocation: 'Block B, Guindy Industrial Cluster, Chennai',
    requestDescription: 'Control panel main circuit breaker heating up excessively under full operational load.',
    priority: 'High',
    requestSource: 'Phone Call',
    submittedBy: 'Kavitha S. (Office Staff)',
    submittedByRole: 'office_staff',
    requestDate: '2026-11-17 11:10 AM',
    status: 'More Information Required',
    adminComments: 'Please confirm exact machine model number, voltage rating, and whether breaker is 3-phase or 1-phase.',
    moreInfoRequestedAt: '2026-11-17 11:40 AM',
    timeline: [
      {
        title: 'Request Created via Call',
        description: 'Inbound breakdown call attended by desk staff.',
        timestamp: '2026-11-17 11:00 AM',
        actor: 'Kavitha S. (Office Staff)',
        status: 'Draft',
      },
      {
        title: 'Submitted to Admin',
        description: 'Forwarded for triage.',
        timestamp: '2026-11-17 11:10 AM',
        actor: 'Kavitha S. (Office Staff)',
        status: 'Pending Approval',
      },
      {
        title: 'More Information Requested by Admin',
        description: 'Admin requested machine model & breaker specs before technician dispatch.',
        timestamp: '2026-11-17 11:40 AM',
        actor: 'Murugan Selvam (Service Admin)',
        status: 'More Information Required',
      },
    ],
  },
  {
    id: 'req-104',
    requestNumber: 'SR-2026-004',
    customerName: 'Balaji Venkatesh',
    contactNumber: '+91 94440 12345',
    companyName: 'Delta Fabrication Works',
    serviceType: 'Warranty Claim',
    serviceLocation: 'SIPCOT Industrial Park, Ranipet',
    requestDescription: 'Customer claims free service on drive delivered 4 years ago without valid warranty extension.',
    priority: 'Low',
    requestSource: 'Phone Call',
    submittedBy: 'Kavitha S. (Office Staff)',
    submittedByRole: 'office_staff',
    requestDate: '2026-11-16 02:20 PM',
    status: 'Rejected',
    adminComments: 'Warranty lapsed 18 months ago. Client advised to purchase standard paid AMC or chargeable call-out visit.',
    rejectedAt: '2026-11-16 03:00 PM',
    timeline: [
      {
        title: 'Call Received',
        description: 'Customer insisted on warranty coverage.',
        timestamp: '2026-11-16 02:15 PM',
        actor: 'Kavitha S. (Office Staff)',
        status: 'Draft',
      },
      {
        title: 'Submitted to Admin',
        description: 'Sent for warranty verification.',
        timestamp: '2026-11-16 02:20 PM',
        actor: 'Kavitha S. (Office Staff)',
        status: 'Pending Approval',
      },
      {
        title: 'Rejected by Admin',
        description: 'Warranty expired in 2024. Commercial quote required instead.',
        timestamp: '2026-11-16 03:00 PM',
        actor: 'Murugan Selvam (Service Admin)',
        status: 'Rejected',
      },
    ],
  },
];

export const getStoredServiceRequests = (): ServiceRequestRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SERVICE_REQUESTS));
      return INITIAL_SERVICE_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SERVICE_REQUESTS;
  }
};

export const saveStoredServiceRequests = (requests: ServiceRequestRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

export const createServiceRequest = (
  payload: Omit<ServiceRequestRecord, 'id' | 'requestNumber' | 'timeline' | 'status'> & {
    isDraft?: boolean;
  }
): ServiceRequestRecord => {
  const all = getStoredServiceRequests();
  const nextNum = all.length + 1;
  const requestNumber = `SR-2026-${String(nextNum).padStart(3, '0')}`;
  const status: ServiceRequestStatus = payload.isDraft ? 'Draft' : 'Pending Approval';

  const newRecord: ServiceRequestRecord = {
    ...payload,
    id: `req-${Date.now()}`,
    requestNumber,
    status,
    timeline: [
      {
        title: 'Customer Phone Call Received',
        description: `Customer ${payload.customerName} requested ${payload.serviceType} via inbound telephone line.`,
        timestamp: new Date().toLocaleString(),
        actor: payload.submittedBy || 'Office Staff',
        status: 'Draft',
      },
      ...(payload.isDraft
        ? []
        : [
            {
              title: 'Submitted for Admin Approval',
              description: 'Service request details saved and queued for Service Admin review and approval.',
              timestamp: new Date().toLocaleString(),
              actor: payload.submittedBy || 'Office Staff',
              status: 'Pending Approval' as ServiceRequestStatus,
            },
          ]),
    ],
  };

  const updated = [newRecord, ...all];
  saveStoredServiceRequests(updated);
  return newRecord;
};

export const updateServiceRequestStatus = (
  requestId: string,
  newStatus: ServiceRequestStatus,
  adminData: {
    actor: string;
    comments?: string;
    technician?: string;
    ticketId?: string;
  }
): ServiceRequestRecord | null => {
  const all = getStoredServiceRequests();
  const index = all.findIndex((r) => r.id === requestId);
  if (index === -1) return null;

  const req = { ...all[index] };
  req.status = newStatus;
  const now = new Date().toLocaleString();

  if (adminData.comments) {
    req.adminComments = adminData.comments;
  }

  if (newStatus === 'Approved') {
    req.approvedAt = now;
    req.approvedBy = adminData.actor;
    if (adminData.ticketId) req.generatedTicketId = adminData.ticketId;
    if (adminData.technician) req.assignedTechnician = adminData.technician;

    req.timeline.push({
      title: 'Service Request Approved & Ticket Created',
      description: `Approved by ${adminData.actor}. Service Ticket ${req.generatedTicketId || ''} assigned to ${req.assignedTechnician || 'Field Technician'}. Comments: ${adminData.comments || 'Approved for execution.'}`,
      timestamp: now,
      actor: adminData.actor,
      status: 'Approved',
    });
  } else if (newStatus === 'Rejected') {
    req.rejectedAt = now;
    req.timeline.push({
      title: 'Service Request Rejected by Admin',
      description: `Request was rejected by ${adminData.actor}. Reason: ${adminData.comments || 'Not applicable or out of warranty.'}`,
      timestamp: now,
      actor: adminData.actor,
      status: 'Rejected',
    });
  } else if (newStatus === 'More Information Required') {
    req.moreInfoRequestedAt = now;
    req.timeline.push({
      title: 'Admin Requested Additional Information',
      description: `Admin queried: "${adminData.comments || 'Please verify machine/location details'}". Pending staff update.`,
      timestamp: now,
      actor: adminData.actor,
      status: 'More Information Required',
    });
  } else if (newStatus === 'Submitted' || newStatus === 'Pending Approval') {
    req.timeline.push({
      title: 'Resubmitted for Admin Approval',
      description: `Staff updated information and resubmitted for admin approval. Note: ${adminData.comments || 'Information updated.'}`,
      timestamp: now,
      actor: adminData.actor,
      status: 'Pending Approval',
    });
  }

  all[index] = req;
  saveStoredServiceRequests(all);
  return req;
};
