class SurveySerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :public_link

  has_many :questions
  
end
