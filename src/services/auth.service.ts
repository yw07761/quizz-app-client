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
  token?: string; // Token có thể không có nếu không được trả về
}

interface AuthResponse {
  token: any;
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
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user)); // Lưu thông tin người dùng
          
          // Check if token exists on the response directly
          if (response.token) { 
            this.saveToken(response.token); // Lưu token vào localStorage
          } else {
            console.error('Token không có trong phản hồi');
          }
        }
      }),
      catchError(this.handleError) // Sử dụng phương thức xử lý lỗi
    );
  }
  

  // Phương thức để lưu token
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token); // Lưu token vào localStorage
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token'); // Lấy token từ localStorage
  }

  // Phương thức đăng ký
  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-up`, userData);
  }
  


  // Phương thức cập nhật vai trò người dùng
  updateUserRole(userId: string, role: string): Observable<AuthResponse> {
    const token = this.getToken(); // Lấy token từ localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<AuthResponse>(`${this.apiUrl}/users/${userId}/role`, { role }, { headers }).pipe(
      catchError(this.handleError) // Sử dụng phương thức xử lý lỗi
    );
  }

  // Phương thức lấy thông tin người dùng hiện tại
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user'); // Lấy thông tin người dùng từ localStorage
    return userStr ? JSON.parse(userStr) : null; // Phân tích JSON nếu có người dùng
  }

  // Phương thức lấy ID người dùng (_id)
  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user._id : null; // Trả về ID người dùng hoặc null
  }

  // Phương thức đăng xuất
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('user'); // Xóa thông tin người dùng từ localStorage
        localStorage.removeItem('auth_token'); // Xóa token
      }),
      catchError(this.handleError) // Sử dụng phương thức xử lý lỗi
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
