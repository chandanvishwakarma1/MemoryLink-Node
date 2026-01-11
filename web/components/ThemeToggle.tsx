"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react"
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleToggle = () => {
        // If current theme is system, force it to the opposite of resolved theme
        if (theme === "system") {
            setTheme(resolvedTheme === "dark" ? "light" : "dark");
        } else {
            setTheme(theme === "dark" ? "light" : "dark");
        }
    };

    return (
        <button onClick={handleToggle} className="cursor-pointer">
            {resolvedTheme === "dark" ? <Sun color="white" className="p-0 m-0" /> : <Moon />}
        </button>
    )
}

export default ThemeToggle
