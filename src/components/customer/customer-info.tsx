import React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { CustomerAvatar } from "./customer-avatar"
import { getCustomerDetailsUrl } from "@/api/tsoft"

type CustomerInfoProps = {
    customer: any
    tSoftSiteUrl?: string
    customerId?: string
    className?: string
}

export const CustomerInfo: React.FC<CustomerInfoProps> = ({
    customer,
    tSoftSiteUrl,
    customerId,
    className = ""
}) => {
    if (!customer) return null;

    return (
        <Card className={`mb-3 rounded-none border-0 ${className}`}>
            <CardContent className="p-3 space-y-3">
                <div className="flex gap-3 items-center">
                    <CustomerAvatar
                        name={customer.Name}
                        surname={customer.Surname}
                    />
                    <div>
                        <h2 className="text-base font-medium truncate">
                            {`${customer.Name} ${customer.Surname || ''}`}
                        </h2>
                        <Badge variant="outline" className="text-xs font-normal">
                            {customer.CustomerCode || 'Bilinmiyor'}
                        </Badge>
                    </div>
                </div>
                <div className="space-y-2">
                    {customer.Email && (
                        <div>
                            <div className="text-xs">E-Posta</div>
                            <div className="text-sm truncate text-muted-foreground">{customer.Email}</div>
                        </div>
                    )}
                    {customer.Mobile && (
                        <div>
                            <div className="text-xs">Telefon</div>
                            <div className="text-sm truncate text-muted-foreground">{customer.Mobile}</div>
                        </div>
                    )}
                </div>
                {tSoftSiteUrl && (
                    <a
                        href={getCustomerDetailsUrl(tSoftSiteUrl, customerId || customer.CustomerId || "")}
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
    )
} 