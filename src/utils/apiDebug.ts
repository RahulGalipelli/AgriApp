/**
 * API Debugging Utility
 * Use this to test API connectivity and diagnose issues
 */
import { API_BASE_URL } from "../config";

export async function testApiConnection(): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    console.log("Testing API connection to:", API_BASE_URL);
    
    // Test 1: Health endpoint (if available)
    try {
      const healthResponse = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        return {
          success: true,
          details: {
            health: healthData,
            url: API_BASE_URL,
          },
        };
      }
    } catch (healthError) {
      console.log("Health endpoint not available or failed");
    }

    // Test 2: Root endpoint
    try {
      const rootResponse = await fetch(`${API_BASE_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const rootText = await rootResponse.text();
      return {
        success: rootResponse.ok,
        details: {
          status: rootResponse.status,
          statusText: rootResponse.statusText,
          response: rootText.substring(0, 200),
          url: API_BASE_URL,
        },
      };
    } catch (rootError) {
      return {
        success: false,
        error: `Cannot connect to ${API_BASE_URL}`,
        details: {
          error: rootError instanceof Error ? rootError.message : String(rootError),
          url: API_BASE_URL,
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: {
        url: API_BASE_URL,
      },
    };
  }
}

export async function testAuthEndpoint(): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobileNumber: "9999999999" }),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return {
      success: response.ok,
      details: {
        status: response.status,
        statusText: response.statusText,
        response: responseData,
        headers: Object.fromEntries(response.headers.entries()),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

