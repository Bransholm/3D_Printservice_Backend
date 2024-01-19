# Welcome to the "3D Printservice" Backend Repository! 👋

You've arrived at the backend repository for **"3D Printservice"**. 

---------

## Introduction

Welcome to our backend application repository, the powerhouse behind our data management and routing operations. This application is specifically designed to handle a myriad of routes and queries while maintaining a connection with our MySQL database, hosted with Azure App-services, and deployed via GitHub pages.

## Table of contents
- [Important Links](#important-links)
- [Prerequisites](#rerequisites)
- [Installation Guide for Backend Repository](#installation-guide-for-backend-repository)
- [Running the Application](#running-the-application)

- [Functionality & Features Summary](#functionality-&-features-summary)
- [Technologies Used](#technologies-used)
- [The End](#the-end)


## Important Links

- Link to the backend repository [3D-Printshop-Backend-Repository](https://github.com/Bransholm/3D_Printservice_Backend)

- Link to the frontend repository [3D-Printshop-Frontend-Repository](https://github.com/Bransholm/3D_Printservice_Frontend)

- Link to the deployed frontend application [3D-Printshop-frontend](https://bransholm.github.io/3D_Printservice_Frontend/)

- Link to the deployed backend application [3D-Printshop-backendAzure](http://3dprintservice.azurewebsites.net)

---

If you don't fancy clicking those links, or they refuse to function as intended, then you can copy the raw link here:

1.  Backend Repository

```bash
 https://github.com/Bransholm/3D_Printservice_Backend
```

2.  Frontend Repository

```bash
 https://github.com/Bransholm/3D_Printservice_Frontend
```

3.  Deployed Frontend

```bash
 https://bransholm.github.io/3D_Printservice_Frontend/
```

4.  Deployed Backend/Azure

```bash
 http://3dprintservice.azurewebsites.net
```

## Prerequisites

Before you begin, ensure you have the following installed:

**Node.js v18** or higher. You can download Node.js [here](https://nodejs.org/en)

Make sure you have install [Git](https://git-scm.com/downloads) 

The backend is currenly running on Node.js v18.17.1.

Open your terminal and insert this, if you already have node.js installed, this prompt will inform you which version of node you have.
```bash
node v
```

## Installation Guide for Backend Repository

1. Start by cloning the repository to your local machine. Use the following command in your terminal:

```bash
git clone https://github.com/Bransholm/3D_Printservice_Backend.git
```

2. Installing Dependencies
- Navigate to the cloned directory and run the following command to install all necessary dependencies:

```bash
npm install
```


  

3. Make sure that you install the following dependencies using the command "npm install ..." in the bash terminal.
    - express
    - cors
    - mysql2
    - db
    - dotenv
    - promise
 
## Running The Application

1. Start by navigating to your local cloned repository and upen the project in your preffered text-editor. Open a bash-terminal in the editor and give it the following command;

```bash
npm start
```
2. This should get your backend application up and running, connected to your MySQL database.

## Functionality & Features Summary

- **Get Routes**
- **Post Routes**
- **Update Routes**
- **Delete Routes**
- **Basic Error-handling implementation**
- **Routes filtering data to not include deactivated items from the requested tables**
- **Stock and Catalogue queries**

## Technologies Used

- node.js
- express
- cors
- db
- MySql
- dotenv
- fs
- promises
- Azure MySql database
- Azure app services
- GitHub Pages
## The End

This project is the result of the collaborative efforts made by the following:

- **Kenneth Bransholm Schou**
- **Lukas Aleksander Maibom**
- **Thomas Gorm Neermark**

