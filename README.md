# RaffleProgram - Contrato de Rifas para Polkadot

Este es un contrato inteligente desarrollado con ink! para crear y gestionar rifas en la blockchain de Polkadot.

## Características

### 1. Creación de Rifas
- **max_tickets**: Número máximo de tickets disponibles
- **ticket_price**: Precio de cada ticket en lamports
- **fee_percent**: Porcentaje que va a la plataforma
- **stake_percent**: Porcentaje que se acumula como premio
- **organizer**: Cuenta pública del organizador

### 2. Compra de Tickets
- Valida disponibilidad de tickets
- Previene compras duplicadas por usuario
- Distribuye automáticamente los pagos:
  - Fee → Cuenta de la plataforma
  - Stake → Se acumula en el contrato
  - Resto → Organizador

### 3. Cierre de Rifa
- Usa blockhash reciente como fuente de aleatoriedad
- Selecciona ganador de forma pseudoaleatoria
- Marca la rifa como cerrada

### 4. Funciones Adicionales
- **claim_prize**: Permite al ganador reclamar el premio
- **get_raffle_info**: Muestra información completa de la rifa

## Instrucciones Disponibles

1. `initialize_platform` - Configura la plataforma
2. `create_raffle` - Crea una nueva rifa
3. `buy_ticket` - Compra un ticket
4. `close_raffle` - Cierra la rifa y selecciona ganador
5. `claim_prize` - Reclama el premio
6. `get_raffle_info` - Obtiene información de la rifa

## Compilación

Para compilar este contrato con ink!:

\`\`\`bash
cargo contract build
\`\`\`

## Despliegue

\`\`\`bash
cargo contract deploy
\`\`\`

## Seguridad

- Validaciones completas en todas las instrucciones
- Prevención de compras duplicadas
- Solo el organizador puede cerrar la rifa
- Solo el ganador puede reclamar el premio

## Notas Técnicas

- Usa Array[Pubkey, 1000] para almacenar hasta 1000 participantes
- Implementa distribución automática de pagos
- Utiliza blockhash como fuente de aleatoriedad (pseudoaleatoria)
- Maneja estados de rifa (abierta/cerrada)
