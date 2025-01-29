FactoryBot.define do
  factory :question do
    association :survey # Ensure it belongs to a survey
    content { 'What is your favorite color?' }
    question_type { 'Multiple Choice' }
  end
end
