document.getElementById('ViewRegister').addEventListener('click', function(e) {
    e.preventDefault();
    
    const errorContainer = document.getElementById('errorContainer');
    const movieContainer = document.getElementById('movieContainer');
    
    // Limpiar contenedores
    errorContainer.style.display = 'none';
    errorContainer.innerHTML = '';
    movieContainer.innerHTML = '';

    fetch("https://graphql-peliculas.onrender.com", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ query: "{getAllRegisters{ id,movieId,actorId}}" })
    })
    .then(resp => resp.json())
    .then(resp => {
        console.log('Respuesta completa:', resp);
        
        if (resp.errors) {
            throw new Error('Errores GraphQL: ' + JSON.stringify(resp.errors));
        }
        
        if (!resp.data || !resp.data.getAllRegisters) {
            throw new Error('Estructura de respuesta inesperada: ' + JSON.stringify(resp));
        }
        
        const Registros = resp.data.getAllRegisters;
        
        Registros.forEach(Registro => {
            const movieCard = `
                <div class="col-sm-4 mb-4" style="background-color: rgb(255, 255, 255);">
                    <p>ID: ${Registro.id}</p>
                    <p>Movie ID: ${Registro.movieId}</p>
                    <p>Actor ID: ${Registro.actorId}</p>
                </div>
            `;
            movieContainer.innerHTML += movieCard;
        });

        console.log(Registros);
    })
    .catch(error => {
        console.error('Error:', error);
        errorContainer.style.display = 'block';
        errorContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    });
});