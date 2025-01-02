import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { DeveloperSettingsService } from "../settings/developer/developer-settings.service";

export function addBearerTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const developerSettings = inject(DeveloperSettingsService); // Inject the service
  const jwt = developerSettings.getDeveloperJwt();
  // const token = ``;
    const clonedRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${jwt()}`
        }
      });

    return next(clonedRequest);
  }