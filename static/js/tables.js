 $(document).ready(function() {
    var table = $('#equipos').DataTable( {
            "iDisplayLength": 30,
            "language" : {
              "search": "Busqueda:",
              "paginate": {
                  "first": "Primer",
                  "previous": "Previo",
                  "next":"Siguiente",
                  "last":"Ultimo"
              }
          },          
            "ajax":{
              "url" : "../data/datos.json",
              "error" : handleAjaxError 
            },
            "columns": [
                      { "data": "nombre" },
                      { "data": "actualizacion" },
                      { "data": "tiempoPasado" }
            ],



    });
    setInterval( function () { 
        table.ajax.reload(null, false); 
    }, 10000 );


    function handleAjaxError( xhr, textStatus, error ) {
    if ( textStatus === 'timeout' ) {
        alert( 'El servidor esta tardando mucho en enviar los datos.' );
    }
    else {
        alert( 'Un error a ocurrido en el servidor, reintente en un minuto.' );
    }
    myDataTable.fnProcessingIndicator( false );
}


   
  

});

 