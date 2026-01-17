import { useEffect } from 'react'
import Button from './Button'
import { useScroll } from '@/contexts/scrollContext'
import { SplitText } from 'gsap/all'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Hero = () => {
  const { heroRef } = useScroll() || {}

  useGSAP(() => {
    let heroSplit = SplitText.create(".title", { type: "words, chars" });

    gsap.from(heroSplit.chars, {
      y: 40, 
      duration: 1.8,
      ease: "expo.out",
      autoAlpha: 0,
      stagger: 0.06
    });

    let paraSplit = SplitText.create(".subtitle", { type: "lines" });
    gsap.from(paraSplit.lines, {
      duration: 1.8,
      delay: 1,
      opacity: 0,
      y: 40,
      stagger: 0.06,
      ease: "expo.out",
      autoAlpha: 0,
      // x: 40,
      })

  }, { scope: heroRef })

  return (
    <div
      ref={heroRef}
      style={{ scrollMarginTop: '190px' }}
      className="
        flex flex-col items-center text-center
        text-txt-light dark:text-txt-dark
        mt-20 sm:mt-24
        px-4 sm:px-6
      "
    >
      <div className="border border-neutral-900 rounded-full px-3 py-1 text-xs sm:text-sm">
        <p>🔒 Join 1,400+ people waiting for access.</p>
      </div>

      <h1
        className="title
          mt-6
          text-3xl sm:text-4xl md:text-5xl lg:text-7xl
          font-bold tracking-tighter
          max-w-4xl
        "
      >
        Weave your shared history.
      </h1>

      <p
        className="subtitle
          mt-4
          max-w-xl sm:max-w-2xl
          text-sm sm:text-base md:text-lg
          text-txt-secondary-light dark:text-txt-secondary-dark
        "
      >
        A calm, private space to capture photos, videos, and voice notes with the
        people who matter most. No ads, no algorithms, just memories.
      </p>

      <div
        className="
          mt-6
          w-full max-w-md sm:max-w-lg
          flex flex-col  sm:flex-row items-center
          gap-3 sm:gap-0
          md:border border-neutral-900 rounded-full
          p-1
        "
      >
        <input
          type="email"
          name="email"
          placeholder="name@example.com"
          required
          className="
            flex-1 w-full
            px-4 py-3 sm:py-2
            outline-none bg-transparent
            text-sm sm:text-base
            border border-neutral-900
            md:border-none
            rounded-full
          "
        />
        <Button title="Join the timeline" />
      </div>
    </div>
  )
}

export default Hero
