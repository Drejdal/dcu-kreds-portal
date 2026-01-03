'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

type Event = {
  id: number
  title: string
  description: string | null
  date: string | null
  time: string | null
  location: string | null
  price: number | null
  status: string
  creator: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  participants: Array<{
    id: number
    user: {
      firstName: string | null
      lastName: string | null
      email: string
      phone: string | null
    }
    licenseNumber: string | null
    paid: boolean
    paidAmount: number | null
    paidDate: string | null
    status: string
    notes: string | null
  }>
  files: Array<{
    id: number
    filename: string
    fileType: string
  }>
}

export default function StaevneDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('detaljer')

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setEvent(data)
        }
      } catch (error) {
        console.error('Failed to fetch event:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Stævne ikke fundet</h3>
        <Link href="/staevner" className="mt-4 text-blue-600 hover:text-blue-800">
          Tilbage til stævner
        </Link>
      </div>
    )
  }

  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'bestyrelse'
  const paidParticipants = event.participants.filter(p => p.paid).length
  const totalParticipants = event.participants.length

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href="/staevner" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tilbage til stævner
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{event.title}</h1>
              <p className="mt-1 text-blue-100">
                Oprettet af {event.creator.firstName} {event.creator.lastName}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
          {event.date && (
            <div className="text-center">
              <div className="text-sm text-gray-500">Dato</div>
              <div className="text-lg font-semibold">
                {new Date(event.date).toLocaleDateString('da-DK', { day: '2-digit', month: 'short' })}
              </div>
            </div>
          )}
          {event.time && (
            <div className="text-center">
              <div className="text-sm text-gray-500">Tid</div>
              <div className="text-lg font-semibold">{event.time}</div>
            </div>
          )}
          {event.price && (
            <div className="text-center">
              <div className="text-sm text-gray-500">Pris</div>
              <div className="text-lg font-semibold">{event.price} kr</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-sm text-gray-500">Deltagere</div>
            <div className="text-lg font-semibold">
              {totalParticipants} ({paidParticipants} betalt)
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {['detaljer', 'deltagere', 'dokumenter', 'billeder', 'regnskab'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'detaljer' && (
            <div className="space-y-6">
              {event.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Beskrivelse</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
              {event.location && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Sted</h3>
                  <p className="text-gray-900">{event.location}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'deltagere' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Deltagere ({totalParticipants})</h3>
                {canEdit && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Tilføj deltager
                  </button>
                )}
              </div>
              
              {event.participants.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Ingen deltagere tilmeldt endnu</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Navn
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Licens
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Betaling
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {event.participants.map((participant) => (
                        <tr key={participant.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {participant.user.firstName} {participant.user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{participant.user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {participant.licenseNumber || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {participant.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {participant.paid ? (
                              <span className="text-green-600 font-medium">
                                ✓ {participant.paidAmount} kr
                                {participant.paidDate && (
                                  <span className="text-gray-500 ml-2">
                                    ({new Date(participant.paidDate).toLocaleDateString('da-DK')})
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-red-600">Ikke betalt</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dokumenter' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Dokumenter</h3>
                {canEdit && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Upload dokument
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-center py-8">
                Google Drive integration kommer snart
              </p>
            </div>
          )}

          {activeTab === 'billeder' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Billeder</h3>
                {canEdit && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Upload billeder
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-center py-8">
                Google Drive integration kommer snart
              </p>
            </div>
          )}

          {activeTab === 'regnskab' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Regnskab</h3>
                {canEdit && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Upload regnskab
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-center py-8">
                Ingen regnskabsfil uploadet endnu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
