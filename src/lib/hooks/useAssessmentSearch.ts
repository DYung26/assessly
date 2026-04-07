import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Assessment } from "@/types";

interface UseAssessmentSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

interface UseAssessmentSearchResult {
  data: Assessment[];
  isLoading: boolean;
  error: Error | null;
  hasSearched: boolean;
}

export function useAssessmentSearch(
  query: string,
  options: UseAssessmentSearchOptions = {}
): UseAssessmentSearchResult {
  const { debounceMs = 300, minQueryLength = 1 } = options;
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Clear timeout if query changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If query is empty, immediately clear debounced query and mark as not searched
    if (!query.trim()) {
      setDebouncedQuery("");
      setHasSearched(false);
      return;
    }

    // Set up debounce
    timeoutRef.current = setTimeout(() => {
      if (query.trim().length >= minQueryLength) {
        setDebouncedQuery(query.trim());
        setHasSearched(true);
      }
    }, debounceMs);
  }, [query, debounceMs, minQueryLength]);

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["assessmentSearch", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) {
        return [];
      }
      const res = await axiosInstance.get("/assessment/search", {
        params: {
          q: debouncedQuery,
          limit: 20,
        },
      });
      return res.data.data as Assessment[];
    },
    enabled: !!debouncedQuery,
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    hasSearched,
  };
}
