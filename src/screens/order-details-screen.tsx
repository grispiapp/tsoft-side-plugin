"use client"

import React from "react"
import { DotsVerticalIcon, ExternalLinkIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Screen, ScreenHeader, ScreenTitle, ScreenContent, LoadingWrapper } from "@/components/ui/screen"
import { useStore } from "@/contexts/store-context"
import { Order, getOrderDetailsUrl } from "@/api/tsoft"
import { formatCurrency, formatDate, formatTimestamp } from "@/lib/utils"

export const OrderDetailsScreen: React.FC = () => {
    const { screenParams, setScreen } = useStore().screen;

    const order = screenParams?.order as Order;
    const tSoftSiteUrl = screenParams?.tSoftSiteUrl as string;

    const handleBack = () => {
        setScreen("customer-details", {
            customer: screenParams?.customer,
            preserveOrders: true,
            previousOrdersState: screenParams?.previousOrdersState
        });
    }

    // Calculate subtotal
    const calculateSubtotal = () => {
        if (!order?.OrderDetails) return "0";

        return order.OrderDetails.reduce((sum, item) => {
            const price = parseFloat(item.SellingPrice) || 0;
            const quantity = parseInt(item.Quantity) || 0;
            return sum + (price * quantity);
        }, 0).toFixed(2);
    };

    if (!order) {
        return (
            <Screen>
                <ScreenHeader onBack={handleBack}>
                    <ScreenTitle>Order Details</ScreenTitle>
                </ScreenHeader>
                <ScreenContent className="mt-2">
                    <div className="p-4 text-center text-muted-foreground">
                        Order information not available
                    </div>
                </ScreenContent>
            </Screen>
        );
    }

    return (
        <Screen>
            <ScreenHeader onBack={handleBack}>
                <ScreenTitle>Order Details</ScreenTitle>
            </ScreenHeader>
            <ScreenContent className="mt-2">
                <Card className="mb-3 rounded-none border-0">
                    <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex gap-2 items-center">
                                    <h2 className="text-base font-medium">{order.OrderCode}</h2>
                                    <Badge variant="secondary">{order.OrderStatus}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Created {formatDate(order.OrderDate)}
                                </p>
                            </div>
                            {tSoftSiteUrl && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="w-8 h-8">
                                            <DotsVerticalIcon className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <a
                                                href={getOrderDetailsUrl(tSoftSiteUrl, order.OrderId)}
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

                <Card className="rounded-none border-0">
                    <CardContent className="p-0">
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid grid-cols-2 w-full h-9 rounded-none">
                                <TabsTrigger value="details" className="text-xs">
                                    Order Details
                                </TabsTrigger>
                                <TabsTrigger value="customer" className="text-xs">
                                    Customer Info
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="p-3 space-y-4 text-xs">
                                {/* Order Items */}
                                <div className="space-y-1">
                                    <h3 className="mb-2 font-medium">Order Items</h3>
                                    {order.OrderDetails && order.OrderDetails.map((item) => (
                                        <Card key={item.OrderProductId} className="p-2">
                                            <div className="flex justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.ProductName}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Code: {item.ProductCode}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div>{item.Quantity} x {formatCurrency(item.SellingPrice)}</div>
                                                    <div className="font-medium">
                                                        {formatCurrency((parseFloat(item.SellingPrice) * parseInt(item.Quantity)).toString())}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Shipping Info */}
                                {order.ShipmentDetail && order.ShipmentDetail.length > 0 && (
                                    <div className="space-y-1">
                                        <h3 className="mb-2 font-medium">Shipping Information</h3>
                                        <Card className="p-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <div className="text-muted-foreground">Carrier:</div>
                                                    <div>{order.ShipmentDetail[0]?.CargoCompany || order.Cargo || "Not specified"}</div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground">Tracking Number:</div>
                                                    <div className="truncate">{order.ShipmentDetail[0]?.CargoTrackingNo || "Not available"}</div>
                                                </div>
                                                {order.ShipmentDetail[0]?.CargoTrackingUrl && (
                                                    <div className="col-span-2">
                                                        <a
                                                            href={order.ShipmentDetail[0].CargoTrackingUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex gap-1 items-center text-xs text-primary"
                                                        >
                                                            <span>Track Package</span>
                                                            <ExternalLinkIcon className="size-3" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {/* Payment Details */}
                                <div className="space-y-1">
                                    <h3 className="mb-2 font-medium">Payment Details</h3>
                                    <Card className="p-2">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between">
                                                <span>Payment Method:</span>
                                                <span>{order.PaymentType || order.PaymentData?.Name || "Not specified"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>{formatCurrency(order.OrderSubtotal || calculateSubtotal())}</span>
                                            </div>
                                            {(order.DiscountTotal && parseFloat(order.DiscountTotal) > 0) && (
                                                <div className="flex justify-between">
                                                    <span>Discount:</span>
                                                    <span>-{formatCurrency(order.DiscountTotal)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between pt-1 font-medium border-t">
                                                <span>Total:</span>
                                                <span>{formatCurrency(order.OrderTotalPrice)}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Order Timeline */}
                                <div className="space-y-1">
                                    <h3 className="mb-2 font-medium">Order Timeline</h3>
                                    <Card className="p-2">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <div className="flex gap-2 items-center">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span>Order Placed</span>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {formatDate(order.OrderDate)}
                                                </div>
                                            </div>

                                            {order.ShipmentTime && (
                                                <div className="flex justify-between">
                                                    <div className="flex gap-2 items-center">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        <span>Shipped</span>
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {formatTimestamp(order.ShipmentTime)}
                                                    </div>
                                                </div>
                                            )}

                                            {order.ShipmentDeliveryTime && (
                                                <div className="flex justify-between">
                                                    <div className="flex gap-2 items-center">
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                        <span>Delivered</span>
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {formatTimestamp(order.ShipmentDeliveryTime)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="customer" className="p-3 space-y-4 text-xs">
                                {/* Customer Information */}
                                <div className="space-y-1">
                                    <h3 className="mb-2 font-medium">Customer Information</h3>
                                    <Card className="p-2">
                                        <div className="space-y-1">
                                            <div className="font-medium">{order.CustomerName}</div>
                                            {order.CustomerData && order.CustomerData[0] && (
                                                <>
                                                    {order.CustomerData[0].Email && (
                                                        <div>{order.CustomerData[0].Email}</div>
                                                    )}
                                                    {order.CustomerData[0].Mobile && (
                                                        <div>{order.CustomerData[0].Mobile}</div>
                                                    )}
                                                </>
                                            )}
                                            {!order.CustomerData && order.CustomerPhone && (
                                                <div>{order.CustomerPhone}</div>
                                            )}
                                        </div>
                                    </Card>
                                </div>

                                {/* Delivery Address */}
                                {order.DeliveryAddress && (
                                    <div className="space-y-1">
                                        <h3 className="mb-2 font-medium">Delivery Address</h3>
                                        <Card className="p-2">
                                            <div className="space-y-1">
                                                <div>{order.CustomerName}</div>
                                                {order.DeliveryAddress.Town && order.DeliveryAddress.City && (
                                                    <div>
                                                        {order.DeliveryAddress.Town}, {order.DeliveryAddress.City}
                                                        {order.DeliveryAddress.Country && `, ${order.DeliveryAddress.Country}`}
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </ScreenContent>
        </Screen>
    )
}
