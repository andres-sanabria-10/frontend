document.addEventListener('DOMContentLoaded', async function () {
    const viewRegisterLink = document.getElementById('ViewRegister');
    const formContainer = document.getElementById('alla');

    // Funciones para obtener datos
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

    const getAllActor = async () => {
        try {
            const response = await fetch("https://graphql-peliculas.onrender.com", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query: "{ getAllActor { id, name } }" })
            });
            const data = await response.json();
            return data.data.getAllActor;
        } catch (error) {
            console.error("Error fetching actors:", error);
            return [];
        }
    };

    const createRegister = async (movieId, actorId) => {
        try {
            const response = await fetch("https://graphql-peliculas.onrender.com", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    query: `mutation { createRegister(register: { movieId: "${movieId}", actorId: "${actorId}" }) { id } }`
                })
            });
            const data = await response.json();
            return data.data.createRegister;
        } catch (error) {
            console.error("Error creating register:", error);
            throw error;
        }
    };

    if (viewRegisterLink && formContainer) {
        viewRegisterLink.addEventListener('click', async function (e) {
            e.preventDefault();
            formContainer.innerHTML = `
                <form id="registerForm" class="border rounded p-4">
                    <h1 class="text-center">Registrar</h1>
                    <p class="ms-3">Registrar actor a películas</p>
                    <div class="row mb-3">
                        <div class="col-md-5">
                            <label for="movieSelect" class="form-label">Películas</label>
                            <select id="movieSelect" class="form-select">
                                <option selected>Seleccionar</option>
                            </select>
                        </div>
                        <div class="col-md-5">
                            <label for="actorSelect" class="form-label">Actores</label>
                            <select id="actorSelect" class="form-select">
                                <option selected>Seleccionar</option>
                            </select>
                        </div>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-dark">Guardar</button>
                    </div>
                </form>
            `;
            formContainer.style.display = 'block';

            // Poblar los desplegables
            const movieSelect = document.getElementById('movieSelect');
            const actorSelect = document.getElementById('actorSelect');

            const [movies, actors] = await Promise.all([getAllMovies(), getAllActor()]);

            movies.forEach(movie => {
                const option = document.createElement('option');
                option.value = movie.id;
                option.textContent = movie.title;
                movieSelect.appendChild(option);
            });

            actors.forEach(actor => {
                const option = document.createElement('option');
                option.value = actor.id;
                option.textContent = actor.name;
                actorSelect.appendChild(option);
            });

            // Agregar event listener al formulario
            const form = document.getElementById('registerForm');
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const movieId = movieSelect.value;
                const actorId = actorSelect.value;

                if (movieId === 'Seleccionar' || actorId === 'Seleccionar') {
                    alert('Por favor, selecciona una película y un actor.');
                    return;
                }

                try {
                    const result = await createRegister(movieId, actorId);
                    if (result && result.id) {
                        alert('Registro creado con éxito!');
                        // Opcionalmente, puedes resetear el formulario o actualizar la lista de registros aquí
                    }
                } catch (error) {
                    console.error('Error al crear el registro:', error);
                    alert('Hubo un error al crear el registro. Por favor, intenta de nuevo.');
                }
            });
        });
    } else {
        console.error('No se encontraron los elementos necesarios');
    }
});