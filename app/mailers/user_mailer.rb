class UserMailer < ApplicationMailer
  default from: 'thusharkulal@gmail.com'

  def send_otp(user)
    @user = user
    mail(to: @user.email, subject: 'Your OTP for Login Verification')
  end
end
