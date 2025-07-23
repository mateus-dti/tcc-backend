import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage, RegisterPage, ChatPage } from './pages';
import { ProtectedRoute } from './components';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Rotas protegidas */}
            <Route 
              path="/chat/:sessionId?" 
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rota raiz - redireciona para chat */}
            <Route path="/" element={<Navigate to="/chat" replace />} />
            
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
