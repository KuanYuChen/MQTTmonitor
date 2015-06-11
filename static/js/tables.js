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
                      { "data": "version" },
                      { "data": "dbm" },
                      { "data": "actualizacion" },
                      { "data": "tiempoPasado" }
            ],



    });
    setInterval( function () { 
        table.ajax.reload(null, false); 
    }, 10000 );


    function handleAjaxError( xhr, textStatus, error ) {
    if ( textStatus === 'timeout' ) {
       console.log( 'El servidor esta tardando en enviar los datos.' );
    }
    else {
        console.log( 'Un error a ocurrido en el servidor' );
    }
    myDataTable.fnProcessingIndicator( false );
}


   
  

});

 