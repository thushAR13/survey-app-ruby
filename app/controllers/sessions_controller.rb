class SessionsController < ApplicationController
  # Skip authentication for login-related actions
  skip_before_action :authenticate_user!, only: %i[new create]

  def new
    # Redirect to surveys page if the user is already logged in
    redirect_to surveys_path if user_signed_in?
  end

  def create
    user = User.find_by(email: params[:user][:email])

    if user&.valid_password?(params[:user][:password])
      if user.active?
        user.generate_otp
        UserMailer.send_otp(user).deliver_now
        render json: { message: 'OTP sent to your email. Please verify to log in.' }, status: :ok
      else
        user.generate_otp
        UserMailer.send_otp(user).deliver_now
        render json: { error: 'Account not verified. Please check your email for OTP.' }, status: :unauthorized
      end
    else
      render json: { error: 'Invalid email or password' }, status: :unprocessable_entity
    end
  end

  def destroy
    sign_out(current_user)
    redirect_to root_path, notice: 'Logged out successfully.'
  end
end
