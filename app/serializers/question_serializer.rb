class QuestionSerializer < ActiveModel::Serializer
  attributes :id, :content, :question_type, :file_url, :options
  has_many :responses, serializer: ResponseSerializer
  def file_url
    object.file.attached? ? Rails.application.routes.url_helpers.url_for(object.file) : nil
  end

  def options
    object.options.map { |option| { id: option.id, content: option.content } }
  end
end