document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('actorsTableReady', function () {
        const tableBody = document.querySelector('#actorsTableBodys');


        if (tableBody) {
            fetch("https://graphql-peliculas.onrender.com", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query: "{ getAllActor { id,name,lastName,birthdate,image } }" })
            })
                .then(resp => {
                    if (!resp.ok) throw new Error('La respuesta de la red no fue correcta');
                    return resp.json();
                })
                .then(data => {
                    const actors = data.data.getAllActor;

                    actors.forEach(actor => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td>${actor.id}</td>
                        <td>${actor.name}</td>
                        <td>${actor.lastName}</td>
                        <td>${actor.birthdate}</td>
                        <td><img src="${actor.image}" alt="${actor.name}" style="width: 50px; height: auto;"></td>
                        <td>
                            <button class="btn btn-primary editButtonA" data-id="${actor.id}"><i class="bi bi-pencil"></i> Editar</button>
                            <button class="btn btn-danger deleteButtonA" data-id="${actor.id}"><i class="bi bi-trash"></i> Eliminar</button>
                        </td>
                    `;
                        tableBody.appendChild(row);
                    });

                    // Agregar event listeners a los botones de eliminar
                    const deleteButtons = document.querySelectorAll('.deleteButtonA');
                    deleteButtons.forEach(button => {
                        button.addEventListener('click', handleDelete);
                    });

                    // Agregar event listeners a los botones de editar
                    const editButtons = document.querySelectorAll('.editButtonA');
                    editButtons.forEach(button => {
                        button.addEventListener('click', handleEdit);
                    });

                    console.log('Tabla de actores encontrada y poblada:', tableBody);
                })
                .catch(error => console.error('Error:', error));
        } else {
            console.error('Elemento del cuerpo de la tabla no encontrado');
        }
    });
});

// Asegúrate de que estas funciones estén definidas
async function handleDelete(event) {
    const button = event.currentTarget;
    const actorId = button.getAttribute('data-id');

    try {
        const response = await fetch("https://graphql-peliculas.onrender.com", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query: `mutation { deleteActor(id: "${actorId}") }` })
        });

        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        // Remove the row from the table
        const row = button.closest('tr');
        row.remove();

        alert('Act@r eliminad@ exitosamente');
    } catch (error) {
        console.error('Error eliminando el actor:', error);
        alert('Error eliminando el/la act@r: ' + error.message);
    }
}




function handleEdit(event) {
    const boton = event.currentTarget;
    const actorId = boton.getAttribute('data-id');
    const fila = boton.closest('tr');

    // Rellenar el modal con los datos del actor de la fila de la tabla
    document.getElementById('editActorId').value = actorId;
    document.getElementById('editActorName').value = fila.querySelector('td:nth-child(2)').textContent;
    document.getElementById('editActorLastName').value = fila.querySelector('td:nth-child(3)').textContent;

    // Mostrar el modal
    const modalEditarActor = new bootstrap.Modal(document.getElementById('editMovieModalActor'));
    modalEditarActor.show();
}





document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('probando', function () {
        const saveButton = document.querySelector('#saveEditButtonActor');
        if (saveButton) {
            saveButton.addEventListener('click', handleSaveActor);
        } else {
            console.error('El botón de guardar no se encontró en el DOM');
        }

    });
});

async function handleSaveActor() {
    const actorId = document.querySelector('#editActorId').value;
    const nombre = document.querySelector('#editActorName').value;
    const apellido = document.querySelector('#editActorLastName').value;

    try {
        const response = await fetch("https://graphql-peliculas.onrender.com", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation {
                    updateActor(id: "${actorId}", actor: { name: "${nombre}", lastName: "${apellido}" }) {
                        id
                        name
                        lastName
                    }
                }`
            })
        });

        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        // Actualizar la tabla con los nuevos datos
        const fila = document.querySelector(`button[data-id="${actorId}"]`).closest('tr');
        fila.querySelector('td:nth-child(2)').textContent = result.data.updateActor.name;
        fila.querySelector('td:nth-child(3)').textContent = result.data.updateActor.lastName;

        alert('Actor actualizado exitosamente');

        // Ocultar el modal
        const modalEditarActor = bootstrap.Modal.getInstance(document.querySelector('#editMovieModalActor'));
        modalEditarActor.hide();
    } catch (error) {
        console.error('Error actualizando el actor:', error);
        alert('Error actualizando el actor: ' + error.message);
    }
}