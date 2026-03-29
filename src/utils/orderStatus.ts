// Define all allowed order statuses
export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 9 | 8;

// Structure of returned object
export interface StatusConfig {
  message: string;
  color: string;
  tagColor:string;
}

export const ORDER_STATUS = [
    { "value": "", "label": "All" },
    { "value": 0, "label": "New" },
    { "value": 1, "label": "Accepted" },
    { "value": 2, "label": "Rejected" },
    // { "value": 3, "label": "Cancelled" },
    { "value": 4, "label": "Dispatched" },
    { "value": 9, "label": "Delivered" },
    // { "value": 8, "label": "Refunded" },
  ]

export const STATUS_MAP: Record<OrderStatus, StatusConfig> = {
  0: {
    message: "Pending",
    color: "", // warning (gold)
    tagColor: "warning",
  },
  1: {
    message: "Confirmed",
    color: "#1677ff", // success (green)
    tagColor:"blue"
  },
  2: {
    message: "Rejected",
    color: "#ff4d4f", // error (red)
    tagColor:"error"
  },
  3: {
    message: "Canceled",
    color: "#8c8c8c", // gray
    tagColor:"error"
  },
  4: {
    message: "Dispatched",
    color: "#25D366", // processing (blue)
    tagColor:"lime"
  },
  9: {
    message: "Delivered",
    color: "green", // completed (cyan)
    tagColor:"cyan"
  },
  8:{
    message: "Refunded",
    color: "red", // completed (cyan)
    tagColor:"red"
  },
};

// Main helper function
export const getOrderStatus = (status?: number): StatusConfig => {
  return STATUS_MAP[status as OrderStatus] ?? {
    message: "Pending",
    color: "#595959",
  };
};
