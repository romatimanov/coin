describe("index", () => {
  beforeEach(() => {
    localStorage.removeItem("check");
    cy.visit("http://localhost:8080/");
    cy.get('input.form-input[placeholder="Login"]').type("developer");
    cy.get('input.form-input[placeholder="Password"]').type("skillbox");
    cy.get(".form-btn").click();
  });

  it("список счетов", () => {
    cy.intercept("GET", "http://localhost:3000/accounts").as("getAccounts");
    cy.wait("@getAccounts").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it("проверка создании счета", () => {
    cy.get(".check-btn").click();
    cy.get(".check-card").should("exist");
  });

  it("обмен валюты", () => {
    cy.visit("http://localhost:8080/exchange");
    cy.get(".exhange-input").type("200");
    cy.get(".choices-exchange").eq(0).click().find('.choices__item').contains('BTC').click();
    cy.get(".choices-exchange").eq(1).click().find('.choices__item').contains('USD').click();  
    cy.get(".change-btn").click();
  });
});
