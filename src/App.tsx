import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { MagnifyingGlass, User, MapPin, UserPlus } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

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
  // Search state
  const [customerId, setCustomerId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<Customer | null>(null)
  const [error, setError] = useState('')

  // Registration state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registeredCustomer, setRegisteredCustomer] = useState<Customer | null>(null)

  const [customers, setCustomers] = useKV<Customer[]>('customers', [])

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

  const handleRegisterCustomer = async () => {
    if (!firstName.trim() || !lastName.trim() || !address.trim()) {
      setError('Por favor complete todos los campos obligatorios')
      return
    }

    setIsRegistering(true)
    setError('')

    // Generate new ID (highest existing ID + 1)
    const existingCustomers = customers || []
    const newId = existingCustomers.length > 0 
      ? Math.max(...existingCustomers.map(c => c.id)) + 1 
      : 1

    const newCustomer: Customer = {
      id: newId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: country.trim() || 'México'
    }

    // Add to customers array
    setCustomers(currentCustomers => [...(currentCustomers || []), newCustomer])

    // Show registered customer info
    setRegisteredCustomer(newCustomer)

    // Clear form
    setFirstName('')
    setLastName('')
    setAddress('')
    setCity('')
    setState('')
    setZipCode('')
    setCountry('')

    setIsRegistering(false)
    
    toast.success(`Cliente registrado exitosamente con ID: ${newId}`)
  }

  const clearRegistration = () => {
    setRegisteredCustomer(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Sistema de Gestión de Clientes
          </h1>
          <p className="text-muted-foreground">
            Registre nuevos clientes o busque información existente
          </p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <MagnifyingGlass size={16} />
              Buscar Cliente
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus size={16} />
              Registrar Cliente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            {registeredCustomer && (
              <Card className="animate-in fade-in duration-300 border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <User className="text-green-600" />
                    ¡Cliente Registrado Exitosamente!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-green-700">ID del Cliente Asignado:</p>
                      <p className="text-3xl font-bold text-green-800">{registeredCustomer.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-green-700">
                          Nombre Completo
                        </label>
                        <p className="text-base font-semibold text-green-800">
                          {registeredCustomer.firstName} {registeredCustomer.lastName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-green-700 flex items-center gap-1">
                        <MapPin size={16} />
                        Dirección Registrada
                      </label>
                      <div className="bg-green-100 p-3 rounded-md space-y-1 border border-green-200">
                        <p className="font-medium text-green-800">{registeredCustomer.address}</p>
                        {registeredCustomer.city && (
                          <p className="text-green-700">{registeredCustomer.city}, {registeredCustomer.state} {registeredCustomer.zipCode}</p>
                        )}
                        <p className="text-green-700">{registeredCustomer.country}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={clearRegistration}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Registrar Otro Cliente
                  </Button>
                </CardContent>
              </Card>
            )}

            {!registeredCustomer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="text-primary" />
                    Registrar Nuevo Cliente
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      placeholder="Nombre"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      placeholder="Apellido"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    placeholder="Calle y número"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      placeholder="Ciudad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      placeholder="Estado"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input
                      id="zipCode"
                      placeholder="CP"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    placeholder="País (por defecto: México)"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleRegisterCustomer}
                  disabled={isRegistering}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isRegistering ? 'Registrando...' : 'Registrar Cliente'}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  * Campos obligatorios
                </p>
              </CardContent>
            </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App