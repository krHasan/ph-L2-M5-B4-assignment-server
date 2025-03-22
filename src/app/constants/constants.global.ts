export const USER_ROLE = {
    landlord: "landlord",
    tenant: "tenant",
    admin: "admin",
} as const;
export const userRoleArray = Object.values(USER_ROLE);

export const USER_STATUS = {
    active: "active",
    blocked: "blocked",
} as const;
export const userStatusArray = Object.values(USER_STATUS);

export const REQUEST_STATUS = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    canceled: "canceled",
} as const;
export const requestStatusArray = Object.values(REQUEST_STATUS);

export const PAYMENT_STATUS = {
    pending: "pending",
    paid: "paid",
    failed: "failed",
} as const;
export const paymentStatusArray = Object.values(PAYMENT_STATUS);

export const PAYMENT_TYPE = {
    COD: "COD",
    Online: "Online",
} as const;
export const paymentTypeArray = Object.values(PAYMENT_TYPE);
