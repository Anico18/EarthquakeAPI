require 'json'
require 'rest-client'

module Api
  module Features
    class FeaturesController < ApplicationController
      def index
        url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

        response = RestClient.get url
        data = JSON.parse(response.body)

        earthquakes_data = data['features'].map do |feature|
          {
            f_type: feature['type'],
            external_id: feature['id'],
            magnitude: feature['properties']['mag'],
            place: feature['properties']['place'],
            time: Time.at(feature['properties']['time'] / 1000),
            tsunami: feature['properties']['tsunami'],
            mag_type: feature['properties']['magType'],
            title: feature['properties']['title'],
            longitude: feature['geometry']['coordinates'][0],
            latitude: feature['geometry']['coordinates'][1],
            external_url: feature['properties']['url']
          }
        end

        earthquakes_data.each do |earthquake_data|
          Feature.create(earthquake_data)
        end

        render json: {
          status: 'SUCCESS',
          message: 'Loaded earthquakes',
          data: earthquakes_data
        }
      end
    end
  end
end
