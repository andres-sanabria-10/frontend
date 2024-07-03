document.addEventListener('DOMContentLoaded', async function () {
    const viewRegisterLink = document.getElementById('ViewRegisterTable');
    const formContainer = document.getElementById('alla');

    // Función para obtener datos
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

    if (viewRegisterLink && formContainer) {
        viewRegisterLink.addEventListener('click', async function (e) {
            e.preventDefault();
            
            // Obtener los registros
            const registers = await getAllRegisters();

            // Crear la tabla
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

            // Agregar filas a la tabla
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

            // Mostrar la tabla en el contenedor
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
                    Menú
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item" href="#">Opción 1</a></li>
                    <li><a class="dropdown-item" href="#">Opción 2</a></li>
                    <li><a class="dropdown-item" href="#">Opción 3</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
                ${tableHTML}
            `;
            formContainer.style.display = 'block';
        });
    } else {
        console.error('No se encontraron los elementos necesarios');
    }
});