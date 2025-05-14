import { useStore } from "@/contexts/store-context";

export function useNavigation() {
  const { setScreen, screenParams } = useStore().screen;

  const navigateToCustomerDetails = (
    customer: any,
    previousSearchQuery?: string,
    customers?: any[],
    totalCustomers?: number
  ) => {
    setScreen("customer-details", {
      customer,
      previousSearchQuery,
      customers,
      totalCustomers,
    });
  };

  const navigateToOrderDetails = (
    order: any,
    tSoftSiteUrl: string,
    customer: any,
    previousOrdersState: any,
    searchQuery?: string
  ) => {
    setScreen("order-details", {
      order,
      tSoftSiteUrl,
      customer,
      previousOrdersState,
      searchQuery,
    });
  };

  const navigateBackToCustomerDetails = () => {
    setScreen("customer-details", {
      customer: screenParams?.customer,
      preserveOrders: true,
      previousOrdersState: screenParams?.previousOrdersState,
      previousSearchQuery: screenParams?.previousSearchQuery,
    });
  };

  const navigateBackToSearch = () => {
    setScreen("search", {
      preserveState: true,
      previousSearchQuery: screenParams?.previousSearchQuery,
      customers: screenParams?.customers,
      totalCustomers: screenParams?.totalCustomers,
    });
  };

  return {
    navigateToCustomerDetails,
    navigateToOrderDetails,
    navigateBackToCustomerDetails,
    navigateBackToSearch,
    screenParams,
  };
}
