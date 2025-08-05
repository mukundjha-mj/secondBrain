// Keep alive utility to prevent cold starts on Render
import { SERVER_URL } from './etc/secrets/config';

export class KeepAlive {
    private interval: NodeJS.Timeout | null = null;
    private serverUrl: string;
    private pingInterval: number;

    constructor(serverUrl: string, pingIntervalMinutes: number = 10) {
        this.serverUrl = serverUrl;
        this.pingInterval = pingIntervalMinutes * 60 * 1000; // Convert minutes to milliseconds
    }

    start() {
        console.log(`🚀 KeepAlive service started. Pinging ${this.serverUrl} every ${this.pingInterval / 60000} minutes`);
        
        // Ping immediately
        this.ping();
        
        // Set up interval for regular pings
        this.interval = setInterval(() => {
            this.ping();
        }, this.pingInterval);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            console.log('⏹️ KeepAlive service stopped');
        }
    }

    private async ping() {
        try {
            const startTime = Date.now();
            const response = await fetch(`${this.serverUrl}/health`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'KeepAlive-Service'
                }
            });
            
            const responseTime = Date.now() - startTime;
            
            if (response.ok) {
                console.log(`✅ Ping successful - Response time: ${responseTime}ms - ${new Date().toISOString()}`);
            } else {
                console.log(`⚠️ Ping response not OK: ${response.status} - ${new Date().toISOString()}`);
            }
        } catch (error) {
            console.log(`❌ Ping failed: ${error} - ${new Date().toISOString()}`);
        }
    }
}

// Environment detection utility
export const getServerUrl = (): string => {
    // Always use SERVER_URL from config (.env file)
    return SERVER_URL;
};
