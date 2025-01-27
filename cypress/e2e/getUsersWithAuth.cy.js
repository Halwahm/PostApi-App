describe("Get Users with Authentication", () => {
  let accessToken;

  beforeEach(() => {
    cy.wait(1000);
  });

  it("should register a new user", () => {
    cy.request("POST", "http://localhost:3001/register/", {
      name: "Jane",
      email: "test1@gmail.com",
      password: "Pass$word1234"
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  const loginUser = () => {
    cy.wait(6000);
    return cy
      .request("POST", "http://localhost:3001/auth/login", {
        email: "test1@gmail.com",
        password: "Pass$word1234"
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("accessToken");
        accessToken = response.body.accessToken;
      });
  };

  const logoutUser = () => {
    return cy
      .request({
        method: "POST",
        url: "http://localhost:3001/auth/logout",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("message", "Logged out successfully");
      });
  };

  it("should get users", () => {
    loginUser();

    cy.request({
      method: "GET",
      url: "http://localhost:3001/users/",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(200);
    });

    logoutUser();
  });
});
