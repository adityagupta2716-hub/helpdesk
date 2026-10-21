const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const http=require("http");

const connectDB = require("./src/config/db");
const app = require("./src/app");

const{
    initializeSockets
}=require("./src/socket");

const {
    lockRegistry
} = require("./src/services/ai/registry/toolRegistry");

async function bootstrap() {
    try {

        await connectDB();

        require("./src/services/ai/tools/registerTools");

        lockRegistry();

        const server=http.createServer(app);

        initializeSockets(server);

        const PORT = process.env.PORT || 5000;

        server.listen(PORT,()=>{
            console.log(
                `Server running on port ${PORT}`
            );
        });

    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}

bootstrap();