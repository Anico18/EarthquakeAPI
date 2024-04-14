Rails.application.routes.draw do
  namespace 'api' do
    namespace 'features' do
      resources :features do
        resources :comments, only: [:create]
      end
      resources :comments, only: [:index]
      resources :test, only: [:index, :show]
    end
  end 
end