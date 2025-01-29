class CreateQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :questions do |t|
      t.references :survey, null: false, foreign_key: true
      t.text :content
      t.string :question_type

      t.timestamps
    end
  end
end
