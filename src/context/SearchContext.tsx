"use client";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

// Initially I was only storing id's in the context but then I realized that I need to store the names also
// so I can display them in the search bar I am not sure if this is the best approach but it works
interface SearchContextValue {
  selectedValues: number[];
  setSelectedValues: Dispatch<SetStateAction<number[]>>;
  selectedNames: string[];
  setSelectedNames: Dispatch<SetStateAction<string[]>>;
}

const defaultContextValue: SearchContextValue = {
  selectedValues: [],
  setSelectedValues: () => {},
  selectedNames: [],
  setSelectedNames: () => {},
};

const SearchContext = createContext<SearchContextValue>(defaultContextValue);

const SearchProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const [selectedValues, setSelectedValues] = useState<number[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      selectedValues,
      setSelectedValues,
      selectedNames,
      setSelectedNames,
    }),
    [selectedValues, selectedNames]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchContext");
  }
  return context;
}

export { SearchContext, SearchProvider, useSearchContext };
