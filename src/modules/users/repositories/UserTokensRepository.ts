import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default interface UserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
}
