require 'rails_helper'

RSpec.describe QuestionsController, type: :controller do
  include Devise::Test::ControllerHelpers

  let(:user) { create(:user) } # Assuming a user exists
  let(:survey) { create(:survey, user: user) } # Each survey belongs to a user
  let(:question) { create(:question, survey: survey) }

  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
    sign_in user # Simulate authentication if required
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      let(:valid_params) do
        {
          question: {
            content: 'What is your favorite color?',
            question_type: 'Multiple Choice',
            survey_id: survey.id,
            options_attributes: [{ content: 'Red' }, { content: 'Blue' }]
          }
        }
      end

      it 'creates a new question' do
        expect do
          post :create, params: valid_params, as: :json
        end.to change(Question, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['content']).to eq('What is your favorite color?')
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) do
        {
          question: {
            content: '',
            question_type: '', # Ensure question_type is also blank
            survey_id: survey.id
          }
        }
      end

      it 'does not create a question and returns errors' do
        post :create, params: invalid_params, as: :json

        expect(response).to have_http_status(422)
        errors = JSON.parse(response.body)['errors']

        # Ensure all expected validation messages are present
        expect(errors).to include("Question type can't be blank")
        expect(errors).to include("Question type is not included in the list")
      end
    end
  end

  describe 'PATCH #update' do
    context 'with valid parameters' do
      let(:update_params) do
        { id: question.id, question: { content: 'Updated Question?' } }
      end

      it 'updates the question' do
        patch :update, params: update_params, as: :json

        question.reload
        expect(question.content).to eq('Updated Question?')
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid parameters' do
      let(:invalid_update_params) do
        { id: question.id, question: { content: '', question_type: '' } } # Invalid update
      end

      it 'does not update and returns errors' do
        patch :update, params: invalid_update_params, as: :json

        expect(response).to have_http_status(422)
        errors = JSON.parse(response.body)['errors']

        # Ensure all expected validation messages are present
        expect(errors).to include("Question type can't be blank")
        expect(errors).to include("Question type is not included in the list")
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'deletes the question' do
      delete_question = create(:question, survey: survey) # Ensure there's something to delete

      expect do
        delete :destroy, params: { id: delete_question.id }, as: :json
      end.to change(Question, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
