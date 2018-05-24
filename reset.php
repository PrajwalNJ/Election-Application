<?php

require 'db_connect.php';

$sql = "TRUNCATE voters";
mysqli_query($con, $sql);

$sql = "SELECT image_src FROM candidates";
$result = mysqli_query($con, $sql);
while ($row = mysqli_fetch_row($result)){
    if(file_exists($row[0]))
        unlink($row[0]);
}


$sql = "TRUNCATE candidates";
mysqli_query($con, $sql);

echo "Done";