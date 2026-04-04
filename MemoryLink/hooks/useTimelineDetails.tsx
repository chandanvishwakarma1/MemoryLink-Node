import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api'; // Your fetch wrapper

export const useTimelineDetail = (id: string) => {
  return useQuery({
    queryKey: ['timelines', id],
    queryFn: () => fetchTimelineById(id),
  });
};

export const useCreateTimeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTimeline) => createTimelineApi(newTimeline),
    onSuccess: () => {
      // This refreshes the list automatically!
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
    },
  });
};