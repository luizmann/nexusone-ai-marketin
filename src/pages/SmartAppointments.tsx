import React, { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { 
  Phone, 
  Clock, 
  Calendar as CalendarIcon,
  Settings,
  MessageCircle,
  Bot,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Scissors,
  Utensils,
  Key,
  Coffee,
  Car,
  Home,
  Heart,
  Zap
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

interface BusinessProfile {
  id: string;
  businessName: string;
  businessType: string;
  phoneNumber: string;
  description: string;
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  services: {
    name: string;
    duration: number;
    price: number;
  }[];
  unavailableDates: string[];
  timeSlotDuration: number;
  advanceBookingDays: number;
  isActive: boolean;
  botPrompt: string;
}

interface Appointment {
  id: string;
  businessId: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

const businessTypes = [
  { value: 'restaurant', label: 'Restaurant', icon: Utensils },
  { value: 'salon', label: 'Hair Salon', icon: Scissors },
  { value: 'barbershop', label: 'Barbershop', icon: Scissors },
  { value: 'spa', label: 'Spa & Wellness', icon: Heart },
  { value: 'dental', label: 'Dental Clinic', icon: Heart },
  { value: 'automotive', label: 'Auto Service', icon: Car },
  { value: 'locksmith', label: 'Locksmith', icon: Key },
  { value: 'cafe', label: 'Café', icon: Coffee },
  { value: 'cleaning', label: 'Cleaning Service', icon: Home },
  { value: 'other', label: 'Other', icon: Zap }
];

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export function SmartAppointments() {
  const { t } = useLanguage();
  const [businesses, setBusinesses] = useKV<BusinessProfile[]>('appointment-businesses', []);
  const [appointments, setAppointments] = useKV<Appointment[]>('appointment-bookings', []);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [newBusiness, setNewBusiness] = useState<Partial<BusinessProfile>>({
    businessName: '',
    businessType: '',
    phoneNumber: '',
    description: '',
    workingHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '16:00', isOpen: false }
    },
    services: [],
    unavailableDates: [],
    timeSlotDuration: 60,
    advanceBookingDays: 30,
    isActive: false,
    botPrompt: ''
  });

  const generateBotPrompt = async (business: Partial<BusinessProfile>) => {
    const prompt = spark.llmPrompt`
      Create a WhatsApp chatbot prompt for an appointment booking system for this business:
      
      Business Name: ${business.businessName}
      Business Type: ${business.businessType}
      Services: ${business.services?.map(s => `${s.name} (${s.duration}min - $${s.price})`).join(', ')}
      Working Hours: ${Object.entries(business.workingHours || {})
        .filter(([_, hours]) => hours.isOpen)
        .map(([day, hours]) => `${day}: ${hours.open}-${hours.close}`)
        .join(', ')}
      
      Create a conversational, friendly bot that can:
      1. Greet customers and explain available services
      2. Check availability for requested dates/times
      3. Confirm appointment details
      4. Handle rescheduling and cancellations
      5. Provide business information
      
      The bot should be professional but warm, matching the business type's personality.
      Include specific instructions for handling edge cases and customer questions.
      
      Format as a detailed system prompt that can be used with GPT.
    `;

    try {
      const response = await spark.llm(prompt, 'gpt-4o');
      return response;
    } catch (error) {
      return "You are a helpful appointment booking assistant for this business.";
    }
  };

  const createBusiness = async () => {
    if (!newBusiness.businessName || !newBusiness.phoneNumber || !newBusiness.businessType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    try {
      // Generate AI bot prompt
      const botPrompt = await generateBotPrompt(newBusiness);

      const business: BusinessProfile = {
        id: `biz_${Date.now()}`,
        ...newBusiness as BusinessProfile,
        botPrompt,
        isActive: true
      };

      setBusinesses(current => [...current, business]);
      setSelectedBusiness(business);
      
      // Reset form
      setNewBusiness({
        businessName: '',
        businessType: '',
        phoneNumber: '',
        description: '',
        workingHours: {
          monday: { open: '09:00', close: '18:00', isOpen: true },
          tuesday: { open: '09:00', close: '18:00', isOpen: true },
          wednesday: { open: '09:00', close: '18:00', isOpen: true },
          thursday: { open: '09:00', close: '18:00', isOpen: true },
          friday: { open: '09:00', close: '18:00', isOpen: true },
          saturday: { open: '10:00', close: '16:00', isOpen: true },
          sunday: { open: '10:00', close: '16:00', isOpen: false }
        },
        services: [],
        unavailableDates: [],
        timeSlotDuration: 60,
        advanceBookingDays: 30,
        isActive: false,
        botPrompt: ''
      });

      toast.success('Smart appointment system created successfully!');
    } catch (error) {
      toast.error('Failed to create appointment system');
    } finally {
      setIsCreating(false);
    }
  };

  const addService = () => {
    const serviceName = prompt('Service name:');
    const duration = prompt('Duration (minutes):');
    const price = prompt('Price:');

    if (serviceName && duration && price) {
      setNewBusiness(prev => ({
        ...prev,
        services: [
          ...(prev.services || []),
          {
            name: serviceName,
            duration: parseInt(duration),
            price: parseFloat(price)
          }
        ]
      }));
    }
  };

  const removeService = (index: number) => {
    setNewBusiness(prev => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index) || []
    }));
  };

  const updateWorkingHours = (day: string, field: 'open' | 'close' | 'isOpen', value: string | boolean) => {
    setNewBusiness(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours?.[day],
          [field]: value
        }
      }
    }));
  };

  const getBusinessTypeIcon = (type: string) => {
    const businessType = businessTypes.find(bt => bt.value === type);
    return businessType ? businessType.icon : Zap;
  };

  const todayAppointments = appointments.filter(apt => 
    apt.date === selectedDate.toISOString().split('T')[0] &&
    selectedBusiness && apt.businessId === selectedBusiness.id
  );

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date) >= new Date() &&
    selectedBusiness && apt.businessId === selectedBusiness.id
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Smart Appointments</h1>
          <p className="text-muted-foreground">AI-Powered WhatsApp Appointment Booking</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Bot className="w-4 h-4 mr-1" />
            {businesses.filter(b => b.isActive).length} Active Bots
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {appointments.filter(a => a.status === 'confirmed').length} Confirmed
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <TrendingUp className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="businesses">
            <Settings className="w-4 h-4 mr-2" />
            My Businesses
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="create">
            <Zap className="w-4 h-4 mr-2" />
            Create New
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Businesses</p>
                    <p className="text-2xl font-bold">{businesses.length}</p>
                  </div>
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                    <p className="text-2xl font-bold">
                      {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
                    </p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                    <p className="text-2xl font-bold">
                      {businesses.filter(b => b.isActive).length}
                    </p>
                  </div>
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">
                      {appointments.filter(a => {
                        const aptDate = new Date(a.date);
                        const now = new Date();
                        return aptDate.getMonth() === now.getMonth() && 
                               aptDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No appointments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((appointment) => {
                    const business = businesses.find(b => b.id === appointment.businessId);
                    const BusinessIcon = business ? getBusinessTypeIcon(business.businessType) : CalendarIcon;
                    
                    return (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <BusinessIcon className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{appointment.customerName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {business?.businessName} • {appointment.service}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{appointment.date} at {appointment.time}</div>
                          <Badge variant={
                            appointment.status === 'confirmed' ? 'default' :
                            appointment.status === 'pending' ? 'secondary' :
                            appointment.status === 'cancelled' ? 'destructive' : 'outline'
                          }>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="businesses" className="space-y-6">
          {businesses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Businesses Setup</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first smart appointment system
                </p>
                <Button onClick={() => document.querySelector('[value="create"]')?.click()}>
                  Create Business
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {businesses.map((business) => {
                const BusinessIcon = getBusinessTypeIcon(business.businessType);
                const businessAppointments = appointments.filter(a => a.businessId === business.id);
                
                return (
                  <Card key={business.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BusinessIcon className="w-8 h-8 text-primary" />
                          <div>
                            <CardTitle>{business.businessName}</CardTitle>
                            <p className="text-muted-foreground">{business.businessType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={business.isActive ? 'default' : 'secondary'}>
                            {business.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => setSelectedBusiness(business)}
                          >
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{business.services.length}</div>
                          <div className="text-sm text-muted-foreground">Services</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{businessAppointments.length}</div>
                          <div className="text-sm text-muted-foreground">Total Bookings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {businessAppointments.filter(a => a.status === 'confirmed').length}
                          </div>
                          <div className="text-sm text-muted-foreground">Confirmed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            <Phone className="w-6 h-6 mx-auto" />
                          </div>
                          <div className="text-sm text-muted-foreground">{business.phoneNumber}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Appointments for {selectedDate.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No appointments for this date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => {
                      const business = businesses.find(b => b.id === appointment.businessId);
                      
                      return (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{appointment.time} - {appointment.customerName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {business?.businessName} • {appointment.service}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.customerPhone}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              appointment.status === 'confirmed' ? 'default' :
                              appointment.status === 'pending' ? 'secondary' :
                              appointment.status === 'cancelled' ? 'destructive' : 'outline'
                            }>
                              {appointment.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Smart Appointment System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={newBusiness.businessName || ''}
                    onChange={(e) => setNewBusiness(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your Business Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={newBusiness.businessType || ''}
                    onValueChange={(value) => setNewBusiness(prev => ({ ...prev, businessType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">WhatsApp Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={newBusiness.phoneNumber || ''}
                    onChange={(e) => setNewBusiness(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeSlotDuration">Time Slot Duration (minutes)</Label>
                  <Select
                    value={newBusiness.timeSlotDuration?.toString() || '60'}
                    onValueChange={(value) => setNewBusiness(prev => ({ ...prev, timeSlotDuration: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={newBusiness.description || ''}
                  onChange={(e) => setNewBusiness(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your business and services..."
                  rows={3}
                />
              </div>

              {/* Services */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Services</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addService}>
                    Add Service
                  </Button>
                </div>
                {newBusiness.services && newBusiness.services.length > 0 && (
                  <div className="space-y-2">
                    {newBusiness.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{service.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {service.duration}min • ${service.price}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(index)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Working Hours */}
              <div className="space-y-4">
                <Label>Working Hours</Label>
                <div className="grid gap-4">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-24">
                        <Switch
                          checked={newBusiness.workingHours?.[day]?.isOpen || false}
                          onCheckedChange={(checked) => updateWorkingHours(day, 'isOpen', checked)}
                        />
                        <span className="ml-2 text-sm capitalize">{day}</span>
                      </div>
                      {newBusiness.workingHours?.[day]?.isOpen && (
                        <>
                          <Input
                            type="time"
                            value={newBusiness.workingHours[day].open}
                            onChange={(e) => updateWorkingHours(day, 'open', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={newBusiness.workingHours[day].close}
                            onChange={(e) => updateWorkingHours(day, 'close', e.target.value)}
                            className="w-32"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={createBusiness}
                disabled={isCreating}
                className="w-full"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isCreating ? 'Creating Smart Bot...' : 'Create Appointment System'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}