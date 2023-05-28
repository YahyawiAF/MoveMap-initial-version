import { useEffect, useState } from 'react'

const getMobileDetect = (userAgent: NavigatorID['userAgent']) => {
  const isAndroid = !!userAgent.match(/Android/i)
  const isIos = !!userAgent.match(/iPhone|iPad|iPod/i)
  const isOpera = !!userAgent.match(/Opera Mini/i)
  const isWindows = !!userAgent.match(/IEMobile/i)
  const isSSR = !!userAgent.match(/SSR/i)
  const isMobile = isAndroid || isIos || isOpera || isWindows
  const isDesktop = !isMobile && !isSSR
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  }
}
const useMobileDetect = () => {
  const [userAgentCharacteristics, setUserAgentCharacteristics] = useState({
    isMobile: undefined,
    isDesktop: undefined,
    isAndroid: undefined,
    isIos: undefined,
    isSSR: undefined,
});
  useEffect(() => {
    const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent
    setUserAgentCharacteristics(getMobileDetect(userAgent));
  }, [])
  return userAgentCharacteristics;
}

export default useMobileDetect;