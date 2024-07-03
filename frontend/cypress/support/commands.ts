/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }




// import { Method } from 'cypress/types/net-stubbing';
//
// Cypress.Commands.add('login', (email: string, password: string) => {
//   const loginUserData = {email, password}
//   cy.request({
//     method: 'POST',
//     url: Cypress.env('api_server') + '/auth/login',
//     // url: 'http://localhost:5000/auth/login',
//     body: { loginUserData },
//     // body: { email, password }
//   }).then((response) => {
//     const { accessToken } = response.body;
//     // cy.log('123=====', accessToken);
//
//     localStorage.setItem('accessToken', accessToken);
//     cy.wrap(accessToken).as('accessToken');
//   });
// });
//
// Cypress.Commands.add('setTokenInLocalStorage', (token: string) => {
//   cy.window().then((window) => {
//     window.localStorage.setItem('accessToken', token);
//   });
// });
//
// Cypress.Commands.add('interceptWithToken', (alias: string, method: Method, url: string, token: string, response: any) => {
//   cy.intercept(method, url, (req) => {
//     req.headers['Authorization'] = `Bearer ${token}`;
//     req.reply(response);
//   }).as(alias);
// });





// Cypress.Commands.add('login', (email, password) => {
//   const loginUserData = {email, password}
//
//   cy.request('POST', `${Cypress.env('api_server')}/auth/login`, {
//     loginUserData
//   }).then((response) => {
//     const { accessToken } = response.body;
//     cy.wrap(accessToken).as('accessToken');
//   });
// });
//
// Cypress.Commands.add('setTokenInLocalStorage', (token) => {
//   cy.window().then((window) => {
//     window.localStorage.setItem('accessToken', token);
//   });
// });
//
// Cypress.Commands.add('interceptWithToken', (alias, method, url, token, response) => {
//   cy.intercept(method, url, (req) => {
//     req.headers['Authorization'] = `Bearer ${token}`;
//     req.reply(response);
//   }).as(alias);
// });








Cypress.Commands.add('login', (email, password) => {
  const loginUserData = {email, password};

  cy.request('POST', `${Cypress.env('api_server')}/auth/login`, {
    loginUserData
  }).then((response) => {
    const { accessToken } = response.body;
    cy.setTokenInLocalStorage(accessToken);
    cy.wrap(accessToken).as('accessToken');
  });
});

Cypress.Commands.add('setTokenInLocalStorage', (token) => {
  cy.window().then((window) => {
    window.localStorage.setItem('accessToken', token);
  });
});

Cypress.Commands.add('visitWithToken', (url) => {
  cy.window().then((window) => {
    const token = window.localStorage.getItem('accessToken');
    cy.visit(url, {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', token);
      },
    });
  });
});

Cypress.Commands.add('interceptWithToken', (alias, method, url, token, response) => {
  cy.intercept(method, url, (req) => {
    req.headers['Authorization'] = `Bearer ${token}`;
    req.reply(response);
  }).as(alias);
});
