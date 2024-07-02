async function renderTable() {
  const mainContainer = document.getElementById("alla");
  mainContainer.innerHTML = `
       <div class="d-flex justify-content-end">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-light ms-3" data-bs-toggle="modal" data-bs-target="#exampleModal100">
                Agregar Actor
            </button>
            <button type="button" class="btn btn-light ms-3" data-bs-toggle="modal" data-bs-target="#exampleModal110">
                Editar y Eliminar
            </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModal100" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Agregar Actor</h5>
                            <a type="button" class="btn-close" id="closeButtonActor" href="#"></a>
                        </div>
                        <div class="modal-body">
                            <form class="row g-3 needs-validation" novalidate id="myForm100">
                                <div class="col-md-6">
                                    <label for="inputName" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="inputName"
                                        placeholder="Nombre" required>
                                    <div class="invalid-feedback">
                                        Por favor ingrese su nombre .
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label for="inputLastName" class="form-label">Apellido</label>
                                    <input type="text" class="form-control" id="inputLastName"
                                        placeholder="Apellido" required>
                                    <div class="invalid-feedback">
                                        Por favor ingrese su apellido.
                                    </div>
                                </div>

                                 <div class="col-md-6">
                                    <label for="inputBirth" class="form-label">Fecha de Nacimiento</label>
                                    <input type="date" class="form-control" id="inputBirth"
                                        placeholder="Dia,Mes y año" required>
                                    <div class="invalid-feedback">
                                        Por favor ingrese su apellido.
                                    </div>
                                </div>

                                

                               
                                <div class="col-12">
                                    <label for="inputImageActor" class="form-label">Imagen</label>
                                    <input type="text" class="form-control" id="inputImageActor" required>
                                    <div class="invalid-feedback">
                                        Por favor ingrese una imagen valida
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <a  class="btn btn-secondary"
                                        href="#" id="cancelButtonActor">Cancelar</a>
                                    <button type="button" id="saveButtonActor" class="btn btn-primary">Guardar </button>
                                </div>
                            </form>


                        </div>

                    </div>
                </div>
            </div>




             <!-- Modal tabla de actor -->

            <div class="modal fade" id="exampleModal110" tabindex="-1" aria-labelledby="exampleModalLabel2"
                aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel2">Tabla de Editar y Eliminar</h5>
                            <a type="button" class="btn-close" href="#" id="Cerrar_Modal_Tabla"></a>
                        </div>
                        <div class="modal-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Apellido</th>
                                        <th scope="col">Fecha de Nacimiento</th>
                                        <th scope="col">Imagen</th>
                                        <th scope="col">Acciones</th>
                                     
                                    </tr>
                                </thead>
                                <tbody id="actorsTableBodys">



                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>








            <!-- Edit ACTOR Modal -->
            <div class="modal fade" id="editMovieModalActor" tabindex="-1" aria-labelledby="editMovieModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editMovieModalLabelActor">Editar Actor</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="ViewActor"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editMovieFormActor ">
                                <input type="hidden" id="editActorId">
                                <div class="mb-3">
                                    <label for="editActorName" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="editActorName">
                                </div>
                                <div class="mb-3">
                                    <label for="editActorLastName" class="form-label">Apellido</label>
                                    <input type="text" class="form-control" id="editActorLastName">
                                </div>
                               
                                <button type="button" class="btn btn-primary" id="saveEditButtonActor">Guardar
                                    Cambios</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container mt-4  " id="Primero">
            <div class="row" id="ActorContainer">


            </div>

        </div>
      `;
  await fetchAndRenderActors();
  setupCancelButton();
  setupSaveButton();
  document.dispatchEvent(new Event('actorsTableReady'));
  document.dispatchEvent(new Event('probando'));
  
}

// Mostrar las cards con actores
async function fetchAndRenderActors() {
  try {
    const response = await fetch("https://graphql-peliculas.onrender.com", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query: "{getAllActor{ name,lastName,birthdate,image}}" })
    });

    const resp = await response.json();
    const actores = resp.data.getAllActor;
    const actorContainer = document.getElementById('ActorContainer');

    actorContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas tarjetas

    actores.forEach(actor => {
      const actorCard = `
                <div class="col-sm-4 mb-4">
                    <div class="card">
                        <img src="${actor.image}" class="card-img-top" alt="Imagen no disponible" width="100%" height="400px">
                        <div class="card-body">
                           <span class="card-title"><span style="font-weight: bold;">Nombre:</span> ${actor.name}</span>
                           <br>
                           <span class="card-title"><span style="font-weight: bold;">Apellido:</span> ${actor.lastName}</span>
                           <br>
                           <span class="card-title"><span style="font-weight: bold;">Fecha de nacimiento:</span> ${actor.birthdate}</span>
                        </div>
                    </div>
                </div>
            `;
      actorContainer.innerHTML += actorCard;
    });

    console.log(actores);
  } catch (error) {
    console.error('Error:', error);
  }
}

const viewActorButton = document.getElementById("ViewActor");
if (viewActorButton) {
  viewActorButton.addEventListener("click", (e) => {
    e.preventDefault();
    renderTable();
  });
}

function setupSaveButton() {
  const saveButton = document.getElementById('saveButtonActor');
  saveButton.addEventListener('click', function (e) {
    e.preventDefault(); // Previene el comportamiento por defecto del botón

    // Obtiene los valores de los campos del formulario
    const NameInput = document.getElementById('inputName').value;
    const LastNameInput = document.getElementById('inputLastName').value;
    const BirthInput = document.getElementById('inputBirth').value;
    const ImageInput = document.getElementById('inputImageActor').value;

    // Verifica si todos los campos están llenos
    if (!NameInput || !LastNameInput || !BirthInput || !ImageInput) {
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
                mutation CreateActor($actor: ActorInput!) {
                    createActor(actor: $actor) {
                        name
                        lastName
                        birthdate
                        image
                    }
                }
            `,
        variables: {
          actor: {
            name: NameInput,
            lastName: LastNameInput,
            birthdate: BirthInput,
            image: ImageInput
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
          alert('Actor guardad@ con éxito');
          // Limpiar el formulario
          document.getElementById('inputName').value = '';
          document.getElementById('inputLastName').value = '';
          document.getElementById('inputBirth').value = '';
          document.getElementById('inputImageActor').value = '';
          // Recargar los actores
          fetchAndRenderActors();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al conectar con el servidor');
      });
  });
}

function setupCancelButton() {
  const cancelButton = document.getElementById('cancelButtonActor');
  const closeButton = document.getElementById('closeButtonActor');
  const closeButtonModal = document.getElementById('Cerrar_Modal_Tabla');

  const modal = new bootstrap.Modal(document.getElementById('exampleModal100'));

  const closeModalAndResetForm = async function() {
    // Cerrar el modal
    modal.hide();

    // Limpiar el formulario
    document.getElementById('inputName').value = '';
    document.getElementById('inputLastName').value = '';
    document.getElementById('inputBirth').value = '';
    document.getElementById('inputImageActor').value = '';

    // Volver a cargar los actores
    await fetchAndRenderActors();
  };

  cancelButton.addEventListener('click', closeModalAndResetForm);
  closeButton.addEventListener('click', closeModalAndResetForm);
  closeButtonModal.addEventListener('click', closeModalAndResetForm);
}



