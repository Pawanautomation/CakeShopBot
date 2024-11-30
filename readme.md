telegramapplink:  t.me/BrilliantBakes_bot
to run: npx ts-node src/app.ts

To keep your bot running continuously without depending on your laptop, you'll need to deploy it to a cloud server. Here are some popular options:

1. Render (Simple & Free tier available):
- Sign up at render.com
- Create a new Web Service
- Connect your GitHub repository
- Set environment variables (TELEGRAM_TOKEN)
- Select the start command: `npm start`

2. Railway (Easy deployment):
- Go to railway.app
- Connect your GitHub repository
- Add environment variables
- Deploy automatically

3. Heroku (Well-known & reliable):
- Create account on heroku.com
- Install Heroku CLI
- Create new app
- Set environment variables
- Deploy using Git

4. DigitalOcean (More control, paid):
- Create a droplet
- SSH into your server
- Install Node.js
- Set up PM2 to keep app running
- Use nginx as reverse proxy

Here's what I recommend for a beginner-friendly setup using Render:

1. First, prepare your project:
```bash
# Add a start script to package.json
{
  "scripts": {
    "start": "ts-node src/app.ts",
    "build": "tsc"
  }
}

# Add a Procfile
web: npm start
```

2. Push your code to GitHub

3. Go to render.com:
- Sign up/Login
- Click "New +" → "Web Service"
- Connect your GitHub repo
- Configure:
  - Name: brilliantbakes-bot
  - Environment: Node
  - Build Command: `npm install`
  - Start Command: `npm start`
- Add environment variable:
  - Key: TELEGRAM_TOKEN
  - Value: Your telegram token

Would you like me to provide more detailed steps for any of these deployment options?