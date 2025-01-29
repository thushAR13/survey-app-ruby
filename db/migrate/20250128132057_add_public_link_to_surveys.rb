class AddPublicLinkToSurveys < ActiveRecord::Migration[7.1]
  def change
    add_column :surveys, :public_link, :string
    add_index :surveys, :public_link, unique: true
  end
end
