import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

type CustomerAvatarProps = {
    name?: string
    surname?: string
    size?: "sm" | "md" | "lg"
    className?: string
}

export const CustomerAvatar: React.FC<CustomerAvatarProps> = ({
    name = "",
    surname = "",
    size = "md",
    className = "",
}) => {
    const sizeClasses = {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
    }

    return (
        <Avatar className={`border ${sizeClasses[size]} ${className}`}>
            <AvatarImage src="/placeholder.svg" alt={`${name} ${surname}`} />
            <AvatarFallback className="text-purple-600 bg-purple-100">
                {getInitials(name, surname)}
            </AvatarFallback>
        </Avatar>
    )
} 