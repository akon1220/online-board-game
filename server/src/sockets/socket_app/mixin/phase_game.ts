export interface PhaseGameInterface {
  onAllPhaseEnd: () => void
}

export interface PhaseController<A extends PhaseGameInterface> {
  takeCharge: () => Promise<PhaseController<A> | null>
}

export class PhaseGameController<A extends PhaseGameInterface> {
  constructor(private app: A, private firstPhase: PhaseController<A>) {
    this.main()
  }

  private main = async () => {
    let currentPhase: PhaseController<A> | null = this.firstPhase
    while (true) {
      if (currentPhase === null) break
      currentPhase = await currentPhase.takeCharge()
    }
    this.app.onAllPhaseEnd()
  }
}
