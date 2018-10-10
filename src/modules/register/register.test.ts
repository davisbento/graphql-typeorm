import { request } from 'graphql-request';
import { startServer } from '../../startServer';
import { User } from '../../entity/User';

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port }: any = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = 'davi.bento53@teste.com';
const password = '1234567abc';

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

test("Register user - SUCCESS", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
})

test("Register user - Email Already taken", async () => {
  const response: any = await request(getHost(), mutation);
  expect(response.register).toHaveLength(1);
  expect(response.register[0].path).toEqual("email"); 
  expect(response.register[0].message).toEqual("already taken"); 
})
