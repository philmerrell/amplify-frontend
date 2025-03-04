import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthTokenService } from '../auth-token.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  styleUrls: ['./callback.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CallbackPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authTokenService = inject(AuthTokenService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  
  loading = true;
  error = '';

  ngOnInit() {
    this.handleAuthCallback();
  }

  private async handleAuthCallback(): Promise<void> {
    try {
      // Get the query parameters from the URL
      this.route.queryParams.subscribe(async params => {
        // Check if there's an error in the callback
        if (params['error']) {
          this.error = `Authentication error: ${params['error_description'] || params['error']}`;
          this.loading = false;
          return;
        }

        // For authorization code flow
        if (params['code']) {
          await this.handleAuthorizationCode(params['code']);
          return;
        }

        this.error = 'No authentication data found in the callback URL';
        this.loading = false;
      });
    } catch (error) {
      this.error = `Authentication processing error: ${error instanceof Error ? error.message : String(error)}`;
      this.loading = false;
    }
  }

  private async handleAuthorizationCode(code: string): Promise<void> {
    try {
      // Exchange the authorization code for tokens
      const token = await this.authService.exchangeCodeForToken(code);
      
      // Store the token
      this.authTokenService.setAccessToken(token.access_token);
      this.authTokenService.setRefreshToken(token.refresh_token);
      this.authTokenService.setIdToken(token.id_token);

      // Update user state
      await this.userService.checkAuthStatus();
      
      
      // Redirect to the main app
      this.redirectToApp();
    } catch (error) {
      this.error = `Failed to exchange code for token: ${error instanceof Error ? error.message : String(error)}`;
      this.loading = false;
    }
  }

  private redirectToApp(): void {
    // Redirect to the main app page
    this.router.navigate(['/conversation/new']);
  }
} 