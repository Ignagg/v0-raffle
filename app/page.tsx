"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Copy,
  CheckCircle,
  Ticket,
  Trophy,
  Shield,
  Zap,
  Eye,
  Sparkles,
  Users,
  DollarSign,
  Hash,
  ArrowRight,
} from "lucide-react"
import { WsProvider } from "@polkadot/api"

// Phantom wallet types
interface PhantomProvider {
  isPhantom: boolean
  connect: () => Promise<{ publicKey: { toString: () => string } }>
  disconnect: () => Promise<void>
  on: (event: string, callback: (args: any) => void) => void
  publicKey: { toString: () => string } | null
  isConnected: boolean
}

// Mock raffle data structure
interface Raffle {
  id: string
  title: string
  ticketPrice: number // in DOT
  ticketsIssued: number
  maxTickets: number
  organizer: string
  isActive: boolean
  stakePercent: number
  feePercent: number
  totalRaised: number
  participants: string[]
  winner: string | null
}

// NFT ticket interface
interface NFTTicket {
  id: string
  raffleId: string
  raffleTitle: string
  ticketNumber: number
  purchaseDate: string
  qrCode: string
}

// Mock raffle data - will be replaced with Polkadot contract data
const mockRaffles: Raffle[] = [
  {
    id: "1",
    title: "Rifa AVEIT 2025",
    ticketPrice: 0.1,
    ticketsIssued: 45,
    maxTickets: 100,
    organizer: "8sj...39F",
    isActive: true, // Ensuring raffle is active
    stakePercent: 10,
    feePercent: 5,
    totalRaised: 4.5,
    participants: [],
    winner: null,
  },
  {
    id: "2",
    title: "Rifa Tech UTN",
    ticketPrice: 0.05,
    ticketsIssued: 23,
    maxTickets: 50,
    organizer: "9kL...28A",
    isActive: true, // Ensuring raffle is active
    stakePercent: 15,
    feePercent: 5,
    totalRaised: 1.15,
    participants: [],
    winner: null,
  },
  {
    id: "3",
    title: "Rifa Blockchain FRC",
    ticketPrice: 0.2,
    ticketsIssued: 12,
    maxTickets: 30,
    organizer: "7mN...45B",
    isActive: true, // Ensuring raffle is active
    stakePercent: 12,
    feePercent: 5,
    totalRaised: 2.4,
    participants: [],
    winner: null,
  },
]

declare global {
  interface Window {
    solana?: PhantomProvider
    injectedWeb3?: { "polkadot-js": PolkadotProvider }
  }
}

const createConfetti = () => {
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff"]
  const confettiCount = 50

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div")
    confetti.style.position = "fixed"
    confetti.style.left = Math.random() * 100 + "vw"
    confetti.style.top = "-10px"
    confetti.style.width = "10px"
    confetti.style.height = "10px"
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.borderRadius = "50%"
    confetti.style.pointerEvents = "none"
    confetti.style.zIndex = "9999"
    confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`

    document.body.appendChild(confetti)

    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

const playSuccessSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
  oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

// Polkadot.js extension types
interface PolkadotProvider {
  isPolkadotJs: boolean
  connect: () => Promise<{ address: string }>
  disconnect: () => Promise<void>
  on: (event: string, callback: (args: any) => void) => void
  selectedAccount: { address: string } | null
  isConnected: boolean
}

// NFT ticket interface
interface NFTTicket {
  id: string
  raffleId: string
  raffleTitle: string
  ticketNumber: number
  purchaseDate: string
  qrCode: string
}

// Polkadot contract data
const polkadotRaffles: Raffle[] = [
  {
    id: "1",
    title: "Rifa AVEIT 2025",
    ticketPrice: 0.1,
    ticketsIssued: 45,
    maxTickets: 100,
    organizer: "8sj...39F",
    isActive: true, // Ensuring raffle is active
    stakePercent: 10,
    feePercent: 5,
    totalRaised: 4.5,
    participants: [],
    winner: null,
  },
  {
    id: "2",
    title: "Rifa Tech UTN",
    ticketPrice: 0.05,
    ticketsIssued: 23,
    maxTickets: 50,
    organizer: "9kL...28A",
    isActive: true, // Ensuring raffle is active
    stakePercent: 15,
    feePercent: 5,
    totalRaised: 1.15,
    participants: [],
    winner: null,
  },
  {
    id: "3",
    title: "Rifa Blockchain FRC",
    ticketPrice: 0.2,
    ticketsIssued: 12,
    maxTickets: 30,
    organizer: "7mN...45B",
    isActive: true, // Ensuring raffle is active
    stakePercent: 12,
    feePercent: 5,
    totalRaised: 2.4,
    participants: [],
    winner: null,
  },
]

declare global {
  interface Window {
    solana?: PhantomProvider
    injectedWeb3?: { "polkadot-js": PolkadotProvider }
  }
}

const wsProvider = new WsProvider("wss://rpc.polkadot.io")

const generateRaffleData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    ventas: Math.floor(Math.random() * 15) + 5,
    ingresos: Math.floor(Math.random() * 3000) + 1000,
  }))
}

const raffleNumbers = Array.from({ length: 1000 }, (_, i) => ({
  number: String(i + 1).padStart(4, "0"),
  sold: Math.random() > 0.3,
  buyer: Math.random() > 0.3 ? `Usuario ${Math.floor(Math.random() * 200) + 1}` : null,
}))

const topBuyers = [
  {
    id: 1,
    name: "Usuario Anónimo #1",
    tickets: 15,
    amount: 15000,
    avatar: "/diverse-user-avatars.png",
    specialty: "Wallet: 5GrwvaEF...3fhX",
  },
  {
    id: 2,
    name: "Usuario Anónimo #2",
    tickets: 12,
    amount: 12000,
    avatar: "/diverse-user-avatars.png",
    specialty: "Wallet: 5FHneW46...xGXg",
  },
  {
    id: 3,
    name: "Usuario Anónimo #3",
    tickets: 10,
    amount: 10000,
    avatar: "/diverse-user-avatars.png",
    specialty: "Wallet: 5DAAnrj7...VjCq",
  },
  {
    id: 4,
    name: "Usuario Anónimo #4",
    tickets: 8,
    amount: 8000,
    avatar: "/diverse-user-avatars.png",
    specialty: "Wallet: 5HGjWAeF...Mn7c",
  },
  {
    id: 5,
    name: "Usuario Anónimo #5",
    tickets: 7,
    amount: 7000,
    avatar: "/diverse-user-avatars.png",
    specialty: "Wallet: 5CiPPseX...R9Ly",
  },
]

const prizes = [
  { name: "1er Premio - Notebook Gamer", value: 800000, color: "hsl(var(--chart-1))" },
  { name: "2do Premio - Smartphone", value: 300000, color: "hsl(var(--chart-2))" },
  { name: "3er Premio - Tablet", value: 150000, color: "hsl(var(--chart-3))" },
  { name: "4to Premio - Auriculares", value: 50000, color: "hsl(var(--chart-4))" },
  { name: "5to Premio - Voucher", value: 25000, color: "hsl(var(--primary))" },
]

export default function PolkadotWalletApp() {
  const [wallet, setWallet] = useState<PolkadotProvider | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [userTickets, setUserTickets] = useState<NFTTicket[]>([])
  const [showTicketsModal, setShowTicketsModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showCreateRaffleModal, setShowCreateRaffleModal] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [newRaffle, setNewRaffle] = useState({
    title: "",
    maxTickets: "",
    ticketPrice: "",
    stakePercent: "",
    feePercent: "",
  })
  const [isCreatingRaffle, setIsCreatingRaffle] = useState(false)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState<{ raffle: Raffle; winner: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [purchaseStep, setPurchaseStep] = useState<"confirm" | "processing" | "success">("confirm")
  const [raffleData, setRaffleData] = useState(generateRaffleData())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showLandingPage, setShowLandingPage] = useState(true)

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-10px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
      
      @keyframes pulse-success {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes slide-up {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      
      .animate-pulse-success {
        animation: pulse-success 2s ease-in-out infinite;
      }
      
      .animate-slide-up {
        animation: slide-up 0.3s ease-out forwards;
      }
      
      .loading-dots::after {
        content: '';
        animation: loading-dots 1.5s infinite;
      }
      
      @keyframes loading-dots {
        0%, 20% { content: ''; }
        40% { content: '.'; }
        60% { content: '..'; }
        80%, 100% { content: '...'; }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setRaffleData(generateRaffleData())
      setCurrentTime(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Check if Polkadot.js extension is available
    if (typeof window !== "undefined" && window.injectedWeb3?.["polkadot-js"]) {
      setWallet(window.injectedWeb3["polkadot-js"])

      // Check if already connected
      if (window.injectedWeb3["polkadot-js"].isConnected && window.injectedWeb3["polkadot-js"].selectedAccount) {
        setIsConnected(true)
        setPublicKey(window.injectedWeb3["polkadot-js"].selectedAccount.address)
      }

      // Listen for wallet events
      window.injectedWeb3["polkadot-js"].on("connect", (account: any) => {
        console.log("[v0] Wallet connected:", account.address)
        setIsConnected(true)
        setPublicKey(account.address)
      })

      window.injectedWeb3["polkadot-js"].on("disconnect", () => {
        console.log("[v0] Wallet disconnected")
        setIsConnected(false)
        setPublicKey("")
      })
    }

    if (isConnected && publicKey) {
      // Mock admin check - replace with actual contract logic
      setIsAdmin(publicKey.startsWith("5Gr") || publicKey.startsWith("5FH"))
    }
  }, [isConnected, publicKey])

  const connectWallet = async () => {
    if (!wallet) {
      window.open("https://polkadot.js.org/extension/", "_blank")
      return
    }

    try {
      setIsConnecting(true)
      const response = await wallet.connect()
      setIsConnected(true)
      setPublicKey(response.address)
    } catch (error) {
      console.error("[v0] Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    if (wallet) {
      try {
        await wallet.disconnect()
        setIsConnected(false)
        setPublicKey("")
      } catch (error) {
        console.error("[v0] Failed to disconnect wallet:", error)
      }
    }
  }

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const buyTicket = async (raffle: Raffle) => {
    console.log("[v0] Buy ticket clicked - isConnected:", isConnected)
    console.log("[v0] Raffle active:", raffle.isActive)
    console.log("[v0] Tickets available:", raffle.maxTickets - raffle.ticketsIssued)

    if (!isConnected || !wallet) {
      alert("Conecta tu wallet primero")
      return
    }

    setSelectedRaffle(raffle)
    setShowPurchaseModal(true)
  }

  const confirmPurchase = async () => {
    if (!selectedRaffle) return

    setIsPurchasing(true)
    setPurchaseStep("processing")

    try {
      await new Promise((resolve) => setTimeout(resolve, 800)) // Wallet confirmation
      setPurchaseStep("processing")
      await new Promise((resolve) => setTimeout(resolve, 1200)) // Transaction processing

      // Mock transaction
      const newTicket: NFTTicket = {
        id: `ticket-${Date.now()}`,
        raffleId: selectedRaffle.id,
        raffleTitle: selectedRaffle.title,
        ticketNumber: (selectedRaffle.ticketsIssued + 1).toString().padStart(4, "0"),
        purchaseDate: new Date().toLocaleDateString(),
        qrCode: `${selectedRaffle.id}-${Date.now()}`,
      }

      // Update raffle data
      const updatedRaffles = polkadotRaffles.map((raffle) =>
        raffle.id === selectedRaffle.id
          ? {
              ...raffle,
              ticketsIssued: raffle.ticketsIssued + 1,
              totalRaised: raffle.totalRaised + raffle.ticketPrice,
            }
          : raffle,
      )

      setUserTickets((prev) => [...prev, newTicket])

      setPurchaseStep("success")
      playSuccessSound()
      createConfetti()

      setTimeout(() => {
        setShowPurchaseModal(false)
        setShowSuccessModal(true)
        setPurchaseStep("confirm")
      }, 1500)
    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setIsPurchasing(false)
    }
  }

  const generateQRCode = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`
  }

  const createRaffle = async () => {
    if (
      !newRaffle.title ||
      !newRaffle.maxTickets ||
      !newRaffle.ticketPrice ||
      !newRaffle.stakePercent ||
      !newRaffle.feePercent
    ) {
      alert("Por favor completa todos los campos")
      return
    }

    setIsCreatingRaffle(true)

    try {
      // Simulate contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const raffleData: Raffle = {
        id: (polkadotRaffles.length + 1).toString(),
        title: newRaffle.title,
        ticketPrice: Number.parseFloat(newRaffle.ticketPrice),
        ticketsIssued: 0,
        maxTickets: Number.parseInt(newRaffle.maxTickets),
        organizer: formatAddress(publicKey),
        isActive: true,
        stakePercent: Number.parseInt(newRaffle.stakePercent),
        feePercent: Number.parseInt(newRaffle.feePercent),
        totalRaised: 0,
        participants: [],
        winner: null,
      }

      polkadotRaffles.push(raffleData)

      setNewRaffle({
        title: "",
        maxTickets: "",
        ticketPrice: "",
        stakePercent: "",
        feePercent: "",
      })

      setShowCreateRaffleModal(false)
      alert("¡Rifa creada exitosamente!")
    } catch (error) {
      console.error("[v0] Failed to create raffle:", error)
      alert("Error al crear la rifa. Intenta nuevamente.")
    } finally {
      setIsCreatingRaffle(false)
    }
  }

  const closeRaffle = async (raffleId: string) => {
    const raffle = polkadotRaffles.find((r) => r.id === raffleId)
    if (!raffle || raffle.ticketsIssued === 0) {
      alert("No se puede cerrar una rifa sin participantes")
      return
    }

    try {
      // Simulate random winner selection
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate random winner from ticket holders (mock)
      const winnerTicketNumber = Math.floor(Math.random() * raffle.ticketsIssued) + 1
      const mockWinnerAddress = `${Math.random().toString(36).substring(2, 5)}...${Math.random().toString(36).substring(2, 5)}`

      // Update raffle
      const raffleIndex = polkadotRaffles.findIndex((r) => r.id === raffleId)
      if (raffleIndex !== -1) {
        polkadotRaffles[raffleIndex].isActive = false
        polkadotRaffles[raffleIndex].winner = mockWinnerAddress
      }

      setSelectedWinner({ raffle, winner: mockWinnerAddress })
      setShowWinnerModal(true)
    } catch (error) {
      console.error("[v0] Failed to close raffle:", error)
      alert("Error al cerrar la rifa. Intenta nuevamente.")
    }
  }

  const goToDashboard = () => {
    setShowLandingPage(false)
  }

  const goToLandingPage = () => {
    setShowLandingPage(true)
  }

  const soldTickets = raffleNumbers.filter((ticket) => ticket.sold).length
  const availableTickets = 1000 - soldTickets
  const totalRevenue = soldTickets * 1000
  const uniqueBuyers = new Set(raffleNumbers.filter((t) => t.buyer).map((t) => t.buyer)).size

  const stats = [
    {
      title: "Números Vendidos",
      value: soldTickets.toString(),
      change: `${Math.round((soldTickets / 1000) * 100)}%`,
      icon: Ticket,
      color: "text-chart-1",
    },
    {
      title: "Números Disponibles",
      value: availableTickets.toString(),
      change: `${Math.round((availableTickets / 1000) * 100)}%`,
      icon: Hash,
      color: "text-chart-2",
    },
    {
      title: "Usuarios Anónimos",
      value: uniqueBuyers.toString(),
      change: "+12%",
      icon: Users,
      color: "text-chart-3",
    },
    {
      title: "Recaudación Total",
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      change: "+25%",
      icon: DollarSign,
      color: "text-chart-4",
    },
  ]

  const goToRafflesDashboard = () => {
    window.location.href = "/rifas"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {showLandingPage && (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-balance">Rifa Blockchain</h1>
                    <p className="text-xs text-muted-foreground">AVEIT UTN FRC</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={goToRafflesDashboard} className="bg-transparent">
                    Ver Dashboard
                  </Button>
                  {!isConnected ? (
                    <Button
                      onClick={connectWallet}
                      disabled={isConnecting}
                      className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Conectando...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4 mr-2" />
                          Conectar Wallet
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-muted/50 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">{formatAddress(publicKey)}</span>
                        <Button variant="ghost" size="sm" onClick={copyAddress} className="h-6 w-6 p-0 hover:bg-muted">
                          {copied ? <CheckCircle className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={disconnectWallet}
                        className="bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                      >
                        Desconectar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4">
            {/* Hero Section */}
            <section className="py-20 text-center">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent mb-6 text-balance animate-slide-up">
                  Rifa Transparente en Blockchain
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed animate-slide-up">
                  Un proyecto de AVEIT que reemplaza la certificación de Lotería con un sistema descentralizado en
                  Polkadot.
                </p>

                <Button
                  onClick={goToRafflesDashboard}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-up"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Ver Dashboard de Rifas
                </Button>
              </div>
            </section>

            {/* Stake Section */}
            <section className="py-16">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Stake de Garantía</h2>
                  <p className="text-lg text-muted-foreground">Cómo funciona el stake en nuestro sistema de rifas.</p>
                </div>

                <div className="mt-12 max-w-4xl mx-auto">
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 animate-slide-up">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-800">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span>Stake de Garantía</span>
                      </CardTitle>
                      <CardDescription className="text-green-700">
                        El stake funciona como garantía de transparencia, reemplazando el rol de Lotería.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-800">0.91 DOT</div>
                          <div className="text-sm text-green-600">Monto Retenido</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-800">1.8%</div>
                          <div className="text-sm text-green-600">Progreso del Stake</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-800">50 DOT</div>
                          <div className="text-sm text-green-600">Objetivo</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700">Progreso del Stake:</span>
                          <span className="font-semibold text-green-800">0.91 / 50 DOT</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: "1.821%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-white/50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 leading-relaxed">
                          <strong>¿Cómo funciona?</strong> Un porcentaje de cada venta se retiene como stake de
                          garantía. Este fondo asegura la transparencia del proceso y reemplaza la necesidad de una
                          autoridad central como Lotería Nacional. Los fondos se liberan automáticamente al finalizar
                          cada rifa.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 animate-slide-up">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Ticket className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Boletas tokenizadas como NFTs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      Cada boleta es un NFT único en la blockchain de Polkadot, garantizando autenticidad y trazabilidad
                      completa de todas las participaciones.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">Stake como garantía transparente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      Un porcentaje de cada venta se retiene como garantía, eliminando la necesidad de autoridades
                      centrales y asegurando transparencia total.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Sorteo auditable en la blockchain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      La selección del ganador utiliza algoritmos verificables en blockchain, permitiendo que cualquiera
                      pueda auditar el proceso de sorteo.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Additional Info Section */}
            <section className="py-16 bg-muted/30 -mx-4 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-foreground mb-6">¿Por qué blockchain?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  La tecnología blockchain elimina la necesidad de confiar en autoridades centrales. Cada transacción,
                  cada boleta y cada sorteo queda registrado de forma inmutable y verificable por cualquier persona.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-2">Transparencia Total</h3>
                      <p className="text-muted-foreground text-sm">
                        Todos los procesos son públicos y verificables en tiempo real.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-2">Seguridad Garantizada</h3>
                      <p className="text-muted-foreground text-sm">
                        La blockchain de Polkadot protege todas las transacciones y datos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Rifas Section */}
            <section className="py-16">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Rifas Disponibles</h2>
                  <p className="text-lg text-muted-foreground">Participa en rifas transparentes y descentralizadas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {polkadotRaffles.slice(0, 3).map((raffle, index) => (
                    <Card
                      key={raffle.id}
                      className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{raffle.title}</CardTitle>
                          <Badge
                            variant={raffle.isActive ? "secondary" : "default"}
                            className={`${raffle.isActive ? "bg-green-100 text-green-800 animate-pulse-success" : "bg-accent/20"}`}
                          >
                            <Ticket className="w-3 h-3 mr-1" />
                            {raffle.isActive ? "Activa" : "Cerrada"}
                          </Badge>
                        </div>
                        <CardDescription>
                          Organizado por {raffle.organizer}
                          {!raffle.isActive && raffle.winner && (
                            <div className="flex items-center mt-1 text-green-600 animate-pulse-success">
                              <Trophy className="w-3 h-3 mr-1" />
                              Ganador: {raffle.winner}
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Precio por boleta:</span>
                            <span className="font-semibold text-primary">{raffle.ticketPrice} DOT</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Boletas vendidas:</span>
                            <span className="font-semibold">
                              {raffle.ticketsIssued} / {raffle.maxTickets}
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${(raffle.ticketsIssued / raffle.maxTickets) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <Button
                          onClick={() => buyTicket(raffle)}
                          className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          disabled={!isConnected || raffle.ticketsIssued >= raffle.maxTickets || !raffle.isActive}
                        >
                          {!isConnected
                            ? "Conectar Wallet"
                            : !raffle.isActive
                              ? "Cerrada"
                              : raffle.ticketsIssued >= raffle.maxTickets
                                ? "Agotado"
                                : "Comprar Boleta"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button onClick={goToRafflesDashboard} variant="outline" size="lg" className="bg-transparent">
                    Ver Todas las Rifas
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>
      )}
    </div>
  )
}
