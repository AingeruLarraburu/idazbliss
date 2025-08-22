# 🌐 IdazBliss

**IdazBliss** es una aplicación web educativa que permite traducir entre el **lenguaje de símbolos Bliss** y los idiomas **español** y **euskera**.  

Además de la traducción, la plataforma incluye:

- ✍️ **Editor de símbolos** para crear y modificar composiciones.  
- 🎮 **Juegos interactivos** para aprender y practicar.  
- 📚 **Tutoriales y diccionarios** integrados.  
- 📂 **Colecciones personalizadas de símbolos** que cada usuario puede gestionar.  

El proyecto está construido con **Next.js**, **Prisma**, **Tailwind CSS**, autenticación mediante **Google OAuth**, y utiliza una base de datos **PostgreSQL**.

---

## 🚀 Requisitos previos

Antes de comenzar asegúrate de tener instalado:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

---

## 📥 Instalación

```bash
### 1. Clonar
git clone https://github.com/AingeruLarraburu/idazbliss.git
cd idazbliss
### 2. Instalar dependencias
npm install
### 3. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto y copia el siguiente contenido, ajustando los valores a tu entorno:

# PostgreSQL
DATABASE_URL=postgresql://usuario:password@localhost:5432/idazbliss

# Autenticación Google (uso en local con HTTP)
GOOGLE_CLIENT_ID_HTTP=tuidclientegoogle
GOOGLE_CLIENT_SECRET_HTTP=tusecretogoogle

# Autenticación Google (uso en producción con HTTPS en tu dominio)
GOOGLE_CLIENT_ID=tuidclientegoogle
GOOGLE_CLIENT_SECRET=tusecretogoogle

# NextAuth (uso en local con HTTP)
NEXTAUTH_SECRET_HTTP=un_secret_aleatorio_local
NEXTAUTH_URL_HTTP=http://localhost:3000

# NextAuth (uso en producción con HTTPS en tu dominio)
NEXTAUTH_SECRET=un_secret_aleatorio_produccion
NEXTAUTH_URL=https://tudominio.com

# API externa (DeepSeek)
DEEPSEEK_API_KEY=tuapikey
⚠️ Nota importante: en producción no uses el dominio https://idazbliss.ddns.net directamente, debes reemplazarlo por tu propia URL o dominio público accesible.

Ejemplo:

NEXTAUTH_URL=https://miapp.ddns.net
### 4. 🗄️ Restaurar la base de datos

Ejecuta en la consola de la aplicación:

npx prisma generate => Esto genera el cliente para acceder a la base de datos
npx prisma migrate dev => Esto crea las tablas, etc en la base de datos

Una vez hecho esto, en la carpeta dbdump/ encontrarás copias de seguridad de la base de datos.
Para cargar el backup más antiguo, sigue estos pasos:

Localiza el archivo .dump más antiguo en dbdump/ (ejemplo: backup_2023-05-10.dump). NUNCA USES LA COPIA backup2025_04_16.dump, porque es de una versión más antigua y se modificaron las tablas posteriormente.

Restaura el backup en la base de datos (Por ejemplo así):

psql idazbliss < dbdump/backup_2023-05-10.dump
Asegúrate de que el usuario de PostgreSQL tenga permisos para crear y restaurar la base de datos.

▶️ Ejecución en desarrollo
Para arrancar la aplicación en modo desarrollo:

npm run dev
La aplicación estará disponible en:
👉 http://localhost:8006

🌍 Despliegue en producción
Para desplegar en un servidor con tu dominio (ejemplo: https://miapp.ddns.net):

Configura las variables de entorno de producción (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL).

Asegúrate de tener HTTPS habilitado en tu dominio.

Compila y arranca el proyecto:

npm run build
npm start

En mi caso, yo modifiqué el package json para que npm run dev ejecutara "dev": "next dev --experimental-https -p 8006", y así no había que hacer build ni start
```
## 📚 Tutoriales recomendados

Si quieres profundizar en las tecnologías usadas en **IdazBliss**, aquí tienes algunos tutoriales que te servirán de guía:

- ▶️ [Curso básico de Next.js](https://www.youtube.com/watch?v=_SPoSMmN3ZU)  
- 🔐 [Tutorial NextAuth](https://www.youtube.com/watch?v=iZDK42F2cTc)  
- 🔑 [Autenticación con Google en Next.js](https://www.youtube.com/watch?v=YCEnpcCYlyo)  
- 🗄️ [Tutorial Prisma](https://www.youtube.com/watch?v=N5dkg28jRF0)


