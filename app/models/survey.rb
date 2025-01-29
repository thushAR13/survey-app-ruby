class Survey < ApplicationRecord
  before_create :generate_public_link

  has_many :questions, dependent: :destroy
  has_many :responses, dependent: :destroy
  belongs_to :user

  accepts_nested_attributes_for :questions, allow_destroy: true

  validates :title, presence: true
  validates :description, presence: true

  private

  def generate_public_link
    self.public_link = SecureRandom.uuid
  end
end
