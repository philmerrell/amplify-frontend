// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // apiBaseUrl: 'https://pm5i3z1g3h.execute-api.us-east-1.amazonaws.com/dev',
  apiBaseUrl: 'http://localhost:3015/dev',
  chatEndpoint: 'https://si62aopn4bfch4cyohmfcvrz4y0gsiab.lambda-url.us-east-1.on.aws/',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
