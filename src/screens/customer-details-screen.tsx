"use client"

import React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Screen, ScreenHeader, ScreenTitle, ScreenContent, LoadingWrapper } from "@/components/ui/screen"
import { CustomerInfo } from "@/components/customer/customer-info"
import { SearchBar } from "@/components/order/search-bar"
import { OrderCard } from "@/components/order/order-card"
import { useCustomerOrders } from "@/hooks/use-customer-orders"
import { useNavigation } from "@/hooks/use-navigation"

export const CustomerDetailsScreen: React.FC = () => {
  const { screenParams, navigateBackToSearch, navigateToOrderDetails } = useNavigation();
  const customer = screenParams?.customer;

  const {
    isLoading,
    orders,
    filteredOrders,
    searchQuery,
    setSearchQuery
  } = useCustomerOrders(
    customer,
    screenParams?.preserveOrders,
    screenParams?.previousOrdersState
  );

  return (
    <Screen>
      <ScreenHeader onBack={navigateBackToSearch}>
        <ScreenTitle>Müşteri Detayları</ScreenTitle>
      </ScreenHeader>
      <ScreenContent className="mt-2">
        <LoadingWrapper loading={isLoading}>
          {/* Customer info card */}
          <CustomerInfo
            customer={customer}
            tSoftSiteUrl={orders?._meta.siteUrl}
            customerId={customer?.CustomerId}
          />

          {/* Search input card */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Siparişlerde ara"
          />

          {/* Orders list */}
          <Card className="rounded-none border-0">
            <CardContent className="p-3">
              <h3 className="mb-2 text-sm font-medium text-center">
                {filteredOrders.length > 0
                  ? `Siparişler (${filteredOrders.length})`
                  : "Sipariş bulunamadı"}
              </h3>

              <div className="space-y-2">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard
                      key={order.OrderId}
                      order={order}
                      onClick={() => navigateToOrderDetails(
                        order,
                        orders?._meta.siteUrl || "",
                        customer,
                        orders,
                        searchQuery
                      )}
                    />
                  ))
                ) : (
                  <div className="py-4 text-sm text-center text-muted-foreground">
                    {isLoading ? "Siparişler yükleniyor..." : "Bu müşteriye ait sipariş bulunamadı"}
                  </div>
                )}
              </div>

              {filteredOrders.length > 5 && (
                <div className="flex justify-center mt-3">
                  <div className="flex">
                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-r-none">
                      <ChevronLeftIcon className="size-3" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-l-none">
                      <ChevronRightIcon className="size-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </LoadingWrapper>
      </ScreenContent>
    </Screen>
  )
}
