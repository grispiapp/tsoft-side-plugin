import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Order } from "@/api/tsoft"

type OrderCardProps = {
    order: Order
    onClick?: () => void
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
    return (
        <Card
            className="p-3 cursor-pointer hover:bg-muted/50"
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-medium text-primary">{order.OrderCode}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(order.OrderDate)}</div>
                </div>
                <div className="text-right">
                    <div className="font-medium">{formatCurrency(order.OrderTotalPrice)}</div>
                    <Badge
                        variant="secondary"
                        className="mt-1 text-xs font-normal"
                    >
                        {order.OrderStatus}
                    </Badge>
                </div>
            </div>
        </Card>
    )
} 