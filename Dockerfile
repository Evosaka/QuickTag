# Use a base node image
FROM node:18-alpine AS deps

# Set the working directory
WORKDIR /app

# Install Yarn
RUN apk add --no-cache libc6-compat 

# Copy over the package.json (and optionally yarn.lock if you have one)
COPY package.json yarn.lock ./

# Use Yarn to install dependencies
RUN yarn --frozen-lockfile

# Use another stage for building the app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy the node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the app's source code
COPY . .

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

# Use another stage for running the app
FROM node:18-alpine AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

# Create a user group and user for security reasons
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# You only need to copy .next from the builder stage, public and node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# IMPORTANT: Copy the whole app folder (including node_modules)
COPY --from=builder /app ./

# Set the appropriate permissions
RUN chown -R nextjs:nodejs /app

# Run as the nextjs user
USER nextjs

# Start the app using Yarn
CMD ["yarn", "start"]
