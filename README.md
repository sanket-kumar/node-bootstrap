#Node Bootstrap

Ready to use Node js project with **Express framework**, **Mysql** (pool connections), **Mongo** (*Mongoose*, pool connections) and Logging functionalities.

## Installation 
* Rename .env.default file to .env and configure with you Mysql and Mongo DB credentials. Also define port on which server has to run. For eg : 8000
* To run and install dependencies, just run following command and server will start on configured port :
```
npm start
```
* API endpoint to validate running server with valid database connections is */v1/verify_db_connection*. For eg :
 ```
http://localhost:8000/v1/verify_db_connection
```
## Usage
Basic ready to use node js project with express framework. Fork it and use it :)
## License
**ISC**
