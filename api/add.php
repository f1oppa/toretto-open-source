<?php
    if($_SERVER['HTTP_SERVER'] == null || $_SERVER['HTTP_CHANNEL'] == null){
        header("Location: https://http.cat/403");
        die();
    }
    
    $current_data = file_get_contents('list.json');
    $array_data = json_decode($current_data, true);
    $extra = array(
         'server' => $_SERVER['HTTP_SERVER'],
         'channel' => $_SERVER['HTTP_CHANNEL']
    );
    $array_data[] = $extra;
    $final_data = json_encode($array_data);

    if(file_put_contents('list.json', $final_data)){  
        http_response_code(200);
        echo "200 OK";
    }
    else{
        http_response_code(500);
        echo "500 Server Error";
    }
?>