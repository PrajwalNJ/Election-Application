<?php
$con = mysqli_connect("localhost", "root", "", "election_db");
$task = $_POST['task'];

if($task === "add"){

    $name = $_POST['name'];
    $type = $_POST['type'];
    $image = $_FILES['candidate_pic'];

    if(($image['type'] == "image/png") || ($image['type'] == "image/jpg") || ($image['type'] == "image/jpeg")){

        if($image['error'] == 0){

            $sql="INSERT INTO candidates (name, election_type) VALUES ('".$name."', '".$type."')";
            mysqli_query($con,$sql);
            $sql="SELECT id FROM candidates WHERE name='".$name."' AND election_type='".$type."' ORDER BY id DESC LIMIT 1";

            if($result = mysqli_query($con,$sql)){
                $row = mysqli_fetch_row($result);
                $id = $row[0];
            }

            $ext = explode('/', $image['type']);
            $image_name = $name."(".$id.")".".".end($ext);

            move_uploaded_file($image['tmp_name'],"candidates/".$image_name);
            $sql="UPDATE candidates SET image_src='candidates/".$image_name."' WHERE id='".$id."'";
            mysqli_query($con,$sql);

            echo "Done";
        }
        else{
            echo "Error Occured";
        }
    }
    else{
        echo "Image not found !";
    }
}

else if($task === "getCandidates"){
    $data = array();
    $i=0;

    $sql="SELECT CONCAT(name,' (',id,') ','(',election_type,')') FROM candidates WHERE election_type REGEXP '^school' ORDER BY election_type,name";
    $result = mysqli_query($con,$sql);

    while($row = mysqli_fetch_row($result)){
        $data[$i] = $row[0];
        $i++;
    }

    $sql="SELECT CONCAT(name,' (',id,') ','(',election_type,')') FROM candidates WHERE election_type NOT RLIKE '^school' ORDER BY election_type,name";
    $result = mysqli_query($con,$sql);

    while($row = mysqli_fetch_row($result)){
        $data[$i] = $row[0];
        $i++;
    }

    echo (json_encode($data));
}

else if($task === "remove"){
    $pword = $_POST['pword'];
    $candidate = $_POST['candidate'];

    $sql="SELECT password FROM admin";
    if($result = mysqli_query($con, $sql)){
        $row = mysqli_fetch_row($result);
        $password = $row[0];
    }

    if($password === md5($pword)){
        $sql="SELECT image_src FROM candidates WHERE CONCAT(name,' (',id,') ','(',election_type,')')='".$candidate."'";
        $result = mysqli_query($con, $sql);
        $row = mysqli_fetch_row($result);
		
		if(file_exists($row[0]))
			unlink($row[0]);
		else
			echo "Image was not found. ";
		
        $sql="DELETE FROM candidates WHERE CONCAT(name,' (',id,') ','(',election_type,')')='".$candidate."'";
        mysqli_query($con, $sql);
        echo "Done";
    }
    else
        echo "Incorrect password!";
}

else if($task === "checkNo"){
    $sql = "SELECT COUNT(name) FROM candidates";
    $result = mysqli_query($con, $sql);
    $row = mysqli_fetch_row($result);

    echo $row[0];
}

?>