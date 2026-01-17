import React, { useEffect } from 'react'
import Card from './Card'
import { Hourglass, Lock, Sprout } from 'lucide-react'
import { useScroll } from '@/contexts/scrollContext'
import { ScrollTrigger } from 'gsap/all';
import { SplitText } from 'gsap/all'
import gsap from 'gsap'
gsap.registerPlugin(SplitText, ScrollTrigger);

const Features = () => {
  const { featuresRef } = useScroll() || {};

  useEffect(() => {
    let split = SplitText.create(".split-features", { type: "words, chars" });

    gsap.from(split.chars, {
      duration: 1,
      x: 40,
      autoAlpha: 0,
      stagger: 0.05,
      scrollTrigger: {
        // scrub:true
        trigger: ".wrapper-features",
        start: "bottom 80%",
        end: "bottom bottom",
        // markers:true
      }
    });
    let splitBody = SplitText.create(".split-body-features", { type: "lines" });
    gsap.from(splitBody.lines, {
      duration: 0.4,
      y: 40,
      stagger: 0.05,
      delay: 1,
      autoAlpha: 0,
      scrollTrigger: {
        trigger: ".wrapper-features",
        start: "100% 90%",
        // markers: true,
      }
    })
    ScrollTrigger.refresh();
  }, [])

  return (
    <div ref={featuresRef} style={{ scrollMarginTop: '100px' }} className='wrapper-features flex  flex-col justify-center items-center mx-6 '>
      <div className=' flex-1 '>
        <h2 className=' text-3xl md:text-7xl font-bold text-txt-light dark:text-txt-dark leading-tighter'>
          <span className='block split-features'>Built for “us”,</span>
          <span className='block split-features'>not for everyone.</span>
        </h2>
        <p className=' flex flex-col leading-tight mt-3 text-txt-secondary-light dark:text-txt-secondary-dark'>
          <span className='split-body-features'>MemoryLink isn’t another social app.</span>
          <span className='split-body-features'>It’s a quiet space for love, friendship, and memories that deserve to last.</span>
        </p>
      </div>
      <div className='md:flex mt-34 mb-9'>
        <div className='space-y-1 space-x-1'>
          <Card custom={true} title='Capture the full feeling.' body='A photo shows what it looked like. A voice note captures what it felt like. Weave audio, video, and images into one seamless story' />
          <Card icon={Lock} title='Private by Design' body='Only you and the people you invite can see your timeline' />
        </div>
        <div className='space-y-1 space-x-1'>
          <Card icon={Hourglass} title='Send love to the future' body='Lock a memory today to be opened by your loved ones next month, or next year. The perfect digital heirloom.' />
          <Card icon={Sprout} title='Daily Streaks' body='Small moments, shared consistently. Stay emotionally connected, one day at a time.' />
        </div>
      </div>
    </div>
  )
}

export default Features
