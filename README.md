<div align="center">
  <img src="https://github.com/SistemBasisData2023/DigiLend/assets/102280666/38f0172f-2ddc-49fd-9547-680ba313f725" alt="logo-no-background" width="250" height="275">
</div>


<br />
<div align="center">
  <h1 align="center">Welcome to DigiLend</h1>
</div>
DigiLend is An advanced platform for efficient and easy-to-use loan management.

# DigiLend

Digilend is a user-friendly website catering to Practician and Lab Assistant. Easily register and login to explore our inventory of available items. Practician can request and return items, with a maximum borrowing period of one month.Experience the convenience of Digilend for seamless borrowing and returning processes.

## Contributors

This is a final Database Management System project made by Group H8:

- [Aldrian Raffi Wicaksono](https://github.com/rianraff) - 2106653256
- [Albertus Timothy Gunawan](https://github.com/albertustimothyy) - 2106639472
- [Muhammad Irsyad Fakhruddin](https://github.com/MuhammadIrsyadFakhruddin) - 2006468850

## Features

### `Home Page`

This page serves as the main gateway to our item borrowing system. On this page, users will find information about the item borrowing system and links that direct them to the login or registration page. The goal is to provide an overview of the system and give users the option to sign in or register.

### `Login`

This page is specifically designed for registered users, such as students or assistants. On this page, users can enter their login information, such as username and password, to access the system. After logging in, users will be redirected to the appropriate page based on their role.

### `Registration`

If users don't have an account yet, they can use this registration page to create a new account. This page provides a registration form that asks users to enter required information, such as full name, student ID, department, and more. After filling out the form, users will have a registered account and can use their credentials to log in to the system.

### `Item List`

This page displays a list of available items along with their quantities. Students can refer to this list to see what items they can borrow. Additionally, assistants also have access to this page to edit the details of each item. They can modify information such as item description, available quantity, and more.

### `Borrow`

Students can use this page to make item borrowing requests for available items. They can select the items they want to borrow and specify the quantity. This page also provides students with access to view the status of their borrowing requests. On the assistant's side, this page allows them to view the borrowing status of all students, enabling efficient management of borrowings

### `Return`

After using the borrowed items, students can report the return of the items through this page. If the return is made late, students may be charged a fine that they need to pay. If the items are lost or damaged, students are required to compensate according to the established policy. This page also provides students with access to view the status of their return requests. On the assistant's side, this page allows them to view the return status of each borrowing made by all students, enabling them to monitor and handle return issues appropriately.

### `Profile`

The profile page allows students and assistants to view and edit their account details. Students can see their personal information, such as name, contact details, and more, and make changes if necessary. Assistants also have access to this page to update their profile information. This page ensures that user data remains up-to-date and accurate.

## Getting Started

To get started with DigiLend, follow these simple steps:
`git clone https://github.com/SistemBasisData2023/DigiLend`
1. Backend
```
cd backend
npm install
node server.js
```
2. Front End
```
cd frontend/Digilend-Project
npm install
npm run dev
```

## Tools

- Node JS
- Express
- PostgreSQL
- HTML
- CSS
- JavaScript
- React JS

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> </p>


## Tabel

The following are tables that is used in DigiLend's database.

### 1. `Return Table`

```
1. id_pengembalian
2. id_peminjaman
3. jumlah_dikembalikan
4. waktu_pengembalian
5. denda
6. ganti_rugi
7. total_sanksi
8. bukti_pembayaran
```

### 2. `Borrow Table`

```
1. id_peminjaman
2. id_barang
3. jumlah_dipinjam
4. id_praktikan
5. waktu_peminjaman
6. tenggat_waktu
7. returned
8. id_pengembalian
```

### 3. `Practician Table`

```
1. id_akun
2. id_kelompok 
```

### 4. `Group Table`

```
1. id_kelompok
2. id_asisten
3. nama_kelompok
4. tahun_ajaran
5. semester
```

### 5. `Lab Assistant Table`

```
1. id_akun
2. kode_aslab
3. status_aslab
```

### 6. `Account Table`

```
1. id_akun
2. id_role
3. nama
4. npm
5. username
6. password
7. telepon
8. jurusan
9. angkatan
```

### 7. `Role Table`

```
1. id_role
2. nama_role
```


### 8. `Items Table`

```
1. id_barang
2. harga
3. jumlah_tersedia
4. nama_barang
```

## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
