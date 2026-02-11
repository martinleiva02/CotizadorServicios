const selectServicio = document.getElementById("selectServicio");
const inputHoras = document.getElementById("horas");
const btnCotizar = document.getElementById("btnCotizar");
const divResultado = document.getElementById("resultado");

let servicios = [];

fetch("data/servicios.json")
    .then (Response => {
    if (!Response.ok){
        throw new Error("no se pudieron cargar los servicios");
    }
    return Response.json();
    })
    .then(data => {
        servicios = data;
        cargarServicios();
    })
    .catch(error => {
        swal.fire("error", error.message, "error");
    });
    

function cargarServicios() {
    servicios.forEach(servicio => {
        const option = document.createElement("option");
        option.value = servicio.id;
        option.textContent = ` ${servicio.nombre} - $${servicio.precioHora} por hora`;
        selectServicio.appendChild(option);
    });
};

btnCotizar.addEventListener("click", () =>{
    const idServicio = parseInt(selectServicio.value);
    const horas = parseInt(inputHoras.value);

    if(isNaN(idServicio) || isNaN(horas) || horas <= 0){
        swal.fire("atencion", "ingrese un servicio y una cantidad valida", "warning");
        return;
    }

    const servicioElegido = servicios.find(optionServicio => optionServicio.id === idServicio);
    const total = servicioElegido.precioHora * horas;

    mostrarResultado(servicioElegido, horas, total);
    guardarCotizacion(servicioElegido, horas, total);
});

function mostrarResultado(servicio, horas, total){
    divResultado.innerHTML = `
    <p> <strong> Servicio:</strong> ${servicio.nombre}</p>
    <p> <strong> Horas:</strong> ${horas}</p>
    <p> <strong> Total:</strong> $${total}</p>
    `;

    swal.fire(
        "Cotizacion realizada",
        "el calculo se realizo correctamente",
        "success"
    )};

function guardarCotizacion (servicio, horas, total){
    const Cotizacion = {
        servicio: servicio.nombre,
        horas: horas,
        total: total
    };
    localStorage.setItem("ultimaCotizacion", JSON.stringify(Cotizacion));
}

function cargarUltimaCotizacion() {
    const CotizacionGuardada = localStorage.getItem("ultimaCotizacion");
    if (CotizacionGuardada){
        const Cotizacion = JSON.parse(CotizacionGuardada);

        divResultado.innerHTML = `
            <p> <strong>ultima cotizacion guardada:</strong> </p>
            <p>Servicio: ${Cotizacion.servicio}</p>
            <p>Horas: ${Cotizacion.horas}</p>
            <p>Total: $${Cotizacion.total}</p>
        `;
    }
}
cargarUltimaCotizacion();