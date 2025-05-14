import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Customer, getCustomers } from "@/api/tsoft";
import { useGrispi } from "@/contexts/grispi-context";

export function useCustomerSearch(
  initialQuery = "",
  preserveState = false,
  initialCustomers: Customer[] = [],
  initialTotalCustomers = 0
) {
  const { bundle } = useGrispi();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(
    preserveState ? initialCustomers : []
  );
  const [hasSearched, setHasSearched] = useState(!!preserveState);
  const [totalCustomers, setTotalCustomers] = useState(initialTotalCustomers);

  // Function to perform the search
  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setIsLoading(true);
      setHasSearched(true);

      try {
        const response = await getCustomers(query, bundle?.context.token || "");

        if (response.data.success) {
          setCustomers(response.data.data ?? []);
          setTotalCustomers(parseInt(response.data.summary.totalRecordCount));
        } else {
          toast.error("Müşteri bulunamadı. Lütfen tekrar deneyin.");
          setCustomers([]);
          setTotalCustomers(0);
        }
      } catch (error) {
        console.error("Arama hatası:", error);
        toast.error("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
        setCustomers([]);
        setTotalCustomers(0);
      } finally {
        setIsLoading(false);
      }
    },
    [bundle?.context.token]
  );

  // Auto search with requester's phone when available
  useEffect(() => {
    // Skip auto-search if returning with preserved state
    if (preserveState) return;

    const requesterPhone = bundle?.context.requester?.phone;
    if (requesterPhone) {
      setSearchQuery(requesterPhone);
      performSearch(requesterPhone);
    }
  }, [bundle?.context.requester?.phone, performSearch, preserveState]);

  return {
    searchQuery,
    setSearchQuery,
    isLoading,
    customers,
    hasSearched,
    totalCustomers,
    performSearch,
  };
}
