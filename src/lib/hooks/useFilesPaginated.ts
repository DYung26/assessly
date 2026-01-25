import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

interface UserFile {
  id: string;
  filename: string;
  filetype: string;
  uploaded_at: string;
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
  });
}
