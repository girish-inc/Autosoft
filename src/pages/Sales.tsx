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
import { Search, Plus, Filter, DollarSign, TrendingUp, Calendar, FileText } from 'lucide-react';

interface Sale {
  id: string;
  customer_id: string;
  vehicle_id: string;
  salesperson_id: string;
  sale_price: number;
  down_payment: number;
  status: string;
  sale_date: string;
  commission_amount: number;
  notes: string;
  customers: {
    first_name: string;
    last_name: string;
    email: string;
  };
  vehicles: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

const Sales = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers:customer_id (first_name, last_name, email),
          vehicles:vehicle_id (make, model, year, vin),
          profiles:salesperson_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch sales data",
          variant: "destructive",
        });
        return;
      }

      setSales(data || []);
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
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'approved':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = searchTerm === '' || 
      sale.customers?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customers?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.vehicles?.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.vehicles?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.vehicles?.vin?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const canManageSales = profile?.role === 'super_admin' || 
                        profile?.role === 'manager' || 
                        profile?.role === 'sales';

  // Calculate stats
  const totalSales = sales.length;
  const completedSales = sales.filter(s => s.status === 'completed').length;
  const pendingSales = sales.filter(s => s.status === 'pending').length;
  const totalRevenue = sales
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.sale_price, 0);

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
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
            <h1 className="text-3xl font-bold">Sales Tracking</h1>
            <p className="text-muted-foreground">
              Monitor and manage your dealership sales
            </p>
          </div>
          {canManageSales && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Sale
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{totalSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by customer, vehicle, or VIN..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales List */}
        {filteredSales.length === 0 ? (
          <Card className="card-elevated">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sales found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first sale to get started'
                }
              </p>
              {canManageSales && (!searchTerm && statusFilter === 'all') && (
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Sale
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSales.map((sale) => (
              <Card key={sale.id} className="card-elevated hover-scale">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {sale.vehicles?.year} {sale.vehicles?.make} {sale.vehicles?.model}
                        </h3>
                        <Badge className={getStatusColor(sale.status)}>
                          {sale.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium">
                            {sale.customers?.first_name} {sale.customers?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {sale.customers?.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Salesperson</p>
                          <p className="font-medium">
                            {sale.profiles?.first_name} {sale.profiles?.last_name || 'Unassigned'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sale Date</p>
                          <p className="font-medium">
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {sale.notes && (
                        <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                          {sale.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ${sale.sale_price.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Down: ${sale.down_payment.toLocaleString()}
                        </p>
                        {sale.commission_amount > 0 && (
                          <p className="text-xs text-green-600">
                            Commission: ${sale.commission_amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
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

export default Sales;