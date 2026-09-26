import { useId, useRef, useState, Children } from 'react'

export default function Tabs(props) {
  const { children, dark = false, ariaLabel = "Secciones" } = props
  const [activeIndex, setActiveIndex] = useState(0)
  const baseId = useId()
  const tabRefs = useRef([])

  const selectTab = (index, focus = false) => {
    setActiveIndex(index)
    if (focus) tabRefs.current[index]?.focus()
  }

  const handleKeyDown = (event, index) => {
    if (!tabs.length) return
    let nextIndex = null
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === "Home") nextIndex = 0
    if (event.key === "End") nextIndex = tabs.length - 1
    if (nextIndex === null) return
    event.preventDefault()
    selectTab(nextIndex, true)
  }

  const tabs = Children.toArray(children).map((child, index) => ({
    title: child.props?.title || '',
    icon: child.props?.icon,
    content: child.props?.children,
    index,
  }))

  return (
    <div>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`flex gap-1 border-b overflow-x-auto ${
          dark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.index}
            ref={(element) => { tabRefs.current[tab.index] = element }}
            id={`${baseId}-tab-${tab.index}`}
            role="tab"
            aria-selected={activeIndex === tab.index}
            aria-controls={`${baseId}-panel-${tab.index}`}
            tabIndex={activeIndex === tab.index ? 0 : -1}
            onKeyDown={(event) => handleKeyDown(event, tab.index)}
            type="button"
            onClick={() => selectTab(tab.index)}
            className={`flex min-h-11 shrink-0 touch-manipulation items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium leading-5 border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeIndex === tab.index
                ? dark
                  ? 'border-primary text-primary-light'
                  : 'border-primary text-primary'
                : dark
                  ? 'border-transparent text-gray-400 hover:text-gray-200'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon && <tab.icon className="h-4 w-4" aria-hidden="true" />}
            {tab.title}
          </button>
        ))}
      </div>

      <div id={`${baseId}-panel-${activeIndex}`} role="tabpanel" aria-labelledby={`${baseId}-tab-${activeIndex}`} tabIndex={0} className="py-4">
        {tabs[activeIndex]?.content}
      </div>
    </div>
  )
}

export function TabItem(props) {
  return <>{props.children}</>
}
