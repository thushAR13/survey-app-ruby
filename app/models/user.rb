class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  after_initialize :set_defaults, unless: :persisted?

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2]
  validates :email, format: {
    with: /\A[\w+\-.]+@(elitmus\.com|yopmail\.com)\z/,
    message: 'is unauthorized(use domains elitmus.com or yopmail.com)'
  }
  has_many :surveys, dependent: :destroy

  def set_defaults
    self.active ||= false
  end
  # Generate OTP
  def generate_otp
    self.otp = rand(100_000..999_999).to_s
    self.otp_expires_at = 10.minutes.from_now
    save!
  end

  # Verify OTP
  def verify_otp(submitted_otp)
    return false if otp != submitted_otp || otp_expires_at.past?

    update(active: true, otp: nil, otp_expires_at: nil) # Activate account or allow login
    true
  end

  # Clear OTP
  def clear_otp
    update(otp: nil, otp_expires_at: nil)
  end
end
