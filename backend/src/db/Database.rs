use futures::StreamExt;
use mongodb::{
    bson::extjson::de::Error,
    results::InsertOneResult,
    Client, Collection,
};
use crate::Movie;


pub struct MongoRepo {
    col: Collection<Movie>,
}

impl MongoRepo {
    pub async fn init() -> Self {
        let uri = "mongodb+srv://amalendumanoj:4G9Tbt05txkZNBct@cluster0.rfesf8v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        let client = Client::with_uri_str(uri).await.expect("Failed to initialize client");
        let db = client.database("rustDB");
        let col: Collection<Movie> = db.collection("Movie");
        MongoRepo { col }
    }

    pub async fn get_all_movies(&self) -> Result<Vec<Movie>, mongodb::error::Error> {
        let mut cursor = self.col.find(None, None).await?;
        let mut movies = Vec::new();
    
        while let Some(result) = cursor.next().await {
            match result {
                Ok(movie) => movies.push(movie),
                Err(e) => return Err(e),
            }
        }
    
        Ok(movies)
    }

    pub async  fn create_user(&self,new_movie: Movie) -> Result<InsertOneResult, Error>{
        let new_film = Movie{
            id:None,
            Movie_title:new_movie.Movie_title,
            Description:new_movie.Description,
            imdb:new_movie.imdb,
            img_link:new_movie.img_link,
        };
        let movie = self    
                        .col
                        .insert_one(new_film, None)
                        .await
                        .ok()
                        .expect("Error creating User");
        Ok(movie)
    }

}
