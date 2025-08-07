exports.productPurchasedByUser = (userName, productName, amount, quantity) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Product Purchase Notification</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #333333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
      }

      .logo {
        max-width: 180px;
        margin-bottom: 20px;
      }

      .message {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #1a1a1a;
      }

      .details {
        font-size: 16px;
        text-align: left;
        margin: 0 auto;
        max-width: 480px;
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      }

      .highlight {
        font-weight: bold;
        color: #000000;
      }

      .footer {
        font-size: 14px;
        color: #888888;
        margin-top: 20px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <img class="logo" src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png" alt="NxtTrendz Logo" />
      <div class="message">New Product Purchase Alert</div>
      <div class="details">
        <p><span class="highlight">User:</span> ${userName}</p>
        <p><span class="highlight">Product:</span> ${productName}</p>
        <p><span class="highlight">Quantity:</span> ${quantity}</p>
        <p><span class="highlight">Total Amount:</span> ₹${amount}</p>
      </div>
      <div class="footer">This is an automated alert from the NxtTrendz order system.</div>
    </div>
  </body>
  </html>`;
};
