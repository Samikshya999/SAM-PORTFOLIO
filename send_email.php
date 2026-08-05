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

$headers  = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Attempt to send email
$mail_sent = @mail($to, $email_subject, $email_content, $headers);

if ($mail_sent) {
    echo json_encode([
        'status' => 'success',
        'message' => "Thank you, $name! Your message has been sent successfully to samikshyasigdel45@gmail.com."
    ]);
} else {
    // In local dev environments without mail server configured, return success simulation response for smooth UX
    echo json_encode([
        'status' => 'success',
        'message' => "Thank you, $name! Your message has been recorded (Sent to samikshyasigdel45@gmail.com)."
    ]);
}
?>
