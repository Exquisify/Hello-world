"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User as UserType } from "@/types/search"

interface UserAutocompleteProps {
  selectedUsers?: UserType[]
  onUsersChange?: (users: UserType[]) => void
  placeholder?: string
  className?: string
}

export function UserAutocomplete({
  selectedUsers = [],
  onUsersChange,
  placeholder = "Search authors...",
  className,
}: UserAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [users, setUsers] = React.useState<UserType[]>([])
  const [loading, setLoading] = React.useState(false)

  // Debounced search
  React.useEffect(() => {
    if (!searchQuery) {
      setUsers([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        }
      } catch (error) {
        console.error("Failed to search users:", error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSelectUser = (user: UserType) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      onUsersChange?.([...selectedUsers, user])
    }
    setOpen(false)
    setSearchQuery("")
  }

  const handleRemoveUser = (userId: string) => {
    onUsersChange?.(selectedUsers.filter((u) => u.id !== userId))
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            <span className="truncate">
              {selectedUsers.length > 0
                ? `${selectedUsers.length} author${selectedUsers.length > 1 ? "s" : ""} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search users..." value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
              <CommandEmpty>{loading ? "Searching..." : "No users found."}</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem key={user.id} value={user.id} onSelect={() => handleSelectUser(user)}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedUsers.find((u) => u.id === user.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-2 w-2" />
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveUser(user.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
