class ApplicationController < ActionController::Base
  include Rails.application.routes.url_helpers

  # Redirect unauthenticated users to the custom login page
  before_action :authenticate_user!

  private

  def authenticate_user!
    unless user_signed_in?
      respond_to do |format|
        format.html { redirect_to root_path, alert: 'You need to log in to access this page.' }
        format.json { render json: { error: 'You need to log in to access this page.' }, status: :unauthorized }
      end
    end
  end

  def after_sign_up_path_for(_resource)
    surveys_path # Redirect to Survey Index page after sign-up
  end

  def after_sign_in_path_for(_resource)
    surveys_path # Redirect to Survey Index page after login
  end

  def after_sign_out_path_for(_resource_or_scope)
    root_path # Redirect to custom login page (root path)
  end
end
