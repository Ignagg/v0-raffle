import { ApiPromise, WsProvider } from "@polkadot/api"
import type { KeyringPair } from "@polkadot/keyring/types"

export class PolkadotRaffleClient {
  private api: ApiPromise | null = null
  private contractAddress: string

  constructor() {
    this.contractAddress = "TU_CONTRACT_ADDRESS_AQUI" // Reemplazar con dirección real del contrato
    this.initializeApi()
  }

  private async initializeApi() {
    try {
      const wsProvider = new WsProvider("wss://rpc.polkadot.io")
      this.api = await ApiPromise.create({ provider: wsProvider })
    } catch (error) {
      console.error("Error inicializando API de Polkadot:", error)
    }
  }

  async buyTicket(raffleId: string, walletAccount: KeyringPair) {
    try {
      if (!this.api) {
        throw new Error("API de Polkadot no inicializada")
      }

      const transaction = this.api.tx.contracts.call(
        this.contractAddress,
        0, // value
        1000000000, // gasLimit
        null, // storageDepositLimit
        "buy_ticket", // método del contrato
        raffleId,
      )

      // Enviar transacción (requiere firma del wallet)
      return transaction
    } catch (error) {
      console.error("Error comprando ticket:", error)
      throw error
    }
  }

  async getRaffleInfo(raffleId: string) {
    try {
      if (!this.api) {
        throw new Error("API de Polkadot no inicializada")
      }

      const result = await this.api.query.contracts.contractInfoOf(this.contractAddress)
      return result
    } catch (error) {
      console.error("Error obteniendo información de rifa:", error)
      return null
    }
  }

  async createRaffle(
    organizer: KeyringPair,
    maxTickets: number,
    ticketPrice: number,
    feePercent: number,
    stakePercent: number,
  ) {
    try {
      if (!this.api) {
        throw new Error("API de Polkadot no inicializada")
      }

      const transaction = this.api.tx.contracts.call(
        this.contractAddress,
        0, // value
        1000000000, // gasLimit
        null, // storageDepositLimit
        "create_raffle", // método del contrato
        maxTickets,
        ticketPrice,
        feePercent,
        stakePercent,
      )

      return transaction
    } catch (error) {
      console.error("Error creando rifa:", error)
      return null
    }
  }

  async closeRaffle(raffleId: string, organizer: KeyringPair) {
    try {
      if (!this.api) {
        throw new Error("API de Polkadot no inicializada")
      }

      const transaction = this.api.tx.contracts.call(
        this.contractAddress,
        0, // value
        1000000000, // gasLimit
        null, // storageDepositLimit
        "close_raffle", // método del contrato
        raffleId,
      )

      return transaction
    } catch (error) {
      console.error("Error cerrando rifa:", error)
      return null
    }
  }
}
