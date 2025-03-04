import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthTokenService } from '../auth/auth-token.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class LoginPage implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  
  ngOnInit() {
    // Check if user is already logged in with a valid token
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['/conversation/new']);
    }
  }

  login() {
    // Call the auth service login method
    this.authService.login();
  }
} 