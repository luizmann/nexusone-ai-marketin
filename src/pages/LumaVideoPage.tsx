import React from 'react'
import { LumaVideoCreator } from '../components/LumaVideoCreator'
import { useLanguage } from '../contexts/CleanLanguageContext'

export function LumaVideoPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <LumaVideoCreator />
    </div>
  )
}