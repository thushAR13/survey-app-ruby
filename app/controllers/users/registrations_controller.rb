class Users::RegistrationsController < Devise::RegistrationsController
  # Override the create action
  skip_before_action :authenticate_user!
  def create
    build_resource(sign_up_params)

    if resource.save
      resource.generate_otp
      UserMailer.send_otp(resource).deliver_now
      render json: { message: "Account created! Please verify OTP to activate your account." }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Permit additional parameters if needed
  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
