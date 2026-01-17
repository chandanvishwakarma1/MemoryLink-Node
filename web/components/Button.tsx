import React from 'react'

interface ButtonProps {
    title: string,
}
const Button = ({ title }: ButtonProps) => {
    return (
        <div className='bg-button-light dark:bg-button-dark rounded-full p-3 w-max'>
            <button className='text-button-txt-light font-medium dark:text-button-txt-dark'>{title}</button>
        </div>
    )
}

export default Button
