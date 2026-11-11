export type DatabaseSeedState = 'ready' | 'seeding' | 'error'

export type DatabaseSeedProgress = {
  done: number
  total: number
}

export type DatabaseSeedStatus = {
  state: DatabaseSeedState
  progress?: DatabaseSeedProgress
  error?: string
}
