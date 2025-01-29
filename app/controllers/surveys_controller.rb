class SurveysController < ApplicationController
  skip_before_action :authenticate_user!, only: [:public_view] # Ensure only logged-in users can create surveys
  before_action :set_survey, only: %i[show edit update destroy]

  # GET /surveys
  def index
    @surveys = current_user.surveys

    respond_to do |format|
      format.html { render :index } # Render the React app for HTML requests
      format.json { render json: @surveys } # Return JSON for API requests
    end
  end

  # GET /surveys/new
  def new
    @survey = current_user.surveys.build
    @survey.questions.build # Allow adding a question dynamically
  end

  # POST /surveys
  def create
    survey = current_user.surveys.build(survey_params)
    if survey.save
      Rails.logger.info "Survey created successfully: #{survey.inspect}"
      render json: { success: true, survey: survey }, status: :created
    else
      Rails.logger.error "Failed to create survey: #{survey.errors.full_messages}"
      render json: { success: false, errors: survey.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /surveys/:id
  def show
    survey = current_user.surveys.includes(questions: :options).find(params[:id])

    respond_to do |format|
      format.html { render :show }
      format.json { render json: survey }
    end
  end

  def responses
    @survey = current_user.surveys.includes(questions: :responses).find(params[:id])
  
    respond_to do |format|
      format.html { render :responses } # Render the HTML page for React
      format.json { render json: @survey.questions, each_serializer: QuestionSerializer } # Return JSON for API requests
    end
  end
  
  # GET /surveys/:id/edit
  def edit; end

  # PATCH /surveys/:id
  def update
    if @survey.update(survey_params)
      redirect_to surveys_path, notice: 'Survey was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /surveys/:id
  def destroy
    @survey.destroy
    respond_to do |format|
      format.html { head :ok } # Don't redirect for HTML responses
      format.json { render json: { message: 'Survey was successfully deleted.' }, status: :ok }
    end
  end

  def public_view
    @survey = Survey.includes(questions: :options).find_by(public_link: params[:public_link])

    if @survey
      respond_to do |format|
        format.html # Renders public.html.erb
        format.json { render json: @survey.as_json(include: { questions: { include: :options } }) }
      end
    else
      respond_to do |format|
        format.html { render plain: "Survey not found", status: :not_found }
        format.json { render json: { error: "Survey not found" }, status: :not_found }
      end
    end
  end

  private

  def set_survey
    @survey = current_user.surveys.find(params[:id])
  end

  def survey_params
    params.require(:survey).permit(
      :title,
      :description,
      questions_attributes: [
        :content,
        :question_type,
        :file,
        :_destroy,
        { options_attributes: %i[
          content
          _destroy
        ] }
      ]
    )
  end
end
