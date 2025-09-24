import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { MagnifyingGlass, User, MapPin, UserPlus, Users } from '@phosphor-icons/react'
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
  // Tab state
  const [activeTab, setActiveTab] = useState('search')
  
  // Search state
  const [customerId, setCustomerId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<Customer | null>(null)
  const [error, setError] = useState('')

  // Registration state
  const [newCustomerId, setNewCustomerId] = useState('')
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
      // Clear any previous customer data and show creation message
      setSearchResult(null)
      setError('not-found')
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
    if (!newCustomerId.trim() || !firstName.trim() || !lastName.trim() || !address.trim()) {
      setError('Por favor complete todos los campos obligatorios (ID, Nombre, Apellido y Dirección)')
      return
    }

    const id = parseInt(newCustomerId.trim())
    if (isNaN(id) || id <= 0) {
      setError('El ID debe ser un número válido mayor que 0')
      return
    }

    // Check if ID already exists
    const existingCustomers = customers || []
    const existingCustomer = existingCustomers.find(c => c.id === id)
    if (existingCustomer) {
      setError(`Ya existe un cliente con el ID ${id}. Por favor use un ID diferente.`)
      return
    }

    setIsRegistering(true)
    setError('')

    const newCustomer: Customer = {
      id: id,
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
    setNewCustomerId('')
    setFirstName('')
    setLastName('')
    setAddress('')
    setCity('')
    setState('')
    setZipCode('')
    setCountry('')

    setIsRegistering(false)
    
    toast.success(`Cliente registrado exitosamente con ID: ${id}`)
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <MagnifyingGlass size={16} />
              Buscar Cliente
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus size={16} />
              Registrar Cliente
            </TabsTrigger>
            <TabsTrigger value="view-all" className="flex items-center gap-2">
              <Users size={16} />
              Ver Todos
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

                {error && error !== 'not-found' && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {error === 'not-found' && (
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="space-y-2">
                        <p className="text-orange-800 font-medium">
                          Lamentablemente, el cliente no está en sistema.
                        </p>
                        <p className="text-orange-700">
                          ¿Desea crearlo?
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button 
                          onClick={() => {
                            // Switch to register tab and pre-fill the ID
                            setNewCustomerId(customerId)
                            setError('')
                            setActiveTab('register')
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Sí, crear cliente
                        </Button>
                        <Button 
                          onClick={clearSearch}
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
                <div className="space-y-2">
                  <Label htmlFor="newCustomerId">ID Cliente *</Label>
                  <Input
                    id="newCustomerId"
                    type="number"
                    placeholder="Ingrese ID único del cliente"
                    value={newCustomerId}
                    onChange={(e) => setNewCustomerId(e.target.value)}
                  />
                </div>

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
                  * Campos obligatorios: ID Cliente, Nombre, Apellido y Dirección
                </p>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          <TabsContent value="view-all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-primary" />
                  Todos los Clientes ({(customers || []).length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!customers || customers.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <Users size={48} className="mx-auto text-muted-foreground/50" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-muted-foreground">
                        No hay clientes registrados
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Registre su primer cliente para comenzar
                      </p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('register')}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Registrar Primer Cliente
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customers.map((customer) => (
                      <Card key={customer.id} className="border-l-4 border-l-accent hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User size={16} className="text-accent" />
                                <span className="text-sm font-medium text-muted-foreground">ID: {customer.id}</span>
                              </div>
                              <p className="text-lg font-semibold text-foreground">
                                {customer.firstName} {customer.lastName}
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-accent" />
                                <span className="text-sm font-medium text-muted-foreground">Dirección</span>
                              </div>
                              <div className="text-sm text-foreground">
                                <p className="font-medium">{customer.address}</p>
                                {customer.city && (
                                  <p>{customer.city}, {customer.state} {customer.zipCode}</p>
                                )}
                                <p>{customer.country}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCustomerId(customer.id.toString())
                                  setSearchResult(customer)
                                  setError('')
                                  setActiveTab('search')
                                }}
                                className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
                              >
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App