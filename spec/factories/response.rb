FactoryBot.define do
  factory :response do
    association :question
    association :survey
    content { 'Sample response text' }
  end
end
