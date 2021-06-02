import { contextBridge, ipcRenderer } from 'electron'
import { AxiosRequestConfig } from 'axios'

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel: string, data: never) => {
    const validChannels = [
      'winMinimize',
      'winClose',
      'discordAuthStart',
      'openExternal',
      'logFileSet',
    ]

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (channel: string, func: any) => {
    const validChannels = ['discordAuthCode', 'discordAuthEnd', 'logFileLine']

    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, func)
    }
  },
  invoke: (channel: string, ...args: any[]) => {
    if (channel === 'axios') {
      const validHostnames = ['api.mojang.com', 'sessionserver.mojang.com']
      const [url, config] = args as [string, AxiosRequestConfig]

      if (validHostnames.includes(new URL(url).hostname)) {
        return ipcRenderer.invoke(channel, url, config)
      }
    } else if (channel === 'hypixel') {
      return ipcRenderer.invoke(channel, ...args)
    } else if (channel === 'hypixelUtils') {
      return ipcRenderer.invoke(channel, ...args)
    } else if (channel === 'openFileLog') {
      return ipcRenderer.invoke(channel)
    } else if (channel === 'pathJoin') {
      return ipcRenderer.invoke(channel, ...args)
    } else if (channel === 'fileReadable') {
      return ipcRenderer.invoke(channel, ...args)
    } else if (channel === 'getVersion') {
      return ipcRenderer.invoke(channel)
    }
  },
})
