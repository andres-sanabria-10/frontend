

async function renderTable() {
    const mainContainer = document.getElementById("alla");
    mainContainer.innerHTML = `
       <div class="d-flex justify-content-end">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#exampleModal100">
                Agregar Actor
            </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModal100" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Agregar Actor</h5>
                            <a type="button" class="btn-close"  href="/"></a>
                        </div>
                        <div class="modal-body">
                            <form class="row g-3 needs-validation" novalidate id="myForm100">
                                <div class="col-md-6">
                                    <label for="inputName" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="inputName"
                                        placeholder="Nombre" required>
                                    <div class="invalid-feedback">
                                        Por favor ingrese su nombre .
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="inputLastName" class="form-label">Apellido</label>
                                    <input type="number" class="form-control" id="inputLastName"
                                        placeholder="Apellido" required>
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
                                        href="/">Cancelar</a>
                                    <button type="button" id="saveButton" class="btn btn-primary">Guardar </button>
                                </div>
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
      `; await fetchAndRenderActors();
  
   
  }
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

// Asegúrate de que este elemento exista en tu HTML
const viewActorButton = document.getElementById("ViewActor");
if (viewActorButton) {
    viewActorButton.addEventListener("click", (e) => {
        e.preventDefault();
        renderTable();
    });
}