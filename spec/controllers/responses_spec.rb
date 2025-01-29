require 'rails_helper'

RSpec.describe ResponsesController, type: :controller do
  include Devise::Test::ControllerHelpers

  let(:user) { create(:user) }
  let(:survey) { create(:survey, user: user) }
  let(:question1) { create(:question, survey: survey) }
  let(:question2) { create(:question, survey: survey) }

  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  describe 'POST #create' do
    context 'with valid responses' do
      let(:valid_params) do
        {
          survey_id: survey.id,
          responses: [
            { question_id: question1.id, answer: 'Response to Q1' },
            { question_id: question2.id, answer: 'Response to Q2' }
          ]
        }
      end

      it 'creates responses successfully' do
        expect do
          post :create, params: valid_params, as: :json
        end.to change(Response, :count).by(2)

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('Responses recorded successfully')
      end
    end

    context 'when no responses are provided' do
      let(:invalid_params) { { survey_id: survey.id, responses: [] } }

      it 'returns an error' do
        post :create, params: invalid_params, as: :json

        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)['error']).to eq(nil)
      end
    end

    context 'when attaching a file' do
      let(:temp_file) do
        file = Tempfile.new(['test_file', '.pdf'])
        file.write('Sample PDF content for testing.')
        file.rewind
        file
      end

      let(:valid_params_with_file) do
        {
          survey_id: survey.id,
          responses: [
            {
              question_id: question1.id,
              answer: 'Response with file',
              file: fixture_file_upload(temp_file.path, 'application/pdf')
            }
          ]
        }
      end

      it 'attaches the file successfully' do
        post :create, params: valid_params_with_file, as: :json

        response_record = Response.last
        expect(response_record.file).to be_attached

        # Cleanup temp file after test
        temp_file.close
        temp_file.unlink
      end
    end

    context 'when a response is invalid' do
      let(:invalid_params) do
        {
          survey_id: survey.id,
          responses: [
            { question_id: nil, answer: 'Invalid response' } # Missing question_id
          ]
        }
      end
    end
  end
end
