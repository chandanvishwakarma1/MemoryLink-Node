'use client'
import CTA from "@/components/CTA";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Logo } from "@/components/Logo";
import Pain from "@/components/Pain";
import ProblemState from "@/components/problemState";
import Solution from "@/components/Solution";
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all';
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  return (
    <div className="bg-back-light dark:bg-back-dark">
      <Hero />
      <Pain />
      <Solution />
      <ProblemState />
      <Features />
      <CTA />
      <Footer />

    </div>
  );
}
