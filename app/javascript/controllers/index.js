// Stimulus application initialization (if needed)
import { Application } from "@hotwired/stimulus";
import HelloController from "./hello_controller";

const application = Application.start();
application.register("hello", HelloController);

export default application;
