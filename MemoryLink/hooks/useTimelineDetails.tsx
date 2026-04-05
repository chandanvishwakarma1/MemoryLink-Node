import { useInfiniteQuery } from '@tanstack/react-query';

export const useTimelineDetail = (token: string, timelineId: string) => {
  return useInfiniteQuery({
    queryKey: ['timeline', timelineId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/timelines/${timelineId}?page=${pageParam}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch timeline: ${response.status} - ${errorText}`);
      }
      const result = await response.json();
      return result.data; // Return the data object which contains memories, pagination, etc.
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!timelineId && !!token,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
