# Scan2Serve 🍽️📱

Scan2Serve is a modern, responsive, frontend-only web application designed for restaurants to offer an intimate fine dining experience with a seamless QR ordering system. It features a complete customer-facing menu, real-time order tracking, and a secure kitchen admin dashboard.

## ✨ Features

- **Landing Page**: A beautiful, modern presentation of the restaurant's atmosphere.
- **QR Menu**: Customers scan a table-specific QR code to browse the menu and order directly from their phone.
- **Real-Time Order Tracking**: Customers can watch their order status change in real-time.
- **Secure Admin Dashboard**: A secure gateway leads to a real-time kitchen dashboard for managing live orders, table status, and generating table-specific QR codes.
- **Frontend-Only Architecture**: Uses HTML, CSS, Vanilla JS, and `localStorage` to manage state—meaning no backend database is required to run the application locally!

## 🚀 Setup and Installation

Since this project relies on vanilla web technologies, setup is incredibly fast:

1. Clone the repository:
   ```bash
   git clone https://github.com/anujtiwari1427/scan-2-serve.git
   ```
2. Open the project folder.
3. For the best experience, serve it using a local development server (like VS Code's **Live Server** extension) by right-clicking `index.html` and selecting "Open with Live Server".

## 🔐 Admin Access

To access the Kitchen Dashboard to manage orders and generate QR codes:

- **Navigate to:** `/admin.html`
- **Admin ID:** `admin`
- **Password:** `admin123`

*(Note: The login uses secure SHA-256 client-side hashing to protect the password from source-code inspection).*

## 🛠️ Technologies Used

- HTML5
- Vanilla CSS3 (Custom Design System, Flexbox, CSS Grid)
- Vanilla JavaScript (ES6+)
- `qrcode.min.js` (for QR Code generation)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
