require 'rails_helper'

RSpec.describe Users::RegistrationsController, type: :controller do
  include Devise::Test::ControllerHelpers # FIXES Devise::MissingWarden error

  before do
    @request.env['devise.mapping'] = Devise.mappings[:user] # Fix Devise mapping
  end

  describe 'POST #create' do
    let(:valid_attributes) do
      {
        user: {
          email: 'test@elitmus.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }
    end

    let(:invalid_attributes) do
      {
        user: {
          email: 'invalidemail.com',
          password: 'pass',
          password_confirmation: 'wrongpass'
        }
      }
    end

    context 'when registration is successful' do
      it 'creates a new user and returns a success message' do
        expect do
          post :create, params: valid_attributes, as: :json
        end.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['message']).to eq('Account created! Please verify OTP to activate your account.')
      end

      it 'generates an OTP for the user' do
        post :create, params: valid_attributes, as: :json
        user = User.find_by(email: valid_attributes[:user][:email])

        expect(user.otp).not_to be_nil
        expect(user.otp_expires_at).to be_present
      end

      it 'sends an OTP email' do
        expect do
          post :create, params: valid_attributes, as: :json
        end.to change { ActionMailer::Base.deliveries.count }.by(1)
      end
    end

    context 'when registration fails' do
      it 'returns error messages for invalid input' do
        post :create, params: invalid_attributes, as: :json

        expect(response.status).to eq(422) # Fix for Invalid HTTP status error
        expect(JSON.parse(response.body)['errors']).to include('Email is unauthorized(use domains elitmus.com or yopmail.com)')
      end
    end
  end
end
