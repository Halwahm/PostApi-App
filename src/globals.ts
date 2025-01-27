export enum PhotoUploads {
  fieldname = "photos",
  maxPhotosCount = 8
}

export interface IUploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export enum TokenType {
  Access = "access",
  Refresh = "refresh"
}

export interface ITokenConfig {
  expiresIn: string;
}

export enum UserRole {
  Basic = "Basic",
  Admin = "Admin"
}

export interface IUser {
  id?: string;
  role?: string;
}

export interface IAuthInfo {
  message: string;
}

interface DateRange {
  start: string;
  end: string;
}

export interface IFilters {
  createdAt?: DateRange;
  likes?: DateRange;
  comments?: DateRange;
  subscriptions?: string[];
  hashtags?: string[];
}

export interface ISearch {
  subscription?: string;
  hashtag?: string;
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}

export enum SortBy {
  CREATED_AT = "createdAt",
  CREATED_BY_ID = "createdById",
  LIKES = "likes",
  NAME = "name"
}

export enum CreatedFilter {
  CREATED_AT = "createdAt",
  CREATED_BY_ID = "createdById"
}

export enum BoolValues {
  TRUE = "true",
  FALSE = "false"
}

export enum Action {
  Read = "read",
  Create = "create",
  Update = "update",
  Delete = "delete",
  Manage = "manage"
}

export enum Resource {
  User = "User",
  Post = "Post",
  Comment = "Comment",
  Like = "Like",
  All = "all"
}

export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PostApi-App",
      version: "1.0.0"
    },
    servers: [
      {
        url: "https://postapi-app-node-app-0-1.onrender.com"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer"
        }
      }
    },
    tags: [
      {
        name: "posts"
      },
      {
        name: "users"
      },
      {
        name: "comments"
      },
      {
        name: "Auth"
      }
    ],
    paths: {
      "/posts/all": {
        post: {
          tags: ["posts"],
          summary: "/posts",
          security: [
            {
              bearerAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    page: {
                      type: "integer"
                    },
                    pageSize: {
                      type: "integer"
                    },
                    sortBy: {
                      type: "string",
                      enum: ["createdById", "createdAt", "likes", "name"]
                    },
                    viewAllUsers: {
                      type: "string"
                    },
                    sortOrder: {
                      type: "string",
                      enum: ["asc", "desc"]
                    },
                    filters: {
                      type: "object",
                      properties: {
                        createdAt: {
                          type: "object",
                          properties: {
                            start: {
                              type: "string",
                              format: "date"
                            },
                            end: {
                              type: "string",
                              format: "date"
                            }
                          }
                        },
                        likes: {
                          type: "object",
                          properties: {
                            start: {
                              type: "string",
                              format: "date"
                            },
                            end: {
                              type: "string",
                              format: "date"
                            }
                          }
                        },
                        comments: {
                          type: "object",
                          properties: {
                            start: {
                              type: "string",
                              format: "date"
                            },
                            end: {
                              type: "string",
                              format: "date"
                            }
                          }
                        }
                      }
                    },
                    search: {
                      type: "object",
                      properties: {
                        subscriptions: {
                          type: "string"
                        },
                        hashtag: {
                          type: "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/posts/": {
        get: {
          tags: ["posts"],
          summary: "/posts:id",
          parameters: [
            {
              name: "id",
              in: "query",
              schema: {
                type: "string"
              },
              required: true
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        },
        delete: {
          tags: ["posts"],
          summary: "/posts/:id",
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: "id",
              in: "query",
              schema: {
                type: "string"
              },
              required: true
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/posts": {
        post: {
          tags: ["posts"],
          summary: "/posts",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: "my3n"
                    },
                    content: {
                      type: "string",
                      example: "my content3"
                    },
                    photos: {
                      type: "string",
                      format: "binary"
                    },
                    hashtags: {
                      type: "string",
                      example: "me"
                    }
                  }
                }
              }
            }
          },
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        },
        put: {
          tags: ["posts"],
          summary: "/posts",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      example: "a3deeaec-aa0f-488f-a002-918680d544cf"
                    },
                    name: {
                      type: "string",
                      example: "my2"
                    },
                    content: {
                      type: "string",
                      example: "my content2"
                    },
                    photos: {
                      type: "string",
                      format: "binary"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/posts/likes": {
        post: {
          tags: ["posts"],
          summary: "Like a post",
          parameters: [
            {
              name: "postId",
              in: "query",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID of the post"
            }
          ],
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            200: {
              description: "Post liked successfully"
            },
            400: {
              description: "Bad request"
            }
          }
        },
        delete: {
          tags: ["posts"],
          summary: "Unlike a post",
          parameters: [
            {
              name: "postId",
              in: "query",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID of the post"
            }
          ],
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            204: {
              description: "Post unliked successfully"
            },
            404: {
              description: "User has not liked this post"
            }
          }
        },
        get: {
          tags: ["posts"],
          summary: "Get likes count for a post",
          parameters: [
            {
              name: "postId",
              in: "query",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID of the post"
            }
          ],
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            200: {
              description: "Number of likes retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      likesCount: {
                        type: "integer"
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: "Post not found"
            }
          }
        }
      },
      "/users/": {
        get: {
          tags: ["users"],
          summary: "/users",
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: "search",
              in: "query",
              schema: {
                type: "string"
              },
              required: false
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/users/{id}": {
        get: {
          tags: ["users"],
          summary: "/users:id",
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: "id",
              in: "query",
              schema: {
                type: "string"
              },
              required: true
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/users/{id}/subscribers": {
        get: {
          tags: ["users"],
          summary: "/users/:id/subscribers",
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: "id",
              in: "query",
              schema: {
                type: "string"
              },
              required: true
            },
            {
              name: "search",
              in: "query",
              schema: {
                type: "string"
              },
              required: false
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/users/{id}/subscribed": {
        get: {
          tags: ["users"],
          summary: "/users/:id/subscribed",
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: "id",
              in: "query",
              schema: {
                type: "string"
              },
              required: true
            },
            {
              name: "search",
              in: "query",
              schema: {
                type: "string"
              },
              required: false
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/users/all/statistics": {
        get: {
          tags: ["users"],
          summary: "/statistics",
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: "startDate",
              in: "query",
              schema: {
                type: "string"
              },
              required: true
            },
            {
              name: "endDate",
              in: "query",
              schema: {
                type: "string"
              },
              required: true
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/comments": {
        get: {
          tags: ["comments"],
          summary: "/comments/:postId",
          parameters: [
            {
              name: "postId",
              in: "query",
              schema: {
                type: "string"
              },
              required: true,
              description: "ID of the post to get comments for"
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/comments/": {
        post: {
          tags: ["comments"],
          summary: "/comments",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    content: {
                      type: "string"
                    },
                    postId: {
                      type: "string"
                    },
                    replyToCommentId: {
                      type: "string"
                    }
                  }
                }
              }
            }
          },
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/comments/{commentId}": {
        put: {
          tags: ["comments"],
          summary: "/comments/:id",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    content: {
                      type: "string"
                    },
                    commentId: {
                      type: "string"
                    }
                  }
                }
              }
            }
          },
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: "commentId",
              in: "path",
              schema: {
                type: "string"
              },
              required: true
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        },
        delete: {
          tags: ["comments"],
          summary: "/comments/:id",
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: "commentId",
              in: "query",
              schema: {
                type: "string"
              },
              required: true
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/register/": {
        post: {
          tags: ["Auth"],
          summary: "/register",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: "Me1"
                    },
                    email: {
                      type: "string",
                      example: "halaleenko1325476@mail.ru"
                    },
                    password: {
                      type: "string",
                      example: "Pass$word1234"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "/login",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      example: "halaleenko1325476@mail.ru"
                    },
                    password: {
                      type: "string",
                      example: "Pass$word1234"
                    }
                  }
                }
              }
            }
          },
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "/logout",
          requestBody: {
            content: {}
          },
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/register/confirm": {
        post: {
          tags: ["Auth"],
          summary: "/register/confirm",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      example: "halaleenko1325476@gmail.com"
                    },
                    code: {
                      type: "integer",
                      example: "85857"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/auth/password/forgot": {
        post: {
          tags: ["Auth"],
          summary: "/password/forgot",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      example: "halaleenko1325476@gmail.com"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      },
      "/auth/password/reset": {
        post: {
          tags: ["Auth"],
          summary: "/password/reset",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      example: "halaleenko1325476@gmail.com"
                    },
                    code: {
                      type: "integer",
                      example: "55587"
                    },
                    newPassword: {
                      type: "string",
                      example: "Pass$word12345"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {}
              }
            }
          }
        }
      }
    }
  },
  apis: ["./routes/mainRouter.ts"]
};
