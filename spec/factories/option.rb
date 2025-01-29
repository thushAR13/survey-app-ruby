FactoryBot.define do
  factory :option do
    association :question
    content { 'Sample option text' }
  end
end
