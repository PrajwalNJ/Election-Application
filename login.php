<?php

require 'db_connect.php';

$sql = "SELECT username, password FROM admin WHERE id = 1";
$result = mysqli_query($con, $sql);
$row = mysqli_fetch_row($result);

if($_POST['task'] == "changePword"){

    $cur_pword = $_POST['cur_pword'];
    $new_pword = $_POST['new_pword'];

    if($row[1] === md5($cur_pword)){
        $sql = "UPDATE admin SET password='".md5($new_pword)."' WHERE id = 1";
        mysqli_query($con, $sql);
        echo "Done";
    }
    else
        echo "Incorrect Current Password!";
}

else if ($_POST['task'] == "login"){
    $uname = $_POST['username'];
    $pword = $_POST['pword'];

    if($uname == $row[0] && md5($pword) == $row[1])
        echo "Done";
    else if($uname != $row[0])
        echo "Incorrect Username and Password";
    else
        echo "Incorrect Password";

}

?>