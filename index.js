const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const config = {
  SESSION_ID: process.env.SESSION_ID || 'your-session-id',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '234XXXXXXXXXX',
  WORKTYPE: process.env.WORKTYPE || 'public',
  PREFIX: process.env.PREFIX || '.',
  TIMEZONE: process.env.TIMEZONE || 'Africa/Lagos',
  OWNER_NAME: process.env.OWNER_NAME || 'Your Name',
  BOT_NAME: process.env.BOT_NAME || 'LËGĒNDÃRY BØT'
}

if (config.SESSION_ID === 'your-session-id') {
  console.error('SESSION_ID no set. Add your session id and redeploy.')
  process.exit(1)
}

const REPO_URL = 'https://github.com/LEGENDARY-AI2008/LEGENDARY-OFFICIAL-WHATSAPP-BOT'

function writeEnvFile(filePath) {
  const envText = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
  fs.writeFileSync(filePath, envText)
  console.log('config.env written')
}

function moveFilesToRoot(srcDir, destDir) {
  const files = fs.readdirSync(srcDir, { withFileTypes: true })
  for (const file of files) {
    const srcPath = path.join(srcDir, file.name)
    const destPath = path.join(destDir, file.name)
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true })
    }
    fs.renameSync(srcPath, destPath)
  }
}

try {
  console.log('Cloning LËGĒNDÃRY BØT...')
  execSync(`git clone --depth 1 ${REPO_URL} temp-dir`, {
    stdio: 'inherit',
    timeout: 180000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
  })

  const rootDir = process.cwd()
  const tempDir = path.join(rootDir, 'temp-dir')

  fs.rmSync(path.join(tempDir, '.git'), { recursive: true, force: true })
  moveFilesToRoot(tempDir, rootDir)
  fs.rmSync(tempDir, { recursive: true, force: true })

  writeEnvFile(path.join(rootDir, 'config.env'))

  console.log('Installing dependencies...')
  fs.writeFileSync(path.join(rootDir, '.npmrc'), 'allow-git=all\n')
  execSync('npm install --allow-git=all', { stdio: 'inherit', env: { ...process.env, NPM_CONFIG_ALLOW_GIT: 'all' } })

  console.log('Starting bot...')
  execSync('npm start', { stdio: 'inherit' })

} catch (err) {
  console.error('Setup failed:', err.message)
  process.exit(1)
}
