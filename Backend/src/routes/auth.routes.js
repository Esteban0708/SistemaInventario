
const routes = Router();

routes.post("/register", registerUser);
routes.post("/login", loginUser);

export default routes;