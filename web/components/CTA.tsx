import React, { useEffect } from 'react'
import Button from './Button'
import { ScrollTrigger } from 'gsap/all';
import { SplitText } from 'gsap/all'
import gsap from 'gsap'
gsap.registerPlugin(SplitText, ScrollTrigger);

const CTA = () => {
    useEffect(() => {
        let split = SplitText.create(".split-cta", { type: "words, chars" });
        gsap.from(split.chars, {
            duration: 1,
            x: 40,
            stagger: 0.05,
            autoAlpha: 0,
            scrollTrigger: {
                trigger: ".wrapper-cta",
                start: "260% 90%",
            }
        })
        let splitBody = SplitText.create(".split-body-cta", { type: "lines" });
        gsap.from(splitBody.lines, {
            duration: 0.4,
            y: 40,
            stagger: 0.05,
            autoAlpha: 0,
            scrollTrigger: {
                trigger: ".wrapper-cta",
                start: "top 90%",
                // markers: true,   
            }
        })
    }, [])
    return (
        <div className='wrapper-cta mb-24 mx-6 flex flex-col items-center'>
            <div className='flex flex-col  text-center justify-center text-txt-light  dark:text-txt-dark mt-24'>
                <h1 className='split-cta text-3xl md:text-7xl font-bold  tracking-tighter  mt-6'>Reserve your username.</h1>
                <p className='split-body-cta max-w-2xl mx-auto mt-3 text-lg text-txt-secondary-light dark:text-txt-secondary-dark'>We are opening access in waves to ensure a calm, bug-free experience. Secure your spot in line today.</p>
            </div>
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

export default CTA
