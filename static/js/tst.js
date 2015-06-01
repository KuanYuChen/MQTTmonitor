
    var mqtt;
    var reconnectTimeout = 2000;

    function MQTTconnect() {
        mqtt = new Paho.MQTT.Client(
                        host,
                        port,
                        "web_" + parseInt(Math.random() * 100,
                        10));
        var options = {
            timeout: 3,
            useSSL: useTLS,
            cleanSession: cleansession,
            onSuccess: onConnect,
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
        mqtt.subscribe(topic, {qos: 0});
        console.log('MQTT Connectado: ' + host + ':' + port)
    }

    function onConnectionLost(response) {
        setTimeout(MQTTconnect, reconnectTimeout);  
        $("#estado").text('CONEXION PERDIDA, reconectando');
        

    };

    function addLog(mensaje){
        $('.console-out').append(mensaje);
        var h = parseInt($('#log')[0].scrollHeight);
        $('#log').scrollTop(h);

    };


    function onMessageArrived(message) {

        var topic = message.destinationName;
        var payload = message.payloadString;
        mensaje = "Resp:>" + topic + ' Valor: ' + payload + '\n';
        addLog(mensaje);
       
    };

    function messageSend(comando, idTst){
        message = new Paho.MQTT.Message(comando);
        message.destinationName = "CONF/"+idTst;
        mqtt.send(message);
        mensaje = "Env:>" + comando + '\n';
        addLog(mensaje);
        console.log(comando);
    };


    function cursorAnimation() {
    $('#cursor').animate({
            opacity: 0
        }, 'fast', 'swing').animate({
            opacity: 1
        }, 'fast', 'swing');
    };

   

    $(document).ready(function() {
        setInterval ('cursorAnimation()', 900);
        MQTTconnect();
         

         $("#enviarcomando").click(function(){
            if ( $.trim($("#comando").val()) != '' &&  $.trim($("#idTst").val()) != '' ) 
            {
                var comando = $("#comando").val().toUpperCase(); 
                var idTst = $("#idTst").val().toUpperCase();
                messageSend(comando,idTst);
            }
            else if ($.trim($("#comando").val()) != '') {
                    var comando = $("#comando").val().toUpperCase(); 
                    var idTst = '#';
                    messageSend(comando,idTst);
            }
            else 
            {
                mensaje = "ERROR comando invalido \n";
                addLog(mensaje);
            }         
        });
    });

    
    
       
       

        
       

    
  
        

