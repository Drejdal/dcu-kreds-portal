import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dcu-kreds.dk' },
    update: {},
    create: {
      email: 'admin@dcu-kreds.dk',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'Bruger',
      phone: '+45 12345678',
      licenseNumber: 'DCU001',
      role: 'admin',
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // Create board member
  const boardPassword = await bcrypt.hash('bestyrelse123', 10)
  const board = await prisma.user.upsert({
    where: { email: 'bestyrelse@dcu-kreds.dk' },
    update: {},
    create: {
      email: 'bestyrelse@dcu-kreds.dk',
      passwordHash: boardPassword,
      firstName: 'Bestyrelses',
      lastName: 'Medlem',
      phone: '+45 23456789',
      licenseNumber: 'DCU002',
      role: 'bestyrelse',
    },
  })
  console.log(`Created board member: ${board.email}`)

  // Create regular members
  const memberPassword = await bcrypt.hash('medlem123', 10)
  const member1 = await prisma.user.upsert({
    where: { email: 'medlem1@dcu-kreds.dk' },
    update: {},
    create: {
      email: 'medlem1@dcu-kreds.dk',
      passwordHash: memberPassword,
      firstName: 'Peter',
      lastName: 'Jensen',
      phone: '+45 34567890',
      licenseNumber: 'DCU003',
      role: 'medlem',
    },
  })
  console.log(`Created member: ${member1.email}`)

  const member2 = await prisma.user.upsert({
    where: { email: 'medlem2@dcu-kreds.dk' },
    update: {},
    create: {
      email: 'medlem2@dcu-kreds.dk',
      passwordHash: memberPassword,
      firstName: 'Anna',
      lastName: 'Nielsen',
      phone: '+45 45678901',
      licenseNumber: 'DCU004',
      role: 'medlem',
    },
  })
  console.log(`Created member: ${member2.email}`)

  // Create sample events
  const event1 = await prisma.event.create({
    data: {
      title: 'Forårsstævne 2024',
      description: 'Vores årlige forårsstævne med forskellige distancer',
      date: new Date('2024-05-15'),
      time: '09:00',
      location: 'Roskilde Cykelbane',
      price: 150.00,
      status: 'arrangeret',
      createdBy: admin.id,
    },
  })
  console.log(`Created event: ${event1.title}`)

  const event2 = await prisma.event.create({
    data: {
      title: 'Sommerstævne 2024',
      description: 'Sommerstævne med fokus på ungdomsløb',
      date: new Date('2024-07-20'),
      time: '10:00',
      location: 'Odense Cykelbane',
      price: 200.00,
      status: 'ide',
      createdBy: board.id,
    },
  })
  console.log(`Created event: ${event2.title}`)

  const event3 = await prisma.event.create({
    data: {
      title: 'Efterårsstævne 2023',
      description: 'Afslutningsstævne for sæsonen',
      date: new Date('2023-09-10'),
      time: '09:30',
      location: 'Aarhus Cykelbane',
      price: 175.00,
      status: 'afholdt',
      createdBy: admin.id,
    },
  })
  console.log(`Created event: ${event3.title}`)

  // Add participants to events
  await prisma.eventParticipant.create({
    data: {
      eventId: event1.id,
      userId: member1.id,
      licenseNumber: member1.licenseNumber!,
      paid: true,
      paidAmount: 150.00,
      paidDate: new Date('2024-04-01'),
      status: 'tilmeldt',
    },
  })

  await prisma.eventParticipant.create({
    data: {
      eventId: event1.id,
      userId: member2.id,
      licenseNumber: member2.licenseNumber!,
      paid: false,
      status: 'tilmeldt',
    },
  })

  await prisma.eventParticipant.create({
    data: {
      eventId: event3.id,
      userId: member1.id,
      licenseNumber: member1.licenseNumber!,
      paid: true,
      paidAmount: 175.00,
      paidDate: new Date('2023-08-15'),
      status: 'deltaget',
    },
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
