class AddSurveyIdAndFileToResponses < ActiveRecord::Migration[7.1]
  def change
    add_reference :responses, :survey, null: false, foreign_key: true
    add_column :responses, :file, :string
  end
end
