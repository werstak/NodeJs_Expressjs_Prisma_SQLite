// declare namespace Cypress {
//   interface Chainable {
//     login(email: string, password: string): Chainable<string>;
//     setTokenInLocalStorage(token: string): Chainable<void>;
//     interceptWithToken(alias: string, method: Method, url: string, token: string, response: any): Chainable<void>;
//   }
// }


import { Method } from 'cypress/types/net-stubbing';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<string>;
      setTokenInLocalStorage(token: string): Chainable<void>;
      interceptWithToken(alias: string, method: Method, url: string, token: string, response: any): Chainable<void>;
    }
  }
}
