import { http, HttpResponse, delay } from "msw";
import { config } from "../pages/config";

export const handlers = [
  http.get("https://api.example.com/user/:id", async (req) => {
    await delay(config.delay);

    return HttpResponse.json({
      id: req.params.id,
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];
