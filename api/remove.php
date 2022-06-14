<?php
    if($_SERVER['HTTP_SERVER'] == null){
        header("Location: https://http.cat/403");
        die();
    }

    $data = file_get_contents('list.json');
    $json_arr = json_decode($data, true);

    $arr_index = array();
    foreach ($json_arr as $key => $value) {
        if ($value['server'] == $_SERVER["HTTP_SERVER"]) {
            $arr_index[] = $key;
        }
    }

    foreach ($arr_index as $i) {
        unset($json_arr[$i]);
    }

    $json_arr = array_values($json_arr);

    if(file_put_contents('list.json', json_encode($json_arr))){  
        http_response_code(200);
        echo "200 OK";
    }
    else{
        http_response_code(500);
        echo "500 Server Error";
    }
?>