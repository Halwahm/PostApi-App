import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.postPhotos.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.userLikedPosts.deleteMany({});
  await prisma.userSubscribers.deleteMany({});
  await prisma.userAuth.deleteMany({});
  await prisma.postHashtags.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.hashtag.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Clearing database completed successfully!");
}

main()
  .catch((error) => {
    console.error("Error clearing database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
