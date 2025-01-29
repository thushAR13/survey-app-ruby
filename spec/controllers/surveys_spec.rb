require 'rails_helper'

RSpec.describe SurveysController, type: :controller do
  include Devise::Test::ControllerHelpers

  let(:user) { create(:user) }
  let(:survey) { create(:survey, user: user) }

  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
    sign_in user
  end

  describe 'GET #index' do
    it 'returns the list of surveys' do
      create_list(:survey, 3, user: user)

      get :index, as: :json
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe 'GET #show' do
    it 'returns a survey' do
      get :show, params: { id: survey.id }, as: :json
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['title']).to eq(survey.title)
    end
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      let(:valid_params) do
        {
          survey: {
            title: 'Customer Feedback Survey',
            description: 'A survey for customer feedback',
            questions_attributes: [
              { content: 'How was your experience?', question_type: 'Short Answer' }
            ]
          }
        }
      end

      it 'creates a new survey' do
        expect do
          post :create, params: valid_params, as: :json
        end.to change(Survey, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['survey']['title']).to eq('Customer Feedback Survey')
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) do
        {
          survey: {
            title: '',
            description: ''
          }
        }
      end

      it 'does not create a survey' do
        post :create, params: invalid_params, as: :json
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body)['success']).to be false
      end
    end
  end

  describe 'PATCH #update' do
    context 'with valid parameters' do
      let(:update_params) do
        { id: survey.id, survey: { title: 'Updated Survey Title' } }
      end

      it 'updates the survey' do
        patch :update, params: update_params
        survey.reload
        expect(survey.title).to eq('Updated Survey Title')
        expect(response).to redirect_to(surveys_path)
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'deletes the survey' do
      delete_survey = create(:survey, user: user)

      expect do
        delete :destroy, params: { id: delete_survey.id }, as: :json
      end.to change(Survey, :count).by(-1)

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET #public_view' do
    let(:public_survey) { create(:survey, user: user, public_link: 'public-link-123') }

    context 'when the survey exists' do
      it 'returns the survey' do
        get :public_view, params: { public_link: public_survey.public_link }, as: :json
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['title']).to eq(public_survey.title)
      end
    end

    context 'when the survey does not exist' do
      it 'returns a 404 error' do
        get :public_view, params: { public_link: 'invalid-link' }, as: :json
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq('Survey not found')
      end
    end
  end
end
