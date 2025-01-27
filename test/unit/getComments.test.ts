import { expect } from "chai";
import axios from "axios";
import { describe, it } from "mocha";

describe("Get Comments for Post", () => {
  it("should get comments for a given post", async () => {
    const postId = "7fb264d3-3daa-41c9-98a0-559669adf77c";
    try {
      const response = await axios.get(`http://localhost:3001/comments?postId=${postId}`);
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      if (response.data.length === 0) throw new Error("Received an empty array of comments");
    } catch (error) {
      throw new Error(`Failed to get comments for post: ${error.message}`);
    }
  });

  it("should return an error when comments for certain post don't exist", async () => {
    const postId = "non-existent-post-id";
    try {
      const response = await axios.get(`http://localhost:3001/comments?postId=${postId}`);
      expect(response.status).to.equal(404);
    } catch (error) {
      if (error.response && error.response.status === 404)
        expect(error.response.status).to.equal(404);
      else throw new Error(`Failed to handle case when comments don't exist: ${error.message}`);
    }
  });
});
