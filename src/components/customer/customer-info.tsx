import React, { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { CustomerAvatar } from "./customer-avatar"
import { getCustomerDetailsUrl } from "@/api/tsoft"
import { Button } from "../ui/button"
import { getIframeContext } from "@/lib/utils"
import toast from "react-hot-toast"

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
    const [loading, setLoading] = useState<boolean>(false);

    const sendCustomerInfoToGrispi = useCallback(() => {
        const context = getIframeContext()
        if (!context) return;

        setLoading(true);

        window.parent.postMessage({
            ...context,
            type: 'com.grispi.fn.updateRequester',
            data: {
                fullName: `${customer.Name} ${customer.Surname}`,
                email: customer.Email,
                phone: customer.Mobile,
            }
        })
    }, [customer])

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
                toast.success("Müşteri bilgileri Grispi'ye gönderildi");
            }, 1000);
        }
    }, [loading]);

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
                <Button variant="outline" className="w-full" onClick={sendCustomerInfoToGrispi} disabled={loading}>
                    Müşteri Bilgilerini Grispi'ye Gönder
                </Button>
            </CardContent>
        </Card>
    )
} 