import { PrismaClient } from "@prisma/client";
import { Faker, en } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const faker = new Faker({ locale: [en] });
const saltRounds = 10;

async function pkTablesSeed() {
  try {
    const usersDataPromise = Array.from({ length: 10 }, async () => {
      const salt = await bcrypt.genSalt(saltRounds);
      return {
        name: faker.person.firstName(),
        password: bcrypt.hashSync(faker.internet.password(), salt),
        salt: salt.toString(),
        email: faker.internet.email(),
        avatarImage: faker.image.avatar(),
        profileDescription: faker.lorem.sentence(),
        createdAt: new Date()
      };
    });
    const usersData = await Promise.all(usersDataPromise);

    const hashtagData = Array.from({ length: 10 }, () => ({
      content: `#${faker.lorem.word()}`
    }));

    const usersPromise = prisma.user.createMany({ data: usersData });
    const hashtagPromise = prisma.hashtag.createMany({ data: hashtagData });

    await Promise.all([usersPromise, hashtagPromise]);
  } catch (error) {
    console.error("Error seeding PkTables:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function postSeed() {
  const users = await prisma.user.findMany();
  const postsData = users.map((user) => ({
    name: faker.lorem.words(3),
    content: faker.lorem.paragraph(),
    createdById: user.id,
    createdAt: new Date(),
    mainPhotoUrl: faker.lorem.words(1)
  }));
  const postsPromise = await Promise.all(postsData);
  return prisma.post.createMany({ data: postsPromise });
}

async function fkTablesSeed() {
  try {
    const randomCount = Math.floor(Math.random() * 6);
    const users = await prisma.user.findMany();
    const posts = await prisma.post.findMany();
    const hashtags = await prisma.hashtag.findMany();

    const userPostHashtagCombinations = users.flatMap((user) =>
      posts.flatMap((post) => hashtags.map((hashtag) => ({ user, post, hashtag })))
    );

    userPostHashtagCombinations.map(async ({ user, post, hashtag }) => {
      const otherUsers = users.filter((u) => u.id !== user.id);
      const subscriberPromise = prisma.userSubscribers.createMany({
        data: otherUsers.map((otherUser) => ({
          subscriberId: otherUser.id,
          userId: user.id
        }))
      });

      const commentPromise = prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          commenter: { connect: { id: user.id } },
          post: { connect: { id: post.id } }
        }
      });

      const userLikedPostsData = Array.from({ length: randomCount }, () => ({
        userId: user.id,
        postId: post.id
      }));

      const userLikedPostPromise = userLikedPostsData.map(async (postData) => {
        try {
          await prisma.userLikedPosts.create({
            data: postData
          });
        } catch (error) {
          console.error(`Failed to create userLikedPost: ${error}`);
        }
      });

      const postHashtagsData = Array.from({ length: randomCount }, () => ({
        postId: post.id,
        hashtagId: hashtag.id
      }));

      const postHashtagsPromise = postHashtagsData.map(async (postData) => {
        try {
          await prisma.postHashtags.create({
            data: postData
          });
        } catch (error) {
          console.error(`Failed to create postHashtag: ${error}`);
        }
      });

      const userAuthPromise = prisma.userAuth.create({
        data: {
          userId: user.id,
          refreshToken: faker.string.numeric()
        }
      });

      await Promise.allSettled([
        subscriberPromise,
        commentPromise,
        userLikedPostPromise,
        postHashtagsPromise,
        userAuthPromise
      ]);
    });
  } catch (error) {
    console.error("Error seeding FkTables:", error);
  } finally {
    await prisma.$disconnect();
  }
}

pkTablesSeed()
  .then(() => postSeed())
  .then(() => fkTablesSeed())
  .catch((error) => console.error("Error seeding tables:", error))
  .finally(() => prisma.$disconnect());
