FactoryBot.define do
  factory :user do
    email { "test_#{rand(1000)}@yopmail.com" }
 # Ensure it matches the allowed domains
    password { 'password123' }
    active { false } # Default value from set_defaults method
  end
end
