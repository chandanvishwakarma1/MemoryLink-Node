import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import React, { useEffect } from 'react'

gsap.registerPlugin(SplitText, ScrollTrigger);

const Solution = () => {
    const strokeWidth = 2;
    useEffect(() => {
        let split = SplitText.create(".splitText", { type: "words, chars" });
        gsap.from(split.chars, {
            duration: 1,
            x: 40,  
            autoAlpha: 0,
            stagger: 0.05,
            scrollTrigger: {
                // scrub:true
                trigger: ".wrapper-solution",
                start: "top 80%",
                // end:"bottom bottom",
                // markers:true
            }
        })
        gsap.from(".bodyText-solution",{
            x:-100,
            opacity:0,
            duration:2,
            scrollTrigger:{
                trigger:".wrapper-solution",
                start: "top center",
                // markers:true
            }
        })
        gsap.from(".illustration-solution", {
            x:100,
            opacity:0,
            duration:2,
            scrollTrigger:{
                trigger: ".wrapper-solution",
                start:"top center",

            }
        })
    }, [])
    return (
        <div className='wrapper-solution mx-6 my-64 flex flex-col items-center text-txt-light dark:text-txt-dark '>
            <h1 className='splitText text-5xl font-bold'>One place. One timeline. Just for you.</h1>
            <div className='flex flex-col md:flex-row mt-9 gap-6'>
                <div className='bodyText-solution max-w-120 bg-card-light dark:bg-card-dark p-6 rounded-xl'>
                    <p className=''>MemoryLink brings all your meaningful moments together into a shared, private timeline — designed for real connection, not social media.</p>
                </div>
                <div className='illustration-solution flex justify-center rounded-xl bg-card-light dark:bg-card-dark w-full md:w-fit p-6 '>
                    <svg className='w-60 h-auto md:w-40' width="146" height="98" viewBox="0 0 146 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15L17.914 11.914C17.5389 11.5391 17.0303 11.3284 16.5 11.3284C15.9697 11.3284 15.4611 11.5391 15.086 11.914L6 21M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3ZM11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 50L21.223 53.482C21.2983 53.5321 21.3858 53.5608 21.4761 53.5652C21.5664 53.5695 21.6563 53.5492 21.736 53.5065C21.8157 53.4639 21.8824 53.4003 21.9289 53.3228C21.9754 53.2452 22 53.1564 22 53.066V44.87C22 44.782 21.9768 44.6956 21.9328 44.6194C21.8887 44.5433 21.8253 44.4801 21.7491 44.4363C21.6728 44.3925 21.5863 44.3696 21.4983 44.3699C21.4103 44.3702 21.324 44.3937 21.248 44.438L16 47.5M4 43H14C15.1046 43 16 43.8954 16 45V53C16 54.1046 15.1046 55 14 55H4C2.89543 55 2 54.1046 2 53V45C2 43.8954 2.89543 43 4 43Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 88H6C6.53043 88 7.03914 88.2107 7.41421 88.5858C7.78929 88.9609 8 89.4696 8 90V93C8 93.5304 7.78929 94.0391 7.41421 94.4142C7.03914 94.7893 6.53043 95 6 95H5C4.46957 95 3.96086 94.7893 3.58579 94.4142C3.21071 94.0391 3 93.5304 3 93V86C3 83.6131 3.94821 81.3239 5.63604 79.636C7.32387 77.9482 9.61305 77 12 77C14.3869 77 16.6761 77.9482 18.364 79.636C20.0518 81.3239 21 83.6131 21 86V93C21 93.5304 20.7893 94.0391 20.4142 94.4142C20.0391 94.7893 19.5304 95 19 95H18C17.4696 95 16.9609 94.7893 16.5858 94.4142C16.2107 94.0391 16 93.5304 16 93V90C16 89.4696 16.2107 88.9609 16.5858 88.5858C16.9609 88.2107 17.4696 88 18 88H21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M111 45.9311C112.507 44.2811 113.524 43.5688 115.215 43.4245C116.813 43.4058 117.648 43.9849 118.761 45.3741M118.761 45.3741C120.403 48.078 120.88 49.869 121.305 52.9682C121.409 54.6983 121.324 55.8693 120.896 56.626C120.414 57.5829 119.725 57.9575 118.817 57.9814C117.731 57.9419 117.242 57.6813 116.663 56.626C116.272 55.3054 116.23 54.5137 116.44 53.0239C117.011 49.8173 117.495 48.0557 118.761 45.3741ZM118.761 45.3741L119.467 43.703C119.77 43.0891 119.95 42.7145 120.377 42.0506C121.201 40.8517 121.811 40.3707 122.772 40.0639C123.831 39.8263 124.553 40.2379 125.984 41.5307C126.964 42.6406 127.432 43.2172 128.138 44.2972M128.138 44.2972C129.261 45.9357 129.724 46.8871 130.384 48.772C130.637 49.5929 130.724 50.5231 130.384 51.5571C129.955 52.5014 129.19 53.0173 128.193 53.0982C126.932 53.025 126.49 52.5811 125.854 51.5571C125.563 50.4193 125.553 49.8077 125.854 48.772C126.599 46.7949 127.106 45.8264 128.138 44.2972ZM128.138 44.2972L129.623 42.3581C130.252 41.5897 130.643 41.2087 131.406 40.6209C132.063 40.176 132.561 40.0139 133.355 40.0267C133.889 40.0462 134.299 40.1925 135.212 41.1141C135.672 41.5291 135.965 42.0487 136.734 43.4988L137.848 45.9497M137.848 45.9497C138.387 47.3151 139.13 49.4776 139.13 49.4776C139.615 51.1539 139.806 52.0976 140.021 53.7852C140.037 55.2411 139.95 55.9786 139.39 56.9602C138.856 57.6799 138.424 57.9347 137.31 58C136.32 57.8294 136 57.5581 135.546 56.9602C134.993 55.7535 134.83 55.0606 134.989 53.7852C135.087 52.4063 135.432 51.4343 136.047 49.4776C136.631 48.0407 137.01 47.261 137.848 45.9497ZM137.848 45.9497L139.687 43.6845C140.536 42.9327 141.064 42.4613 142.045 41.8835C143.446 41.0968 144.228 40.8865 145.238 40.8066" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M26 12C59.2 12 33.5455 48.0156 70.2667 49.2517M70.2667 49.2517C85.393 49.2517 109 49.2517 109 49.2517M70.2667 49.2517C52.5 50 26 50 26 50M70.2667 49.2517C38.5 49.9353 56.1818 87 26 87" stroke="currentColor" strokeWidth={strokeWidth} />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Solution
