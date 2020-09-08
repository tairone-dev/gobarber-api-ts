import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfilesController from '@modules/users/infra/http/controllers/ProfilesController';

const usersRouter = Router();
const profilesController = new ProfilesController();

usersRouter.use(ensureAuthenticated);

usersRouter.put('/', profilesController.update);

export default usersRouter;
