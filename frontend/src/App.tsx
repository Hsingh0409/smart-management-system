import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary mb-4">
                🍬 Sweet Shop Management
              </h1>
              <p className="text-muted-foreground">
                Setup complete! Ready to start development.
              </p>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
