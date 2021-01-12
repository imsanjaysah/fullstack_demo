import { Application } from "https://deno.land/x/oak@v6.2.0/mod.ts";

import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

import {GraphQLService} from './server.ts'

const { PORT } = config() 

const app = new Application();

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server is ready at PORT: " + PORT)

await app.listen({ port: +PORT });