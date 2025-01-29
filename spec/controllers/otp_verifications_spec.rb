require 'rails_helper'

RSpec.describe OtpVerificationsController, type: :controller do
  include Devise::Test::ControllerHelpers

  let(:user) { create(:user, active: false) } # Inactive user for OTP verification
  let(:active_user) { create(:user, active: true) } # Active user for login OTP verification

  before do
    @request.env["devise.mapping"] = Devise.mappings[:user]
  end

  describe 'POST #verify' do
    context 'when OTP is correct for new user' do
      it 'activates the user and logs them in' do
        user.generate_otp
        post :verify, params: { email: user.email, otp: user.otp }, as: :json

        user.reload
        expect(user.active).to be true # User should be activated
        expect(controller.current_user).to eq(user) # User should be logged in
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('Login successful!')
      end
    end

    context 'when OTP is correct for an active user' do
      it 'logs the user in' do
        active_user.generate_otp
        post :verify, params: { email: active_user.email, otp: active_user.otp }, as: :json

        expect(controller.current_user).to eq(active_user) # User should be logged in
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('Login successful!')
      end
    end

    context 'when OTP is invalid' do
      it 'returns an error' do
        post :verify, params: { email: user.email, otp: 'wrongotp' }, as: :json

        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['error']).to eq('Invalid or expired OTP.')
      end
    end

    context 'when user is not found' do
      it 'returns a not found error' do
        post :verify, params: { email: 'nonexistent@example.com', otp: '123456' }, as: :json

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq('Invalid OTP or user not found.')
      end
    end
  end
end
