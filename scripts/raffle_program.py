# Contrato inteligente de rifas para Polkadot usando ink!
# Este es un ejemplo conceptual - ink! usa Rust, no Python

"""
Contrato de Rifas para Polkadot

Este contrato inteligente está diseñado para ser implementado con ink! (Rust)
para crear y gestionar rifas en la blockchain de Polkadot.

Características principales:
- Creación de rifas con parámetros configurables
- Compra de tickets con distribución automática de pagos
- Selección aleatoria de ganadores
- Sistema de stake como garantía de transparencia
"""

# Estructura conceptual del contrato (en Rust sería diferente)
class RaffleContract:
    def __init__(self):
        self.raffles = {}
        self.platform_config = {
            'authority': None,
            'fee_account': None
        }
    
    def initialize_platform(self, authority, fee_account):
        """Inicializa la configuración de la plataforma"""
        self.platform_config['authority'] = authority
        self.platform_config['fee_account'] = fee_account
        print(f"Plataforma inicializada con autoridad: {authority}")
    
    def create_raffle(self, organizer, max_tickets, ticket_price, fee_percent, stake_percent):
        """Crea una nueva rifa"""
        
        # Validaciones
        assert max_tickets > 0 and max_tickets <= 10000, "Max tickets entre 1 y 10,000"
        assert ticket_price >= 1000000000, "Precio mínimo: 0.001 DOT"  # En planck units
        assert fee_percent <= 20, "Fee máximo: 20%"
        assert stake_percent <= 50, "Stake máximo: 50%"
        assert fee_percent + stake_percent <= 70, "Fee + stake máximo: 70%"
        
        raffle_id = f"raffle_{len(self.raffles) + 1}"
        
        # Configurar la rifa
        self.raffles[raffle_id] = {
            'organizer': organizer,
            'max_tickets': max_tickets,
            'ticket_price': ticket_price,
            'fee_percent': fee_percent,
            'stake_percent': stake_percent,
            'tickets_sold': 0,
            'participants': [],
            'winner': None,
            'is_closed': False,
            'total_stake': 0
        }
        
        print(f"Rifa creada por {organizer}")
        print(f"Max tickets: {max_tickets}, Precio: {ticket_price} planck")
        return raffle_id
    
    def buy_ticket(self, raffle_id, buyer):
        """Compra un ticket para la rifa"""
        
        raffle = self.raffles.get(raffle_id)
        assert raffle, "Rifa no encontrada"
        assert not raffle['is_closed'], "La rifa ya está cerrada"
        assert raffle['tickets_sold'] < raffle['max_tickets'], "No quedan tickets disponibles"
        
        # Verificar que el comprador no haya comprado ya un ticket
        assert buyer not in raffle['participants'], "Ya compraste un ticket para esta rifa"
        
        # Agregar al comprador a la lista de participantes
        raffle['participants'].append(buyer)
        raffle['tickets_sold'] += 1
        
        # Calcular distribución del pago
        total_price = raffle['ticket_price']
        fee_amount = (total_price * raffle['fee_percent']) // 100
        stake_amount = (total_price * raffle['stake_percent']) // 100
        organizer_amount = total_price - fee_amount - stake_amount
        
        # El stake se mantiene en el contrato
        raffle['total_stake'] += stake_amount
        
        print(f"Ticket comprado por {buyer}")
        print(f"Tickets vendidos: {raffle['tickets_sold']}/{raffle['max_tickets']}")
        print(f"Distribución - Fee: {fee_amount}, Organizador: {organizer_amount}, Stake: {stake_amount}")
        
        return {
            'ticket_number': raffle['tickets_sold'],
            'raffle_id': raffle_id,
            'buyer': buyer
        }
    
    def close_raffle(self, raffle_id, organizer):
        """Cierra la rifa y selecciona un ganador"""
        
        raffle = self.raffles.get(raffle_id)
        assert raffle, "Rifa no encontrada"
        assert raffle['organizer'] == organizer, "Solo el organizador puede cerrar la rifa"
        assert not raffle['is_closed'], "La rifa ya está cerrada"
        assert raffle['tickets_sold'] > 0, "No se vendieron tickets"
        
        # Simular selección aleatoria (en ink! usarías el randomness del runtime)
        import random
        winner_index = random.randint(0, raffle['tickets_sold'] - 1)
        raffle['winner'] = raffle['participants'][winner_index]
        raffle['is_closed'] = True
        
        print(f"Rifa cerrada!")
        print(f"Ganador seleccionado: {raffle['winner']}")
        print(f"Índice ganador: {winner_index} de {raffle['tickets_sold']} participantes")
        
        return raffle['winner']
    
    def claim_prize(self, raffle_id, winner):
        """Permite al ganador reclamar el premio (stake acumulado)"""
        
        raffle = self.raffles.get(raffle_id)
        assert raffle, "Rifa no encontrada"
        assert raffle['is_closed'], "La rifa debe estar cerrada"
        assert raffle['winner'] == winner, "Solo el ganador puede reclamar el premio"
        assert raffle['total_stake'] > 0, "No hay premio para reclamar"
        
        # Transferir el stake acumulado al ganador
        prize_amount = raffle['total_stake']
        raffle['total_stake'] = 0
        
        print(f"Premio de {prize_amount} planck reclamado por {winner}")
        return prize_amount
    
    def get_raffle_info(self, raffle_id):
        """Obtiene información de la rifa"""
        
        raffle = self.raffles.get(raffle_id)
        if not raffle:
            return None
        
        print(f"=== INFORMACIÓN DE LA RIFA {raffle_id} ===")
        print(f"Organizador: {raffle['organizer']}")
        print(f"Tickets: {raffle['tickets_sold']}/{raffle['max_tickets']}")
        print(f"Precio por ticket: {raffle['ticket_price']} planck")
        print(f"Fee: {raffle['fee_percent']}%")
        print(f"Stake: {raffle['stake_percent']}%")
        print(f"Total stake acumulado: {raffle['total_stake']} planck")
        print(f"Estado: {'Cerrada' if raffle['is_closed'] else 'Abierta'}")
        
        if raffle['is_closed'] and raffle['winner']:
            print(f"Ganador: {raffle['winner']}")
        
        print(f"Participantes:")
        for i, participant in enumerate(raffle['participants']):
            print(f"  {i + 1}. {participant}")
        
        return raffle

# Función de prueba para demostrar el flujo completo
def test_raffle_flow():
    """Función de prueba para demostrar el flujo completo"""
    print("=== PRUEBA DEL SISTEMA DE RIFAS EN POLKADOT ===")
    print("1. Inicializar plataforma")
    print("2. Crear rifa")
    print("3. Comprar tickets")
    print("4. Cerrar rifa y seleccionar ganador")
    print("5. Reclamar premio")
    print("\nEste contrato está diseñado para ser implementado con ink! en Polkadot!")
    
    # Ejemplo de uso
    contract = RaffleContract()
    
    # Inicializar plataforma
    contract.initialize_platform("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty")
    
    # Crear rifa
    raffle_id = contract.create_raffle(
        organizer="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        max_tickets=100,
        ticket_price=100000000000,  # 0.1 DOT en planck
        fee_percent=5,
        stake_percent=10
    )
    
    # Comprar algunos tickets
    contract.buy_ticket(raffle_id, "5DAAnrj7VLVnzFBFxwenLiRXwI4VooDHBtjmHdBXZY6VjCq")
    contract.buy_ticket(raffle_id, "5HGjWAeFN4r1AT2WREkuDWdcAiUo4gKWiWCwqSvp6FeRUdNw")
    
    # Cerrar rifa
    winner = contract.close_raffle(raffle_id, "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
    
    # Reclamar premio
    contract.claim_prize(raffle_id, winner)
    
    # Ver información final
    contract.get_raffle_info(raffle_id)

if __name__ == "__main__":
    test_raffle_flow()
