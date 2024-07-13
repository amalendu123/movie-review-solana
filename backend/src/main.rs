use std::{path::Path, result};

use actix_web::{cookie::time::convert::Microsecond, delete, get, post, put, web::{Data, Json,Path as pa}, App, Error, HttpResponse, HttpServer, Responder};
mod db;
use db::MongoRepo;
mod models;
use models::movie::Movie;
use mongodb::bson::oid::ObjectId;
#[get("/getallmovies")]
async fn getmovies(db: Data<MongoRepo>) -> HttpResponse {
    match db.get_all_movies().await {
        Ok(movies) => HttpResponse::Ok().json(movies),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[post("/add_movies")]
async fn add_movies(db:Data<MongoRepo>,newMovie:Json<Movie>) -> HttpResponse{
    let data = Movie{
        id:None,
        Movie_title:newMovie.Movie_title.clone(),
        Description:newMovie.Description.clone(),
        imdb:newMovie.imdb.clone(),
        img_link:newMovie.img_link.clone()
    };

    let movie_detail = db.create_user(data).await;
    match movie_detail{
        Ok(movie) => HttpResponse::Ok().json(movie),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[put("/update_movie/{id}")]
async fn update_movie(db: Data<MongoRepo>, path: pa<String>, new_movie: Json<Movie>) -> HttpResponse {
    let id = path.into_inner();
    if id.is_empty() {
        return HttpResponse::BadRequest().body("Invalid ID");
    }

    let object_id = match ObjectId::parse_str(&id) {
        Ok(oid) => oid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid ObjectId format"),
    };

    let data = Movie {
        id: Some(object_id),
        Movie_title: new_movie.Movie_title.clone(),
        Description: new_movie.Description.clone(),
        imdb: new_movie.imdb.clone(),
        img_link: new_movie.img_link.clone(),
    };

    let update_result = db.update_Movie(&id, data).await;
    match update_result {
        Ok(movie) => HttpResponse::Ok().json(movie),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[delete("/delete_movie/{id}")]
async fn delete_movie(db:Data<MongoRepo>,path:pa<String>) -> HttpResponse{
    let id = path.into_inner();
    if( id.is_empty()){
        return HttpResponse::BadRequest().body("invalid ID");
    }
    let result = db.delete_movie(&id).await;

    match  result {
        Ok(res)=>{
            if res.deleted_count == 1{
                return HttpResponse::Ok().json("Movie successfully deleted!"); 
            }else {
                return HttpResponse::NotFound().json("Movie with specified ID not found!");
            }

        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),

        
    }
}

#[actix_web::main]
async  fn main() -> std::io::Result<()>{
    let d = MongoRepo::init().await;
    let db_data = Data::new(d);
    HttpServer::new(move ||{
        App::new()
            .app_data(db_data.clone())
            .service(getmovies)
            .service(add_movies)
            .service(update_movie)
            .service(delete_movie)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await

}
