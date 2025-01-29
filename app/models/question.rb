class Question < ApplicationRecord
  belongs_to :survey
  has_many :options, dependent: :destroy
  has_many :responses, dependent: :destroy
  has_one_attached :file

  accepts_nested_attributes_for :options, allow_destroy: true

  validates :question_type, presence: true,
                            inclusion: { in: ['Multiple Choice', 'Short Answer', 'True/False', 'Fill in the Blanks', 'File Upload'] }

  def file_url
    file.attached? ? Rails.application.routes.url_helpers.url_for(file) : nil
  end
end
