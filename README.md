# DCU Kreds Portal

En komplet intern portal til DCU-kreds med stævne-administration, dokument-håndtering, og medlem-funktioner.

## 🚀 Funktioner

- **Autentificering**: Login-system med roller (Admin, Bestyrelse, Medlem)
- **Stævne-administration**: Opret og administrer stævner med deltagere og betalingsstatus
- **Bruger-administration**: Håndtering af medlemmer og deres profiler
- **Dokument-håndtering**: Integration med Google Drive (kommer snart)
- **Galleri**: Billede-albums (kommer snart)
- **Responsive design**: Mobil-venligt interface

## 🛠️ Teknisk Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: SQLite med Prisma ORM
- **Styling**: Tailwind CSS
- **Autentificering**: NextAuth.js med JWT
- **File Storage**: Google Drive API (kommer snart)
- **TypeScript**: For type-sikkerhed

## 📋 Forudsætninger

- Node.js 18 eller nyere
- npm eller yarn

## 🔧 Installation

1. **Klon repository:**
   ```bash
   git clone <repository-url>
   cd dcu-kreds-portal
   ```

2. **Installer dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurer environment variabler:**
   
   Kopier `.env.example` til `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Rediger `.env` og tilpas værdierne:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   
   # Google Drive (valgfrit - kommer snart)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GOOGLE_DRIVE_FOLDER_ID=""
   ```

4. **Initialiser database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed database med test-data:**
   ```bash
   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
   ```

6. **Start udviklings-server:**
   ```bash
   npm run dev
   ```

7. **Åbn applikationen:**
   
   Gå til [http://localhost:3000](http://localhost:3000)

## 👤 Test-konti

Efter seeding er følgende konti tilgængelige:

| Email | Password | Rolle |
|-------|----------|-------|
| admin@dcu-kreds.dk | admin123 | Admin |
| bestyrelse@dcu-kreds.dk | bestyrelse123 | Bestyrelse |
| medlem1@dcu-kreds.dk | medlem123 | Medlem |
| medlem2@dcu-kreds.dk | medlem123 | Medlem |

## 📁 Projektstruktur

```
dcu-kreds-portal/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   └── events/          # Event API endpoints
│   ├── dashboard/           # Dashboard side
│   ├── staevner/            # Stævne-sider
│   ├── dokumenter/          # Dokument-browser
│   ├── galleri/             # Billede-galleri
│   ├── profil/              # Bruger-profil
│   ├── admin/               # Admin-panel
│   └── login/               # Login-side
├── components/              # Genanvendelige komponenter
├── lib/                     # Utility funktioner
│   ├── auth.ts             # NextAuth konfiguration
│   └── prisma.ts           # Prisma client
├── prisma/                  # Database schema og seed
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── types/                   # TypeScript type definitions
└── public/                  # Statiske filer
```

## 🗄️ Database Schema

### Users
- Brugeroplysninger
- Roller (admin, bestyrelse, medlem)
- DCU licens-nummer

### Events
- Stævne-information
- Status (idé, arrangeret, afholdt, aflyst)
- Dato, tid, sted, pris

### EventParticipants
- Deltagere til stævner
- Betalingsstatus
- Licens-numre

### DriveFiles
- Referencer til filer i Google Drive
- Metadata (filtype, ejer, timestamps)

## 🔐 Roller og Rettigheder

### Admin
- Fuld adgang til alle funktioner
- Kan oprette, redigere og slette stævner
- Kan administrere brugere
- Kan se admin-panel

### Bestyrelse
- Kan oprette og redigere stævner
- Kan administrere deltagere
- Kan uploade dokumenter
- Kan se admin-panel

### Medlem
- Kan se stævner
- Kan se dokumenter
- Kan se galleri
- Kan redigere egen profil

## 🔄 API Endpoints

### Events
- `GET /api/events` - Hent alle stævner
- `POST /api/events` - Opret nyt stævne
- `GET /api/events/[id]` - Hent specifikt stævne
- `PATCH /api/events/[id]` - Opdater stævne
- `DELETE /api/events/[id]` - Slet stævne
- `POST /api/events/[id]/participants` - Tilføj deltager

### Auth
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

## 🚀 Deployment

### Build til produktion:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Vigtige produktions-overvejelser:
1. Generer en sikker `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
2. Opdater `NEXTAUTH_URL` til dit domæne
3. Overvej at bruge en mere robust database (PostgreSQL, MySQL)
4. Konfigurer backup-strategi for database
5. Setup SSL/HTTPS
6. Implementer rate limiting
7. Konfigurer logging og monitoring

## 🔮 Kommende Funktioner

- ✅ Grundlæggende stævne-administration
- ✅ Bruger-autentificering og roller
- ✅ Dashboard med oversigt
- ✅ Admin-panel
- ⏳ Google Drive integration
- ⏳ Dokument-upload og -browser
- ⏳ Billede-galleri
- ⏳ Regnskabs-håndtering
- ⏳ Email-notifikationer
- ⏳ Eksport til Excel/PDF
- ⏳ Søge- og filtreringsfunktioner

## 📝 Scripts

- `npm run dev` - Start udviklings-server
- `npm run build` - Build til produktion
- `npm start` - Start production server
- `npm run lint` - Kør ESLint
- `npm run db:push` - Sync database schema
- `npm run db:seed` - Seed database

## 🤝 Bidrag

Dette er et internt projekt for DCU-kreds. Kontakt administratoren for at bidrage.

## 📄 Licens

Privat - Kun til brug i DCU-kreds.

## 🆘 Support

Ved problemer eller spørgsmål, kontakt:
- Email: admin@dcu-kreds.dk
- GitHub Issues: [Link til repository]

## 🔧 Troubleshooting

### Database fejl
Hvis du oplever database-fejl, prøv:
```bash
rm prisma/dev.db
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### Port allerede i brug
Hvis port 3000 er i brug:
```bash
PORT=3001 npm run dev
```

### Dependencies fejl
Slet node_modules og geninstaller:
```bash
rm -rf node_modules package-lock.json
npm install
```
