<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "Form was submitted";
    // Print out the form data for testing
    print_r($_POST);
}
