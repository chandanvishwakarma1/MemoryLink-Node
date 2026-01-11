'use client'
import CTA from "@/components/CTA";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Logo } from "@/components/Logo";
import ProblemState from "@/components/problemState";
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all';
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger);

export default function Home() {

  const lenisRef = useRef()

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, [])



  return (
    <div className="dark:bg-[#050505]">
      <Hero />
      {/* <Logo className='absolute self-end  z-1 text-white w-full h-auto' /> */}
      <ProblemState />
      <Features />
      <CTA />
      <Footer />

    </div>
  );
}
