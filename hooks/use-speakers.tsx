'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { Speaker } from '@/models/speaker'

// Define the context type
type SpeakerContextType = {
  speakers: Speaker[]
  selectedSpeaker: Speaker | null
  setSelectedSpeaker: (speaker: Speaker | null) => void
}

const SpeakerContext = createContext<SpeakerContextType | undefined>(undefined)

// Fetch function for speakers
const fetchSpeakers = async (): Promise<Speaker[]> => {
  const response = await fetch('/api/speakers')
  if (!response.ok) {
    throw new Error('Error fetching speakers')
  }
  return response.json()
}

// Provider component
export const SpeakerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    data: speakers = [] as Speaker[],
    isLoading,
    isError,
  } = useQuery({ queryKey: ['speakers'], queryFn: fetchSpeakers })

  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)

  useEffect(() => {
    if (speakers?.length > 0 && !selectedSpeaker) {
      setSelectedSpeaker(speakers[0])
    }
  }, [selectedSpeaker, speakers])

  if (isLoading) return <div>Loading speakers...</div>
  if (isError) return <div>Error loading speakers</div>

  return (
    <SpeakerContext.Provider
      value={{ speakers, selectedSpeaker, setSelectedSpeaker }}
    >
      {children}
    </SpeakerContext.Provider>
  )
}

// Hook for consuming the SpeakerContext
export const useSpeakerContext = (): SpeakerContextType => {
  const context = useContext(SpeakerContext)
  if (!context) {
    throw new Error('useSpeakerContext must be used within a SpeakerProvider')
  }
  return context
}