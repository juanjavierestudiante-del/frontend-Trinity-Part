import { useState, Children } from 'react'

export default function Tabs(props) {
  const { children, dark = false } = props
  const [activeIndex, setActiveIndex] = useState(0)

  const tabs = Children.toArray(children).map((child, index) => ({
    title: child.props?.title || '',
    icon: child.props?.icon,
    content: child.props?.children,
    index,
  }))

  return (
    <div>
      <div
        className={`flex gap-1 border-b ${
          dark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.index}
            onClick={() => setActiveIndex(tab.index)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeIndex === tab.index
                ? dark
                  ? 'border-primary text-primary-light'
                  : 'border-primary text-primary'
                : dark
                  ? 'border-transparent text-gray-400 hover:text-gray-200'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.title}
          </button>
        ))}
      </div>

      <div className="py-4">
        {tabs[activeIndex]?.content}
      </div>
    </div>
  )
}

export function TabItem(props) {
  return <>{props.children}</>
}
