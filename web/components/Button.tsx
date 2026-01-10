import React from 'react'

interface ButtonProps {
    title: string,
}
const Button = ({ title }: ButtonProps) => {
    return (
        <div className='bg-white rounded-full p-3'>
            <button className='text-black'>{title}</button>
        </div>
    )
}

export default Button
