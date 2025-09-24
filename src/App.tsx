import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MagnifyingGlass, User, MapPin } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface Customer {
  id: number
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

function App() {
  const [customerId, setCustomerId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<Customer | null>(null)
  const [error, setError] = useState('')

  const [customers] = useKV<Customer[]>('customers', [])

  const handleSearch = async () => {
    if (!customerId.trim()) {
      setError('Por favor ingrese un ID de cliente')
      return
    }

    const id = parseInt(customerId)
    if (isNaN(id)) {
      setError('El ID debe ser un número válido')
      return
    }

    setIsSearching(true)
    setError('')
    setSearchResult(null)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const customer = (customers || []).find(c => c.id === id)
    
    if (customer) {
      setSearchResult(customer)
    } else {
      setError('Cliente no encontrado. Verifique el ID e intente nuevamente.')
    }

    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setCustomerId('')
    setSearchResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Búsqueda de Clientes
          </h1>
          <p className="text-muted-foreground">
            Ingrese el ID del cliente para obtener su información completa
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MagnifyingGlass className="text-primary" />
              Buscar Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                id="customer-id"
                type="number"
                placeholder="Ingrese ID del cliente"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6"
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {searchResult && (
          <Card className="animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-accent" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    ID Cliente
                  </label>
                  <p className="text-base font-semibold">{searchResult.id}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Nombre Completo
                  </label>
                  <p className="text-base font-semibold">
                    {searchResult.firstName} {searchResult.lastName}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin size={16} />
                  Dirección Completa
                </label>
                <div className="bg-muted/50 p-3 rounded-md space-y-1">
                  <p className="font-medium">{searchResult.address}</p>
                  <p>{searchResult.city}, {searchResult.state} {searchResult.zipCode}</p>
                  <p>{searchResult.country}</p>
                </div>
              </div>

              <Button 
                onClick={clearSearch}
                variant="outline"
                className="w-full"
              >
                Nueva Búsqueda
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App