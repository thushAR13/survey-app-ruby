require 'rails_helper'

RSpec.describe Option, type: :model do
  describe 'associations' do
    it { should belong_to(:question) }
  end
end
