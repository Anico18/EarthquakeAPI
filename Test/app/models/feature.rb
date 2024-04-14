class Feature < ApplicationRecord
    validates :title, presence: true
    validates :external_url, presence: true, uniqueness: true
    validates :place, presence: true
    validates :latitude, presence: true, numericality: { greater_than_or_equal_to: -90.0, less_than_or_equal_to: 90.0 }
    validates :longitude, presence: true, numericality: { greater_than_or_equal_to: -180.0, less_than_or_equal_to: 180.0 }
    validates :mag_type, presence: true
    validates :magnitude, numericality: { greater_than_or_equal_to: -1.0, less_than_or_equal_to: 10.0 }

    has_many :comments
end
