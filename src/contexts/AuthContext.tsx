import React, { createContext, useContext, useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

interface AuthUser {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'premium'
  credits: number
  videoCredits: number
  createdAt: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<AuthUser>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useKV<AuthUser | null>('user-profile', null)
  const [users, setUsers] = useKV<AuthUser[]>('users-database', [])
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const existingUser = users.find(u => u.email === email)
      if (existingUser) {
        setUser(existingUser)
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const existingUser = users.find(u => u.email === email)
      if (existingUser) {
        return false
      }

      const newUser: AuthUser = {
        id: Date.now().toString(),
        email,
        name,
        plan: 'free',
        credits: 50,
        videoCredits: 1,
        createdAt: new Date().toISOString()
      }

      setUsers(prev => [...prev, newUser])
      setUser(newUser)
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = (updates: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u))
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}