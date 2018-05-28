-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2018 at 10:30 AM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `election_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL COMMENT 'This field will contain the id of the administrator(s)',
  `username` varchar(255) NOT NULL COMMENT 'This field will store the username of the respective administrator',
  `password` varchar(255) NOT NULL COMMENT 'This field will store the password of the respective administrator'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table contains the details of the administrator(s)';

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'srivani', '41bf236be8728fc47990c74aff3a3f31');

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL COMMENT 'This field stores the candidates'' id',
  `name` text NOT NULL COMMENT 'This field stores the names of the candidates',
  `image_src` text NOT NULL COMMENT 'This field stores the path or url of the candidates'' images ',
  `election_type` text NOT NULL COMMENT 'This field stores the type of election that the candidate is standing for',
  `votes` int(11) NOT NULL COMMENT 'This field stores the number of votes the candidate has received'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of all the candidates';

-- --------------------------------------------------------

--
-- Table structure for table `class_details`
--

CREATE TABLE `class_details` (
  `class` int(11) NOT NULL COMMENT 'This field stores the all classes in the school',
  `sections` int(11) NOT NULL COMMENT 'This field stores the number of sections in the respective class in the school'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table contains the number of sections in each class';

--
-- Dumping data for table `class_details`
--

INSERT INTO `class_details` (`class`, `sections`) VALUES
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `houses`
--

CREATE TABLE `houses` (
  `id` int(11) NOT NULL COMMENT 'This filed stores the id of the houses',
  `category` varchar(250) NOT NULL COMMENT 'This field stores the names of all the houses (including school)',
  `election_type` varchar(250) NOT NULL COMMENT 'This field stores the different elections in which candidates can stand'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table contains the details of houses and election types';

--
-- Dumping data for table `houses`
--

INSERT INTO `houses` (`id`, `category`, `election_type`) VALUES
(1, 'School', 'School - Captain'),
(2, 'School', 'School - Vice Captain'),
(3, 'Aryabhatta', 'Aryabhatta - Captain'),
(4, 'Aryabhatta', 'Aryabhatta - Vice Captain'),
(5, 'Bhaskara', 'Bhaskara - Captain'),
(6, 'Bhaskara', 'Bhaskara - Vice Captain'),
(7, 'Charaka', 'Charaka - Captain'),
(8, 'Charaka', 'Charaka - Vice Captain'),
(9, 'Sushrutha', 'Sushrutha - Captain'),
(10, 'Sushrutha', 'Sushrutha - Vice Captain');

-- --------------------------------------------------------

--
-- Table structure for table `voters`
--

CREATE TABLE `voters` (
  `roll_no` varchar(35) NOT NULL COMMENT 'This field stores the roll number of the voter (student)',
  `class` int(11) NOT NULL COMMENT 'This field stores the class of the voter (student)',
  `section` varchar(10) NOT NULL COMMENT 'This field stores the section of the voter (student)',
  `school_cap` varchar(11) NOT NULL COMMENT 'This field stores the candidate_id for whom the voter (student) has voted as school captain or ''None'' if candidates aren''t present',
  `school_vcap` varchar(11) NOT NULL COMMENT 'This field stores the candidate_id for whom the voter (student) has voted as school vice captain or ''None'' if candidates aren''t present',
  `house_cap` varchar(11) NOT NULL COMMENT 'This field stores the candidate_id for whom the voter (student) has voted as house captain or ''None'' if candidates aren''t present',
  `house_vcap` varchar(11) NOT NULL COMMENT 'This field stores the candidate_id for whom the voter (student) has voted as house vice captain or ''None'' if candidates aren''t present'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='This table stores the details of the voters and their votes';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `houses`
--
ALTER TABLE `houses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'This field will contain the id of the administrator(s)', AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'This field stores the candidates'' id';

--
-- AUTO_INCREMENT for table `houses`
--
ALTER TABLE `houses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'This filed stores the id of the houses', AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

