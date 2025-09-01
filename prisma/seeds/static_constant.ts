import { PrismaClient } from "@prisma/client"

const constants = [
  {
    type: "Google Maps rate limiter",
    slug: "google_maps",
    value: 0,
    maxValue: 900,
  },
]

export const addConstants = async (prisma: PrismaClient) => {
  await Promise.all(
    constants.map((c) =>
      prisma.constants.upsert({
        where: { constant_slug: c.type },
        update: {
          constant_value: c.value,
          constant_max_limit: c.maxValue,
        },
        create: {
          constant_type: c.type,
          constant_value: c.value,
          constant_max_limit: c.maxValue,
          constant_slug: c.slug
        },
      })
    )
  )

  console.log("✅ Constants added/updated")
}
