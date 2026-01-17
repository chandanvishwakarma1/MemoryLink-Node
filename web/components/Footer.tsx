'use client'
import React, { useEffect, useState } from 'react'
import { Logo } from './Logo'
import Link from 'next/link'
import { useScroll } from '@/contexts/scrollContext';

const Footer = () => {
    const [index, setIndex] = useState(0);
    const ScrollContext = useScroll();
    const scrollToFeatures = ScrollContext?.scrollToFeatures;
    const scrollToHero = ScrollContext?.scrollToHero;

    const footerLinks = [
        { name: "Home", onClick: scrollToHero },
        { name: "Features", onClick: scrollToFeatures },
        { name: "Contact Us", href: "/contact" },
        { name: "Follow Us on X", href: "https://x.com/MemoryLink_app" },
    ];

    const emojis = [
        { id: 1, emoji: '❤️'},
        { id: 2, emoji: '🤩'},
        { id: 3, emoji: '👀'},
        { id: 4, emoji: '🙏'},
        { id: 5, emoji: '☕'},
        { id: 6, emoji: '🐱'},
    ]

    useEffect(()=> {
        const timeOut = setTimeout(()=> {
            setIndex((prev)=> (prev+1) % emojis.length)
        },2000)
        return () => clearTimeout(timeOut);
    }, [index]);
    return (
        
            <div className='flex justify-center px-6 border-t border-border-light dark:border-border-dark py-9 bg-footer-light dark:bg-footer-dark'>
                <div className='flex flex-col w-3xl space-y-3' >
                    <div className='flex text-txt-light gap-2 dark:text-txt-dark'>
                        <Logo className='w-10 h-auto' strokeWidth={66} />
                        <h2 className='text-3xl font-bold'>MemoryLink</h2>
                    </div>
                    <div className='flex flex-col font-semibold text-footer-link-light dark:text-footer-link-dark'>
                        {
                            footerLinks.map(({ name, onClick, href }) => (
                                href ? (
                                    <Link key={name} href={href} >{name}</Link>
                                ) : (
                                    <button key={name} onClick={onClick} className='self-start'>{name}</button>
                                )
                            ))
                        }
                    </div>
                    <div className='mt-3  text-footer-link-light dark:text-footer-link-dark'>
                        <h2>Built with {emojis[index].emoji} by <Link href={'https://x.com/chandanv2005'} className='underline'>@chandanv2005</Link></h2>
                    </div>
                </div>
            </div>
    )
}

export default Footer
