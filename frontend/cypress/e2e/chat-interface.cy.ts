describe('Chat Interface', () => {
  beforeEach(() => {
    // Simular usuário autenticado
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'fake-token')
      win.localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }))
    })

    // Interceptar requisições da API
    cy.intercept('GET', '**/api/chat/models', {
      fixture: 'models.json'
    }).as('getModels')

    cy.visit('/chat')
  })

  it('should display chat interface correctly', () => {
    cy.get('.chat-layout').should('be.visible')
    cy.get('.chat-sidebar').should('be.visible')
    cy.get('.chat-window').should('be.visible')
    
    // Verificar se carregou os modelos
    cy.wait('@getModels')
  })

  it('should show model selector', () => {
    cy.wait('@getModels')
    cy.get('.model-selector').should('be.visible')
  })

  it('should allow creating new chat', () => {
    cy.get('.chat-sidebar__new-chat').should('be.visible').click()
    
    // Verificar se há uma área para digitar mensagem
    cy.get('.chat-input').should('be.visible')
  })

  it('should handle message sending', () => {
    // Interceptar envio de mensagem
    cy.intercept('POST', '**/api/chat/conversation', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          response: 'Esta é uma resposta de teste do AI',
          updatedContext: ['Mensagem de teste', 'Esta é uma resposta de teste do AI']
        }
      }
    }).as('sendMessage')

    const testMessage = 'Olá, esta é uma mensagem de teste'
    
    // Digitar e enviar mensagem
    cy.get('.chat-input input, .chat-input textarea').type(testMessage)
    cy.get('.chat-input button[type="submit"]').click()

    // Verificar se a mensagem aparece
    cy.contains(testMessage).should('be.visible')
    
    // Verificar requisição
    cy.wait('@sendMessage')
    
    // Verificar resposta do AI
    cy.contains('Esta é uma resposta de teste do AI').should('be.visible')
  })

  it('should show loading state during message sending', () => {
    // Interceptar com delay
    cy.intercept('POST', '**/api/chat/conversation', {
      delay: 2000,
      statusCode: 200,
      body: {
        success: true,
        data: {
          response: 'Resposta após delay',
          updatedContext: []
        }
      }
    }).as('sendMessageSlow')

    cy.get('.chat-input input, .chat-input textarea').type('Mensagem de teste')
    cy.get('.chat-input button[type="submit"]').click()

    // Verificar estado de loading
    cy.get('.chat-input button[type="submit"]').should('be.disabled')
    
    cy.wait('@sendMessageSlow')
  })

  it('should handle API errors gracefully', () => {
    // Interceptar com erro
    cy.intercept('POST', '**/api/chat/conversation', {
      statusCode: 500,
      body: {
        success: false,
        error: 'Erro interno do servidor'
      }
    }).as('sendMessageError')

    cy.get('.chat-input input, .chat-input textarea').type('Mensagem que vai dar erro')
    cy.get('.chat-input button[type="submit"]').click()

    cy.wait('@sendMessageError')
    
    // Verificar se mostra mensagem de erro
    cy.contains('Erro').should('be.visible')
  })

  it('should maintain conversation context', () => {
    // Primeira mensagem
    cy.intercept('POST', '**/api/chat/conversation', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          response: 'Primeira resposta',
          updatedContext: ['Primeira mensagem', 'Primeira resposta']
        }
      }
    }).as('firstMessage')

    cy.get('.chat-input input, .chat-input textarea').type('Primeira mensagem')
    cy.get('.chat-input button[type="submit"]').click()
    cy.wait('@firstMessage')

    // Segunda mensagem (deve incluir contexto)
    cy.intercept('POST', '**/api/chat/conversation', (req) => {
      // Verificar se o contexto foi enviado
      expect(req.body.context).to.deep.equal(['Primeira mensagem', 'Primeira resposta'])
      
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          data: {
            response: 'Segunda resposta',
            updatedContext: ['Primeira mensagem', 'Primeira resposta', 'Segunda mensagem', 'Segunda resposta']
          }
        }
      })
    }).as('secondMessage')

    cy.get('.chat-input input, .chat-input textarea').clear().type('Segunda mensagem')
    cy.get('.chat-input button[type="submit"]').click()
    cy.wait('@secondMessage')
  })

  it('should clear chat when requested', () => {
    // Enviar uma mensagem primeiro
    cy.intercept('POST', '**/api/chat/conversation', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          response: 'Resposta para limpar',
          updatedContext: ['Mensagem para limpar', 'Resposta para limpar']
        }
      }
    }).as('messageBeforeClear')

    cy.get('.chat-input input, .chat-input textarea').type('Mensagem para limpar')
    cy.get('.chat-input button[type="submit"]').click()
    cy.wait('@messageBeforeClear')

    // Limpar chat (assumindo que há um botão de limpar)
    cy.get('.chat-sidebar__new-chat').click()
    
    // Verificar se as mensagens foram limpas
    cy.contains('Mensagem para limpar').should('not.exist')
  })
})
