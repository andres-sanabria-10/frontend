fetch("https://graphql-peliculas.onrender.com", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({ query: "{ getAllMovies { id, title, gender, year, director, image } }" })
})
    .then(resp => resp.json())
    .then(data => {
        const movies = data.data.getAllMovies;
        const tableBody = document.getElementById('moviesTableBody');

        movies.forEach(movie => {
            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${movie.id}</td>
            <td>${movie.title}</td>
            <td>${movie.gender}</td>
            <td>${movie.year}</td>
            <td>${movie.director}</td>
            <td><img src="${movie.image}" alt="${movie.title}" style="width: 50px; height: auto;"></td>
            <td>
                <button class="btn btn-primary editButton" data-id="${movie.id}"><i class="bi bi-pencil"></i> Editar</button>
                <button class="btn btn-danger deleteButton" data-id="${movie.id}"><i class="bi bi-trash"></i> Eliminar</button>
            </td>
        `;

            tableBody.appendChild(row);
        });

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.deleteButton');
        deleteButtons.forEach(button => {
            button.addEventListener('click', handleDelete);
        });

        // Add event listeners to edit buttons
        const editButtons = document.querySelectorAll('.editButton');
        editButtons.forEach(button => {
            button.addEventListener('click', handleEdit);
        });
    })
    .catch(error => console.error('Error:', error));

async function handleDelete(event) {
    const button = event.currentTarget;
    const movieId = button.getAttribute('data-id');

    try {
        const response = await fetch("https://graphql-peliculas.onrender.com", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query: `mutation { deleteMovie(id: "${movieId}") }` })
        });

        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        // Remove the row from the table
        const row = button.closest('tr');
        row.remove();
        
        alert('Película eliminada exitosamente');
    } catch (error) {
        console.error('Error eliminando la película:', error);
        alert('Error eliminando la película: ' + error.message);
    }
}

function handleEdit(event) {
    const button = event.currentTarget;
    const movieId = button.getAttribute('data-id');
    const row = button.closest('tr');

    // Fill the modal with the movie data from the table row
    document.getElementById('editMovieId').value = movieId;
    document.getElementById('editMovieTitle').value = row.querySelector('td:nth-child(2)').textContent;
    document.getElementById('editMovieYear').value = row.querySelector('td:nth-child(4)').textContent;
    document.getElementById('editMovieDirector').value = row.querySelector('td:nth-child(5)').textContent;

    // Show the modal
    const editMovieModal = new bootstrap.Modal(document.getElementById('editMovieModal'));
    editMovieModal.show();
}

document.getElementById('saveEditButton').addEventListener('click', async () => {
    const movieId = document.getElementById('editMovieId').value;
    const title = document.getElementById('editMovieTitle').value;
    const year = parseInt(document.getElementById('editMovieYear').value, 10);
    const director = document.getElementById('editMovieDirector').value;

    try {
        const response = await fetch("https://graphql-peliculas.onrender.com", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query: `mutation {
                updateMovie(id: "${movieId}", movie: { title: "${title}", year: "${year}", director: "${director}" }) {
                    id
                    title
                    year
                    director
                }
            }` })
        });

        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        // Update the table with the new data
        const row = document.querySelector(`button[data-id="${movieId}"]`).closest('tr');
        row.querySelector('td:nth-child(2)').textContent = result.data.updateMovie.title;
        row.querySelector('td:nth-child(4)').textContent = result.data.updateMovie.year;
        row.querySelector('td:nth-child(5)').textContent = result.data.updateMovie.director;

        alert('Película actualizada exitosamente');
        
        // Hide the modal
        const editMovieModal = bootstrap.Modal.getInstance(document.getElementById('editMovieModal'));
        editMovieModal.hide();
    } catch (error) {
        console.error('Error actualizando la película:', error);
        alert('Error actualizando la película: ' + error.message);
    }
});
