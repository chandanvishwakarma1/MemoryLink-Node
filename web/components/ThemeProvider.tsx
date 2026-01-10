"use client"

import {ThemeProvider as NextThemeProvder} from 'next-themes'

export function ThemeProvider({children}:{children: React.ReactNode}) {
    return(
        <NextThemeProvder attribute="class" defaultTheme='light' enableSystem>
            {children}
        </NextThemeProvder>
    )
}
