import { expect } from "chai";
import sinon from "sinon";
import { PrismaClient } from "@prisma/client";
import postService from "./../../src/services/postService";
import { UserRole } from "../../src/globals";
import { AppError, Errors } from "../../src/errors";
import { Answers } from "../../src/answers";

describe("deletePost", () => {
  let prisma: PrismaClient;
  let findUniqueStub: sinon.SinonStub;
  let transactionStub: sinon.SinonStub;

  beforeEach(() => {
    prisma = new PrismaClient();
    findUniqueStub = sinon.stub(prisma.post, "findUnique");
    transactionStub = sinon.stub(prisma, "$transaction");
  });

  afterEach(() => {
    findUniqueStub.restore();
    transactionStub.restore();
    prisma.$disconnect();
  });

  it("should delete post if user is the creator or has Admin role", async () => {
    const postId = "fd8e5ec0-bd93-40f0-a388-402b34d07c5e";
    const userId = "aa5331bd-04f5-4aeb-adcf-17537aa0bf6d";
    const userRole: UserRole = UserRole.Admin;

    const post = { createdById: userId };

    findUniqueStub.resolves(post);
    transactionStub.resolves([]);

    await postService.deletePost(postId, userId, userRole);

    expect(
      findUniqueStub.calledOnceWithExactly({ where: { id: postId }, select: { createdById: true } })
    ).to.be.true;
    expect(transactionStub.calledOnce).to.be.true;
  });

  it("should throw an error if post not found", async () => {
    const postId = "some Post";
    const userId = "aa5331bd-04f5-4aeb-adcf-17537aa0bf6d";
    const userRole: UserRole = UserRole.Admin;

    findUniqueStub.resolves(null);

    try {
      await postService.deletePost(postId, userId, userRole);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal(Answers.NOT_FOUND);
    }
  });

  it("should throw an error if user is not the creator or doesn't have Admin role", async () => {
    const postId = "fd8e5ec0-bd93-40f0-a388-402b34d07c5e";
    const userId = "aa5331bd-04f5-4aeb-adcf-17537aa0bf6d";
    const userRole: UserRole = UserRole.Basic;

    const post = { createdById: "anotherUserId" };

    findUniqueStub.resolves(post);

    try {
      await postService.deletePost(postId, userId, userRole);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal(Answers.UNAUTHORIZED_OR_NO_PERM);
    }
  });

  it("should throw an AppError if an error occurs during deletion", async () => {
    const postId = "fd8e5ec0-bd93-40f0-a388-402b34d07c5e";
    const userId = "aa5331bd-04f5-4aeb-adcf-17537aa0bf6d";
    const userRole: UserRole = UserRole.Admin;

    const post = { createdById: userId };

    findUniqueStub.resolves(post);
    transactionStub.rejects(new Error(Errors.ERROR_WHILE_ADDING_DATA));

    try {
      await postService.deletePost(postId, userId, userRole);
    } catch (error) {
      expect(error).to.be.instanceOf(AppError);
      expect(error.message).to.equal(Errors.ERROR_WHILE_ADDING_DATA);
    }
  });
});
