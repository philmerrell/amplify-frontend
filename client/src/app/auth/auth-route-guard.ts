import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthTokenService } from "./auth-token.service";
import { inject } from "@angular/core";
import { ToastController } from "@ionic/angular/standalone";

export const authGuard: CanActivateFn = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const authTokenService = inject(AuthTokenService);
    const router = inject(Router);
    
    const jwt = authTokenService.getAuthTokenFromLocalStorage();
    if (jwt) {
        const isExpired = await authTokenService.isAccessTokenExpired(jwt);
        if (isExpired) {
            router.navigate(['/settings/developer']);
            presentToast('Your bearer token has expired.')
            return false;
        } else {
            return true;
        }
    } else {
        router.navigate(['/settings/developer']);
        presentToast('Please input a valid JWT.')
        return false;
    }
  };

  function presentToast(message: string) {
    const toastController = inject(ToastController);
    const toast = toastController.create({
        message,
        duration: 4000,
        color: 'danger'
    })
  }
  
  export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => authGuard(route, state);
  