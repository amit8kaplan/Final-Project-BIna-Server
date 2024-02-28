import initApp from "./app";
import https from 'https';
import http from 'http';
import fs from 'fs';
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
const PORT = process.env.PORT || 3000;
initApp().then((app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Advanced Application development 2023 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT and refresh token - Creators: Amit Kaplan & Matan Azarzar",
      },
      servers: [{ url: "http://localhost:3000", },],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  if (process.env.NODE_ENV !== 'production') {
    ////console.log('development');
    http.createServer(app).listen(PORT);
  } else {
    ////console.log('PRODUCTION');
    const options2 = {
      key: fs.readFileSync('../client-key.pem'),
      cert: fs.readFileSync('../client-cert.pem')
    };
    https.createServer(options2, app).listen(process.env.HTTPS_PORT);
  }
});
