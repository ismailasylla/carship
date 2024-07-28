import { IUser } from '../interfaces/user';

const users: IUser[] = [];

const findOne = jest.fn((query) => Promise.resolve(users.find(user => user.email === query.email) || null));
const create = jest.fn((userData) => {
  const newUser = { ...userData, _id: 'fake-id', password: userData.password } as IUser;
  users.push(newUser);
  return Promise.resolve(newUser);
});
const findById = jest.fn((id) => Promise.resolve(users.find(user => user._id === id) || null));

const User = { findOne, create, findById };

export default User;
