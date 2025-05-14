"use client"

import React from "react"
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Screen, ScreenHeader, ScreenTitle, ScreenContent, LoadingWrapper } from "@/components/ui/screen"
import { useStore } from "@/contexts/store-context"
import { getCustomers, Customer } from "@/api/tsoft"
import toast from "react-hot-toast"
import { useGrispi } from "@/contexts/grispi-context"

export const SearchCustomersScreen: React.FC = () => {
    const { setScreen, screenParams } = useStore().screen;
    const { bundle } = useGrispi();

    const [searchQuery, setSearchQuery] = React.useState(screenParams?.previousSearchQuery || "")
    const [isLoading, setIsLoading] = React.useState(false)
    const [customers, setCustomers] = React.useState<Customer[]>([])
    const [hasSearched, setHasSearched] = React.useState(!!screenParams?.preserveState)
    const [totalCustomers, setTotalCustomers] = React.useState(screenParams?.totalCustomers || 0)

    // Function to perform the search
    const performSearch = React.useCallback(async (query: string) => {
        if (!query.trim()) return;

        setIsLoading(true);
        setHasSearched(true);

        try {
            const response = await getCustomers(query, bundle?.context.token || "");

            if (response.data.success) {
                setCustomers(response.data.data ?? []);
                setTotalCustomers(parseInt(response.data.summary.totalRecordCount));
            } else {
                toast.error("Failed to find customers. Please try again.");
                setCustomers([]);
                setTotalCustomers(0);
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Failed to connect to the server. Please try again.");
            setCustomers([]);
            setTotalCustomers(0);
        } finally {
            setIsLoading(false);
        }
    }, [bundle?.context.token]);

    // Handle form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchQuery);
    }

    // Automatically search with requester's phone when component mounts
    React.useEffect(() => {
        // Skip auto-search if returning from customer details with preserved state
        if (screenParams?.preserveState) {
            if (screenParams?.customers && screenParams?.totalCustomers) {
                setCustomers(screenParams.customers);
                setTotalCustomers(screenParams.totalCustomers);
            }
            return;
        }

        const requesterPhone = bundle?.context.requester?.phone;
        if (requesterPhone) {
            setSearchQuery(requesterPhone);
            performSearch(requesterPhone);
        }
    }, [bundle?.context.requester?.phone, performSearch, screenParams]);

    const handleCustomerSelect = (customer: Customer) => {
        setScreen("customer-details", {
            customer,
            previousSearchQuery: searchQuery,
            customers,
            totalCustomers
        });
    }

    return (
        <Screen>
            <ScreenHeader>
                <ScreenTitle>Search Customers</ScreenTitle>
            </ScreenHeader>
            <ScreenContent className="mt-4 space-y-6">
                <Card className="rounded-none border-0">
                    <CardHeader className="pb-2">
                        <h2 className="text-lg font-medium">Search Customers</h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, phone, email or code"
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Searching..." : "Search"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                {hasSearched && (
                    <Card className="rounded-none border-0">
                        <CardContent className="p-3">
                            <LoadingWrapper loading={isLoading}>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        {totalCustomers > 0
                                            ? `Found ${totalCustomers} customer${totalCustomers > 1 ? 's' : ''}`
                                            : "No customers found"}
                                    </h3>
                                    {customers.length > 0 && (
                                        <div className="space-y-2">
                                            {customers.map((customer) => (
                                                <Card
                                                    key={customer.CustomerId}
                                                    className="p-3 cursor-pointer hover:bg-muted/50"
                                                    onClick={() => handleCustomerSelect(customer)}
                                                >
                                                    <div className="flex gap-3 items-center">
                                                        <div className="flex justify-center items-center bg-purple-100 rounded-full size-10">
                                                            <span className="font-medium text-purple-600">
                                                                {`${customer.Name.charAt(0)}${customer.Surname ? customer.Surname.charAt(0) : ''}`}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{`${customer.Name} ${customer.Surname || ''}`}</p>
                                                            <div className="flex flex-col">
                                                                {customer.Email && (
                                                                    <p className="text-sm text-muted-foreground">{customer.Email}</p>
                                                                )}
                                                                {customer.Mobile && (
                                                                    <p className="text-sm text-muted-foreground">{customer.Mobile}</p>
                                                                )}
                                                                <p className="text-xs text-muted-foreground">{customer.CustomerCode}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </LoadingWrapper>
                        </CardContent>
                    </Card>
                )}
            </ScreenContent>
        </Screen>
    )
}
