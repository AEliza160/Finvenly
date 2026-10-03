import { createContext, useContext, useEffect, useRef } from 'react'

const PrivacyContext = createContext(false)

export function PrivacyProvider({ hidden, children }) {
  return <PrivacyContext.Provider value={hidden}>{children}</PrivacyContext.Provider>
}

export function PrivacyValue({ value }) {
  const hidden = useContext(PrivacyContext)
  const element = useRef(null)

  useEffect(() => {
    if (element.current) element.current.textContent = hidden ? '$***' : String(value)
  }, [hidden, value])

  return <span ref={element} />
}
