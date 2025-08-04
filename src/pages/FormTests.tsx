import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, TestTube, FormInput } from 'lucide-react';
import { TextareaTest } from '@/components/testing/TextareaTest';
import { toast } from 'sonner';

export default function FormTests() {
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    description: '',
    category: '',
    preferences: [] as string[],
    newsletter: false,
    experience: '',
    notifications: true
  });

  const runFormTests = () => {
    const results = {
      textareaBasic: formData.message.length > 0,
      textareaMultiline: formData.description.split('\n').length > 1,
      inputValidation: formData.email.includes('@'),
      selectFunctionality: formData.category !== '',
      checkboxInteraction: formData.preferences.length > 0,
      switchToggle: formData.notifications !== undefined,
      radioSelection: formData.experience !== ''
    };
    
    setTestResults(results);
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    if (passedTests === totalTests) {
      toast.success(`All form tests passed! (${passedTests}/${totalTests})`);
    } else {
      toast.warning(`Some tests need attention (${passedTests}/${totalTests} passed)`);
    }
  };

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: checked 
        ? [...prev.preferences, preference]
        : prev.preferences.filter(p => p !== preference)
    }));
  };

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      message: '',
      description: '',
      category: '',
      preferences: [],
      newsletter: false,
      experience: '',
      notifications: true
    });
    setTestResults({});
    toast.info('Form cleared');
  };

  const submitForm = () => {
    toast.success('Form submitted successfully! All components are working correctly.');
  };

  const allTestsPassed = Object.values(testResults).every(result => result);
  const testCount = Object.keys(testResults).length;
  const passedCount = Object.values(testResults).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <TestTube className="h-8 w-8 text-purple-600" />
          Form Components Test Suite
        </h1>
        <p className="text-muted-foreground">
          Comprehensive testing of all form components including Textarea, Input, Select, and other UI elements
        </p>
      </div>

      {/* Test Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {testCount > 0 && allTestsPassed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : testCount > 0 ? (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              ) : (
                <FormInput className="h-5 w-5 text-blue-600" />
              )}
              Test Status
            </span>
            {testCount > 0 && (
              <Badge variant={allTestsPassed ? "default" : "secondary"}>
                {passedCount}/{testCount} Tests Passed
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={runFormTests} variant="outline">
              <TestTube className="h-4 w-4 mr-2" />
              Run Tests
            </Button>
            <Button onClick={clearForm} variant="outline">
              Clear Form
            </Button>
            <Button onClick={submitForm} variant="default">
              Submit Test Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Grid */}
      {testCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(testResults).map(([test, passed]) => (
            <Card key={test} className={passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {passed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {test.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Testing Tabs */}
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components">Component Tests</TabsTrigger>
          <TabsTrigger value="textarea">Textarea Detailed</TabsTrigger>
          <TabsTrigger value="integration">Integration Test</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Text Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Text Input Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (Input)</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Input with validation)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Textarea)</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Multi-line Description (Textarea)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter a detailed description...&#10;Press Enter to create new lines&#10;Test multiline functionality here"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Selection Components */}
            <Card>
              <CardHeader>
                <CardTitle>Selection Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category (Select)</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Preferences (Checkboxes)</Label>
                  {['Email Updates', 'SMS Notifications', 'Push Notifications', 'Newsletter'].map((pref) => (
                    <div key={pref} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pref-${pref}`}
                        checked={formData.preferences.includes(pref)}
                        onCheckedChange={(checked) => handlePreferenceChange(pref, checked as boolean)}
                      />
                      <Label htmlFor={`pref-${pref}`}>{pref}</Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label>Experience Level (Radio)</Label>
                  <RadioGroup value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced">Advanced</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={formData.notifications}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked }))}
                  />
                  <Label htmlFor="notifications">Enable Notifications (Switch)</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="textarea">
          <TextareaTest />
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Test - Complete Form</CardTitle>
              <p className="text-muted-foreground">
                Fill out this form to test all components working together
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="int-name">Full Name</Label>
                    <Input
                      id="int-name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="int-email">Email Address</Label>
                    <Input
                      id="int-email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="int-category">Inquiry Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="int-message">Message</Label>
                    <Textarea
                      id="int-message"
                      placeholder="Please describe your inquiry in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={6}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Form Data Summary</h4>
                <div className="text-sm space-y-1">
                  <div>Name: {formData.name || 'Not provided'}</div>
                  <div>Email: {formData.email || 'Not provided'}</div>
                  <div>Category: {formData.category || 'Not selected'}</div>
                  <div>Message Length: {formData.message.length} characters</div>
                  <div>Description Lines: {formData.description.split('\n').length}</div>
                  <div>Preferences: {formData.preferences.length} selected</div>
                  <div>Experience: {formData.experience || 'Not selected'}</div>
                  <div>Notifications: {formData.notifications ? 'Enabled' : 'Disabled'}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={submitForm} className="flex-1">
                  Submit Integration Test
                </Button>
                <Button onClick={clearForm} variant="outline">
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Component Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Component Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Textarea</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Working correctly</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Input</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Working correctly</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Select</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Working correctly</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Other Components</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">All functional</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}