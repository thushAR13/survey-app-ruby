class ResponseSerializer < ActiveModel::Serializer
  attributes :id, :content, :file_url

  def file_url
    object.file.attached? ? Rails.application.routes.url_helpers.url_for(object.file) : nil
  end
end
