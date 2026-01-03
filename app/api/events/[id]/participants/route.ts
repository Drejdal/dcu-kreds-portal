import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, licenseNumber, paid, paidAmount, paidDate, notes } = body

    const participant = await prisma.eventParticipant.create({
      data: {
        eventId: parseInt(params.id),
        userId: parseInt(userId),
        licenseNumber,
        paid: paid || false,
        paidAmount: paidAmount ? parseFloat(paidAmount) : null,
        paidDate: paidDate ? new Date(paidDate) : null,
        notes
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json(participant, { status: 201 })
  } catch (error) {
    console.error('Failed to add participant:', error)
    return NextResponse.json(
      { error: 'Failed to add participant' },
      { status: 500 }
    )
  }
}
