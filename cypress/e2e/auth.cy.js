describe("Registration", () => {
  beforeEach(() => {
    cy.wait(6000);
  });

  it("should register a new user", () => {
    cy.request("POST", "http://localhost:3001/register/", {
      name: "Mike",
      email: "test@gmail.com",
      password: "Pass$word1234"
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it("should not register a user with an already existing email", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/register/",
      failOnStatusCode: false,
      body: {
        name: "Mike",
        email: "test@gmail.com",
        password: "Pass$word1234"
      }
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("message", "Already registered");
    });
  });

  it("should not register a user with data validation error", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/register/",
      failOnStatusCode: false,
      body: {
        name: "",
        email: "test@g.com",
        password: "Pass"
      }
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  });
});

describe("Login and Logout", () => {
  let accessToken;

  beforeEach(() => {
    cy.wait(1000);
  });

  it("should login and logout the user", () => {
    loginUser();
    loginHeaders();
    logoutUser();
  });

  it("should return message for Not found account", () => {
    loginWrongEmail();
  });

  it("should return message for Invalid credentials", () => {
    loginWrongPassword();
  });

  it("should check User-Agent in request", () => {
    loginUser();
    loginHeaders();
    logoutUser();
  });

  const loginUser = () => {
    return cy
      .request("POST", "http://localhost:3001/auth/login", {
        email: "test@gmail.com",
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

  const loginWrongEmail = () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/auth/login",
      failOnStatusCode: false,
      body: {
        email: "wrongemail@gmail.com",
        password: "WrongPass1234"
      }
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  };

  const loginWrongPassword = () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/auth/login",
      failOnStatusCode: false,
      body: {
        email: "halaleenko1325476@mail.ru",
        password: "WrongPass1234"
      }
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  };

  const loginHeaders = () => {
    cy.intercept("POST", "http://localhost:3001/auth/login", (req) => {
      expect(req.body.email).to.equal("test@gmail.com");
      expect(req.body.password).to.equal("Pass$word1234");
      expect(req.headers).to.have.property("user-agent").and.not.be.empty;
      req.continue((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property("accessToken");
      });
    });
  };
});
