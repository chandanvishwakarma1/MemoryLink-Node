import React from 'react'
import { Logo } from './Logo'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const NavBar = () => {
    return (
        <div className='mt-3 backdrop-blur-md bg-neutral-300/40 w-3xl rounded-full px-6 py-4 dark:text-white'>
            <nav>
                <ul className='flex items-center justify-between'>
                    <li>
                        <Link href={'/'}><Logo className='w-10 h-auto' strokeWidth={66} /></Link>
                    </li>
                    <ul className='flex items-center gap-3'>
                        <li><Link href={'/features'}>Features</Link></li>
                        <li><div className='flex'><ThemeToggle /></div></li>
                    </ul>
                </ul>
            </nav>
        </div>
    )
}

export default NavBar
