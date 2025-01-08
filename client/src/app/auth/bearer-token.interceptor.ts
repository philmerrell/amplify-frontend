import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, EMPTY, finalize, Observable, throwError } from "rxjs";
import { DeveloperSettingsService } from "../settings/developer/developer-settings.service";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular/standalone";

export function addBearerTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(addTokenToRequest(req)).pipe(
    catchError(err => handleError(err, req, next)),
    finalize(()=> {

    })
  )
}

function addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
  const developerSettings = inject(DeveloperSettingsService); // Inject the service
  const jwt = developerSettings.getDeveloperJwt();
  // const token = ``;
  const clonedRequest = req.clone({
    setHeaders: {
        Authorization: `Bearer ${jwt()}`
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
  presentToast('401: Update your bearer token', 'danger')
  router.navigateByUrl('/settings/developer');
  return EMPTY;

  // TODO: refresh token...
  // return this.refreshToken().pipe(
  //     switchMap(() => next.handle(this.addTokenToRequest(request))),
  //     catchError(err => {
  //         this.clearUserAndTokens();
  //         return throwError(() => err);
  //     })
  // );
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