import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str

from .serializers import (
    RegisterSerializer, LoginSerializer,
    OTPVerifySerializer, ResendOTPSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)

User = get_user_model()

# Utility function to send OTP
def send_otp(email, otp):
    send_mail(
        'Your OTP Code',
        f'Your OTP is: {otp}',
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )


# Register View
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            otp = str(random.randint(100000, 999999))
            cache.set(f'otp_{user.email}', otp, timeout=300)
            send_otp(user.email, otp)
            return Response({"message": "OTP sent to email."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# OTP Verification for Registration
class OTPVerifyView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            cached_otp = cache.get(f'otp_{email}')
            if cached_otp == otp:
                cache.delete(f'otp_{email}')
                return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Resend OTP
class ResendOTPView(APIView):
    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user:
                otp = str(random.randint(100000, 999999))
                cache.set(f'otp_{email}', otp, timeout=300)
                send_otp(email, otp)
                return Response({"message": "OTP resent to email."}, status=status.HTTP_200_OK)
            return Response({"error": "Email not registered."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            token, _ = Token.objects.get_or_create(user=serializer.validated_data['user'])
            return Response({"token": token.key})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Send OTP for Password Reset (instead of link)
class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user:
                otp = str(random.randint(100000, 999999))
                cache.set(f'reset_otp_{email}', otp, timeout=300)
                send_mail(
                    "Password Reset OTP",
                    f"Your OTP for password reset is: {otp}",
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                )
            return Response({"message": "If the email exists, an OTP has been sent."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Verify OTP for password reset
class VerifyPasswordOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        cached_otp = cache.get(f'reset_otp_{email}')
        if cached_otp and cached_otp == otp:
            cache.set(f'reset_verified_{email}', True, timeout=300)
            return Response({"message": "OTP verified. You can now reset your password."})
        return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)



# Reset password after OTP verification
class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            email = request.data.get('email')
            if not cache.get(f'reset_verified_{email}'):
                return Response({"error": "OTP not verified or expired."}, status=status.HTTP_403_FORBIDDEN)

            user = User.objects.filter(email=email).first()
            if not user:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            user.set_password(serializer.validated_data['new_password'])
            user.save()
            cache.delete(f'reset_verified_{email}')
            return Response({"message": "Password reset successful."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Protected route
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Hello, {request.user.username}. This is a protected endpoint."})
