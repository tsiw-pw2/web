import "./assets/css/style.css"
import "vue-sonner/style.css"
import { createApplication } from "@/app/application"

createApplication().then((app) => app.mount("#app"))
