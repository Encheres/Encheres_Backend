<h1 align="center">Welcome to Encheres_backend 👋</h1>
<br/>

# To run MongoDB based server locally

## Prerequisites

1. Please install mongodb on your pc;
2. In your PC create folder and name it mongodb move into it and create folder data (if haven't already done so) this will store all databases of your mongodb.
3. Then cd to mongodb. 
4. Run following command in the terminal. <code>mongod --dbpath=data --bind_ip 127.0.0.1</code>  
5. This will start mongo server to serve up data from and into data folder.

Now run following commands in the terminal in the root directory of this project:
<ol>
   <li><code> npm install</code></li>
   <li><code> npm start</code>   To start the server using nodemon, you can use <code> npm run dev</code> instead</li>
</li>

# To run FastApi Server

## Prerequisites

uvicorn Python Library must be installed

Now go to generative_models/fastApiApp/ directory on Command line and run:

<code>  uvicorn main:app --reload </code>    To start the FastApi Server for serving ML Scripts.
   
# Link for Frontend repo:
Frontend: https://github.com/Encheres/Encheres_Frontend <br />
 <br />
  
## Show your support<br/>
Give a ⭐️ if you liked the project!<br/>
