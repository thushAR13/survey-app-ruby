require 'rails_helper'

RSpec.describe Response, type: :model do
  describe 'associations' do
    it { should belong_to(:question) }
    it { should belong_to(:survey) }
    it { should have_one_attached(:file) }
  end

  describe 'file attachment' do
    let(:response) { create(:response) }

    it 'allows attaching a file' do
      # Generate a temporary test file dynamically
      file = Tempfile.new(['test_file', '.pdf'])
      file.write('Sample PDF content for testing.')
      file.rewind # Ensure file content is readable

      response.file.attach(
        io: File.open(file.path),
        filename: 'test_file.pdf',
        content_type: 'application/pdf'
      )

      expect(response.file).to be_attached

      # Cleanup: Close and remove the temp file after the test
      file.close
      file.unlink
    end
  end
end
