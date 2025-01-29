Rails.application.routes.draw do
  # Use custom sessions controller for login/logout
  root 'sessions#new' # Custom login page as root

  post '/login', to: 'sessions#create', as: :login
  delete '/logout', to: 'sessions#destroy', as: :logout

  # Devise routes for other actions like registration
  devise_for :users, skip: [:sessions], controllers: { registrations: 'users/registrations' }
  post '/otp_verifications', to: 'otp_verifications#verify', as: :otp_verifications
  resources :surveys do
    member do
      get :responses
    end
  end

  get '/surveys/public/:public_link', to: 'surveys#public_view', as: :public_survey

  resources :questions
  resources :responses, only: [:create]
end
