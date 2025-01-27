import { expect } from "chai";
import { userService } from "../../src/services/userService";
import { PrismaClient } from "@prisma/client";
import sinon from "sinon";

const prisma = new PrismaClient();

describe("getUserSubscribers", () => {
  let prismaUserSubscribersStub: sinon.SinonStub;

  before(() => {
    prismaUserSubscribersStub = sinon.stub(prisma.userSubscribers, "findMany");
  });

  after(() => {
    prismaUserSubscribersStub.restore();
  });

  it("should return a specific subscriber if found", async () => {
    const userId = "5739c7ae-250b-4970-8cac-ef7e09723c4a";
    const search = "";

    const specificSubscriber = {
      id: "1",
      userId: "f2367237-ebcc-4c2a-a664-fda2b4cee2d7",
      subscriberId: "5739c7ae-250b-4970-8cac-ef7e09723c4a"
    };
    prismaUserSubscribersStub.resolves([specificSubscriber]);

    const subscribers = await userService.getUserSubscribers(userId, search);
    expect(subscribers).to.deep.equal([specificSubscriber]);
  });

  it("should return empty array if no subscribers found", async () => {
    const userId = "not existing user";
    const search = "";
    prismaUserSubscribersStub.resolves([]);

    const subscribers = await userService.getUserSubscribers(userId, search);
    expect(subscribers).to.be.an("array").that.is.empty;
  });
});
