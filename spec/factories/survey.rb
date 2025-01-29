FactoryBot.define do
  factory :survey do
    association :user # Ensure it belongs to a user
    title { 'Customer Feedback Survey' }
    description { 'A survey to collect customer feedback.' }
    public_link { SecureRandom.hex(10) } # Generate a random public link
  end
end
