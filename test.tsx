const Item = ({ id, title }) => {
  const { token } = useAuthStore();
  const { mutate: deleteTimeline, isPending } = useDeleteTimeline(token);

  const confirmDelete = () => {
    Alert.alert(
      "Delete Timeline",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => deleteTimeline(id) 
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      className='flex flex-row gap-3 items-center my-3' 
      onLongPress={confirmDelete} // User holds the item to delete
      disabled={isPending} // Prevent double-clicks
    >
      <View className={`bg-gray-100 rounded-full h-14 w-14 items-center justify-center`}>
        {isPending ? <ActivityIndicator size="small" /> : <View className="h-full w-full bg-blue-100 rounded-full" />}
      </View>
      <View style={{ opacity: isPending ? 0.5 : 1 }}>
        <Text className="font-semibold text-lg">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};