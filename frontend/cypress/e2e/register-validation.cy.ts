describe('Register Form Password Validation', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('should display password mismatch error when passwords do not match', () => {
    // Preencher o formulário com senhas diferentes
    cy.get('#name').type('João Silva')
    cy.get('#email').type('joao@example.com')
    cy.get('#password').type('senha123')
    cy.get('#confirmPassword').type('senha456')

    // Verificar se o erro de confirmação de senha aparece
    cy.get('#confirmPassword').blur()
    cy.contains('As senhas não coincidem').should('be.visible')

    // Verificar se o botão de submit está desabilitado
    cy.get('button[type="submit"]').should('be.disabled')
  })

  it('should enable submit button when passwords match', () => {
    // Preencher o formulário com senhas iguais
    cy.get('#name').type('João Silva')
    cy.get('#email').type('joao@example.com')
    cy.get('#password').type('senha123')
    cy.get('#confirmPassword').type('senha123')

    // Verificar se não há erro de confirmação de senha
    cy.contains('As senhas não coincidem').should('not.exist')

    // Verificar se o botão de submit está habilitado
    cy.get('button[type="submit"]').should('not.be.disabled')
  })

  it('should validate password strength requirements', () => {
    cy.get('#name').type('João Silva')
    cy.get('#email').type('joao@example.com')

    // Testar senha muito curta
    cy.get('#password').type('123')
    cy.get('#password').blur()
    cy.contains('Senha deve ter pelo menos 6 caracteres').should('be.visible')

    // Testar senha sem letras
    cy.get('#password').clear().type('123456')
    cy.get('#password').blur()
    cy.contains('Senha deve conter pelo menos uma letra').should('be.visible')

    // Testar senha válida
    cy.get('#password').clear().type('senha123')
    cy.get('#password').blur()
    cy.contains('Senha deve ter pelo menos 6 caracteres').should('not.exist')
    cy.contains('Senha deve conter pelo menos uma letra').should('not.exist')
  })

  it('should validate all required fields', () => {
    // Tentar submeter formulário vazio
    cy.get('button[type="submit"]').should('be.disabled')

    // Preencher nome
    cy.get('#name').type('A') // Nome muito curto
    cy.get('#name').blur()
    cy.contains('Nome deve ter pelo menos 2 caracteres').should('be.visible')

    cy.get('#name').clear().type('João Silva')
    cy.get('#name').blur()
    cy.contains('Nome deve ter pelo menos 2 caracteres').should('not.exist')

    // Preencher email inválido
    cy.get('#email').type('email-invalido')
    cy.get('#email').blur()
    cy.contains('Email deve ter um formato válido').should('be.visible')

    cy.get('#email').clear().type('joao@example.com')
    cy.get('#email').blur()
    cy.contains('Email deve ter um formato válido').should('not.exist')

    // Preencher senhas
    cy.get('#password').type('senha123')
    cy.get('#confirmPassword').type('senha123')

    // Agora o botão deve estar habilitado
    cy.get('button[type="submit"]').should('not.be.disabled')
  })

  it('should show real-time validation feedback', () => {
    // Testar feedback em tempo real para confirmação de senha
    cy.get('#password').type('senha123')
    cy.get('#confirmPassword').type('senha')
    
    // Verificar erro em tempo real
    cy.contains('As senhas não coincidem').should('be.visible')
    
    // Corrigir a senha
    cy.get('#confirmPassword').clear().type('senha123')
    cy.contains('As senhas não coincidem').should('not.exist')
  })

  it('should maintain validation state when switching between fields', () => {
    // Preencher email inválido
    cy.get('#email').type('email-invalido')
    cy.get('#name').click() // Mudar foco
    cy.contains('Email deve ter um formato válido').should('be.visible')

    // Corrigir email
    cy.get('#email').clear().type('joao@example.com')
    cy.get('#password').click() // Mudar foco
    cy.contains('Email deve ter um formato válido').should('not.exist')
  })
})
