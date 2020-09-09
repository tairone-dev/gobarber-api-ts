import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfilesController from '@modules/users/infra/http/controllers/ProfilesController';

const usersRouter = Router();
const profilesController = new ProfilesController();

usersRouter.use(ensureAuthenticated);

usersRouter.get('/', profilesController.show);
usersRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profilesController.update,
);

export default usersRouter;
