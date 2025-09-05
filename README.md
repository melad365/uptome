# Uptome

Your personal activity and entertainment tracker built with Next.js, SQLite, and Docker.

## Features

- **Add Picks**: Create new activity/entertainment picks with title, description, location, date, and tags
- **View Picks**: Browse all your picks with their associated tags
- **Search & Filter**: Search picks by text and filter by tags
- **Responsive Design**: Built with shadcn/ui components and TailwindCSS
- **Dockerized**: Ready for deployment with Docker and NGINX reverse proxy

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI**: shadcn/ui components, TailwindCSS
- **Database**: SQLite with better-sqlite3
- **Deployment**: Docker, NGINX, SSL support

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## Production Deployment with Docker

1. **Generate SSL certificates** (for HTTPS):
   ```bash
   ./generate-ssl.sh
   ```

2. **Build and start the containers**:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**:
   - HTTP: [http://localhost](http://localhost) (redirects to HTTPS)
   - HTTPS: [https://localhost](https://localhost)

## Database Schema

### Tables

- **picks**: Main entity for activities/events
  - `id` (PRIMARY KEY, INTEGER)
  - `title` (TEXT, NOT NULL)
  - `description` (TEXT, NOT NULL)
  - `location` (TEXT, OPTIONAL)
  - `date` (DATETIME, OPTIONAL)
  - `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

- **tags**: Tag names
  - `id` (PRIMARY KEY, INTEGER)
  - `name` (TEXT, UNIQUE, NOT NULL)

- **pick_tags**: Many-to-many relationship between picks and tags
  - `pick_id` (INTEGER, FOREIGN KEY)
  - `tag_id` (INTEGER, FOREIGN KEY)

## API Endpoints

- `GET /api/picks` - Get all picks (supports ?q=search&tagIds=1,2,3 params)
- `POST /api/picks` - Create a new pick
- `GET /api/tags` - Get all tags

## Docker Services

- **uptome**: Next.js application container
- **nginx**: Reverse proxy with SSL termination and rate limiting

## Configuration Files

- `Dockerfile`: Multi-stage build for the Next.js app
- `docker-compose.yml`: Service orchestration
- `nginx/nginx.conf`: NGINX reverse proxy configuration
- `next.config.ts`: Next.js configuration with standalone output

## Security Features

- SSL/TLS encryption
- Rate limiting on API endpoints
- Security headers (HSTS, X-Frame-Options, etc.)
- Input validation and sanitization

## Development vs Production

### Development
- Uses Next.js dev server
- Hot reloading enabled
- No SSL required

### Production
- Standalone Next.js build
- NGINX reverse proxy
- SSL/TLS encryption
- Rate limiting
- Gzip compression
- Static file caching

## Troubleshooting

1. **Port conflicts**: Ensure ports 80, 443, and 3000 are available
2. **SSL certificate issues**: Regenerate certificates with `./generate-ssl.sh`
3. **Database permissions**: Ensure the `data` directory has proper write permissions
4. **Container logs**: Check logs with `docker-compose logs uptome` or `docker-compose logs nginx`

## License

MIT License
