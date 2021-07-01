import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
  clipboard,
  globalShortcut,
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import axios, { AxiosRequestConfig } from 'axios'
import {
  Client as HypixelClient,
  Components,
  getBedwarsLevelInfo,
  getNetworkLevel,
  getPlayerRank,
} from '@zikeji/hypixel'
import fs from 'fs'
import TailFile from '@logdna/tail-file'
import readline from 'readline'
import { autoUpdater } from 'electron-updater'
import windowStateKeeper from 'electron-window-state'

const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay)
  })

const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

let win: BrowserWindow | null = null

let discordAuthWin: BrowserWindow | null = null

async function createWindow() {
  const winState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
  })

  win = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    x: winState.x,
    y: winState.y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: process.platform !== 'darwin',
    webPreferences: {
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      devTools: process.env.NODE_ENV === 'development',
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  winState.manage(win)

  win.setAlwaysOnTop(true, 'screen-saver')

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    await win.loadURL('app://./index.html')

    if (!process.windowsStore && !process.mas) {
      await autoUpdater.checkForUpdatesAndNotify({
        title: 'A new update is available to install',
        body: 'Bedwarsify Overlay v{version} has been downloaded and will be installed on exit.',
      })
    }
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})

if (process.platform === 'linux') {
  app.disableHardwareAcceleration()
}

app.on('ready', async () => {
  if (process.platform === 'linux') {
    await wait(300)
  }

  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  await createWindow()
})

function toggleWinMinimized() {
  if (win?.isMinimized()) {
    win?.showInactive()
  } else {
    win?.minimize()
  }
}

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('winMinimize', () => {
  win?.minimize()
})

ipcMain.on('winClose', () => {
  win?.close()
})

ipcMain.handle('toggleWinMinimized', () => {
  toggleWinMinimized()
})

ipcMain.on('discordAuthStart', async () => {
  discordAuthWin = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
  })

  win?.setAlwaysOnTop(true, 'status')
  discordAuthWin.setAlwaysOnTop(true, 'screen-saver')
  await discordAuthWin.loadURL(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.VUE_APP_DISCORD_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost&response_type=code&scope=identify`
  )
  discordAuthWin.show()

  discordAuthWin.webContents.on('will-navigate', (event, newUrl) => {
    const parsedUrl = new URL(newUrl)

    if (parsedUrl.hostname === 'localhost') {
      win?.webContents.send(
        'discordAuthCode',
        parsedUrl.searchParams.get('code')
      )
      discordAuthWin?.close()
      discordAuthWin = null
    }
  })

  discordAuthWin.on('close', () => {
    const url = discordAuthWin!.webContents.getURL()
    const parsedUrl = new URL(url)

    win?.webContents.send(
      'discordAuthEnd',
      parsedUrl.hostname === 'localhost'
        ? parsedUrl.searchParams.get('code')
        : null
    )
  })
})

ipcMain.on('openExternal', async (event, url) => {
  await shell.openExternal(url)
})

ipcMain.handle(
  'axios',
  async (
    event,
    url: string,
    config: AxiosRequestConfig,
    validStatuses: number[] | undefined
  ) => {
    const response = await axios(
      url,
      validStatuses === undefined
        ? config
        : {
            ...config,
            validateStatus: (status) => validStatuses?.includes(status),
          }
    )

    return {
      data: response.data,
      status: response.status,
    }
  }
)

ipcMain.handle(
  'hypixel',
  async (
    event,
    key: string,
    resource: 'key' | 'player.uuid' | 'guild.player',
    ...args: any[]
  ) => {
    const client = new HypixelClient(key)

    if (resource === 'key') {
      return await client.key()
    } else if (resource === 'player.uuid') {
      const [uuid] = args as [string]
      return await client.player.uuid(uuid)
    } else if (resource === 'guild.player') {
      const [player] = args as [string]
      return await client.guild.player(player)
    }
  }
)

ipcMain.handle(
  'hypixelUtils',
  async (event, resource: 'getPlayerRank', ...args: any[]) => {
    if (resource === 'getPlayerRank') {
      const [player, onlyPackages] = args as [
        Components.Schemas.Player,
        boolean | undefined
      ]

      return getPlayerRank(player, onlyPackages)
    } else if (resource === 'getBedwarsLevelInfo') {
      const [player] = args as [Components.Schemas.Player]

      return getBedwarsLevelInfo(player)
    } else if (resource === 'getNetworkLevel') {
      const [player] = args as [Components.Schemas.Player]

      return getNetworkLevel(player)
    }
  }
)

ipcMain.handle('openFileLog', async () => {
  return await dialog.showOpenDialog(win!, {
    defaultPath: app.getPath('appData'),
    filters: [
      {
        name: 'Logs',
        extensions: ['log'],
      },
    ],
    properties: ['openFile'],
  })
})

ipcMain.handle(
  'pathJoin',
  async (event, base: 'userData' | 'appData', ...pathElements: string[]) => {
    return path.join(app.getPath(base), ...pathElements)
  }
)

ipcMain.handle('fileReadable', async (event, path: string) => {
  return await fs.promises
    .access(path, fs.constants.R_OK)
    .then(() => true)
    .catch(() => false)
})

let logFileTail: TailFile | null = null
let logFileReadline: readline.Interface | null = null

ipcMain.on('logFileSet', async (event, path: string) => {
  logFileReadline?.close()
  logFileReadline = null

  await logFileTail?.quit()
  logFileTail = null

  if (path !== null) {
    logFileTail = new TailFile(path)
    await logFileTail.start()

    logFileReadline = readline.createInterface({
      input: logFileTail,
    })

    logFileReadline.on('line', (line) => {
      win?.webContents.send('logFileLine', line)
    })
  }
})

ipcMain.handle('captureScreenshotToClipboard', async () => {
  const { width, height } = win?.getBounds() ?? {
    width: 800,
    height: 600,
  }

  win?.setBounds({
    width: 720,
    height: 440,
  })

  const image = await win?.webContents.capturePage()

  if (image) {
    clipboard.writeImage(image)
  }

  win?.setBounds({
    width,
    height,
  })
})

const registeredGlobalShortcuts = new Set<string>()

ipcMain.handle('registerGlobalShortcuts', async (event, shortcuts) => {
  for (const shortcut of registeredGlobalShortcuts) {
    globalShortcut.unregister(shortcut)
    registeredGlobalShortcuts.delete(shortcut)
  }

  for (const shortcut of shortcuts) {
    try {
      globalShortcut.register(shortcut, () =>
        win?.webContents.send('globalShortcutPressed', shortcut)
      )
      registeredGlobalShortcuts.add(shortcut)

      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
})

app.on('will-quit', () => {
  for (const shortcut of registeredGlobalShortcuts) {
    globalShortcut.unregister(shortcut)
    registeredGlobalShortcuts.delete(shortcut)
  }
})
