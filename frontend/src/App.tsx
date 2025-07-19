import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md container" style={{ maxWidth: '28rem' }}>
        <h1 className="text-center m-4">
          Frontend React + Sass
        </h1>
        
        <div className="text-center">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="btn btn--primary"
          >
            Count is {count}
          </button>
          
          <p className="m-4" style={{ color: 'var(--color-gray-600)' }}>
            Edit <code style={{ backgroundColor: 'var(--color-gray-200)', padding: 'var(--spacing-1)', borderRadius: 'var(--border-radius-sm)' }}>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        
        <div className="text-center m-8">
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
            Projeto React com TypeScript e Sass
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
