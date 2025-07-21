describe('Authentication Flow', () => {
  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login')
    })

    it('should display login form correctly', () => {
      cy.contains('TCC Chat').should('be.visible')
      cy.contains('Entre na sua conta para continuar').should('be.visible')
      cy.get('#email').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('button[type="submit"]').should('contain', 'Entrar')
      cy.contains('Não tem uma conta?').should('be.visible')
      cy.get('a[href="/register"]').should('contain', 'Criar conta')
    })

    it('should validate required fields', () => {
      // Tentar submeter sem preencher
      cy.get('button[type="submit"]').should('be.disabled')

      // Preencher email
      cy.get('#email').type('test@example.com')
      cy.get('button[type="submit"]').should('be.disabled')

      // Preencher senha
      cy.get('#password').type('password123')
      cy.get('button[type="submit"]').should('not.be.disabled')
    })

    it('should navigate to register page', () => {
      cy.get('a[href="/register"]').click()
      cy.url().should('include', '/register')
      cy.contains('Criar conta').should('be.visible')
    })

    it('should show loading state during login attempt', () => {
      cy.get('#email').type('test@example.com')
      cy.get('#password').type('password123')
      
      // Interceptar a requisição para simular delay
      cy.intercept('POST', '**/api/auth/login', { delay: 1000, statusCode: 401 }).as('loginRequest')
      
      cy.get('button[type="submit"]').click()
      cy.get('button[type="submit"]').should('be.disabled')
      cy.contains('Entrando...').should('be.visible')
      
      cy.wait('@loginRequest')
    })
  })

  describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/register')
    })

    it('should display register form correctly', () => {
      cy.contains('TCC Chat').should('be.visible')
      cy.contains('Crie sua conta para começar').should('be.visible')
      cy.get('#name').should('be.visible')
      cy.get('#email').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('#confirmPassword').should('be.visible')
      cy.get('button[type="submit"]').should('contain', 'Criar conta')
      cy.contains('Já tem uma conta?').should('be.visible')
      cy.get('a[href="/login"]').should('contain', 'Fazer login')
    })

    it('should navigate to login page', () => {
      cy.get('a[href="/login"]').click()
      cy.url().should('include', '/login')
      cy.contains('Entrar').should('be.visible')
    })

    it('should show loading state during registration', () => {
      cy.get('#name').type('João Silva')
      cy.get('#email').type('joao@example.com')
      cy.get('#password').type('senha123')
      cy.get('#confirmPassword').type('senha123')
      
      // Interceptar a requisição para simular delay
      cy.intercept('POST', '**/api/auth/register', { delay: 1000, statusCode: 201 }).as('registerRequest')
      
      cy.get('button[type="submit"]').click()
      cy.get('button[type="submit"]').should('be.disabled')
      cy.contains('Criando conta...').should('be.visible')
      
      cy.wait('@registerRequest')
    })
  })

  describe('Navigation and Redirects', () => {
    it('should redirect to login from root when not authenticated', () => {
      cy.visit('/')
      cy.url().should('include', '/login')
    })

    it('should redirect to chat from root when authenticated', () => {
      // Simular usuário autenticado
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'fake-token')
        win.localStorage.setItem('user', JSON.stringify({
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        }))
      })

      cy.visit('/')
      cy.url().should('include', '/chat')
    })

    it('should prevent access to auth pages when already authenticated', () => {
      // Simular usuário autenticado
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'fake-token')
        win.localStorage.setItem('user', JSON.stringify({
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        }))
      })

      cy.visit('/login')
      cy.url().should('include', '/chat')

      cy.visit('/register')
      cy.url().should('include', '/chat')
    })
  })
})
