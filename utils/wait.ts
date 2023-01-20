export enum waitTime {
  RefreshScreen = 500,
}

export default function wait(timeout: waitTime) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function refreshDelay() { return wait(waitTime.RefreshScreen) }