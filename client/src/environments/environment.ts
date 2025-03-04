// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { secrets } from './secrets';

export const environment = {
  // chatEndpoint: 'http://localhost:8000',
  apiBaseUrl: 'http://localhost:3015/dev',
  // apiBaseUrl: 'https://dev-chat-api.dev.boisestate.edu',
  chatEndpoint: 'https://si62aopn4bfch4cyohmfcvrz4y0gsiab.lambda-url.us-east-1.on.aws/',
  production: false,
  cognito: {
    clientId: 'q0m6trkhevtbfa3a1sn2rbu65',
    clientSecret: secrets.cognito.clientSecret,
    domain: 'dev-chat-auth.dev.boisestate.edu',
    redirectUri: 'http://localhost:4200/auth/callback/cognito',
    responseType: 'code',
    scope: 'openid email',
    nonce: 'd6BXtkwvhb4xP26cJ5eZOA17wbGw_Ngly55aC3rCiow'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI. 