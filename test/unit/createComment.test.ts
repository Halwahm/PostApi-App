import { expect } from "chai";
import { commentService } from "../../src/services/commentService";
import { PrismaClient } from "@prisma/client";
import sinon from "sinon";

const prisma = new PrismaClient();

describe("createCommentForPost", () => {
  let prismaStub: sinon.SinonStub;

  before(() => {
    prismaStub = sinon.stub(prisma.comment, "create");
  });

  after(() => {
    prismaStub.restore();
  });

  it("should create a new comment", async () => {
    const mockComment = {
      content: "This is a test comment",
      commenterId: "edab2235-4a51-4a30-91ff-19787f606758",
      postId: "7fb264d3-3daa-41c9-98a0-559669adf77c",
      replyCommentId: undefined
    };

    prismaStub.resolves(mockComment);

    const newComment = await commentService.createCommentForPost(
      mockComment.content,
      mockComment.commenterId,
      mockComment.postId,
      mockComment.replyCommentId
    );

    expect(newComment).to.deep.equal(mockComment);
  });
});
