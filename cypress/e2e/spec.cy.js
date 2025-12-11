describe('Instrumusic - Testes E2E', () => {
  it('Teste 1: Página inicial - elementos principais visíveis', () => {
    cy.visit('https://henriquevieiraneto.github.io/instrumusic/')
    cy.contains('InstruMusic: Aprenda, Crie, Transforme!').should('be.visible')
    cy.contains('Comece a Aprender').should('be.visible')
    cy.contains('Aulas Gratuitas').should('be.visible')
    cy.contains('Instrumentos Disponíveis').should('be.visible')
    cy.contains('Aulas Personalizadas').should('be.visible')
    cy.contains('Comunidade Vibrante').should('be.visible')
  })

  it('Teste 2: Página de instrumentos - cards visíveis', () => {
    cy.visit('https://henriquevieiraneto.github.io/instrumusic/instrumentos.html')
    cy.contains('Explore Nossos Instrumentos').should('be.visible')
    cy.contains('Guitarra').should('be.visible')
    cy.contains('Bateria').should('be.visible')
    cy.contains('Teclado').should('be.visible')
    cy.contains('Violino').should('be.visible')
    cy.contains('Flauta').should('be.visible')
    cy.contains('Trompete').should('be.visible')
  })

  it('Teste 3: Página de entrada - opções de login/cadastro', () => {
    cy.visit('https://henriquevieiraneto.github.io/instrumusic/entry.html')
    cy.contains('Bem-vindo à InstruMusic!').should('be.visible')
    cy.contains('Fazer Login').should('be.visible')
    cy.contains('Criar Conta (Cadastro)').should('be.visible')
    cy.contains('Voltar para a Página Inicial').should('be.visible')
  })

  it('Teste 4: Rodapé e redes sociais na página inicial', () => {
    cy.visit('https://henriquevieiraneto.github.io/instrumusic/')
    cy.contains('© 2025 InstruMusic').should('be.visible')
    cy.contains('Facebook').should('be.visible')
    cy.contains('Instagram').should('be.visible')
  })
})
