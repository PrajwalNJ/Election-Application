<?php

require 'db_connect.php';

if(isset($_POST['class']))
    $class=$_POST['class'];

$task=$_POST['task'];

if($task == "updateSections"){
	$sections=$_POST['sections'];
	$sql="UPDATE class_details SET sections=".$sections." WHERE class=".$class;	
	if($result=mysqli_query($con, $sql))
		echo 'Done';	
	else
		echo 'Failed';
}

else if($task == "getSections"){
	$sql="SELECT sections FROM class_details WHERE class=".$class;
	if($result=mysqli_query($con, $sql)){
		$row=mysqli_fetch_row($result);
		echo $row[0];
	}
}

else if ($task == "getVotingStatus"){
    $data = array();

    $sql="SELECT class, sections FROM class_details";
    $result1 = mysqli_query($con, $sql);
    $j=0; $k=0;

    while ($row1 = mysqli_fetch_row($result1)){
        $section = ($row1[1] == "1") ? "" : "A";

        if($section == ""){
            $sql = "SELECT class, section, COUNT(class) FROM voters WHERE class=".$row1[0]." AND section='None'";
            $result2 = mysqli_query($con, $sql);
            $row2 = mysqli_fetch_row($result2);

            if($row2 && $row2[2] != 0){
                $data['finished'][$j] = $row1[0]."  (No. of students voted:  ".$row2[2].")";
                $j++;
            }
            else{
                $data['pending'][$k] = $row1[0];
                $k++;
            }
        }

        for($i=0; $i<$row1[1] && $section != ""; $i++, $section++){
            $sql = "SELECT class, section, COUNT(class) FROM voters WHERE class=".$row1[0]." AND section='".$section."'";
            $result2 = mysqli_query($con, $sql);
            $row2 = mysqli_fetch_row($result2);

            if($row2 && $row2[2] != 0){
                $data['finished'][$j] = $row1[0]." '".$section."' (No. of students voted: ".$row2[2].")";
                $j++;
            }
            else{
                $data['pending'][$k] = $row1[0]." '".$section."'";
                $k++;
            }
        }
    }

    echo (json_encode($data));
}


?>