
    var mqtt;
    //Version 3.1 = 3 , 3.11 = 4
    var version = 3
    
    var reconnectTimeout = 2000;

    var timer;


  
    

    //clearTimeout(timer);

    function MQTTconnect() {
        mqtt = new Paho.MQTT.Client(
                        host,
                        port,
                        "web_" + parseInt(Math.random() * 100,
                        10));
        var options = {
            timeout: 3,
            mqttVersion : version,
            useSSL: useTLS,
            cleanSession: cleansession,
            onSuccess: onConnect,
            //Version 3.1 = 3 , 3.11 = 4
            onFailure: function (message) {
                $('#estado').text("Conexion fallada: " + message.errorMessage + "Retry");
                setTimeout(MQTTconnect, reconnectTimeout);
            }


        };

        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;

        if (username != null) {
            options.userName = username;
            options.password = password;
        }
        console.log("Host="+ host + ", port=" + port + " TLS = " + useTLS + " username=" + username + " password=" + password);
        mqtt.connect(options);
    }

    function onConnect() {
        $("#estado").text('CONECTADO: [' + host + "]");
        mqtt.subscribe(topicRespuesta, {qos: 1});
        console.log('MQTT Connectado: ' + host + ':' + port)
        enabledCommand();
    }

    function onConnectionLost(response) {
        setTimeout(MQTTconnect, reconnectTimeout);  
        $("#estado").text('CONEXION PERDIDA, reconectando');
        disabledCommand();
    };

    function enabledCommand(){
        $("#enviarcomando").attr("disabled", false);
        $("#comando").attr("disabled", false);
    };

    function disabledCommand(){
        $("#enviarcomando").attr("disabled", true);
        $("#comando").attr("disabled", true);
    };

    function addLog(mensaje){
        $('.console-out').append(mensaje);
        var h = parseInt($('#log')[0].scrollHeight);
        $('#log').scrollTop(h);

    };


    function onMessageArrived(message) {

        var topicRespuesta = message.destinationName;
        var payload = message.payloadString;
        mensaje = "Resp:>" + topicRespuesta + ' Valor: ' + payload + '\n';
        addLog(mensaje);
        stopTimer();
    };

    function messageSend(comando, idTst){
        message = new Paho.MQTT.Message(comando);
        if (idTst == 'todos')
            message.destinationName = topicEnvioComando;
        else
            message.destinationName = topicEnvioComando+idTst;
        mqtt.send(message);
        mensaje = "Env:>" + comando + '\n';
        addLog(mensaje);
        console.log(comando);
        startTimer();
    };



    function cursorAnimation() {
    $('#cursor').animate({
            opacity: 0
        }, 'fast', 'swing').animate({
            opacity: 1
        }, 'fast', 'swing');
    };


    function startTimer(){
        timer = setTimeout(function(){
            addLog("Resp:> Tiempo excedido de respuesta. \n");
            stopTimer();
        }, 10000);

    };

    function stopTimer(){
        clearTimeout(timer);
    };

   

    $(document).ready(function() {
        setInterval ('cursorAnimation()', 900);
        MQTTconnect();
         
        $("#limpiar").click(function(){
            $('.console-out').empty();

        });

         $("#enviarcomando").click(function(){
            if ( $.trim($("#comando").val()) != '' &&  $.trim($("#idTst").val()) != '' ) 
            {
                var comando = $("#comando").val().toUpperCase(); 
                var idTst = $("#idTst").val().toUpperCase();
                messageSend(comando,idTst);
            }
            else if ($.trim($("#comando").val()) != '' && $.trim($("#idTst").val()) == '') {
                    var comando = $("#comando").val().toUpperCase(); 
                    var idTst = 'todos';
                    messageSend(comando,idTst);
            }
            else 
            {
                mensaje = "ERROR comando invalido \n";
                addLog(mensaje);
            }         
        });
    });

    
    
       
       

        
       

    
  
        

