# 🛍️ Roy&Joy Fabric Store – POS System

A modern and user-friendly Point of Sale (POS) system developed for **Roy&Joy Fabric Store**. This application helps manage daily sales, products, inventory, and user activities through a centralized system.

## ✨ Features

### 🔐 Authentication & User Management
- Secure user login using Supabase Authentication.
- Role-Based Access Control (RBAC).
- Three user roles:
  - **Admin** – Full system access and user management.
  - **Manager** – Product and sales management.
  - **Cashier** – POS terminal and dashboard access.

### 🛒 POS Terminal
- View available products.
- Search products easily.
- Add products to the shopping cart.
- Update product quantities.
- Calculate the total automatically.
- Complete sales transactions.
- Generate unique receipt numbers.

### 📊 Dashboard
- View total products.
- View total sales.
- Monitor total revenue.
- Display system information.
- Role-based dashboard access.

### 📦 Product Management
- Add new products.
- View product details.
- Delete products.
- Manage product prices.
- Track stock quantities.
- Organize products by category.

### 🧾 Sales & Receipt Management
- View sales history.
- View individual sales details.
- Generate printable receipts.
- Display transaction date and time.
- Track cashier information.

### 🎨 User Interface
- Modern and clean design.
- Purple and pink gradient theme.
- Responsive user interface.
- Easy-to-use navigation.
- Professional receipt layout.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Frontend framework |
| React 19 | User interface |
| TypeScript | Programming language |
| Tailwind CSS 4 | Styling |
| Supabase | Database and authentication |
| PostgreSQL | Relational database |
| Zustand | State management |
| Vercel | Deployment |

---

## 📁 Project Structure

```text
pos-demo/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── pos/
│   │   │   ├── products/
│   │   │   ├── sales/
│   │   │   └── users/
│   │   ├── login/
│   │   ├── globals.css
│   │   └── layout.tsx
│   └── lib/
│       ├── supabase/
│       └── store/
├── public/
├── .env.local
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 18 or later
- npm
- Git
- A Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/oshadhisadinya/pos-demo.git
```

### 2. Navigate to the Project

```bash
cd pos-demo
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory.

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Open the Application

Visit:

http://localhost:3000

---

## 🗄️ Database Structure

The system uses Supabase PostgreSQL.

Main database tables:

| Table | Description |
|---|---|
| profiles | Stores user profiles and roles |
| products | Stores product and inventory details |
| sales | Stores sales transactions |
| sale_items | Stores individual items in each sale |

---

## 📸 Screenshots

Add your actual application screenshots here.

### Login Page

### Dashboard

### POS Terminal

### Product Management

### Sales History

### Printable Receipt

---

## 🎯 Future Improvements

- [ ] Barcode scanning.
- [ ] Customer management.
- [ ] Advanced sales reports.
- [ ] Export sales reports to PDF and Excel.
- [ ] Low-stock notifications.
- [ ] Multi-currency support.
- [ ] Email receipt delivery.
- [ ] Dark mode.

---

## 👩‍💻 Author

**Oshadhi Sadinya Alahapperuma**

Undergraduate | Curtin University  
Software Engineering | Full-Stack Development

- **GitHub:** https://github.com/oshadhisadinya

---

## 📄 License

This project was developed as a demonstration and portfolio project for learning and showcasing software development skills.

---

<div align="center">

**Made with ❤️ for Roy&Joy Fabric Store**







 

