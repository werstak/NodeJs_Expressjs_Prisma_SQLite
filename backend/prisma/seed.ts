import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
    {
        firstName: 'Diana',
        lastName: 'Tool',
        email: 'diana@prisma.io',
        posts: {
            create: [
                {
                    title: 'Join the Prisma Slack',
                    description: 'https://slack.prisma.io',
                    published: true,
                },
            ],
        },
    },
    {
        firstName: 'Alex',
        lastName: 'Bird',
        email: 'alex@prisma.io',
        posts: {
            create: [
                {
                    title: 'Follow Prisma on Twitter',
                    description: 'https://www.twitter.com/prisma',
                    published: true,
                },
            ],
        },
    },
    {
        firstName: 'Tom',
        lastName: 'Appleck',
        email: 'tom@prisma.io',
        posts: {
            create: [
                {
                    title: 'Ask a question about Prisma on GitHub',
                    description: 'https://www.github.com/prisma/prisma/discussions',
                    published: true,
                },
                {
                    title: 'Prisma on YouTube',
                    description: 'https://pris.ly/youtube',
                },
            ],
        },
    },
    {
        firstName: 'Daniel',
        lastName: 'Duncan',
        email: 'daniel@prisma.io',
        posts: {
            create: [
                {
                    title: 'Ask a question about Prisma on GitHub',
                    description: 'https://www.github.com/prisma/prisma/discussions',
                    published: true,
                },
                {
                    title: 'Prisma on YouTube',
                    description: 'https://pris.ly/youtube',
                },
            ],
        },
    },
]

async function main() {
    console.log(`Start seeding ...`)
    for (const u of userData) {
        const user = await prisma.user.create({
            data: u,
        })
        console.log(`Created user with id: ${user.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
