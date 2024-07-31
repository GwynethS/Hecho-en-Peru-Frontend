# 🦙 Hecho en Perú
Hecho en Perú es una tienda en línea de artesanías peruanas. El proyecto incluye una vista administrativa para la gestión de productos, clientes, artesanos y regiones, y está desarrollado con Angular para el frontend y Spring Boot para el backend. Este proyecto sigue la aplicación de una vista e-commerce desarrollada en el [repositorio Hecho en Perú](https://github.com/AlexandraRamirezz/Hecho-en-Peru).

## 📂 Repositorio del backend
https://github.com/GonzaloPA23/HechoEnPeru

## 📝 Descripción
Hecho en Perú es una plataforma integral que permite la gestión completa de una tienda de artesanías. Los usuarios pueden navegar y comprar productos, mientras que los administradores pueden gestionar todos los aspectos de la tienda a través de una interfaz administrativa.

## ✅ Funcionalidades
- **Gestión de productos:** CRUD completo para productos.
- **Gestión de clientes:** Listar y buscar clientes.
- **Gestión de artesanos:** CRUD completo para artesanos.
- **Gestión de regiones:** Crear y editar regiones.
- **Carrito de compras:** Implementación de un carrito de compras con simulación de plataforma de pago.
- **Comentarios y valoraciones:** Los clientes pueden interactuar mediante comentarios y valoraciones de productos.
- **Roles y permisos:** Diferentes funciones disponibles según el rol del usuario.
- **Protección de rutas:** Implementación de guards para proteger las rutas.
- **Despliegue:** El proyecto se desplegará en una instancia de AWS (en desarrollo).

## 💡 Tecnologías utilizadas
- **Frontend:** Angular, Angular Material, Redux, SweetAlert, Toastify, Chart.js, Routing, Guards
- **Backend:** Java Spring Boot
- **Base de Datos:** PostgreSQL
- **Lenguajes:** TypeScript, Java
- **Herramientas de Desarrollo:** Git, GitHub, Visual Studio Code, AWS

## 🔨 Instalación

### Backend:
1. Clona el repositorio del backend:
  ```bash
  git clone https://github.com/GonzaloPA23/HechoEnPeru.git
  ```
2. Navega al directorio del proyecto:
  ```bash
  cd HechoEnPeru
  ```
3. Instala las dependencias:
  ```bash
  mvn install
  ```
4. Configura la base de datos PostgreSQL y actualiza las credenciales en el archivo `application.properties`.
5. Ejecuta la aplicación Spring Boot

### Frontend:
1. Clona el repositorio:
  ```bash
  git clone https://github.com/GwynethS/Hecho-en-Peru-Frontend.git
  ```
2. Navega al directorio del proyecto:
  ```bash
  cd Hecho-en-Peru-Frontend
  ```
3. Instala las dependencias
  ```bash
  npm install
  ```

## 👩🏻‍💻 Uso
1. Inicia sesión con las credenciales creadas en la base de datos.
2. Gestiona la plataforma con el rol ADMIN.
3. Interactúa con la plataforma como cliente con el rol USER para comprar productos, dejar comentarios y valoraciones.

## 📸 Ejecución

### Vista de administrador
#### Página de inicio
![Página de inicio del administrador](./src/assets/img/execution/home-admin.gif)

#### CRUD de productos y listar por id
![Página de productos del administrador](./src/assets/img/execution/products-admin.gif)

#### Crear y listar categorías
![Modal de categorías del administrador](./src/assets/img/execution/categories-admin.gif)

#### Listar y buscar clientes
![Página de clientes del administrador](./src/assets/img/execution/customers-admin.gif)

#### Listar y buscar órdenes por cliente
![Página de clientes del administrador](./src/assets/img/execution/orders-admin.gif)

#### CRUD de artesanos
![Página de artesanos del administrador](./src/assets/img/execution/local-craftsmen-admin.gif)

#### Crear y editar regiones
![Página de regiones del administrador](./src/assets/img/execution/regions-admin.gif)

### Vista de cliente
#### Registro
![Registro](./src/assets/img/execution/sign-up.gif)

#### Inicio de sesión
![Inicio de sesión](./src/assets/img/execution/login.gif)

#### Perfil de usuario
![Perfil de usuario](./src/assets/img/execution/profile.gif)

#### Página de inicio
![Inicio de la plataforma](./src/assets/img/execution/home.gif)

#### Catálogo de productos
![Catálogo de productos](./src/assets/img/execution/catalog.gif)

#### Detalles de un producto
![Detalles de un producto](./src/assets/img/execution/product-details.gif)

#### Regiones
![Regiones](./src/assets/img/execution/regions.gif)

#### Detalles de una región
![Detalles de una región](./src/assets/img/execution/region-details.gif)

#### Quiénes somos
![Quiénes somos](./src/assets/img/execution/about-us.gif)

#### Carrito de compras
![Carrito de compras](./src/assets/img/execution/shopping-cart.gif)

#### Proceso de compra
![Proceso de compra](./src/assets/img/execution/purchasing-process.gif)
