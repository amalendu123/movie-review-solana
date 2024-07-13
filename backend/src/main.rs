use actix_web::{delete, get, patch, post, web::Data, App, Error, HttpResponse, HttpServer, Responder};
mod db;
use db::MongoRepo;
mod models;
use models::movie::Movie;
#[get("/getallmovies")]
async fn getmovies(db: Data<MongoRepo>) -> HttpResponse {
    match db.get_all_movies().await {
        Ok(movies) => HttpResponse::Ok().json(movies),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[post("/add_movies")]
async fn add_movies() -> impl Responder{
    HttpResponse::Ok().body("create movies")
}

#[patch("/update_movie/{uuid}")]
async fn update_movie() -> impl Responder{
    HttpResponse::Ok().body("update movies")
}

#[delete("/delete_movie/{uuid}")]
async fn delete_movie() ->impl Responder{
    HttpResponse::Ok().body("Delete movies")
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
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await

}
