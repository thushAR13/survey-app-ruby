class QuestionsController < ApplicationController
  before_action :set_question, only: %i[update destroy]
  before_action :set_survey, only: [:create]

  # POST /questions
  def create
    @question = @survey.questions.build(question_params)

    if @question.save
      render json: @question, status: :created
    else
      render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /questions/:id
  def update
    if @question.update(question_params)
      render json: @question.as_json(include: :options)
    else
      render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /questions/:id
  def destroy
    @question.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private

  def set_survey
    @survey = Survey.find(params[:question][:survey_id])
  end

  def set_question
    @question = Question.find(params[:id])
  end

  def question_params
    params.require(:question).permit(
      :content,
      :question_type,
      :survey_id,
      :file,
      options_attributes: %i[id content _destroy]
    )
  end
end
