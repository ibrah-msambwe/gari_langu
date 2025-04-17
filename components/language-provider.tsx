"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useUserStore } from "@/lib/user-store"
import { useAuthStore } from "@/lib/auth-store"

type LanguageContextType = {
  language: "en" | "sw"
  setLanguage: (language: "en" | "sw") => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.overview": "Overview",
    "dashboard.cars": "Cars",
    "dashboard.services": "Services",
    "dashboard.reminders": "Reminders",
    "dashboard.settings": "Settings",
    "dashboard.profile": "Profile",

    // Cars
    "cars.title": "My Cars",
    "cars.subtitle": "Manage your registered vehicles",
    "cars.add": "Add Car",
    "cars.edit": "Edit Car",
    "cars.delete": "Delete Car",
    "cars.view": "View",
    "cars.make": "Make",
    "cars.model": "Model",
    "cars.year": "Year",
    "cars.license": "License Plate",
    "cars.color": "Color",
    "cars.vin": "VIN",
    "cars.description": "Description",
    "cars.image": "Vehicle Image",
    "cars.save": "Save Car",
    "cars.cancel": "Cancel",
    "cars.saving": "Saving...",
    "cars.empty.title": "No cars registered",
    "cars.empty.subtitle": "You haven't added any vehicles to your account yet.",
    "cars.empty.action": "Add Your First Car",
    "cars.delete.confirm": "Are you sure you want to delete this car?",
    "cars.delete.description":
      "This action cannot be undone. This will permanently delete the vehicle and all associated service records.",

    // Services
    "services.title": "Service Records",
    "services.add": "Add Service Record",
    "services.history": "View Service History",
    "services.last": "Last Service",
    "services.next": "Next Service Due",
    "services.no_record": "No record",
    "services.not_scheduled": "Not scheduled",
    "services.date": "Date",
    "services.type": "Service Type",
    "services.description": "Description",
    "services.mileage": "Mileage",
    "services.cost": "Cost",
    "services.provider": "Service Provider",
    "services.notes": "Notes",
    "services.save": "Save Record",
    "services.empty.title": "No service records",
    "services.empty.subtitle": "You haven't added any service records for this vehicle yet.",
    "services.empty.action": "Add First Service Record",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account preferences",
    "settings.profile": "Profile Settings",
    "settings.language": "Language Settings",
    "settings.name": "Full Name",
    "settings.email": "Email Address",
    "settings.phone": "Phone Number",
    "settings.language.select": "Select Language",
    "settings.language.en": "English",
    "settings.language.sw": "Swahili",
    "settings.save": "Save Changes",
    "settings.saving": "Saving...",

    // Common
    "common.loading": "Loading...",
    "common.please_wait": "Please wait",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
  },
  sw: {
    // Dashboard
    "dashboard.title": "Dashibodi",
    "dashboard.welcome": "Karibu tena",
    "dashboard.overview": "Muhtasari",
    "dashboard.cars": "Magari",
    "dashboard.services": "Huduma",
    "dashboard.reminders": "Vikumbusho",
    "dashboard.settings": "Mipangilio",
    "dashboard.profile": "Wasifu",

    // Cars
    "cars.title": "Magari Yangu",
    "cars.subtitle": "Simamia magari yako yaliyosajiliwa",
    "cars.add": "Ongeza Gari",
    "cars.edit": "Hariri Gari",
    "cars.delete": "Futa Gari",
    "cars.view": "Tazama",
    "cars.make": "Mtengenezaji",
    "cars.model": "Modeli",
    "cars.year": "Mwaka",
    "cars.license": "Namba ya Usajili",
    "cars.color": "Rangi",
    "cars.vin": "Namba ya VIN",
    "cars.description": "Maelezo",
    "cars.image": "Picha ya Gari",
    "cars.save": "Hifadhi Gari",
    "cars.cancel": "Ghairi",
    "cars.saving": "Inahifadhi...",
    "cars.empty.title": "Hakuna magari yaliyosajiliwa",
    "cars.empty.subtitle": "Bado hujaongeza magari yoyote kwenye akaunti yako.",
    "cars.empty.action": "Ongeza Gari Lako la Kwanza",
    "cars.delete.confirm": "Una uhakika unataka kufuta gari hili?",
    "cars.delete.description":
      "Kitendo hiki hakiwezi kutenduliwa. Kitafuta gari hili na rekodi zote za huduma zinazohusiana.",

    // Services
    "services.title": "Rekodi za Huduma",
    "services.add": "Ongeza Rekodi ya Huduma",
    "services.history": "Tazama Historia ya Huduma",
    "services.last": "Huduma ya Mwisho",
    "services.next": "Huduma Ijayo",
    "services.no_record": "Hakuna rekodi",
    "services.not_scheduled": "Haijapangwa",
    "services.date": "Tarehe",
    "services.type": "Aina ya Huduma",
    "services.description": "Maelezo",
    "services.mileage": "Kilomita",
    "services.cost": "Gharama",
    "services.provider": "Mtoa Huduma",
    "services.notes": "Maelezo ya Ziada",
    "services.save": "Hifadhi Rekodi",
    "services.empty.title": "Hakuna rekodi za huduma",
    "services.empty.subtitle": "Bado hujaongeza rekodi zozote za huduma kwa gari hili.",
    "services.empty.action": "Ongeza Rekodi ya Kwanza ya Huduma",

    // Settings
    "settings.title": "Mipangilio",
    "settings.subtitle": "Simamia mapendeleo ya akaunti yako",
    "settings.profile": "Mipangilio ya Wasifu",
    "settings.language": "Mipangilio ya Lugha",
    "settings.name": "Jina Kamili",
    "settings.email": "Anwani ya Barua Pepe",
    "settings.phone": "Namba ya Simu",
    "settings.language.select": "Chagua Lugha",
    "settings.language.en": "Kiingereza",
    "settings.language.sw": "Kiswahili",
    "settings.save": "Hifadhi Mabadiliko",
    "settings.saving": "Inahifadhi...",

    // Common
    "common.loading": "Inapakia...",
    "common.please_wait": "Tafadhali subiri",
    "common.save": "Hifadhi",
    "common.cancel": "Ghairi",
    "common.delete": "Futa",
    "common.edit": "Hariri",
    "common.view": "Tazama",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { preferences, updatePreferences } = useUserStore()
  const { currentUser, updateCurrentUser } = useAuthStore()
  const [language, setLanguageState] = useState<"en" | "sw">(
    // Use currentUser.language if available, otherwise use preferences.language, default to "en"
    currentUser?.language || preferences?.language || "en",
  )

  useEffect(() => {
    // Update language when user preference or current user changes
    if (currentUser?.language) {
      setLanguageState(currentUser.language)
    } else if (preferences?.language) {
      setLanguageState(preferences.language)
    }
  }, [currentUser?.language, preferences?.language])

  const setLanguage = (newLanguage: "en" | "sw") => {
    setLanguageState(newLanguage)

    // Update in both stores
    updatePreferences({ language: newLanguage })

    if (currentUser) {
      updateCurrentUser({ language: newLanguage })
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
