import HomeController from "@/App/Controllers/HomeController";
import { Router } from "@toctive/makex";

Router.get("/about", () => "About Page");
Router.get("/users/{user-Id}/books/:bookId", [HomeController.index, HomeController.show])
Router.get("/terms", () => "Terms Page");
