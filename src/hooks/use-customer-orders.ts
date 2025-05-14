import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Customer, OrderResponse, getOrders } from "@/api/tsoft";
import { useGrispi } from "@/contexts/grispi-context";

export function useCustomerOrders(
  customer?: Customer,
  preserveOrders = false,
  previousOrdersState?: OrderResponse["data"]
) {
  const { bundle } = useGrispi();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResponse["data"] | undefined>(
    preserveOrders ? previousOrdersState : undefined
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomerOrders = useCallback(async () => {
    if (!customer?.CustomerId) return;

    setIsLoading(true);
    try {
      const response = await getOrders(
        customer.CustomerId,
        bundle?.context.token || ""
      );

      if (response.data.success) {
        setOrders(response.data);
      } else {
        toast.error("Müşteri siparişleri alınamadı");
        setOrders(undefined);
      }
    } catch (error) {
      console.error("Siparişleri alma hatası:", error);
      toast.error("Sunucuya bağlanılamadı");
      setOrders(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [customer?.CustomerId, bundle?.context.token]);

  useEffect(() => {
    if (customer?.CustomerId) {
      // If we're returning with preserved orders state, use that instead of fetching again
      if (preserveOrders && previousOrdersState) {
        setOrders(previousOrdersState);
        return;
      }

      fetchCustomerOrders();
    }
  }, [
    customer?.CustomerId,
    preserveOrders,
    previousOrdersState,
    fetchCustomerOrders,
  ]);

  // Filter orders if search query is provided
  const filteredOrders = searchQuery.trim()
    ? orders?.data.filter(
        (order) =>
          order.OrderCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.OrderTotalPrice?.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          order.OrderStatus?.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? []
    : orders?.data ?? [];

  return {
    isLoading,
    orders,
    filteredOrders,
    searchQuery,
    setSearchQuery,
    fetchCustomerOrders,
  };
}
