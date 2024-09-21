export const otptemplateHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 10px 0;
    }
    .content {
      padding: 20px;
      text-align: left;
    }
    .footer {
      text-align: center;
      padding: 10px 0;
      font-size: 12px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Bina Web</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your OTP code is: <strong>{{OTP_CODE}}</strong></p>
      <p>Thank you for using our service!</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Amit Kaplan Co'. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;