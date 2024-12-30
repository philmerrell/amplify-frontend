import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function addBearerTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const token = ``;
    
    const clonedRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
      });

    return next(clonedRequest);
  }