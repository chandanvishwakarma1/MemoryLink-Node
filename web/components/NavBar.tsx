'use client'
import { Logo } from './Logo'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import Button from './Button'
import { useScroll } from '@/contexts/scrollContext'

const NavBar = () => {
    const ScrollContext = useScroll();
    const scrollToFeatures = ScrollContext?.scrollToFeatures;
    const scrollToHero = ScrollContext?.scrollToHero;
    const { isHeroInView } = useScroll() || {};

    return (
        <div className={`mt-3 backdrop-blur-md bg-neutral-300/4 w-3xl rounded-full px-6 py-4 dark:text-white`}>
            <nav>
                <ul className='flex items-center justify-between'>
                    <li>
                        <button onClick={scrollToHero} className='align-middle cursor-pointer'><Logo className='w-10 h-auto' strokeWidth={66} /></button>
                    </li>
                    <ul className='flex items-center gap-3'>
                        <li><button onClick={scrollToFeatures} className='cursor-pointer'>Features</button></li>
                        <li><div className='flex'><ThemeToggle /></div></li>
                    </ul>
                </ul>
            </nav>
        </div>
    )
}

export default NavBar
