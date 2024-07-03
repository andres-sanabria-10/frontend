fetch("https://graphql-peliculas.onrender.com", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({ query: "{getAllMovies{ title,gender,year,director,image}}" })
})
    .then(resp => resp.json())
    .then(resp => {
        const movies = resp.data.getAllMovies;
        const movieContainer = document.getElementById('movieContainer');

        movies.forEach(movie => {
            const movieCard = `
                <div class="col-sm-4 mb-4">
                    <div class="card">
                        <img src="${movie.image}" class="card-img-top" alt="Imagen no disponible" width="85%" height="400px">
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


    // Guardar pelicula
    document.getElementById('saveButton').addEventListener('click', function(e) {
        e.preventDefault(); // Previene el comportamiento por defecto del botón
    
        // Obtiene los valores de los campos del formulario
        const titleInput = document.getElementById('inputTitle').value;
        const yearInput = document.getElementById('inputYear').value;
        const directorInput = document.getElementById('inputDirector').value;
        const genderInput = document.getElementById('inputState').value;
        const imageInput = document.getElementById('inputImage').value;
    
        // Verifica si todos los campos están llenos
        if (!titleInput || !yearInput || !directorInput || !genderInput || !imageInput) {
            alert('Por favor, llene todos los campos');
            return;
        }
    
        // Realiza la petición al servidor
        fetch("https://graphql-peliculas.onrender.com", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation CreateMovie($movie: MovieInput!) {
                        createMovie(movie: $movie) {
                            title
                            gender
                            year
                            director
                            image
                        }
                    }
                `,
                variables: {
                    movie: {
                        title: titleInput,
                        gender: genderInput,
                        year: yearInput.toString(),
                        director: directorInput,
                        image: imageInput
                    }
                }
            })
        })
        .then(resp => resp.json())
        .then(resp => {
            if (resp.errors) {
                console.error('GraphQL errors:', resp.errors);
                alert('Hubo un error al guardar la película');
            } else {
                console.log('Success:', resp);
                alert('Película guardada con éxito');
                 // Limpiar el formulario
            document.getElementById('inputTitle').value = '';
            document.getElementById('inputYear').value = '';
            document.getElementById('inputDirector').value = '';
            document.getElementById('inputState').value = ''; // Asumiendo que 'Accion' es la opción por defecto
            document.getElementById('inputImage').value = '';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Hubo un error al conectar con el servidor');
        });
    });