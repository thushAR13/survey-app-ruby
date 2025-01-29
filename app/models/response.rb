class Response < ApplicationRecord
  belongs_to :question
  belongs_to :survey

  has_one_attached :file
end
