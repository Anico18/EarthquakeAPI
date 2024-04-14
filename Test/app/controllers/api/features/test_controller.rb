module Api
    module Features
        class TestController < ApplicationController
            def index
                earthquakes = Feature.limit(params[:limit]).offset(params[:offset])
                rendered_earthquakes = earthquakes.map do |earthquake|
                {
                    id: earthquake.id,
                    type: 'feature',
                    attributes: {
                    external_id: earthquake.external_id,
                    magnitude: earthquake.magnitude,
                    place: earthquake.place,
                    time: earthquake.time,
                    tsunami: earthquake.tsunami,
                    mag_type: earthquake.mag_type,
                    title: earthquake.title,
                    coordinates: {
                        longitude: earthquake.longitude,
                        latitude: earthquake.latitude
                    }
                    },
                    links: {
                    external_url: earthquake.external_url
                    }
                }

            end
                total = Feature.count
                render json: {
                status: 'SUCCESS',
                message: 'Loaded earthquakes',
                data: rendered_earthquakes,
                total: total
                }
            end

            def show
                earthquake_filtered = Feature.filter(params[:mag_type])
                render json: {status: 'SUCCESS', message:'Loaded earthquake', data: earthquake_filtered}
            end
        end
    end
end
