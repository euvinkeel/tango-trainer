import { useEffect } from "react"

export const useWindowSize = (callback: (width: number, height: number) => void) => {
    useEffect(() => {
        const handleResize = () => {
            callback(window.innerWidth, window.innerHeight)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [callback])
}