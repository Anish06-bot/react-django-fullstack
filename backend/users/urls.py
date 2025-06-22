from django.urls import path
from .views import (
    RegisterView, OTPVerifyView, ResendOTPView, LoginView,
    PasswordResetRequestView, VerifyPasswordOTPView, PasswordResetConfirmView,
    ProtectedView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', OTPVerifyView.as_view(), name='verify_otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
    path('login/', LoginView.as_view(), name='login'),

    # 🔁 Password Reset with OTP (no email link)
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('verify-reset-otp/', VerifyPasswordOTPView.as_view(), name='verify_password_otp'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    path('protected/', ProtectedView.as_view(), name='protected'),
]
