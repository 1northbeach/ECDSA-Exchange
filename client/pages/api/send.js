export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("POST /api/send");
    console.log("req.body", req.body);
    try {
      const data = await fetch("http://localhost:3042/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: req.body,
      });
      const response = await data.json();
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      throw new Error(error);
      //res.status(405).json({ error: error.message });
    }
  }
}
