"use client"

import React from "react"
import { ExternalLinkIcon } from '@radix-ui/react-icons'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Screen, ScreenHeader, ScreenTitle, ScreenContent } from "@/components/ui/screen"
import { getOrderDetailsUrl, Order } from "@/api/tsoft"
import { cn, formatCurrency, formatDate, formatTimestamp } from "@/lib/utils"
import { useNavigation } from "@/hooks/use-navigation"

export const OrderDetailsScreen: React.FC = () => {
    const { screenParams, navigateBackToCustomerDetails } = useNavigation();

    const order = screenParams?.order as Order;
    const tSoftSiteUrl = screenParams?.tSoftSiteUrl as string | undefined;

    // Calculate subtotal
    const calculateSubtotal = () => {
        if (!order?.OrderDetails) return "0";

        return order.OrderDetails.reduce((sum: number, item: any) => {
            const price = parseFloat(item.SellingPrice) || 0;
            const quantity = parseInt(item.Quantity) || 0;
            return sum + (price * quantity);
        }, 0).toFixed(2);
    };

    if (!order) {
        return (
            <Screen>
                <ScreenHeader onBack={navigateBackToCustomerDetails}>
                    <ScreenTitle>Sipariş Detayları</ScreenTitle>
                </ScreenHeader>
                <ScreenContent className="mt-2">
                    <div className="p-4 text-center text-muted-foreground">
                        Sipariş bilgileri mevcut değil
                    </div>
                </ScreenContent>
            </Screen>
        );
    }

    return (
        <Screen>
            <ScreenHeader onBack={navigateBackToCustomerDetails}>
                <ScreenTitle>Sipariş Detayları</ScreenTitle>
            </ScreenHeader>
            <ScreenContent className="mt-2">
                <Card className="mb-3 rounded-none border-0">
                    <CardContent className="p-3">
                        <div className="flex gap-2 items-center">
                            <h2 className="text-base font-medium">{order.OrderCode}</h2>
                            <Badge variant="secondary">{order.OrderStatus}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Oluşturulma {formatDate(order.OrderDate)}
                        </p>
                        {tSoftSiteUrl && (
                            <a
                                href={getOrderDetailsUrl(tSoftSiteUrl, order.OrderId)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-1 items-center mt-2 text-sm text-muted-foreground/70 hover:text-muted-foreground"
                            >
                                <span>TSoft'ta Görüntüle</span>
                                <ExternalLinkIcon className="size-3.5" />
                            </a>
                        )}
                    </CardContent>
                </Card>

                <Card className="rounded-none border-0">
                    <CardContent className="p-0">
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid grid-cols-2 w-full h-9 rounded-none">
                                <TabsTrigger value="details" className="text-xs">
                                    Sipariş Detayları
                                </TabsTrigger>
                                <TabsTrigger value="customer" className="text-xs">
                                    Müşteri Bilgileri
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="p-3 space-y-4 text-xs">
                                {/* Order Items */}
                                <div className="space-y-1">
                                    <h3 className="mb-2 font-medium">Ürünler</h3>
                                    {order.OrderDetails && order.OrderDetails.map((item) => (
                                        <Card key={item.OrderProductId} className="p-2">
                                            <div className="flex justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.ProductName}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Kod: {item.ProductCode}
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
                                        <h3 className="mb-2 font-medium">Kargo Bilgileri</h3>
                                        <Card className="p-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <div className="text-muted-foreground">Kargo Firması:</div>
                                                    <div>{order.ShipmentDetail[0]?.CargoCompany || order.Cargo || "Belirtilmemiş"}</div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground">Takip Numarası:</div>
                                                    <div className="truncate">{order.ShipmentDetail[0]?.CargoTrackingNo || "Mevcut değil"}</div>
                                                </div>
                                                {order.ShipmentDetail[0]?.CargoTrackingUrl && (
                                                    <div className="col-span-2">
                                                        <a
                                                            href={order.ShipmentDetail[0].CargoTrackingUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex gap-1 items-center text-xs text-primary"
                                                        >
                                                            <span>Kargo Takip</span>
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
                                    <h3 className="mb-2 font-medium">Ödeme Detayları</h3>
                                    <Card className="p-2">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between">
                                                <span>Ödeme Yöntemi:</span>
                                                <span>{order.PaymentType || order.PaymentData?.Name || "Belirtilmemiş"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Ara Toplam:</span>
                                                <span>{formatCurrency(order.OrderSubtotal || calculateSubtotal())}</span>
                                            </div>
                                            {(order.DiscountTotal && parseFloat(order.DiscountTotal) > 0) && (
                                                <div className="flex justify-between">
                                                    <span>İndirim:</span>
                                                    <span>-{formatCurrency(order.DiscountTotal)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between pt-1 font-medium border-t">
                                                <span>Toplam:</span>
                                                <span>{formatCurrency(order.OrderTotalPrice)}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Order Timeline */}
                                <div className="space-y-1">
                                    <h3 className="mb-2 font-medium">Zaman Çizelgesi</h3>
                                    <Card className="p-2">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <div className="flex gap-2 items-center">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span>Sipariş Verildi</span>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {formatDate(order.OrderDate)}
                                                </div>
                                            </div>

                                            {order.ShipmentTime && (
                                                <div className={cn("flex justify-between", { "opacity-50": order.ShipmentTime === '0' })}>
                                                    <div className="flex gap-2 items-center">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        <span>Kargoya Verildi</span>
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {formatTimestamp(order.ShipmentTime)}
                                                    </div>
                                                </div>
                                            )}

                                            {order.ShipmentDeliveryTime && (
                                                <div className={cn("flex justify-between", { "opacity-50": order.ShipmentDeliveryTime === '0' })}>
                                                    <div className="flex gap-2 items-center">
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                        <span>Teslim Edildi</span>
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
                                    <h3 className="mb-2 font-medium">Müşteri Bilgileri</h3>
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
                                        <h3 className="mb-2 font-medium">Teslimat Adresi</h3>
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
