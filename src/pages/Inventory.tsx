import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Filter, Car, Fuel, Settings, Eye } from 'lucide-react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  color: string;
  mileage: number;
  price: number;
  status: string;
  fuel_type: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  images: string[];
  created_at: string;
}

const Inventory = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch vehicles",
          variant: "destructive",
        });
        return;
      }

      setVehicles(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'sold':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'reserved':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'in_service':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'needs_repair':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const canManageInventory = profile?.role === 'super_admin' || 
                            profile?.role === 'manager' || 
                            profile?.role === 'inventory';

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Vehicle Inventory</h1>
            <p className="text-muted-foreground">
              Manage your dealership's vehicle stock
            </p>
          </div>
          {canManageInventory && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by make, model, or VIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="in_service">In Service</SelectItem>
                    <SelectItem value="needs_repair">Needs Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Vehicles</p>
                  <p className="text-2xl font-bold">{vehicles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold">
                    {vehicles.filter(v => v.status === 'available').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sold</p>
                  <p className="text-2xl font-bold">
                    {vehicles.filter(v => v.status === 'sold').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reserved</p>
                  <p className="text-2xl font-bold">
                    {vehicles.filter(v => v.status === 'reserved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length === 0 ? (
          <Card className="card-elevated">
            <CardContent className="p-12 text-center">
              <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Add your first vehicle to get started'
                }
              </p>
              {canManageInventory && (!searchTerm && statusFilter === 'all') && (
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Vehicle
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="card-elevated hover-scale overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
                    <Car className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <Badge 
                    className={`absolute top-3 left-3 ${getStatusColor(vehicle.status)}`}
                  >
                    {vehicle.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">VIN: {vehicle.vin}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Settings className="w-3 h-3 text-muted-foreground" />
                        <span>{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-muted-foreground" />
                        <span>{vehicle.fuel_type}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          ${vehicle.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.mileage.toLocaleString()} miles
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Inventory;