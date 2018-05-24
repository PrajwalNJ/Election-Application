<?php

$host="localhost";
$user="root";
$pword="";
$db="election_db";
$con=mysqli_connect($host,$user,$pword,$db);

if(!$con){
	die("Couldn't connect to database. Please try again later.");	
}

?>