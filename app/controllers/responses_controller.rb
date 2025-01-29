class ResponsesController < ApplicationController
  skip_before_action :authenticate_user!
  def create
    survey_id = params[:survey_id]
    responses_data = responses_params[:responses]

    if responses_data.nil?
      render json: { success: false, error: 'No responses provided' }, status: :unprocessable_entity
      return
    end

    ActiveRecord::Base.transaction do
      responses_data.each do |response_data|
        question = Question.find(response_data[:question_id])

        response = Response.new(
          question: question,
          survey_id: survey_id, # Explicitly set the survey_id
          content: response_data[:answer]
        )

        # Attach file if provided
        response.file.attach(response_data[:file]) if response_data[:file].present?

        # Save the response
        response.save!
      end
    end

    render json: { success: true, message: 'Responses recorded successfully' }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { success: false, error: e.message }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { success: false, error: "An unexpected error occurred: #{e.message}" },
           status: :internal_server_error
  end

  private

  def responses_params
    params.permit(:survey_id, responses: %i[question_id answer file])
  end
end
