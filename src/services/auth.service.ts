import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface User {
  _id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  token?: string;
}

interface AuthResponse {
  token: string;
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Thay đổi theo API của bạn

  constructor(private http: HttpClient) {}

  // Phương thức đăng nhập
  signIn(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/sign-in`, credentials).pipe(
      tap((response) => {
        console.log('Đăng nhập thành công:', response);
        if (response.user && response.token) {
          localStorage.setItem('user', JSON.stringify(response.user)); // Lưu thông tin người dùng
          this.saveToken(response.token); // Lưu token vào localStorage
        } else {
          console.error('Phản hồi đăng nhập không có token hoặc user');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Phương thức để lưu token
  private saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Phương thức đăng ký
  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-up`, userData).pipe(catchError(this.handleError));
  }

  // Phương thức cập nhật vai trò người dùng
  updateUserRole(userId: string, role: string): Observable<AuthResponse> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<AuthResponse>(`${this.apiUrl}/users/${userId}/role`, { role }, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Phương thức lấy thông tin người dùng hiện tại
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Phương thức cập nhật thông tin người dùng
  updateUser(updatedUser: User): Observable<User> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<User>(`${this.apiUrl}/user/update`, updatedUser, { headers }).pipe(
      tap((response) => {
        if (response) {
          localStorage.setItem('user', JSON.stringify(response)); // Cập nhật thông tin người dùng trong localStorage
        }
      }),
      catchError(this.handleError)
    );
  }

  // Phương thức lấy ID người dùng (_id)
  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user._id : null;
  }

  // Phương thức đăng xuất
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }),
      catchError(this.handleError)
    );
  }

  // Phương thức xử lý lỗi
  private handleError(error: any): Observable<never> {
    console.error('Lỗi trong quá trình xử lý:', error);
    if (error.status === 401) {
      alert('Email hoặc mật khẩu không đúng!');
    } else {
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
    return throwError(error);
  }
}