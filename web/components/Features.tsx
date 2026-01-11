import React from 'react'
import Card from './Card'
import { Hourglass, Lock, Sprout } from 'lucide-react'
import { useScroll } from '@/contexts/scrollContext'

const Features = () => {
  const { featuresRef } = useScroll() || {};
  
  return (
    <div ref={featuresRef} style={{ scrollMarginTop: '100px' }} className='flex flex-col justify-center items-center'>
      <div className='w-3xl '>
        <h2 className='text-7xl font-bold text-txt-light dark:text-txt-dark leading-tighter'>
          <span className='block'>Built for “us”,</span>
          <span className='block'>not for everyone.</span>
        </h2>
        <p className='flex flex-col leading-tight mt-3 text-txt-secondary-light dark:text-txt-secondary-dark'>
          <span>MemoryLink isn’t another social app.</span>
          <span>It’s a quiet space for love, friendship, and memories that deserve to last.</span>
        </p>
      </div>
      <div className='flex mt-34 mb-9'>
        <div className='space-y-1 space-x-1'>
          <Card custom={true}  title='Capture the full feeling.' body='A photo shows what it looked like. A voice note captures what it felt like. Weave audio, video, and images into one seamless story' />
          <Card icon={Lock}  title='Private by Design' body='Only you and the people you invite can see your timeline' />
        </div>
        <div className='space-y-1 space-x-1'>
          <Card icon={Hourglass}  title='Send love to the future' body='Lock a memory today to be opened by your loved ones next month, or next year. The perfect digital heirloom.' />
          <Card icon={Sprout} title='Daily Streaks' body='Small moments, shared consistently. Stay emotionally connected, one day at a time.' />
        </div>
      </div>
    </div>
  )
}

export default Features
