import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function StaevnerPage() {
  const session = await getServerSession(authOptions)
  
  const events = await prisma.event.findMany({
    orderBy: [
      {
        date: 'desc'
      },
      {
        createdAt: 'desc'
      }
    ],
    include: {
      creator: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      _count: {
        select: {
          participants: true
        }
      }
    }
  })

  const canCreateEvent = session?.user?.role === 'admin' || session?.user?.role === 'bestyrelse'

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Stævner</h1>
        {canCreateEvent && (
          <Link
            href="/staevner/opret"
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Opret nyt stævne
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Alle
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Kommende
          </button>
          <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Afholdte
          </button>
        </nav>
      </div>

      {/* Events grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/staevner/${event.id}`}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  event.status === 'ide' ? 'bg-yellow-100 text-yellow-800' :
                  event.status === 'arrangeret' ? 'bg-green-100 text-green-800' :
                  event.status === 'afholdt' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status === 'ide' ? '🟡 Idé' :
                   event.status === 'arrangeret' ? '🟢 Arrangeret' :
                   event.status === 'afholdt' ? '✅ Afholdt' :
                   '🔴 Aflyst'}
                </span>
                {event.price && (
                  <span className="text-sm font-medium text-gray-900">
                    {event.price} kr
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {event.title}
              </h3>
              
              {event.description && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm text-gray-500">
                {event.date && (
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.date).toLocaleDateString('da-DK', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
                
                {event.time && (
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.time}
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                )}
                
                <div className="flex items-center">
                  <svg className="flex-shrink-0 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {event._count.participants} deltagere
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ingen stævner</h3>
          <p className="mt-1 text-sm text-gray-500">
            Kom i gang ved at oprette et nyt stævne.
          </p>
          {canCreateEvent && (
            <div className="mt-6">
              <Link
                href="/staevner/opret"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Opret nyt stævne
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
