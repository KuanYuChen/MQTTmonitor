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
            "ajax": "../data/datos.json",
            "columns": [
                      { "data": "id" },
                      { "data": "nombre" },
                      { "data": "serie" },
                      { "data": "conexion" },
                      { "data": "actualizacion" },
                      { "data": "horaserver" },
                      { "data": "tiempoPasado" }
            ],

    });
    setInterval( function () { 
        table.ajax.reload(null, false); 
    }, 10000 );


   
  

});

 