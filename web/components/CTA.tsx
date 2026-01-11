import React from 'react'
import Button from './Button'

const CTA = () => {
    return (
        <div className='mb-24'>
            <div className='flex flex-col  text-center justify-center text-txt-light  dark:text-txt-dark mt-24'>
                <h1 className='text-7xl font-bold  tracking-tighter mt-6'>Reserve your username.</h1>
                <p className='max-w-2xl mx-auto mt-3 text-lg'>We are opening access in waves to ensure a calm, bug-free experience. Secure your spot in line today.</p>
            </div>

            <div className="flex p-1 border border-neutral-900 rounded-full max-w-lg h-auto mx-auto mt-6">
                <input type="email" name="email" placeholder="name@example.com" required={true} className="outline-none mx-6 w-76" />
                <Button title="Join the timeline" />
            </div>
        </div>
    )
}

export default CTA
