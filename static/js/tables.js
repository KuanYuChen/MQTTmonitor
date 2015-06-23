 $(document).ready(function() {

    var table = $('#equipos').DataTable( {
            responsive: true,
            "iDisplayLength": 30,
            "language" : {
              "info":           "Mostrando _START_ de _END_  para  _TOTAL_ puntos de monitoreo",
              "lengthMenu": "Mostrar _MENU_ puntos de monitoreo por pagina",
              "search": "Busqueda:",
              "loadingRecords": "Cargando...",
              "processing":     "Procesando...",
              "paginate": {
                  "first": "Primer",
                  "previous": "Previo",
                  "next":"Siguiente",
                  "last":"Ultimo"
              },


          },          
            "ajax":{
              "url" : "../data/datos.json",
              "error" : handleAjaxError 
            },
            "columns": [
                      { "data": "nombre" },
                      { "data": "acciones"},
                      { "data": "version" },
                      { "data": "dbm" },
                      { "data": "actualizacion" },
                      { "data": "conexion"},
                      { "data": "tiempoPasado" }
            ],



    });

    $('#logConexion').dataTable({
           "language" : {
              "info":           "Mostrando _START_ de _END_  para  _TOTAL_ registro de logs",
              "lengthMenu": "Mostrar _MENU_ registro de logs",
              "search": "Busqueda:",
              "loadingRecords": "Cargando...",
              "processing":     "Procesando...",
              "paginate": {
                  "first": "Primer",
                  "previous": "Previo",
                  "next":"Siguiente",
                  "last":"Ultimo"
              },

          }    
        });

    setInterval( function () { 
        table.ajax.reload(null, false); 
    }, 10000 );


    function handleAjaxError( xhr, textStatus, error ) {
    if ( textStatus === 'timeout' ) {
       console.log( 'El servidor registra un timeout en enviar los datos.' );
    }
    else {
        console.log( 'Un error a ocurrido en el servidor' );
    }
    myDataTable.fnProcessingIndicator( false );
}


   
  

});

 