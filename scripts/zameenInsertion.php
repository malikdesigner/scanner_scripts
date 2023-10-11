<?php
//exit;
//require "/opt/vp2/config.php";
$sitesDBIP = 'intel_tool';
$db_username = "root";
$db_pwd = "";
$db_host = "localhost";
$obj = new mysqli($db_host, $db_username, $db_pwd, $sitesDBIP);
//$obj = new Dbase($db_db, $db_host, $db_username, $db_pwd);

$dir = "C:/Local_Projects/scanner_scripts/scripts/zameen/";
$loop_index = 0;
if ($handle = opendir($dir)) {
  while (false !== ($file_name = readdir($handle))) {
    if ($file_name != "." && $file_name != "..") {
      $file_path = $dir . $file_name;
      $file_output = file_get_contents($file_path);

      // Decode JSON data
      $json_data = json_decode($file_output, true);

      // Check for JSON decoding errors
      if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Error decoding JSON in file $file_name: " . json_last_error_msg() . "\n";
      } else {
        // Extract values
        $type = $json_data['Type'];

        $query = "SELECT id FROM tbl_propertycategory WHERE name = '$type'";
        $result = $obj->query($query);
        
        if ($result) {
            // Fetch the id
            $row = $result->fetch_assoc();
            $propertyCategoryId = $row['id'];
        }
        $price = $json_data['Price'];
        $location = $json_data['Location'];
        $bath = ($json_data['Bath(s)'] ? $json_data['Bath(s)'] : '');
        $area = ($json_data['Area'] ? $json_data['Area'] : '');
        $purpose = $json_data['Purpose'];
        $bedrooms = ($json_data['Bedroom(s)'] ? $json_data['Bedroom(s)'] : '');
        $added = $json_data['Added'];
        $description = str_replace("'", "", $json_data['description']);
        $mainLink = $json_data['mainLink'];
        $whatsapp = $json_data['whatsapp'];
        $phoneNumber = $json_data['phoneNumber'];
        $title = $json_data['title'];
        $subHeading = $json_data['subHeading'];
        //$pricePKR = $json_data['price'];
        $amenities = ($json_data['amenities'] ? $json_data['amenities'] : '');
        $buyRent = $json_data['buyRent'];
        $city = $json_data['city'];


        $image = ($json_data['images'] ? $json_data['images'] : '');
        $images = json_encode($image);


        // Now you can use $data_array in your further processing or insertion logic

        // Insert into database
        $sql = "INSERT INTO tbltransactions (type, price, location, bath, area, purpose, bedroom, added, description, mainLink, whatsApp, phoneNumber, title, subHeading,amenities, images,city,buyRent) VALUES ('$propertyCategoryId', '$price', '$location', '$bath', '$area', '$purpose', '$bedrooms', '$added', '$description', '$mainLink', '$whatsapp', '$phoneNumber', '$title', '$subHeading','$amenities', '$images','$city','$buyRent')";
        if ($obj->query($sql) === TRUE) {
          echo "Record inserted successfully for $file_name\n";
        } else {
          echo "Error inserting record for $file_name: " . $conn->error . "\n";
        }
      }
      unlink($file_path);
    }
  }
  closedir($handle);

  // Close database connection
  $conn->close();
}
