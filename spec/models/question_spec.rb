require 'rails_helper'

RSpec.describe Question, type: :model do
  describe 'associations' do
    it { should belong_to(:survey) }
    it { should have_many(:options).dependent(:destroy) }
    it { should have_many(:responses).dependent(:destroy) }
    it { should have_one_attached(:file) }
  end

  describe 'validations' do
    it { should validate_presence_of(:question_type) }

    it do
      should validate_inclusion_of(:question_type)
        .in_array(['Multiple Choice', 'Short Answer', 'True/False', 'Fill in the Blanks', 'File Upload'])
    end
  end

  describe 'nested attributes' do
    it { should accept_nested_attributes_for(:options).allow_destroy(true) }
  end

  describe '#file_url' do
    let(:question) { create(:question) }
    context 'when file is not attached' do
      it 'returns nil' do
        expect(question.file_url).to be_nil
      end
    end
  end
end
