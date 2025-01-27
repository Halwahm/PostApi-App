import { expect } from "chai";
import axios from "axios";
import { describe, it } from "mocha";

describe("Get Post by ID", () => {
  it("should get a post for a given ID", async () => {
    const postId = "7e5b2cea-e2b1-4099-a3ad-12b9efee6574";
    try {
      const response = await axios.get(`http://localhost:3001/posts?id=${postId}`);
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("object");
      if (!response.data || Object.keys(response.data).length === 0)
        throw new Error("Received an empty post");
    } catch (error) {
      throw new Error(`Failed to get post for ID: ${error.message}`);
    }
  });

  it("should return error when no such route", async () => {
    try {
      const response = await axios.get(`http://localhost:3001/incorrect-route`);
      expect(response.status).to.equal(404);
      // expect(response.data).to.have.property("message", "Not found");
    } catch (error) {
      throw new Error(`Failed to handle database unavailable: ${error.message}`);
    }
  });

  it("should return error when post is not found", async () => {
    const nonExistingPostId = "non-existing-post-id";
    try {
      const response = await axios.get(`http://localhost:3001/posts?id=${nonExistingPostId}`);
      expect(response.status).to.equal(404);
      // expect(response.data).to.have.property("message", "Not found");
    } catch (error) {
      throw new Error(`Failed to handle post not found: ${error.message}`);
    }
  });
});
