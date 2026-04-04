import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Alert } from "react-native";

export const useDeleteTimeline = (token: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (timelineId: string) => {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/timelines/${timelineId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log("id:", timelineId)
            if (!response.ok) throw new Error('Failed to delete timeline')
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['timelines']});
            Alert.alert("Deleted", "Timeline has been removed")
        },
        onError: (error) => {
            Alert.alert("Error", error.message)
        }
    })
}