require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  include Devise::Test::ControllerHelpers

  let(:user) { create(:user, password: 'password123', active: true) } # Active user
  let(:inactive_user) { create(:user, password: 'password123', active: false) } # Inactive user

  before do
    @request.env["devise.mapping"] = Devise.mappings[:user]
  end

  describe 'POST #create' do
    context 'when login is successful (active user)' do
      let(:valid_params) { { user: { email: user.email, password: 'password123' } } }

      it 'sends an OTP and returns success message' do
        allow(UserMailer).to receive_message_chain(:send_otp, :deliver_now)

        post :create, params: valid_params, as: :json

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('OTP sent to your email. Please verify to log in.')
      end
    end

    context 'when login fails (inactive user)' do
      let(:inactive_params) { { user: { email: inactive_user.email, password: 'password123' } } }

      it 'sends OTP but returns account not verified error' do
        allow(UserMailer).to receive_message_chain(:send_otp, :deliver_now)

        post :create, params: inactive_params, as: :json

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['error']).to eq('Account not verified. Please check your email for OTP.')
      end
    end

    context 'when email or password is incorrect' do
      let(:invalid_params) { { user: { email: user.email, password: 'wrongpassword' } } }

      it 'returns invalid credentials error' do
        post :create, params: invalid_params, as: :json

        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['error']).to eq('Invalid email or password')
      end
    end
  end

  describe 'DELETE #destroy' do
    before { sign_in user } # Simulate user logged in

    it 'logs out the user' do
      delete :destroy, as: :json

      expect(response).to have_http_status(302) # Redirect status
      expect(controller.current_user).to be_nil
    end
  end
end
