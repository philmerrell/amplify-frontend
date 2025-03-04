import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { ToastController } from "@ionic/angular/standalone";
import { UserService } from "../services/user.service";

export const AuthGuard: CanActivateFn = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const userService = inject(UserService);
    const router = inject(Router);
    
    const isAuthenticated = await userService.checkAuthStatus();

    
    if (isAuthenticated) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  };

  function presentToast(message: string) {
    const toastController = inject(ToastController);
    const toast = toastController.create({
      message,
      duration: 4000,
      color: 'danger'
    });
  }
  
export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => AuthGuard(route, state);