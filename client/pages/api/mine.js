import jayson from "jayson";
import request from "superagent";

export default async function handler(req, res) {
  console.log("GET /api/mine");
  const requestBody = jayson.Utils.request("startMining", [], undefined, {
    version: 2,
  });

  request
    .post("http://localhost:3042")
    .timeout({ response: 5000, deadline: 60000 })
    .send(requestBody)
    .end(function (err, response) {
      if (err) {
        if (!err.status) {
          throw err;
        }
        const body = err.response.body;
        if (
          body &&
          body.error &&
          jayson.Utils.Response.isValidError(body.error, 2)
        ) {
          // the error body was a valid JSON-RPC version 2
          // we may wish to deal with it differently
          console.err(body.error);
          return;
        }
        throw err; // error was something completely different
      }

      const body = response.body;
      if (!jayson.Utils.Response.isValidResponse(body, 2)) {
        console.err(body);
      }

      if (body.error) {
        // we have a json-rpc error...
        console.err(body.error); // 10!
      } else {
        // do something useful with the result
        console.log(body.result); // 10!
        res.status(200).json(body.result);
      }
    });
}
