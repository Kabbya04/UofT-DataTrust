"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQueryState] = useState("")

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQueryState("")
  }, [])

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}