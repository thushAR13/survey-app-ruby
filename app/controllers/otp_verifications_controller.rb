class OtpVerificationsController < ApplicationController
  skip_before_action :authenticate_user!

  def verify
    user = User.find_by(email: params[:email])

    if user.present?
      if user.verify_otp(params[:otp]) # Assuming `verify_otp` checks the OTP
        if user.active?
          # Login OTP verification
          sign_in(user)
          render json: { success: true, message: 'Login successful!' }, status: :ok
        else
          # Sign-up OTP verification
          user.update(active: true) # Mark user as active
          sign_in(user)
          render json: { success: true, message: 'Account activated successfully!' }, status: :ok
        end
      else
        render json: { success: false, error: 'Invalid or expired OTP.' }, status: :unprocessable_entity
      end
    else
      render json: { success: false, error: 'Invalid OTP or user not found.' }, status: :not_found
    end
  end
end
