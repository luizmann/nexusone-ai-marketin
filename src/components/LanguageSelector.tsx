import React from 'react'
import { Globe } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useLanguage, languages, Language } from '../contexts/CleanLanguageContext'

export function LanguageSelector() {
  const { language, setLanguage, isRTL } = useLanguage()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Globe size={16} />
          <span className="hidden sm:inline">
            {languages[language].flag} {languages[language].name}
          </span>
          <span className="sm:hidden">
            {languages[language].flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-40">
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as Language)}
            className={`gap-2 ${lang.dir === 'rtl' ? 'flex-row-reverse text-right' : ''} ${
              language === code ? 'bg-accent' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}