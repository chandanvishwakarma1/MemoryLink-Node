import React, { useEffect } from 'react'
import gsap from 'gsap'
import { Loader, LoaderCircle } from 'lucide-react'

interface ActivityIndicatorProps{
    className?: string,
    
}

const ActivityIndicator = ({className}: ActivityIndicatorProps) => {
    useEffect(()=> {
        gsap.to('.loader', {
            rotate: 360,
            duration:1,
            repeat: -1,
            // yoyo: true
        })
    },[])
  return (
    <div className={`loader rounded-full w-fit ${className} `}>
      <LoaderCircle />
    </div>
  )
}

export default ActivityIndicator
