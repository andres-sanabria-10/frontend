document.addEventListener('DOMContentLoaded', async function () {
    const viewRegisterLink = document.getElementById('ViewRegisterTable');
    const formContainer = document.getElementById('alla');

    // Función para obtener datos de registros
    const getAllRegisters = async () => {
        try {
            const response = await fetch("https://graphql-peliculas.onrender.com", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query: "{ getAllRegisters { id, movieId { id, title }, actorId { id, name } } }" })
            });
            const data = await response.json();
            return data.data.getAllRegisters;
        } catch (error) {
            console.error("Error fetching registers:", error);
            return [];
        }
    };

    // Función para obtener todas las películas
    const getAllMovies = async () => {
        try {
            const response = await fetch("https://graphql-peliculas.onrender.com", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query: "{ getAllMovies { id, title } }" })
            });
            const data = await response.json();
            return data.data.getAllMovies;
        } catch (error) {
            console.error("Error fetching movies:", error);
            return [];
        }
    };

    if (viewRegisterLink && formContainer) {
        viewRegisterLink.addEventListener('click', async function (e) {
            e.preventDefault();
            
            // Obtener los registros y las películas
            const [registers, movies] = await Promise.all([getAllRegisters(), getAllMovies()]);

            // Crear un mapa de películas y sus actores
            const movieActorsMap = new Map();
            registers.forEach(register => {
                if (!movieActorsMap.has(register.movieId.id)) {
                    movieActorsMap.set(register.movieId.id, {
                        title: register.movieId.title,
                        actors: []
                    });
                }
                movieActorsMap.get(register.movieId.id).actors.push(register.actorId);
            });

            // Crear la tabla de registros (como antes)
            let tableHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Id Registro</th>
                            <th>Película</th>
                            <th>Actor</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            registers.forEach(register => {
                tableHTML += `
                    <tr>
                        <td>${register.id}</td>
                        <td>${register.movieId.title}</td>
                        <td>${register.actorId.name}</td>
                    </tr>
                `;
            });

            tableHTML += `
                    </tbody>
                </table>
            `;

            // Crear las opciones del menú desplegable con los títulos de las películas
            let movieOptionsHTML = '';
            movies.forEach(movie => {
                movieOptionsHTML += `<li><a class="dropdown-item" href="#" data-movie-id="${movie.id}">${movie.title}</a></li>`;
            });

            // Mostrar la tabla y el menú en el contenedor
            formContainer.innerHTML = `
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-9">
                            <div id="formContainer">
                                <h1 class="text-center">Registros</h1>
                                <br>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Películas
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    ${movieOptionsHTML}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                ${tableHTML}

                <!-- Modal -->
                <div class="modal fade" id="movieModal" tabindex="-1" aria-labelledby="movieModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="movieModalLabel">Detalles de la Película</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" id="movieModalBody">
                                <!-- El contenido del modal se llenará dinámicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
            formContainer.style.display = 'block';

            // Agregar evento click a las opciones del menú
            document.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const movieId = this.getAttribute('data-movie-id');
                    const movieData = movieActorsMap.get(movieId);
                    
                    if (movieData) {
                        const modalBody = document.getElementById('movieModalBody');
                        modalBody.innerHTML = `
                            <h4>${movieData.title}</h4>
                            <h5>Actores:</h5>
                            <ul>
                                ${movieData.actors.map(actor => `<li>${actor.name}</li>`).join('')}
                            </ul>
                        `;
                        
                        // Mostrar el modal
                        const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
                        movieModal.show();
                    }
                });
            });
        });
    } else {
        console.error('No se encontraron los elementos necesarios');
    }
});