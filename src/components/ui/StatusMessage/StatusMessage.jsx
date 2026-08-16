import Loader from '../Loader/Loader'

const STATUS_CONFIG = {
  loading: {
    icon: <Loader size="lg" />,
    text: 'Cargando...',
  },
  error: {
    iconClass: 'text-red-400',
    icon: (
      <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  empty: {
    iconClass: 'text-gray-300',
    icon: (
      <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
}

export default function StatusMessage({ status = 'loading', message, className = '' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.loading

  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="mb-4">
        {status === 'loading' ? config.icon : config.icon}
      </div>
      <p className={`text-sm font-medium ${status === 'error' ? 'text-red-600' : status === 'empty' ? 'text-gray-500' : 'text-muted'}`}>
        {message || (status === 'loading' ? 'Cargando...' : status === 'error' ? 'Algo salió mal' : 'No hay resultados')}
      </p>
    </div>
  )
}
