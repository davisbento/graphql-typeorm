import { createTypeOrmConn } from '../utils/createConnection';
import { request } from 'graphql-request';
import { User } from '../entity/User';

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

beforeAll(async () => {
  await createTypeOrmConn();
});

describe("Register USER", async () => {
  it("Register user - SUCCESS", async () => {
    const response = await request(process.env.TEST_HOST as string, mutation);
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  })

  it("Register user - Email Already taken", async () => {
    const response: any = await request(process.env.TEST_HOST as string, mutation);
    expect(response.register).toHaveLength(1);
    expect(response.register[0].path).toEqual("email");
    expect(response.register[0].message).toEqual("already taken");
  })
});
