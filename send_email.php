<?php
header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. Please submit the form.'
    ]);
    exit;
}

// Sanitize & Validate Form Data
$name    = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email   = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? trim(strip_tags($_POST['subject'])) : 'General Inquiry';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validation Checks
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please fill in all required fields (Name, Email, and Message).'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid email address provided.'
    ]);
    exit;
}

// Email Recipient & Headers
$to = 'samikshyasigdel45@gmail.com';
$email_subject = "Artwork Inquiry [$subject] from $name";

$email_content  = "Name: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Inquiry Type: $subject\n\n";
$email_content .= "Message:\n$message\n";

// Construct a valid domain-based From address to pass host SPF/Sender policies
$host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? 'localhost';
$host = preg_replace('/:\d+$/', '', $host); // remove port if present
$host = preg_replace('/^www\./i', '', $host); // remove www prefix
if (empty($host) || $host === 'localhost' || filter_var($host, FILTER_VALIDATE_IP)) {
    $from_email = 'noreply@portfolio.local';
} else {
    $from_email = 'noreply@' . $host;
}

// Set From to domain email and Reply-To to visitor's email address
$headers  = "From: $name <$from_email>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Attempt to send email
$mail_sent = mail($to, $email_subject, $email_content, $headers);

if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => "Thank you, $name! Your message has been sent successfully."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => "Mail server failed to send email. Please email directly to samikshyasigdel45@gmail.com"
    ]);
}
?>

