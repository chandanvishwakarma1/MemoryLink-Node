import React from 'react'
import Card from './Card'

const Features = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex justify-center items-center'>
        <h2 className='text-7xl font-bold dark:text-white leading-tighter'>
          <span className='block'> Built for “us”,</span>
          <span className='block'>not for everyone.</span>
        </h2>
      </div>
      <div className='flex mt-6 '>
        <div className='space-y-1 space-x-1'>
          <Card icon='' title='Capture the full feeling.' body='A photo shows what it looked like. A voice note captures what it felt like. Weave audio, video, and images into one seamless story' />
          <Card icon='' title='Private by Design' body='Only you and the people you invite can see your timeline' />
        </div>
        <div className='space-y-1 space-x-1'>
          <Card icon='' title='Send love to the future' body='Lock a memory today to be opened by your loved ones next month, or next year. The perfect digital heirloom.' />
          <Card icon='' title='Daily Streaks' body='Small moments, shared consistently. Stay emotionally connected, one day at a time.' />
        </div>
      </div>
    </div>
  )
}

export default Features
