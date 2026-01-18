import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const TimelinePath = () => {
    const pathRef = useRef<SVGPathElement | null>(null);
    useEffect(() => {

        if (!pathRef.current) return;

        const path = pathRef.current;
        const pathLength = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        })
        gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: path,
                start: "top center",
                end: "bottom 60%",
                scrub: 1,
                // markers: true,
            }
        })
    }, [])
    return (
        <div className='svg-path hidden md:block absolute text-txt-light dark:text-txt-dark'>
            {/* <svg width="1095" height="1994" viewBox="0 0 1095 1994" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path ref={pathRef} d="M3.98249 0V635.659H1094.5V1355H0.5V1994" stroke="black" />
            </svg> */}
            {/* <svg width="1095" height="1994" viewBox="0 0 1095 1994" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    ref={pathRef}
                    d="M 20 0 V 560 C 20 610 60 635 120 635 H 975 C 1035 635 1075 665 1075 720 V 1280 C 1075 1340 1035 1370 975 1370 H 120 C 60 1370 20 1400 20 1460 V 1994 "
                    stroke="black"
                    strokeWidth="23"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg> */}
            {/* <svg width="1020" height="2426" viewBox="0 0 1122 2426" fill="none" xmlns="http://www.w3.org/2000/svg"> <path  d="M11.5 0 V292 C11.5 350.5 75.5 398 138 398 C75.5 398 11.5 350.5 11.5 292 V584 C11.5 606.6 29.9 625 52.5 625 H1069.5 C1092.1 625 1110.5 643.4 1110.5 666 V990.5 C1110.5 1049 1046.5 1096.5 984 1096.5 C1046.5 1096.5 1110.5 1049 1110.5 990.5 V1315 C1110.5 1337.6 1092.1 1356 1069.5 1356 H52.5 C29.9 1356 11.5 1374.4 11.5 1397 V1696.5 C11.5 1755 75.5 1802.5 138 1802.5 C75.5 1802.5 11.5 1755 11.5 1696.5 V1996" stroke="black" strokeWidth="23" strokeLinecap="square" strokeLinejoin="round"/> </svg> */}

            {/* <svg width="991" height="1996" viewBox="0 0 991 1996" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_68_127)">
                    <mask id="mask0_68_127" maskUnits="userSpaceOnUse" x="0" y="0" width="991" height="1996">
                        <path d="M0 0H991V1996H0V0Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_68_127)">
                        <path ref={pathRef} d="M10.1562 0V292M10.1562 292C10.1562 350.5 66.6844 398 121.887 398M10.1562 292V584C10.1562 606.6 26.4086 625 46.3694 625H944.629C964.593 625 980.841 643.4 980.841 666V990.5M980.841 990.5C980.841 1049 924.314 1096.5 869.112 1096.5M980.841 990.5V1315C980.841 1337.6 964.593 1356 944.629 1356H46.3694C26.4086 1356 10.1572 1374.4 10.1572 1397V1696.5M10.1572 1696.5C10.1572 1755 66.6844 1802.5 121.887 1802.5M10.1572 1696.5L10.1562 1996" stroke="black" stroke-width="23" />
                    </g>
                </g>
                <defs>
                    <clipPath id="clip0_68_127">
                        <rect width="991" height="1996" fill="white" />
                    </clipPath>
                </defs>
            </svg> */}

            <svg className='' width="991" height="1996" viewBox="0 0 991 1996" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_68_127)">
                    <path ref={pathRef} d="M10.1562 0V292C10.1562 350.5 66.6844 398 121.887 398C66.6844 398 10.1562 350.5 10.1562 292V584C10.1562 606.6 26.4086 625 46.3694 625H944.629C964.593 625 980.841 643.4 980.841 666V990.5C980.841 1049 924.314 1096.5 869.112 1096.5C924.314 1096.5 980.841 1049 980.841 990.5V1315C980.841 1337.6 964.593 1356 944.629 1356H46.3694C26.4086 1356 10.1572 1374.4 10.1572 1397V1696.5C10.1572 1755 66.6844 1802.5 121.887 1802.5C66.6844 1802.5 10.1572 1755 10.1572 1696.5L10.1562 1996" stroke="currentColor" strokeWidth="23" strokeLinecap="square" strokeLinejoin="bevel" />
                </g>
                <defs>
                    <clipPath id="clip0_68_127">
                        <rect width="991" height="1996" fill="white" />
                    </clipPath>
                </defs>
            </svg>






        </div>
    )
}

export default TimelinePath
