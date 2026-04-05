// const {
//   data,
//   fetchNextPage,
//   hasNextPage,
//   isFetchingNextPage,
// } = useInfiniteQuery({
//   queryKey: ['memories', timelineId],
//   queryFn: async ({ pageParam = 1 }) => {
//     const response = await fetch(
//       `${API_URL}/timelines/${timelineId}/memories?page=${pageParam}&limit=10`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.json();
//   },
//   getNextPageParam: (lastPage) => {
//     return lastPage.pagination.hasNextPage 
//       ? lastPage.pagination.currentPage + 1 
//       : undefined;
//   },

import { useAuthStore } from "@/store/authStore"
import { useInfiniteQuery } from "@tanstack/react-query";

// });
export const useMemories = (token: string, timelineId: string) => {
    const { user } = useAuthStore();
    return useInfiniteQuery<
        { data: any[]; pagination: { hasNextPage: boolean; currentPage: number } },
        Error
    >({
        queryKey: ['memories', timelineId],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/${timelineId}/memories?page=${pageParam}&limit=10`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch memories');
            }
            return response.json();
        },
        getNextPageParam: (lastPage) =>
            lastPage.pagination.hasNextPage
                ? lastPage.pagination.currentPage + 1
                : undefined,
        initialPageParam: 1,
    });
}