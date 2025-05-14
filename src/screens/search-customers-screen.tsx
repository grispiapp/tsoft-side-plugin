"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Screen, ScreenHeader, ScreenTitle, ScreenContent, LoadingWrapper } from "@/components/ui/screen"
import { CustomerAvatar } from "@/components/customer/customer-avatar"
import { useCustomerSearch } from "@/hooks/use-customer-search"
import { useNavigation } from "@/hooks/use-navigation"

export const SearchCustomersScreen: React.FC = () => {
    const { screenParams, navigateToCustomerDetails } = useNavigation();
    const {
        searchQuery,
        setSearchQuery,
        isLoading,
        customers,
        hasSearched,
        totalCustomers,
        performSearch
    } = useCustomerSearch(
        screenParams?.previousSearchQuery,
        !!screenParams?.preserveState,
        screenParams?.customers,
        screenParams?.totalCustomers
    );

    // Handle form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchQuery);
    }

    return (
        <Screen>
            <ScreenHeader>
                <ScreenTitle>Müşteri Ara</ScreenTitle>
            </ScreenHeader>
            <ScreenContent className="mt-4 space-y-6">
                <Card className="rounded-none border-0">
                    <CardHeader className="pb-2">
                        <h2 className="text-lg font-medium">Müşteri Ara</h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="İsim, telefon, e-posta veya kod ile ara"
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Aranıyor..." : "Ara"}
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
                                            ? `${totalCustomers} müşteri bulundu${totalCustomers > 1 ? '' : ''}`
                                            : "Müşteri bulunamadı"}
                                    </h3>
                                    {customers.length > 0 && (
                                        <div className="space-y-2">
                                            {customers.map((customer) => (
                                                <Card
                                                    key={customer.CustomerId}
                                                    className="p-3 cursor-pointer hover:bg-muted/50"
                                                    onClick={() => navigateToCustomerDetails(customer, searchQuery, customers, totalCustomers)}
                                                >
                                                    <div className="flex gap-3 items-center">
                                                        <CustomerAvatar
                                                            name={customer.Name}
                                                            surname={customer.Surname}
                                                            size="md"
                                                            className="bg-purple-100"
                                                        />
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
