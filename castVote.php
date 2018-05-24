<?php

require 'db_connect.php';

$task = $_POST['task'];
$data = array();

if($task === "getHouses"){
    $sql = "SELECT DISTINCT category FROM houses WHERE category != 'School'";
    $result = mysqli_query($con, $sql);

    for($i=0; $row = mysqli_fetch_row($result); $i++)
        $data[$i] = $row[0];

    echo (json_encode($data));
}

else if($task === "getCandidateDetails"){
    $sql = "SELECT DISTINCT category FROM houses";
    $result1 = mysqli_query($con, $sql);

    for($i=0; $row1 = mysqli_fetch_row($result1); $i++){

        $data[$i]['house'] = $row1[0];

        $sql = "SELECT election_type FROM houses WHERE category = '".$row1[0]."' ORDER BY election_type";
        $result2 = mysqli_query($con, $sql);
        $arrayName = "captain";

        for($j=0; $row2 = mysqli_fetch_row($result2); $j++){

            $purpose = 0;
            if(isset($_POST['purpose']) && $_POST['purpose'] == "displayVotes"){
                $sql = "SELECT name, votes FROM candidates WHERE election_type = '".$row2[0]."' ORDER BY votes DESC";
                $purpose = 1;
            }
            else
                $sql = "SELECT name, id, image_src FROM candidates WHERE election_type = '".$row2[0]."' ORDER BY name";
            $result3 = mysqli_query($con, $sql);
			
			$data[$i][$arrayName] = array();

            for ($k=0; $row3 = mysqli_fetch_row($result3); $k++){

                if($purpose == 0){
                    $data[$i][$arrayName][$k]['id'] = $row3[1];
                    if(file_exists($row3[2]))
                        $data[$i][$arrayName][$k]['img_src'] = $row3[2];
                    else
                        $data[$i][$arrayName][$k]['img_src'] = "images/login.png";
                }
                else
                    $data[$i][$arrayName][$k]['votes'] = $row3[1];

                $data[$i][$arrayName][$k]['name'] = $row3[0];
            }

            $arrayName = "vice-captain";
        }
    }

    echo (json_encode($data));
}