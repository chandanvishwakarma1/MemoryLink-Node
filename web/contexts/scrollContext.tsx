'use client'
import { createContext, useContext, useRef, RefObject, useState, useEffect } from "react";

interface ScrollContextType {
  featuresRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLDivElement | null>;
  isHeroInView: boolean;
  scrollToFeatures: () => void;
  scrollToHero: () => void;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export const ScrollProvider = ({children}: { children: React.ReactNode }) => {
    const featuresRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [isHeroInView, setIsHeroInView] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsHeroInView(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -10% 0px'
            }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => {
            if (heroRef.current) {
                observer.unobserve(heroRef.current);
            }
        };
    }, []);

    const scrollToHero = () => {
        heroRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: "smooth"});
    }
    return(
        <ScrollContext.Provider value={{featuresRef, heroRef, isHeroInView, scrollToFeatures, scrollToHero}}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => useContext(ScrollContext);
