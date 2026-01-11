
import Button from './Button'
import { useScroll } from '@/contexts/scrollContext'



const Hero = () => {
  const { heroRef } = useScroll() || {};


  return (
    <div ref={heroRef} style={{ scrollMarginTop:'190px'}} className="flex flex-col  text-center justify-center text-txt-light  dark:text-txt-dark mt-24">
        <div className="border border-neutral-900 rounded-full px-3 py-1 w-fit h-auto mx-auto text-sm">
          <p>🔒 Join 1,400+ people waiting for access.</p>
        </div>
        <h1 className="text-7xl font-bold  tracking-tighter mt-6">Weave your shared history.</h1>
        <p className="max-w-2xl mx-auto mt-3 text-lg">A calm, private space to capture photos, videos, and voice notes with the people who matter most. No ads, no algorithms, just memories.</p>
        <div className="flex p-1 border border-neutral-900 rounded-full max-w-2xl h-auto mx-auto mt-6">
          <input type="email" name="email" placeholder="name@example.com" required={true} className="outline-none mx-6 w-76"  />
          <Button title="Join the timeline" />
        </div>
      </div>
  )
}

export default Hero
