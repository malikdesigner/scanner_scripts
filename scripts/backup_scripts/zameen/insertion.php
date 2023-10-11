<?php $dir = "C:/Local_Projects/scanner_scripts/scripts/zameen/";

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
                // Accessing the "Type" value
                $propertyType = $json_data['Type'];
                
                // Print the "Type" value
                echo "Type of $file_name: $propertyType\n";
            }
        }
    }
    closedir($handle);
}
?>