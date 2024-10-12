"use strict";
exports.__esModule = true;
exports.routes = void 0;
var exam_student_component_1 = require("./exam_student/exam_student.component");
var login_component_1 = require("./login/login.component");
var register_component_1 = require("./register/register.component");
var forgot_password_component_1 = require("./forgot-password/forgot-password.component");
var qrcode_component_1 = require("./qrcode/qrcode.component");
var reset_pw_component_1 = require("./reset-pw/reset-pw.component");
var routes = [
    { path: 'exam', component: exam_student_component_1.Exam_studentComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'register', component: register_component_1.RegisterComponent },
    { path: 'forgot-password', component: forgot_password_component_1.ForgotPasswordComponent },
    { path: 'qrcode', component: qrcode_component_1.QRcodeComponent },
    { path: 'reset-password', component: reset_pw_component_1.ResetPWComponent },
    { path: '', redirectTo: '/exam', pathMatch: 'full' }
];
exports.routes = routes;
