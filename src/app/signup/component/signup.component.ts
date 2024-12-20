import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
  ],
  providers:[HttpClient],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  public regForm!: FormGroup;
  buttonLock = false;
  errorPost = new BehaviorSubject<string>('');
  buttonClicked = false;
  errorPostSubject$ = this.errorPost.asObservable();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
  ) {}
  
  ngOnInit() {
    this.regForm = this.fb.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
      ],

      lastName: [
        '',
        [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w\d_]+@[\w\d_]+\.\w{2,7}$/),
        ],
      ],

      password: [
        '',
        [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
      ],
    });

    this.regForm.valueChanges.subscribe({
      next: () => {
        if (this.errorPost.getValue()) {
          this.errorPost.next('');
          this.buttonClicked = true;
        }
      },
    });
  }

  register() {
    this.buttonLock = true;
    const body = { first_name: this.regForm.controls['firstName'].value, last_name: this.regForm.controls['lastName'].value, email:this.regForm.controls['email'].value, password:this.regForm.controls['password'].value }
    this.http.post('http://localhost:3000/api/register', body).subscribe({
      next:(request)=>{
        console.log('Autorizated seccesseful', request);
        this.router.navigate(['/'])
      },
      error:(error)=>{
        console.log('Autorization error',error)
      }
    })
    this.regForm.controls['password'].reset();
    setTimeout(() => {
      this.buttonLock = false;
    }, 2000);
  }
}
