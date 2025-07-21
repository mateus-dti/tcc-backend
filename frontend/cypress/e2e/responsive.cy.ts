describe('Responsive Design', () => {
  const viewports = [
    { device: 'Mobile', width: 375, height: 667 },
    { device: 'Tablet', width: 768, height: 1024 },
    { device: 'Desktop', width: 1280, height: 720 }
  ]

  viewports.forEach(({ device, width, height }) => {
    describe(`${device} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height)
      })

      it('should display login form correctly', () => {
        cy.visit('/login')
        
        cy.get('.auth-page').should('be.visible')
        cy.get('.auth-page__container').should('be.visible')
        cy.get('#email').should('be.visible')
        cy.get('#password').should('be.visible')
        cy.get('button[type="submit"]').should('be.visible')
        
        // Verificar se não há scroll horizontal
        cy.get('body').should('have.css', 'overflow-x', 'hidden')
      })

      it('should display register form correctly', () => {
        cy.visit('/register')
        
        cy.get('.auth-page').should('be.visible')
        cy.get('.auth-page__container').should('be.visible')
        cy.get('#name').should('be.visible')
        cy.get('#email').should('be.visible')
        cy.get('#password').should('be.visible')
        cy.get('#confirmPassword').should('be.visible')
        cy.get('button[type="submit"]').should('be.visible')
        
        // Verificar se o formulário cabe na tela
        cy.get('.auth-page__container').should('be.visible')
      })

      if (device === 'Mobile') {
        it('should handle mobile-specific interactions', () => {
          cy.visit('/register')
          
          // Verificar se os campos são acessíveis no mobile
          cy.get('#name').click().should('be.focused')
          cy.get('#email').click().should('be.focused')
          cy.get('#password').click().should('be.focused')
          cy.get('#confirmPassword').click().should('be.focused')
          
          // Verificar se não há overflow
          cy.get('.auth-page').should('not.have.css', 'overflow-x', 'scroll')
        })
      }

      if (device === 'Desktop') {
        it('should display chat interface with sidebar', () => {
          // Simular usuário autenticado
          cy.window().then((win) => {
            win.localStorage.setItem('authToken', 'fake-token')
            win.localStorage.setItem('user', JSON.stringify({
              id: '1',
              name: 'Test User',
              email: 'test@example.com'
            }))
          })

          cy.intercept('GET', '**/api/chat/models', {
            fixture: 'models.json'
          }).as('getModels')

          cy.visit('/chat')
          
          cy.get('.chat-layout').should('be.visible')
          cy.get('.chat-sidebar').should('be.visible')
          cy.get('.chat-window').should('be.visible')
          
          // No desktop, sidebar deve estar sempre visível
          cy.get('.chat-sidebar').should('have.css', 'width').and('not.equal', '0px')
        })
      }

      if (device === 'Mobile' || device === 'Tablet') {
        it('should handle mobile chat interface', () => {
          // Simular usuário autenticado
          cy.window().then((win) => {
            win.localStorage.setItem('authToken', 'fake-token')
            win.localStorage.setItem('user', JSON.stringify({
              id: '1',
              name: 'Test User',
              email: 'test@example.com'
            }))
          })

          cy.intercept('GET', '**/api/chat/models', {
            fixture: 'models.json'
          }).as('getModels')

          cy.visit('/chat')
          
          cy.get('.chat-layout').should('be.visible')
          
          // Verificar se a interface se adapta ao tamanho menor
          cy.get('body').should('not.have.css', 'overflow-x', 'scroll')
        })
      }
    })
  })

  describe('Form Validation on Different Screen Sizes', () => {
    it('should show validation errors properly on mobile', () => {
      cy.viewport(375, 667)
      cy.visit('/register')
      
      // Preencher formulário com erros
      cy.get('#name').type('A')
      cy.get('#email').type('email-invalido')
      cy.get('#password').type('123')
      cy.get('#confirmPassword').type('456')
      
      // Verificar se os erros são visíveis
      cy.get('#name').blur()
      cy.contains('Nome deve ter pelo menos 2 caracteres').should('be.visible')
      
      cy.get('#email').blur()
      cy.contains('Email deve ter um formato válido').should('be.visible')
      
      cy.get('#password').blur()
      cy.contains('Senha deve ter pelo menos 6 caracteres').should('be.visible')
      
      cy.get('#confirmPassword').blur()
      cy.contains('As senhas não coincidem').should('be.visible')
      
      // Verificar se os erros não causam scroll horizontal
      cy.get('body').should('not.have.css', 'overflow-x', 'scroll')
    })

    it('should maintain form layout on tablet', () => {
      cy.viewport(768, 1024)
      cy.visit('/register')
      
      // Verificar se o formulário se adapta bem ao tablet
      cy.get('.auth-page__container').should('be.visible')
      cy.get('.auth-page__container').should('have.css', 'max-width')
      
      // Preencher formulário
      cy.get('#name').type('João Silva')
      cy.get('#email').type('joao@example.com')
      cy.get('#password').type('senha123')
      cy.get('#confirmPassword').type('senha123')
      
      cy.get('button[type="submit"]').should('not.be.disabled')
    })
  })
})
