<?php

require 'db_connect.php';

$rollno=$_POST['rno'];
$class=$_POST['class'];
$section=$_POST['section'];
$task=$_POST['task'];

if($task == "checkRollNo"){
    $sql = "SELECT roll_no, class, section FROM voters WHERE roll_no = '".md5($rollno)."' AND class = ".$class." AND section = '".$section."'";
    $result = @mysqli_query($con, $sql);

    if(mysqli_fetch_row($result)){
        echo "Denied";
    }
    else
        echo "Granted";
}

else if($task == "vote"){
    $candidatesVoted = array('school_cap' => $_POST['school_cap'], 'school_vcap' => $_POST['school_vcap'], 'house_cap' => $_POST['house_cap'], 'house_vcap' => $_POST['house_vcap']);

    $sql = "INSERT INTO voters (roll_no, class, section, school_cap, school_vcap, house_cap, house_vcap) VALUES ('".md5($rollno)."', ".$class.", '".$section."', '".$candidatesVoted['school_cap']."', '".$candidatesVoted['school_vcap']."', '".$candidatesVoted['house_cap']."', '".$candidatesVoted['house_vcap']."')";
    $result = mysqli_query($con, $sql);

    foreach ($candidatesVoted as $id){
        if($id != 'none'){
            $sql = "SELECT votes FROM candidates WHERE id=".$id;
            $votes = mysqli_fetch_row(mysqli_query($con, $sql))[0];

            $sql = "UPDATE candidates SET votes = ".++$votes." WHERE id = ".$id;
            mysqli_query($con, $sql);
        }
    }

    echo "Done";
}

?>