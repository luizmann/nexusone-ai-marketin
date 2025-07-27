import React, { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

interface CreditContextType {
  credits: number
  videoCredits: number
  useCredits: (amount: number) => boolean
  useVideoCredits: (amount: number) => boolean
  hasCredits: (amount: number) => boolean
  hasVideoCredits: (amount: number) => boolean
  getCreditCost: (action: string) => number
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export const useCredits = () => {
  const context = useContext(CreditContext)
  if (!context) {
    throw new Error('useCredits must be used within a CreditProvider')
  }
  return context
}

const CREDIT_COSTS = {
  'campaign-generation': 100,
  'video-creation': 50,
  'sales-page': 30,
  'product-import': 10,
  'whatsapp-message': 5,
  'facebook-ads': 40,
  'copy-generation': 20,
  'image-generation': 15,
  'voice-generation': 25,
  'competitor-analysis': 35
}

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth()

  const credits = user?.credits || 0
  const videoCredits = user?.videoCredits || 0

  const useCredits = (amount: number): boolean => {
    if (credits >= amount) {
      updateProfile({ credits: credits - amount })
      return true
    }
    return false
  }

  const useVideoCredits = (amount: number): boolean => {
    if (videoCredits >= amount) {
      updateProfile({ videoCredits: videoCredits - amount })
      return true
    }
    return false
  }

  const hasCredits = (amount: number): boolean => {
    return credits >= amount
  }

  const hasVideoCredits = (amount: number): boolean => {
    return videoCredits >= amount
  }

  const getCreditCost = (action: string): number => {
    return CREDIT_COSTS[action as keyof typeof CREDIT_COSTS] || 10
  }

  return (
    <CreditContext.Provider value={{
      credits,
      videoCredits,
      useCredits,
      useVideoCredits,
      hasCredits,
      hasVideoCredits,
      getCreditCost
    }}>
      {children}
    </CreditContext.Provider>
  )
}