import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import React, { useEffect } from 'react'

gsap.registerPlugin(SplitText, ScrollTrigger);


const Pain = () => {
    useEffect(() => {
        let split = SplitText.create(".text", { type: "chars, words" });
        const scrollTween = gsap.to(".text", {
            xPercent: -100,
            ease: "none",
            scrollTrigger: {
                trigger: ".wrapper",
                start: "top middle",
                pin: true,
                end: "+=5000px",
                scrub: true
            }
        });

        split.chars.forEach((char) => {
            gsap.from(char, {
                yPercent: "random(-200, 200)",
                rotation: "random(-20, 20)",
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: char,
                    containerAnimation: scrollTween,
                    start: "left 100%",
                    end: "left 30%",
                    scrub: 1
                }
            });
        });
    }, [])
    return (
        <div className='wrapper flex items-center mx-6 h-screen text-txt-light dark:text-txt-dark  overflow-hidden '>
            <div className='text flex w-max whitespace-nowrap gap-[4vw] pl-[100vw] font-[clamp(2rem, 10vw, 12rem)] font-semibold leading-9'>
                <h2 className='text-3xl font-semibold md:text-5xl'>Your memories are scattered.</h2>
                <p>Photos in your gallery.
                    Videos in chat apps.
                    Voice notes lost in conversations.
                    And the moments that matter most?
                    They slowly disappear.
                </p>
            </div>
        </div>
    )
}

export default Pain
