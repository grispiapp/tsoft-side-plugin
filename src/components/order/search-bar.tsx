import React from "react"
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

type SearchBarProps = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    cardClassName?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = "Ara",
    className = "",
    cardClassName = ""
}) => {
    return (
        <Card className={`mb-3 rounded-none border-0 ${cardClassName}`}>
            <CardContent className="p-3">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={placeholder}
                        className={`pl-8 h-9 ${className}`}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    )
} 