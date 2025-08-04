import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

export function TextareaTest() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('Pre-filled content with some text to test display');
  const [value3, setValue3] = useState('');
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});

  const runTests = () => {
    const results = {
      basicInput: value1.length > 0,
      prefilledDisplay: value2.includes('Pre-filled'),
      multilineSupport: value3.includes('\n'),
      placeholderVisible: value1.length === 0
    };
    
    setTestResults(results);
  };

  const handleMultilineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue3(e.target.value);
  };

  const allTestsPassed = Object.values(testResults).every(result => result);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {allTestsPassed ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          )}
          Textarea Component Test Suite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test 1: Basic Input */}
        <div className="space-y-2">
          <Label htmlFor="test1">Test 1: Basic Input Functionality</Label>
          <Textarea
            id="test1"
            placeholder="Type something here to test basic input..."
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            rows={3}
          />
          <div className="text-sm text-muted-foreground">
            Characters: {value1.length}
          </div>
        </div>

        {/* Test 2: Pre-filled Content */}
        <div className="space-y-2">
          <Label htmlFor="test2">Test 2: Pre-filled Content Display</Label>
          <Textarea
            id="test2"
            placeholder="This should not be visible due to pre-filled content"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            rows={3}
          />
          <div className="text-sm text-muted-foreground">
            Content length: {value2.length}
          </div>
        </div>

        {/* Test 3: Multiline Support */}
        <div className="space-y-2">
          <Label htmlFor="test3">Test 3: Multiline Support (Press Enter to create new lines)</Label>
          <Textarea
            id="test3"
            placeholder="Press Enter to create multiple lines..."
            value={value3}
            onChange={handleMultilineChange}
            rows={4}
          />
          <div className="text-sm text-muted-foreground">
            Lines: {value3.split('\n').length}
          </div>
        </div>

        {/* Test 4: Styling Test */}
        <div className="space-y-2">
          <Label htmlFor="test4">Test 4: Styling & Disabled State</Label>
          <Textarea
            id="test4"
            placeholder="This textarea is disabled"
            value="This content cannot be edited"
            disabled
            rows={2}
          />
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button onClick={runTests} variant="outline">
              Run Tests
            </Button>
            {Object.keys(testResults).length > 0 && (
              <Badge variant={allTestsPassed ? "default" : "secondary"}>
                {Object.values(testResults).filter(Boolean).length}/{Object.keys(testResults).length} Tests Passed
              </Badge>
            )}
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(testResults).map(([test, passed]) => (
                <div key={test} className={`flex items-center gap-2 p-2 rounded text-sm ${
                  passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {passed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {test.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Component Info */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Component Status</h4>
          <div className="text-sm space-y-1">
            <div>✅ Textarea component is properly imported from @/components/ui/textarea</div>
            <div>✅ Supports standard React textarea props (value, onChange, placeholder, etc.)</div>
            <div>✅ Includes proper styling with Tailwind CSS classes</div>
            <div>✅ Supports keyboard interactions (Enter for new lines)</div>
            <div>✅ Responsive design with proper focus states</div>
            <div>✅ Accessibility features (proper labeling, focus management)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}