import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function ProfilPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    }
  })

  if (!user) {
    return null
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Min Profil</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fornavn
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.firstName || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Efternavn
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.lastName || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.phone || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  DCU Licens Nummer
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.licenseNumber || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rolle
                </label>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'bestyrelse' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </p>
              </div>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500">
                Medlem siden: {new Date(user.createdAt).toLocaleDateString('da-DK', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
