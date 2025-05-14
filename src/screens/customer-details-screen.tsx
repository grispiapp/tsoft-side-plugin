"use client"

import React, { useEffect, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, DotsVerticalIcon, ExternalLinkIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGrispi } from "@/contexts/grispi-context"
import { Screen, ScreenHeader, ScreenTitle, ScreenContent, LoadingWrapper } from "@/components/ui/screen"
import { useStore } from "@/contexts/store-context"
import { Customer, Order, OrderResponse, getCustomerDetailsUrl, getOrders } from "@/api/tsoft"
import toast from "react-hot-toast"

export const CustomerDetailsScreen: React.FC = () => {
  const { screenParams, setScreen } = useStore().screen;
  const { bundle } = useGrispi();
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<OrderResponse['data']>()

  const customer = screenParams?.customer as Customer;

  useEffect(() => {
    if (customer?.CustomerId) {
      // If we're returning with preserved orders state, use that instead of fetching again
      if (screenParams?.preserveOrders && screenParams?.previousOrdersState) {
        setOrders(screenParams.previousOrdersState);
        return;
      }

      fetchCustomerOrders();
    }
  }, [customer?.CustomerId, screenParams?.preserveOrders]);

  const fetchCustomerOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getOrders(customer.CustomerId, bundle?.context.token || "");

      if (response.data.success) {
        setOrders(response.data);
      } else {
        toast.error("Failed to fetch customer orders");
        setOrders(undefined);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Could not connect to the server");
      setOrders(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setScreen("search", {
      preserveState: true,
      previousSearchQuery: screenParams?.previousSearchQuery,
      customers: screenParams?.customers,
      totalCustomers: screenParams?.totalCustomers
    });
  }

  // Filter orders if search query is provided
  const filteredOrders = searchQuery.trim()
    ? orders?.data.filter(order =>
      order.OrderCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.OrderTotalPrice?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.OrderStatus?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? []
    : orders?.data ?? [];

  const getInitials = (name: string = "", surname: string = "") => {
    const firstInitial = name ? name.charAt(0) : "";
    const lastInitial = surname ? surname.charAt(0) : "";
    return (firstInitial + lastInitial).toUpperCase();
  }

  // Format date to a shorter version
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    try {
      const value = parseFloat(amount);
      return value.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (e) {
      return amount;
    }
  };

  return (
    <Screen>
      <ScreenHeader onBack={handleBack}>
        <ScreenTitle>Customer Details</ScreenTitle>
      </ScreenHeader>
      <ScreenContent className="mt-2">
        <LoadingWrapper loading={isLoading}>
          {/* Customer info card */}
          <Card className="mb-3 rounded-none border-0">
            <CardContent className="p-3">
              <div className="flex gap-3 items-start">
                <Avatar className="border size-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Customer avatar" />
                  <AvatarFallback className="text-purple-600 bg-purple-100">
                    {getInitials(customer?.Name, customer?.Surname)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1 items-center mb-0.5">
                    <h2 className="text-base font-medium truncate">
                      {customer ? `${customer.Name} ${customer.Surname || ''}` : 'Customer'}
                    </h2>
                    <Badge variant="outline" className="text-xs font-normal">
                      {customer?.CustomerCode || 'Unknown'}
                    </Badge>
                  </div>
                  <p className="text-sm truncate text-muted-foreground">{customer?.Email || 'No email'}</p>
                  {customer?.Mobile && <p className="text-sm truncate text-muted-foreground">{customer.Mobile}</p>}
                </div>
                {orders?._meta.siteUrl && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <DotsVerticalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a
                          href={getCustomerDetailsUrl(orders._meta.siteUrl, customer?.CustomerId || "")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex gap-2 items-center"
                        >
                          <span>View in TSoft</span>
                          <ExternalLinkIcon className="size-3.5" />
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search input card */}
          <Card className="mb-3 rounded-none border-0">
            <CardContent className="p-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for orders"
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Orders list */}
          <Card className="rounded-none border-0">
            <CardContent className="p-3">
              <h3 className="mb-2 text-sm font-medium text-center">
                {filteredOrders.length > 0
                  ? `Orders (${filteredOrders.length})`
                  : "No orders found"}
              </h3>

              <div className="space-y-2">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <Card
                      key={order.OrderId}
                      className="p-3 cursor-pointer hover:bg-muted/50"
                      onClick={() => setScreen("order-details", {
                        order,
                        tSoftSiteUrl: orders?._meta.siteUrl,
                        customer,
                        previousOrdersState: orders, // Pass orders to preserve state
                        searchQuery  // Pass the search query along
                      })}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-primary">{order.OrderCode}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(order.OrderDate)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₺{formatCurrency(order.OrderTotalPrice)}</div>
                          <Badge
                            variant="secondary"
                            className="mt-1 text-xs font-normal"
                          >
                            {order.OrderStatus}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="py-4 text-sm text-center text-muted-foreground">
                    {isLoading ? "Loading orders..." : "No orders found for this customer"}
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
