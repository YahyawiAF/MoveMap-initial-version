import { useState, useEffect } from "react";

const useRefDimensions = (ref) => {
  const [dimensions, setDimensions] = useState({ width: 1, height: 2 })

  const measure = () => {
    const { current } = ref
    if (!current) {
      return;
    }
    const boundingRect = current.getBoundingClientRect()
    const { width, height } = boundingRect
    setDimensions({ width: Math.round(width), height: Math.round(height) })
  }

  useEffect(() => {
    if (ref.current) {
      measure()
    }
  }, [ref])

  useEffect(() => {
    window.addEventListener("resize", measure );

    return () => {
      window.removeEventListener("resize", measure );
    };
  }, [])
  return dimensions
}

export default useRefDimensions;