'use client';

import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const locationGroups = [
    {
        country: "India",
        cities: [
            { value: "mumbai", label: "Mumbai", sub: "Maharashtra" },
            { value: "delhi", label: "New Delhi", sub: "Delhi" },
            { value: "bangalore", label: "Bengaluru", sub: "Karnataka" },
            { value: "goa", label: "Goa", sub: "Goa" },
            { value: "jaipur", label: "Jaipur", sub: "Rajasthan" },
            { value: "udaipur", label: "Udaipur", sub: "Rajasthan" },
            { value: "agra", label: "Agra", sub: "Uttar Pradesh" },
            { value: "chennai", label: "Chennai", sub: "Tamil Nadu" },
            { value: "kolkata", label: "Kolkata", sub: "West Bengal" },
            { value: "hyderabad", label: "Hyderabad", sub: "Telangana" },
            { value: "kochi", label: "Kochi", sub: "Kerala" },
            { value: "rishikesh", label: "Rishikesh", sub: "Uttarakhand" },
            { value: "varanasi", label: "Varanasi", sub: "Uttar Pradesh" },
            { value: "shimla", label: "Shimla", sub: "Himachal Pradesh" },
            { value: "manali", label: "Manali", sub: "Himachal Pradesh" },
        ]
    },
    {
        country: "United Kingdom",
        cities: [
            { value: "london", label: "London", sub: "Greater London" },
            { value: "manchester", label: "Manchester", sub: "Greater Manchester" },
            { value: "edinburgh", label: "Edinburgh", sub: "Scotland" },
            { value: "liverpool", label: "Liverpool", sub: "Merseyside" },
            { value: "birmingham", label: "Birmingham", sub: "West Midlands" },
            { value: "glasgow", label: "Glasgow", sub: "Scotland" },
            { value: "bristol", label: "Bristol", sub: "South West" },
            { value: "oxford", label: "Oxford", sub: "Oxfordshire" },
            { value: "cambridge", label: "Cambridge", sub: "Cambridgeshire" },
            { value: "bath", label: "Bath", sub: "Somerset" },
            { value: "york", label: "York", sub: "North Yorkshire" },
            { value: "brighton", label: "Brighton", sub: "East Sussex" },
        ]
    },
    {
        country: "Spain",
        cities: [
            { value: "barcelona", label: "Barcelona", sub: "Catalonia" },
            { value: "madrid", label: "Madrid", sub: "Community of Madrid" },
            { value: "ibiza", label: "Ibiza", sub: "Balearic Islands" },
            { value: "seville", label: "Seville", sub: "Andalusia" },
            { value: "valencia", label: "Valencia", sub: "Valencian Community" },
            { value: "granada", label: "Granada", sub: "Andalusia" },
            { value: "malaga", label: "Malaga", sub: "Andalusia" },
            { value: "mallorca", label: "Palma", sub: "Majorca" },
            { value: "bilbao", label: "Bilbao", sub: "Basque Country" },
            { value: "san-sebastian", label: "San Sebastián", sub: "Basque Country" },
        ]
    },
    {
        country: "United States",
        cities: [
            { value: "new-york", label: "New York", sub: "New York State" },
            { value: "los-angeles", label: "Los Angeles", sub: "California" },
            { value: "miami", label: "Miami", sub: "Florida" },
            { value: "san-francisco", label: "San Francisco", sub: "California" },
            { value: "chicago", label: "Chicago", sub: "Illinois" },
            { value: "las-vegas", label: "Las Vegas", sub: "Nevada" },
            { value: "honolulu", label: "Honolulu", sub: "Hawaii" },
            { value: "austin", label: "Austin", sub: "Texas" },
            { value: "new-orleans", label: "New Orleans", sub: "Louisiana" },
            { value: "boston", label: "Boston", sub: "Massachusetts" },
            { value: "seattle", label: "Seattle", sub: "Washington" },
            { value: "san-diego", label: "San Diego", sub: "California" },
        ]
    },
    {
        country: "France",
        cities: [
            { value: "paris", label: "Paris", sub: "Île-de-France" },
            { value: "nice", label: "Nice", sub: "Provence-Alpes-Côte d'Azur" },
            { value: "lyon", label: "Lyon", sub: "Auvergne-Rhône-Alpes" },
            { value: "bordeaux", label: "Bordeaux", sub: "Nouvelle-Aquitaine" },
            { value: "marseille", label: "Marseille", sub: "Provence-Alpes-Côte d'Azur" },
            { value: "cannes", label: "Cannes", sub: "Provence-Alpes-Côte d'Azur" },
            { value: "strasbourg", label: "Strasbourg", sub: "Grand Est" },
        ]
    },
    {
        country: "Italy",
        cities: [
            { value: "rome", label: "Rome", sub: "Lazio" },
            { value: "venice", label: "Venice", sub: "Veneto" },
            { value: "florence", label: "Florence", sub: "Tuscany" },
            { value: "milan", label: "Milan", sub: "Lombardy" },
            { value: "naples", label: "Naples", sub: "Campania" },
            { value: "positano", label: "Positano", sub: "Amalfi Coast" },
            { value: "lake-como", label: "Lake Como", sub: "Lombardy" },
        ]
    },
    {
        country: "United Arab Emirates",
        cities: [
            { value: "dubai", label: "Dubai", sub: "Emirate of Dubai" },
            { value: "abu-dhabi", label: "Abu Dhabi", sub: "Emirate of Abu Dhabi" },
            { value: "sharjah", label: "Sharjah", sub: "Emirate of Sharjah" },
        ]
    },
    {
        country: "Japan",
        cities: [
            { value: "tokyo", label: "Tokyo", sub: "Kanto" },
            { value: "kyoto", label: "Kyoto", sub: "Kansai" },
            { value: "osaka", label: "Osaka", sub: "Kansai" },
        ]
    },
    {
        country: "Australia",
        cities: [
            { value: "sydney", label: "Sydney", sub: "New South Wales" },
            { value: "melbourne", label: "Melbourne", sub: "Victoria" },
            { value: "brisbane", label: "Brisbane", sub: "Queensland" },
        ]
    },
];

interface LocationSearchProps {
    value: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
}

export function LocationSearch({ value, onChange, className, placeholder }: LocationSearchProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full h-20 justify-start text-left font-normal text-xl rounded-full px-8 hover:bg-white/5 text-white placeholder:text-white/60 pl-16 relative", className)}
                >
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70">
                        <MapPin className="w-6 h-6" />
                    </div>
                    {value
                        ? locationGroups.flatMap(g => g.cities).find((c) => c.value === value)?.label + ', ' + locationGroups.find(g => g.cities.some(c => c.value === value))?.country
                        : placeholder || "Where are you going?"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-[#0f172a] border-white/10 text-white shadow-2xl" align="start">
                <Command className="bg-transparent text-white">
                    <CommandInput placeholder="Search global destinations..." className="text-white placeholder:text-slate-500 border-b border-white/10" />
                    <CommandList className="max-h-[300px] custom-scrollbar">
                        <CommandEmpty className="py-6 text-center text-sm text-slate-500">No destinations found.</CommandEmpty>
                        {locationGroups.map((group) => (
                            <CommandGroup key={group.country} heading={group.country} className="text-slate-500 font-bold">
                                {group.cities.map((city) => (
                                    <CommandItem
                                        key={city.value}
                                        value={city.value}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                        className="flex items-center gap-3 py-3 cursor-pointer aria-selected:bg-blue-600/20 aria-selected:text-white"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-400 group-aria-selected:bg-blue-600 group-aria-selected:text-white transition-colors">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white text-base">{city.label}</span>
                                            <span className="text-xs text-slate-500 font-normal">{city.sub}, {group.country}</span>
                                        </div>
                                        {value === city.value && <Check className="ml-auto h-4 w-4 text-blue-500" />}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
