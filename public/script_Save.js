fetch("https://graphql-peliculas.onrender.com", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({ query: "{getAllActor{ name,lastName,birthdate}}" })
})
    .then(resp => resp.json())
    .then(resp => {
        const movies = resp.data.getAllMovies;
        const movieContainer = document.getElementById('movieContainer');

        movies.forEach(movie => {
            const movieCard = `
                <div class="col-sm-4 mb-4">
                    <div class="card">
                        <img src="${movie.image}" class="card-img-top" alt="Imagen no disponible" width="100%" height="400px">
                        <div class="card-body">
                           <span class="card-title"><span style="font-weight: bold;">Título:</span> ${movie.title}</span>
                           <br>
                           <span class="card-title"><span style="font-weight: bold;">Género:</span> ${movie.gender}</span>
                           <br>
                           <span class="card-title"><span style="font-weight: bold;">Año:</span> ${movie.year}</span>
                           <br>
                           <span class="card-title"><span style="font-weight: bold;">Director:</span> ${movie.director}</span>
                           
                        </div>
                    </div>
                </div>
            `;
            movieContainer.innerHTML += movieCard;
        });

        console.log(movies);
    })
    .catch(error => console.error('Error:', error));

