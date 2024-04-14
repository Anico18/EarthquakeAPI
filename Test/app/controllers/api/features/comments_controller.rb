module Api
    module Features
      class CommentsController < ApplicationController

        def index
            comments = Comment.order('created_at ASC').paginate(page: params[:page], per_page: 1000)
            rendered_comments = comments.map do |comment|
            {
                id: comment.id,
                body: comment.body
            }
        end
            render json: {
            status: 'SUCCESS',
            message: 'Loaded comments',
            data: comments
            }
        end


        def create
            earthquake = Feature.find(params[:feature_id])
            comment = earthquake.comments.build(body: params[:body])
            if comment.save
                render json: { status: 'SUCCESS', message: 'Comment created successfully', data: comment }, status: :created
            else
                render json: { status: 'ERROR', message: 'Failed to create comment', errors: comment.errors.full_messages }, status: :unprocessable_entity
            end
        end
        
            private
            
            def comment_params
                params.require(:comment).permit(:feature_id, :body) 
            end
        end
    end
end
  