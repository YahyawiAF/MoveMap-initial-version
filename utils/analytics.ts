import ReactGA from 'react-ga'

const GA_TRACKING_ID = "UA-67539353-3"

export const initGA = () => {
 ReactGA.initialize(GA_TRACKING_ID)
}

export const logPageView = (url) => {
 ReactGA.set({ page: url })
 ReactGA.pageview(url)
}

export const logEvent = (category = '', action = '', label='', value=null) => {
  if (category && action) {
   if (value) {
     ReactGA.event({ category, action, label, value })
   } else {
    ReactGA.event({ category, action, label });
   }
 }
}

export const logException = (description = '', fatal = false) => {
 if (description) {
   ReactGA.exception({ description, fatal })
 }
}