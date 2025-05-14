import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { JwtToken } from "@/types/grispi.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload) as JwtToken;
}

export function convertPhoneNumber(input: string) {
  let digits = input.replace(/\D/g, ""); // Remove all non-digit characters
  let match = digits.match(/^(\d{1,4})?(\d{10})$/); // Capture area code (optional) and last 10 digits

  if (!match) return null; // Return null if input is invalid

  let areaCode = match[1] && match[1] !== "0" ? match[1] : "90"; // Use provided area code or default to '90'
  let number = match[2];

  return `${areaCode}${number}`;
}

// Format date
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);

    if (date.getTime() === 0) return "Not yet";
    if (date.getFullYear() === 1970) return "Not yet";

    // Use UTC methods to prevent timezone conversion
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } catch (e) {
    return dateString;
  }
};

// Format timestamp
export const formatTimestamp = (timestamp: string) => {
  if (timestamp === "0") return "Not yet";

  const date = new Date(parseInt(timestamp) * 1000);
  return formatDate(date.toISOString());
};

// Format currency
export const formatCurrency = (amount: string) => {
  try {
    const value = parseFloat(amount);
    return value.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currencyDisplay: "symbol",
      style: "currency",
      currency: "TRY",
    });
  } catch (e) {
    return amount;
  }
};
