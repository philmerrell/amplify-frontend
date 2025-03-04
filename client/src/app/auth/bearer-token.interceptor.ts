import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, EMPTY, finalize, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular/standalone";
import { AuthTokenService } from './auth-token.service';
import { AuthService } from './auth.service';

export function addBearerTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(addTokenToRequest(req)).pipe(
    catchError(err => handleError(err, req, next)),
    finalize(()=> {

    })
  )
}

function addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
  const authTokenService = inject(AuthTokenService);
  
  // const token = ``;
  const clonedRequest = req.clone({
    setHeaders: {
        Authorization: `Bearer ${authTokenService.getAccessToken()}`
    }
  });
  return clonedRequest;
}

function handleError(error: any, request?:HttpRequest<any>, next?: HttpHandlerFn) {
  if (error instanceof NoTokensError) {
    // authService.redirectToLogin();
    return EMPTY;
  }

  if (error instanceof HttpErrorResponse) {
      switch (error.status) {
          case 401: {
              return handleUnauthorized(request!, next!);
          }
          // case 400: {
          //     return throwError(() => error); // rethrow the error and catch it in the service
          // }
          // case 403:
          //     // this.router.navigate(['/unauthorized']);
          //     return EMPTY;
          // case 500: {
          //     this.toastService.showToast({
          //         message: 'An unexpected error has occurred.',
          //         color: 'danger',
          //         duration: 3000,
          //     });
          //     return EMPTY;
          // }
          default: {
              return EMPTY;
          }
      }
  }
  return throwError(() => error);
}

function handleUnauthorized(request: HttpRequest<any>, next: HttpHandlerFn) {
  const router = inject(Router);

  // before redirecting to login, check to see if we can refresh the token
  const authTokenService = inject(AuthTokenService);
  const canRefreshToken = authTokenService.canRefreshToken();
  if (canRefreshToken) {
    handleRefresh(request, next);
    return EMPTY;
  }

  router.navigate(['/login']);
  return EMPTY;
}

function handleRefresh(request: HttpRequest<any>, next: HttpHandlerFn) {
  const router = inject(Router);

  const authTokenService = inject(AuthTokenService);
  const refreshToken = authTokenService.getRefreshToken();
  if (!refreshToken) {
    router.navigate(['/login']);
    return EMPTY;
  }
  
  const authService = inject(AuthService);
  authService.refreshToken().then((token) => {
    authTokenService.setAccessToken(token.access_token);
    authTokenService.setRefreshToken(token.refresh_token);
    authTokenService.setIdToken(token.id_token);
    router.navigate(['/login']);
  });
  return EMPTY;
}

async function presentToast(message: string, color: string) {
  const toastService = inject(ToastController);
  const toast = await toastService.create({
    message,
    color
  });
  toast.present();
}

export class NoTokensError extends Error {
  constructor(message?: string) {
      super(message);
      this.name = noTokensErrorName;
  }
}

export const noTokensErrorName = 'NoTokensError';