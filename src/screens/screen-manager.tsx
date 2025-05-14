import { LoadingScreen } from "./loading-screen";
import { observer } from "mobx-react-lite";

import { useStore } from "@/contexts/store-context";
import { SearchCustomersScreen } from "./search-customers-screen";
import { CustomerDetailsScreen } from "./customer-details-screen";
import { OrderDetailsScreen } from "./order-details-screen";

export const ScreenManager = observer(() => {
  const { screen } = useStore().screen;

  if (screen === "search") {
    return <SearchCustomersScreen />;
  }

  if (screen === "customer-details") {
    return <CustomerDetailsScreen />;
  }

  if (screen === "order-details") {
    return <OrderDetailsScreen />;
  }

  return <LoadingScreen />;
});
