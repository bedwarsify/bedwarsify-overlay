import amogusAudio from '@/assets/audio/amogus.webm'
import bassDropAudio from '@/assets/audio/bass-drop.webm'
import dangerAudio from '@/assets/audio/danger.webm'
import fogHornAudio from '@/assets/audio/fog-horn.webm'
import letsGoAudio from '@/assets/audio/lets-go.webm'
import missionPassedAudio from '@/assets/audio/mission-passed.webm'
import oofOneAudio from '@/assets/audio/oof-one.webm'
import oofTwoAudio from '@/assets/audio/oof-two.webm'
import wastedAudio from '@/assets/audio/wasted.webm'
import windowsXpErrorAudio from '@/assets/audio/windows-xp-error.webm'
import windowsXpShutdownAudio from '@/assets/audio/windows-xp-shutdown.webm'
import windowsXpStartupAudio from '@/assets/audio/windows-xp-startup.webm'

export enum SoundEffect {
  AMOGUS = 'AMOGUS',
  BASS_DROP = 'BASS_DROP',
  DANGER = 'DANGER',
  FOG_HORN = 'FOG_HORN',
  LETS_GO = 'LETS_GO',
  MISSION_PASSED = 'MISSION_PASSED',
  OOF_ONE = 'OOF_ONE',
  OOF_TWO = 'OOF_TWO',
  WASTED = 'WASTED',
  WINDOWS_XP_ERROR = 'WINDOWS_XP_ERROR',
  WINDOWS_XP_SHUTDOWN = 'WINDOWS_XP_SHUTDOWN',
  WINDOWS_XP_STARTUP = 'WINDOWS_XP_STARTUP',
}

const soundEffects: {
  [p: string]: {
    displayName: string
    audio: HTMLAudioElement
  }
} = {
  [SoundEffect.AMOGUS]: {
    displayName: 'Amogus',
    audio: new Audio(amogusAudio),
  },
  [SoundEffect.BASS_DROP]: {
    displayName: 'Bass Drop',
    audio: new Audio(bassDropAudio),
  },
  [SoundEffect.DANGER]: {
    displayName: 'Danger',
    audio: new Audio(dangerAudio),
  },
  [SoundEffect.FOG_HORN]: {
    displayName: 'Fog Horn',
    audio: new Audio(fogHornAudio),
  },
  [SoundEffect.LETS_GO]: {
    displayName: "Let's Go",
    audio: new Audio(letsGoAudio),
  },
  [SoundEffect.MISSION_PASSED]: {
    displayName: 'Mission Passed',
    audio: new Audio(missionPassedAudio),
  },
  [SoundEffect.OOF_ONE]: {
    displayName: 'Oof One',
    audio: new Audio(oofOneAudio),
  },
  [SoundEffect.OOF_TWO]: {
    displayName: 'Oof Two',
    audio: new Audio(oofTwoAudio),
  },
  [SoundEffect.WASTED]: {
    displayName: 'Wasted',
    audio: new Audio(wastedAudio),
  },
  [SoundEffect.WINDOWS_XP_ERROR]: {
    displayName: 'XP Error',
    audio: new Audio(windowsXpErrorAudio),
  },
  [SoundEffect.WINDOWS_XP_SHUTDOWN]: {
    displayName: 'XP Shutdown',
    audio: new Audio(windowsXpShutdownAudio),
  },
  [SoundEffect.WINDOWS_XP_STARTUP]: {
    displayName: 'XP Startup',
    audio: new Audio(windowsXpStartupAudio),
  },
}

export default soundEffects
