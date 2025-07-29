import { useState, useEffect } from 'react'

/**
 * Custom hook to manage persistent state using localStorage
 * Replacement for @github/spark useKV hook for production deployment
 */
export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state from localStorage or default
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    
    try {
      const stored = localStorage.getItem(`nexus-${key}`)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  // Save to localStorage when value changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(`nexus-${key}`, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error saving to localStorage key "${key}":`, error)
    }
  }, [key, value])

  // Update function that supports both direct values and functions
  const updateValue = (newValue: T | ((prev: T) => T)) => {
    if (typeof newValue === 'function') {
      setValue(prev => {
        const updated = (newValue as (prev: T) => T)(prev)
        return updated
      })
    } else {
      setValue(newValue)
    }
  }

  // Delete function to remove from localStorage
  const deleteValue = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`nexus-${key}`)
    }
    setValue(defaultValue)
  }

  return [value, updateValue, deleteValue]
}

/**
 * Global spark object for compatibility with existing code
 */
declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
      user: () => Promise<{ avatarUrl: string; email: string; id: string; isOwner: boolean; login: string }>
      kv: {
        keys: () => Promise<string[]>
        get: <T>(key: string) => Promise<T | undefined>
        set: <T>(key: string, value: T) => Promise<void>
        delete: (key: string) => Promise<void>
      }
    }
  }
}

// Mock spark object for production compatibility
if (typeof window !== 'undefined' && !window.spark) {
  window.spark = {
    llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => {
      return strings.reduce((acc, str, i) => {
        return acc + str + (values[i] || '')
      }, '')
    },
    
    llm: async (prompt: string, modelName = 'gpt-4o', jsonMode = false) => {
      // In production, this would call your OpenAI API
      console.log('LLM Call:', { prompt, modelName, jsonMode })
      return 'AI response would be here'
    },
    
    user: async () => {
      // Mock user data
      return {
        avatarUrl: 'https://github.com/user.png',
        email: 'user@nexusone.ai',
        id: 'user-123',
        isOwner: true,
        login: 'nexusone-user'
      }
    },
    
    kv: {
      keys: async () => {
        const keys: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith('nexus-')) {
            keys.push(key.replace('nexus-', ''))
          }
        }
        return keys
      },
      
      get: async <T>(key: string): Promise<T | undefined> => {
        try {
          const stored = localStorage.getItem(`nexus-${key}`)
          return stored ? JSON.parse(stored) : undefined
        } catch {
          return undefined
        }
      },
      
      set: async <T>(key: string, value: T): Promise<void> => {
        localStorage.setItem(`nexus-${key}`, JSON.stringify(value))
      },
      
      delete: async (key: string): Promise<void> => {
        localStorage.removeItem(`nexus-${key}`)
      }
    }
  }
}

export default { useKV }