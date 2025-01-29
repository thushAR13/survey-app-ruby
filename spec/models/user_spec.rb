require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { should have_many(:surveys).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }

    it 'allows valid emails' do
      valid_user = build(:user, email: 'user@elitmus.com')
      expect(valid_user).to be_valid
    end

    it 'rejects invalid emails' do
      invalid_user = build(:user, email: 'user@gmail.com')
      expect(invalid_user).not_to be_valid
    end
  end

  describe '#generate_otp' do
    let(:user) { create(:user) }

    it 'sets OTP and expiration time' do
      user.generate_otp
      expect(user.otp).not_to be_nil
      expect(user.otp_expires_at).to be_within(1.second).of(10.minutes.from_now)
    end
  end

  describe '#verify_otp' do
    let(:user) { create(:user) }

    it 'activates user with correct OTP' do
      user.generate_otp
      otp = user.otp
      expect(user.verify_otp(otp)).to be true
      expect(user.active).to be true
    end

    it 'rejects expired OTP' do
      user.generate_otp
      user.update(otp_expires_at: 5.minutes.ago)
      expect(user.verify_otp(user.otp)).to be false
    end
  end

  describe '#clear_otp' do
    let(:user) { create(:user) }

    it 'clears OTP and expiration time' do
      user.generate_otp
      user.clear_otp
      expect(user.otp).to be_nil
      expect(user.otp_expires_at).to be_nil
    end
  end
end
