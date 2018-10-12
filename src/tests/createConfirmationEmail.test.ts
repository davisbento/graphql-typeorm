import * as Redis from 'ioredis';
import { User } from './../entity/User';
import { createTypeOrmConn } from './../utils/createConnection';
import { createConfirmEmailLink } from './../utils/createConfirmEmailLink';
import fetch from 'node-fetch';

let userId = "";
const redis = new Redis();

beforeAll(async () => {
  await createTypeOrmConn();
  const user = await User.create({
    email: "davi.bento@teste.com",
    password: "1234577",
  }).save();

  userId = user.id;
});

describe("Testing send confirmation link", () => {
  test("Make sure it confirms email and clear cache in redis", async () => {
    
    const url = await createConfirmEmailLink(
      process.env.TEST_HOST as string,
      userId,
      redis
    );
  
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual("OK");
  
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();
  
    const chunks = url.split('/');
    const key = chunks[chunks.length - 1];
    const redisKey = await redis.get(key);
    expect(redisKey).toBeNull();
  });

  test("Test sends back invalid if bad id is sent", async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/1234`);
    const text = await response.text();
    expect(text).toEqual("Invalid");
  });
})

