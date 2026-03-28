import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { forwardRef, useCallback, useMemo } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Plus, UserPlus } from 'lucide-react-native';

interface CustomBottomSheetProps {
    title?: string,

}
type Ref = BottomSheet;
const CustomBottomSheet = forwardRef<Ref, CustomBottomSheetProps>(({ title }, ref) => {
    const snapPoints = useMemo(() => ['30%'], []);
    const renderBackdrop = useCallback((props: any) => (<BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior={"close"} />), [])

    return (
        <BottomSheet ref={ref} index={-1} snapPoints={snapPoints} enablePanDownToClose={true} enableDynamicSizing={false} backdropComponent={renderBackdrop}>
            <BottomSheetView className='p-6 gap-6 mt-1'>
                <TouchableOpacity className='flex flex-row items-center justify-between'><Text className='font-semibold'>Create new timeline</Text><Plus size={24} /></TouchableOpacity>
                <TouchableOpacity className='flex flex-row items-center justify-between'><Text className='font-semibold'>Add to timeline</Text><UserPlus size={24} /></TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    )
})

export default CustomBottomSheet

const styles = StyleSheet.create({})