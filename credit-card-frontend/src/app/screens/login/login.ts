import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  prefix = '';
  error = '';

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    this.auth.login(this.prefix).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: any) => {
        console.error(err);
        this.error = 'Login failed. Check prefix.';
      }
    });
  }
}
