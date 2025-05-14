export const TSOFT_API_URL = "http://localhost:8080";

// Customer search filter types
type FilterType = "Mobile" | "Email" | "CustomerCode" | "Name";

// Helper to determine search type
export const determineSearchType = (
  query: string
): { type: FilterType; value: string } => {
  // Check if it's a phone number (starts with +, 0, or just digits)
  if (/^(\+|0)?\d+$/.test(query)) {
    return { type: "Mobile", value: formatPhoneNumber(query) };
  }

  // Check if it's an email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query)) {
    return { type: "Email", value: query };
  }

  // Check if it's a customer code (starts with T followed by numbers)
  if (/^T\d+$/.test(query)) {
    return { type: "CustomerCode", value: query };
  }

  // Otherwise use Name
  return { type: "Name", value: query };
};

// Phone formatter function
export const formatPhoneNumber = (phone: string): string => {
  // Already in international format
  if (phone.startsWith("+")) {
    return phone;
  }

  // Clean the input (remove spaces, dashes, etc.)
  const cleaned = phone.replace(/\D/g, "");

  // If it starts with 0, remove it
  const withoutLeadingZero = cleaned.startsWith("0")
    ? cleaned.substring(1)
    : cleaned;

  // Add Turkey country code (+90) if it appears to be a Turkish number
  return `+90${withoutLeadingZero}`;
};

// Customer types
export type Customer = {
  CustomerId: string;
  CustomerCode: string;
  Name: string;
  Surname: string;
  Email: string;
  Mobile: string;
  // ... other fields as needed
};

export type CustomerResponse = {
  statusCode: number;
  data: {
    success: boolean;
    data: Customer[];
    message: Array<{
      type: null | number;
      code: null | string;
      index: number;
      id: string;
      subid: string;
      text: Array<null | string>;
      errorField: string[];
    }>;
    summary: {
      totalRecordCount: string;
      primaryKey: string;
    };
  };
};

// Order types
export type OrderDetail = {
  OrderProductId: string;
  ProductId: string;
  ProductCode: string;
  ProductName: string;
  Quantity: string;
  SellingPrice: string;
  Brand?: string;
  ImageUrl?: string;
  Vat?: string;
  Barcode?: string;
  DiscountPercent?: number;
  // ... other fields as needed
};

export type OrderCustomerData = {
  Email: string;
  Mobile: string;
  Country?: string;
  City?: string;
  Town?: string;
  District?: string;
  PostCode?: string;
  // ... other fields as needed
};

export type DeliveryAddress = {
  City?: string;
  Town?: string;
  Country?: string;
  District?: string;
  // ... other fields as needed
};

export type ShipmentDetail = {
  ShipmentId: string;
  CargoTrackingNo: string;
  CargoTrackingUrl: string;
  CargoCompany?: string;
  OrderStatus?: string;
  CreateTime?: string;
  // ... other fields as needed
};

export type PaymentData = {
  Id: string;
  Name: string;
  Type: string;
  OnlineTransaction: string;
  CashOnDelivery: string;
  // ... other fields as needed
};

export type CargoInfo = {
  Id: string;
  Code: string;
  Name: string;
  Type: string;
  // ... other fields as needed
};

export type Order = {
  OrderId: string;
  OrderCode: string;
  OrderDate: string;
  OrderStatusId: string;
  OrderStatus: string;
  OrderTotalPrice: string;
  CustomerName: string;
  CustomerPhone: string;
  OrderDetails: OrderDetail[];
  CustomerData: OrderCustomerData[];
  ShipmentDetail: ShipmentDetail[];
  OrderSubtotal: string;
  DiscountTotal: string;
  PaymentType: string;
  Cargo: string;
  ShipmentTime?: string;
  ShipmentDeliveryTime?: string;
  DeliveryAddress?: DeliveryAddress;
  PaymentData?: PaymentData;
  CargoInfo?: CargoInfo;
  // ... other fields as needed
};

export type OrderResponse = {
  statusCode: number;
  data: {
    success: boolean;
    data: Order[];
    message: Array<{
      type: number;
      code: string;
      index: number;
      id: string;
      subid: string;
      text: string[];
      errorField: string[];
    }>;
    summary: {
      totalRecordCount: string;
      primaryKey: string;
    };
    _meta: {
      siteUrl: string;
    };
  };
};

// API functions
export const getCustomers = async (
  query: string,
  apiKey: string
): Promise<CustomerResponse> => {
  const { type, value } = determineSearchType(query);
  const filter = `${type}|${value}|${type === "Name" ? "contain" : "equal"}`;

  const response = await fetch(`${TSOFT_API_URL}/customer/getCustomers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      f: filter,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get customers");
  }

  return response.json();
};

export const getOrders = async (
  customerId: string,
  apiKey: string
): Promise<OrderResponse> => {
  const response = await fetch(`${TSOFT_API_URL}/order/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      FetchProductData: "1",
      FetchCustomerData: "1",
      FetchPaymentData: "1",
      FetchCargoInfo: "1",
      FetchShipmentDetail: "1",
      f: `CustomerId|${customerId}|equal`,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get orders");
  }

  return response.json();
};

export const getCustomerDetailsUrl = (
  host: string,
  customerId: string
): string => {
  return `${host}/srv/admin/customer/customer/add/${customerId}`;
};

export const getOrderDetailsUrl = (host: string, orderId: string): string => {
  return `${host}/srv/admin/order/order/detail/${orderId}/1`;
};
