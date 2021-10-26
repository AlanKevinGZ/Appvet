let pagina=1;
const cita={
    nombre='',
    fecha='',
    hora='',
    servicios=[],
}

document.addEventListener('DOMContentLoaded',()=>{
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    //resalta el tab ssegun el seleccionado
    mostrarSeccion();
    //oculata o muestra la seccion del tab 
    cambiarSeccion();

    //paginacion siguiente y anterior
    PaginaSiguiente();

    PaginaAnterior();

    //combrueba la paginacion para ocultar o mostar los botones de siguiente o anterior
    botonesPaginador();

    //muestra el resumen de la cita
    mostrarResumen();

    //almacena el nombre
    nombreCita();

    //almacena la fecha
    fechaCita();

    //desabilita dias pasados
    deshabilitarDiasPasados();
}

function mostrarSeccion() {

    const seccionAnterior=document.querySelector('.tab-seleccionado');

    if(seccionAnterior){
        seccionAnterior.classList.remove('tab-seleccionado');
    }
    
    const seccionActual=document.querySelector(`#paso-${pagina}`)
    seccionActual.classList.add('tab-seleccionado');

    const tabAnterior= document.querySelector('.tabs button.actual');
    if(tabAnterior){
        //eleimnar la clase de actual del tab anterior
        tabAnterior.classList.remove('actual');
    }
    
    //resaltar btn seleccionados
    const tabs=document.querySelector(`[data-paso="${pagina}"]`);
    tabs.classList.add('actual');
}


function cambiarSeccion() {
    let botones=document.querySelectorAll('.tabs button');

    botones.forEach((boton)=>{
        boton.addEventListener('click',(e)=>{
            e.preventDefault();
            pagina=parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    //try catch para errores como conectar a una bd o api
    try {
        //obtenemos respuestas del json y los datos
        const resultado=await fetch('./servicios.json');
        const db=await resultado.json();
        
        const {servicios}=db;

        //generar el html

        servicios.forEach(servicio => {
            const {id,nombre,precio}=servicio;

            //dom scripting

            //nombres servicio
            const nombreServicio=document.createElement('P');
            nombreServicio.textContent=nombre;
            nombreServicio.classList.add('nombre_servicio');

            //precio servicio
            const costoServicio=document.createElement('span');
            costoServicio.textContent=`$ ${precio}`;
            costoServicio.classList.add('precio_servicio');
           
            //generar div que contiene la info
            const divContendor=document.createElement('DIV');
            divContendor.classList.add('servicio');
            divContendor.dataset.idServicios=id;

            //selecciona un servicio para la cita
            divContendor.onclick=seleccionarServicios;


            //inyectar al div
            divContendor.appendChild(nombreServicio);
            divContendor.appendChild(costoServicio);

           
            //inyectar al html
           document.querySelector('#listado_servicios').appendChild(divContendor);


            
        });


      
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicios(e) {
    
    let elemento;
    //para que le de click al div
    if(e.target.tagName==='P' || e.target.tagName==='SPAN'){
        //va hacia el elemnto padre
        elemento=e.target.parentElement;
    }else{
        elemento=e.target;
        
    }
  
   let result = elemento.classList.contains('seleccionar');

   if (result) {
       elemento.classList.remove('seleccionar');

      const id=parseInt(elemento.dataset.idServicios);

       eliminarServicio(id);
   }else{
    elemento.classList.add('seleccionar');

      

      const servicioObj={
          id:parseInt(elemento.dataset.idServicios),
          nombre:elemento.firstElementChild.textContent,
          precio:elemento.firstElementChild.nextElementSibling.textContent,

      }
      //console.log(servicioObj);

    agregarServicio(servicioObj);
   }
   
}


function eliminarServicio(id) {
    const {servicios}=cita;

    //filtra y se trae los que son diferentes al id
    cita.servicios=servicios.filter(servicio => servicio.id !==id);

   
}

function agregarServicio(servicioObj) {
    const {servicios}=cita;
    //copiar un arreglo para agrgar el servicio
    cita.servicios=[...servicios,servicioObj];
   
}


function PaginaSiguiente() {
    const siguiente=document.querySelector('#siguiente');
    siguiente.addEventListener('click',()=>{
        pagina++;
        
        botonesPaginador();
    })
}

function PaginaAnterior() {
    const anterior=document.querySelector('#anterior');
    anterior.addEventListener('click',()=>{
        pagina--;
        console.log(pagina);
        botonesPaginador();
        
    })
}


function botonesPaginador() {
    const siguiente=document.querySelector('#siguiente');
    const anterior=document.querySelector('#anterior');

    if(pagina===1){
        anterior.classList.add('ocultar');
    }else if(pagina===3){
        siguiente.classList.add('ocultar');
        anterior.classList.remove('ocultar');

        mostrarResumen();
    }else{
       siguiente.classList.remove('ocultar');
        anterior.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function mostrarResumen() {
    //destructuring
    const {nombre,fecha,hora,servicios}=cita;
    
    let seccionTres=document.querySelector('.seccion_tres');

   while (seccionTres.firstChild) {
       seccionTres.removeChild(seccionTres.firstChild);
   }

    //validar objeto
    //extaer los valores de un objeto
    if(Object.values(cita).includes('')){
        const noServicios=document.createElement('P');
        noServicios.textContent="El nombre, la fecha o la hora no pueden estar vacios"
        noServicios.classList.add('msjError');

        seccionTres.appendChild(noServicios);
        
        return;
    }

    const nombreCita=document.createElement('P');
    nombreCita.innerHTML=`<span>Nombre:</span>${nombre}`;
    seccionTres.appendChild(nombreCita);
    console.log(nombreCita);
}

function nombreCita() {
    const nombreInput=document.querySelector('#nombre');

    nombreInput.addEventListener('input',(e)=>{
        const nombreTexto=e.target.value.trim();

        //validar input
        if(nombreTexto==='' || nombreTexto.length< 3){
            mostararAlertas('Nombre vacio','error');
        }else{
            const alerta=document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre=nombreTexto;
            
        }
        
    })
}

function mostararAlertas(msj,tipo) {

    //si ya hay una alerta no crear otra
    const alertaprevia=document.querySelector('.alerta');
    if(alertaprevia){
        return;
    }
   const alert=document.createElement('DIV');
   alert.textContent=msj;
   alert.classList.add('alerta');

   if(tipo='error'){
       alert.classList.add('error');

   }

   //insertar en elformulario
   const formulario=document.querySelector('.formulario');
   formulario.appendChild(alert);
   
   //eliminar la alerta despues de 3 s
   setTimeout(() => {
       alert.remove();
   }, 3000);

}

function fechaCita() {
    const fechaInput=document.querySelector('#fecha');

    fechaInput.addEventListener('input',(e)=>{
    
        const dia=new Date(e.target.value).getUTCDay();

        if([0].includes(dia)){
            e.preventDefault();
            fechaInput.value='';
            console.log('domingo no es valido');
            mostararAlertas('Los Domingos no hay Servicio','error');
        }else{
            cita.fecha=fechaInput.value;

           
        }
    });


}

function deshabilitarDiasPasados() {
    const fechaInput=document.querySelector('#fecha');
    
    // Obtencion de el año, mes, dia
   const fechaAhora = new Date();
   const year = fechaAhora.getFullYear();
   let mes = fechaAhora.getMonth() + 1;

   // suma un día a la fecha actual sin inconvenientes, por ejemplo, si el 
   //día actual es 31 de marzo y se le suma un día, la fecha sería 1 de abril
   fechaAhora.setDate(fechaAhora.getDate() + 1);

   let dia = fechaAhora.getDate();

   if(mes < 10){
      mes = `0${mes}`;
   }

   if(dia < 10){
      dia = `0${dia}`;
   }

   // Formato de la fecha minima AAAA-MM-DD 
   let fechaDeshabilitar = `${year}-${mes}-${dia}`;

   fechaInput.min = fechaDeshabilitar;

    
   
}