import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

interface UserFile {
  id: string;
  filename: string;
  filetype: string;
  uploaded_at: string;
  url?: string;
  download_url: string;
}

interface FilesResponse {
  data: {
    items: UserFile[];
    has_more: boolean;
    cursor: string;
  };
}

interface UseFilesPaginatedOptions {
  limit?: number;
}

export function useFilesPaginated(options: UseFilesPaginatedOptions = {}) {
  const { limit = 10 } = options;

  return useInfiniteQuery({
    queryKey: ["user-files-paginated"],
    queryFn: async ({ pageParam }: { pageParam?: string | undefined }) => {
      const params: Record<string, string | number> = { limit };
      if (pageParam) {
        params.cursor = pageParam;
      }

      const res = await axiosInstance.get<FilesResponse>("/user/files", {
        params,
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.has_more ? lastPage.cursor : undefined;
    },
    initialPageParam: undefined,
    staleTime: 1000 * 60 * 5, // Cache is fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in memory for 30 minutes to prevent garbage collection on unmount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchInterval: false, // No automatic refetch
  });
}
