import { useAuthStore } from '@/store/authStore';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useTimelines = (token: string) => {
  const { user} = useAuthStore();
  return useInfiniteQuery({
    queryKey: ['timelines', user],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/timelines?page=${pageParam}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};