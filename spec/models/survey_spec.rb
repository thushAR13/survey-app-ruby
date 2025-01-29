require 'rails_helper'

RSpec.describe Survey, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:questions).dependent(:destroy) }
    it { should have_many(:responses).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:description) }
  end

  describe 'nested attributes' do
    it { should accept_nested_attributes_for(:questions).allow_destroy(true) }
  end

  describe 'callbacks' do
    it 'generates a public link before creation' do
      survey = create(:survey)
      expect(survey.public_link).to be_present
    end

    it 'generates a unique public link' do
      survey1 = create(:survey)
      survey2 = create(:survey)
      expect(survey1.public_link).not_to eq(survey2.public_link)
    end
  end
end
