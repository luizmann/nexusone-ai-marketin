// 🔧 NexusOne AI - Real-time API Health Monitor
// Monitors all API endpoints and provides live status updates

const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const API_TIMEOUT = 10000; // 10 seconds

class APIHealthMonitor {
    constructor() {
        this.apis = [];
        this.status = {};
        this.listeners = [];
        this.isRunning = false;
        this.checkCount = 0;
        
        this.loadEnvironmentConfig();
        this.initializeAPIs();
    }

    loadEnvironmentConfig() {
        // Load environment variables (client-side safe ones)
        this.config = {
            supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
            apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
            appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
        };
    }

    initializeAPIs() {
        this.apis = [
            {
                id: 'supabase',
                name: 'Supabase Database',
                endpoint: `${this.config.supabaseUrl}/rest/v1/`,
                method: 'GET',
                critical: true,
                timeout: 5000,
                headers: {},
                expectedStatus: [200, 401], // 401 is OK for auth check
                description: 'Core database and authentication service'
            },
            {
                id: 'supabase-auth',
                name: 'Supabase Auth',
                endpoint: `${this.config.supabaseUrl}/auth/v1/health`,
                method: 'GET',
                critical: true,
                timeout: 5000,
                headers: {},
                expectedStatus: [200],
                description: 'User authentication service'
            },
            {
                id: 'edge-functions',
                name: 'Edge Functions',
                endpoint: `${this.config.apiBaseUrl}/health`,
                method: 'GET',
                critical: false,
                timeout: 8000,
                headers: {},
                expectedStatus: [200, 404], // 404 is OK if health endpoint not implemented
                description: 'Serverless API functions'
            },
            {
                id: 'openai-health',
                name: 'OpenAI Service',
                endpoint: 'https://status.openai.com/api/v2/status.json',
                method: 'GET',
                critical: true,
                timeout: 8000,
                headers: {},
                expectedStatus: [200],
                description: 'AI content generation service'
            },
            {
                id: 'elevenlabs-health',
                name: 'ElevenLabs Service',
                endpoint: 'https://api.elevenlabs.io/v1/voices',
                method: 'HEAD', // Use HEAD to avoid authentication issues
                critical: false,
                timeout: 8000,
                headers: {},
                expectedStatus: [200, 401, 403], // Auth errors are OK for health check
                description: 'Text-to-speech service'
            },
            {
                id: 'replicate-health',
                name: 'Replicate Service',
                endpoint: 'https://api.replicate.com/v1/models',
                method: 'HEAD',
                critical: false,
                timeout: 8000,
                headers: {},
                expectedStatus: [200, 401, 403],
                description: 'Image generation service'
            },
            {
                id: 'luma-health',
                name: 'Luma AI Service',
                endpoint: 'https://api.lumalabs.ai/ping',
                method: 'GET',
                critical: false,
                timeout: 10000,
                headers: {},
                expectedStatus: [200, 401, 403, 404],
                description: 'Video generation service'
            },
            {
                id: 'gupshup-health',
                name: 'Gupshup WhatsApp',
                endpoint: 'https://api.gupshup.io/sm/api/v1/app',
                method: 'HEAD',
                critical: false,
                timeout: 8000,
                headers: {},
                expectedStatus: [200, 401, 403],
                description: 'WhatsApp Business messaging'
            },
            {
                id: 'facebook-health',
                name: 'Facebook API',
                endpoint: 'https://graph.facebook.com/v18.0/',
                method: 'GET',
                critical: false,
                timeout: 8000,
                headers: {},
                expectedStatus: [200, 400, 401], // 400 is OK for health check
                description: 'Facebook Marketing API'
            },
            {
                id: 'unsplash-health',
                name: 'Unsplash API',
                endpoint: 'https://api.unsplash.com/',
                method: 'GET',
                critical: false,
                timeout: 8000,
                headers: {},
                expectedStatus: [200, 401, 403],
                description: 'Stock photo service'
            }
        ];

        // Initialize status
        this.apis.forEach(api => {
            this.status[api.id] = {
                status: 'unknown',
                lastCheck: null,
                responseTime: null,
                error: null,
                uptime: 0,
                consecutiveFailures: 0
            };
        });
    }

    async checkAPI(api) {
        const startTime = Date.now();
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), api.timeout);

            const response = await fetch(api.endpoint, {
                method: api.method,
                headers: api.headers,
                signal: controller.signal,
                mode: 'cors'
            });

            clearTimeout(timeoutId);
            const responseTime = Date.now() - startTime;

            const isHealthy = api.expectedStatus.includes(response.status);
            
            return {
                status: isHealthy ? 'healthy' : 'unhealthy',
                responseTime,
                statusCode: response.status,
                error: isHealthy ? null : `HTTP ${response.status}`
            };

        } catch (error) {
            const responseTime = Date.now() - startTime;
            
            if (error.name === 'AbortError') {
                return {
                    status: 'timeout',
                    responseTime,
                    statusCode: null,
                    error: 'Request timeout'
                };
            }

            return {
                status: 'error',
                responseTime,
                statusCode: null,
                error: error.message
            };
        }
    }

    async runHealthCheck() {
        this.checkCount++;
        console.log(`🔍 Running health check #${this.checkCount}`);

        const promises = this.apis.map(async (api) => {
            const result = await this.checkAPI(api);
            
            // Update status
            const previousStatus = this.status[api.id].status;
            this.status[api.id] = {
                ...this.status[api.id],
                ...result,
                lastCheck: new Date(),
                consecutiveFailures: result.status === 'healthy' ? 0 : this.status[api.id].consecutiveFailures + 1
            };

            // Calculate uptime (simplified)
            if (result.status === 'healthy') {
                this.status[api.id].uptime = Math.min(100, this.status[api.id].uptime + 1);
            } else {
                this.status[api.id].uptime = Math.max(0, this.status[api.id].uptime - 2);
            }

            // Log status changes
            if (previousStatus !== result.status) {
                console.log(`📊 ${api.name}: ${previousStatus} → ${result.status}`);
            }

            return { api, result };
        });

        const results = await Promise.all(promises);
        
        // Notify listeners
        this.notifyListeners(results);

        return results;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        console.log('🚀 Starting API health monitoring...');
        
        // Run initial check
        this.runHealthCheck();
        
        // Set up periodic checks
        this.intervalId = setInterval(() => {
            this.runHealthCheck();
        }, HEALTH_CHECK_INTERVAL);
    }

    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        console.log('⏹️ Stopping API health monitoring...');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    getStatus() {
        return {
            apis: this.apis.map(api => ({
                ...api,
                ...this.status[api.id]
            })),
            summary: this.getSummary(),
            lastUpdate: new Date(),
            isRunning: this.isRunning
        };
    }

    getSummary() {
        const total = this.apis.length;
        const healthy = Object.values(this.status).filter(s => s.status === 'healthy').length;
        const critical = this.apis.filter(api => api.critical);
        const criticalHealthy = critical.filter(api => this.status[api.id].status === 'healthy').length;

        return {
            total,
            healthy,
            unhealthy: total - healthy,
            healthPercentage: Math.round((healthy / total) * 100),
            criticalHealthy: criticalHealthy,
            criticalTotal: critical.length,
            criticalHealthPercentage: Math.round((criticalHealthy / critical.length) * 100),
            overallStatus: criticalHealthy === critical.length ? 'operational' : 'degraded'
        };
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    notifyListeners(results) {
        const status = this.getStatus();
        this.listeners.forEach(callback => {
            try {
                callback(status, results);
            } catch (error) {
                console.error('Error in health monitor listener:', error);
            }
        });
    }

    // Export health data
    exportHealthData() {
        return {
            timestamp: new Date().toISOString(),
            config: this.config,
            status: this.getStatus(),
            checkCount: this.checkCount,
            uptime: this.isRunning ? Date.now() - this.startTime : 0
        };
    }

    // Generate health report
    generateReport() {
        const status = this.getStatus();
        const summary = status.summary;
        
        let report = `# 🔍 NexusOne AI - API Health Report\n\n`;
        report += `Generated: ${new Date().toLocaleString()}\n`;
        report += `Check #: ${this.checkCount}\n\n`;
        
        report += `## 📊 Summary\n`;
        report += `- **Overall Status**: ${summary.overallStatus.toUpperCase()}\n`;
        report += `- **Health Percentage**: ${summary.healthPercentage}%\n`;
        report += `- **Critical Services**: ${summary.criticalHealthy}/${summary.criticalTotal} healthy\n`;
        report += `- **Total Services**: ${summary.healthy}/${summary.total} healthy\n\n`;
        
        report += `## 🔌 Service Details\n\n`;
        
        status.apis.forEach(api => {
            const icon = api.status === 'healthy' ? '✅' : 
                        api.status === 'timeout' ? '⏱️' : 
                        api.status === 'error' ? '❌' : '❓';
            
            report += `### ${icon} ${api.name}\n`;
            report += `- **Status**: ${api.status}\n`;
            report += `- **Critical**: ${api.critical ? 'Yes' : 'No'}\n`;
            if (api.responseTime) {
                report += `- **Response Time**: ${api.responseTime}ms\n`;
            }
            if (api.error) {
                report += `- **Error**: ${api.error}\n`;
            }
            if (api.lastCheck) {
                report += `- **Last Check**: ${new Date(api.lastCheck).toLocaleString()}\n`;
            }
            report += `- **Description**: ${api.description}\n\n`;
        });
        
        return report;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIHealthMonitor;
} else if (typeof window !== 'undefined') {
    window.APIHealthMonitor = APIHealthMonitor;
}

// Auto-start if in browser environment
if (typeof window !== 'undefined') {
    // Create global instance
    window.healthMonitor = new APIHealthMonitor();
    
    // Start monitoring when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.healthMonitor.start();
        });
    } else {
        window.healthMonitor.start();
    }
    
    // Provide console helpers
    window.startHealthMonitor = () => window.healthMonitor.start();
    window.stopHealthMonitor = () => window.healthMonitor.stop();
    window.getHealthStatus = () => window.healthMonitor.getStatus();
    window.getHealthReport = () => console.log(window.healthMonitor.generateReport());
}