"use client"

import * as React from "react"
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select"
import { SelectValue } from "@radix-ui/react-select"

interface DatePickerProps {
    value?: string;
    onChange?: (date: string) => void;
    startYear?: number;
    endYear?: number;
}

export function DatePickerDemo({
    value,
    onChange,
    startYear = getYear(new Date()) - 50,
    endYear = getYear(new Date()),
}: DatePickerProps) {
    const parsedDate = value ? new Date(value) : new Date()
    const [date, setDate] = React.useState<Date>(parsedDate)

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

    const toLocalDateString = (date: Date): string => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
    }

    const handleMonthChange = (month: string) => {
        const newDate = setMonth(date, months.indexOf(month))
        setDate(newDate)
        onChange?.(toLocalDateString(newDate))
    }

    const handleYearChange = (year: string) => {
        const newDate = setYear(date, parseInt(year))
        setDate(newDate)
        onChange?.(toLocalDateString(newDate))
    }

    const handleSelect = (selectDate: Date | undefined) => {
        const finalDate = selectDate ?? new Date()
        setDate(finalDate)
        onChange?.(toLocalDateString(finalDate))
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("w-full justify-between text-left font-normal", !value && "text-muted-foreground")}
                >
                    {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="mr-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="flex justify-between p-2">
                    <Select onValueChange={handleMonthChange} value={months[getMonth(date)]}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month, index) => (
                                <SelectItem key={index} value={month}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={handleYearChange} value={getYear(date).toString()}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    month={date}
                    onMonthChange={setDate}
                />
            </PopoverContent>
        </Popover>
    )
}
