import sys
import os
import requests
import json
from pathlib import Path
import time

# Add the parent directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))


class WebhookTester:
    """Test utility for webhook functionality"""

    def __init__(self):
        self.base_url = "http://localhost:8000/api/v1"
        self.token = None
        self.headers = {"Content-Type": "application/json"}

    def login(self, username, password):
        """Login to get authentication token"""
        login_url = f"{self.base_url}/auth/token"

        try:
            # Convert to form data as required by the endpoint
            form_data = {"username": username, "password": password}

            response = requests.post(
                login_url,
                data=form_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )

            if response.status_code == 200:
                self.token = response.json().get("access_token")
                self.headers["Authorization"] = f"Bearer {self.token}"
                print(f"Login successful! Token obtained.")
                return True
            else:
                print(f"Login failed with status code {response.status_code}")
                print(f"Response: {response.text}")
                return False

        except requests.exceptions.ConnectionError:
            print("Connection error. Make sure the backend server is running.")
            return False
        except Exception as e:
            print(f"Error during login: {str(e)}")
            return False

    def test_server_connection(self):
        """Test if the server is up and running"""
        try:
            response = requests.get(
                f"{self.base_url}/dashboard/stats", headers=self.headers
            )
            if response.status_code == 200:
                print("Server connection successful!")
                return True
            else:
                print(
                    f"Server connection failed with status code {response.status_code}"
                )
                print(f"Response: {response.text}")
                return False
        except requests.exceptions.ConnectionError:
            print("Connection error. Make sure the backend server is running.")
            return False
        except Exception as e:
            print(f"Error testing server connection: {str(e)}")
            return False

    def send_webhook_message(self, message):
        """Send a test message to the webhook endpoint"""
        webhook_url = f"{self.base_url}/webhook/"
        payload = {"message": message}

        try:
            print(f"Sending webhook message to {webhook_url}...")
            response = requests.post(webhook_url, json=payload, headers=self.headers)

            if response.status_code == 200:
                print("Webhook message sent successfully!")
                print(f"Response: {json.dumps(response.json(), indent=2)}")
                return response.json()
            else:
                print(f"Webhook request failed with status code {response.status_code}")
                print(f"Response: {response.text}")
                return None

        except Exception as e:
            print(f"Error sending webhook message: {str(e)}")
            return None


def run_tests():
    """Run all tests"""
    tester = WebhookTester()

    # Login
    if not tester.login("demo", "password"):
        print("Login failed. Exiting.")
        return

    # Test server connection
    if not tester.test_server_connection():
        print("Server connection failed. Exiting.")
        return

    # Test webhook with a sample message
    sample_message = """
    Hi there, just following up on our previous conversation. I'm Ahmed Bassyouni,
    co-founder of Cloudilic. We're exploring AI solutions to automate our lead capture and
    onboarding process. You can reach me at ahmed@cloudilic.com. Looking forward to connecting
    further.
    """

    result = tester.send_webhook_message(sample_message)

    if result:
        print("\n✅ All tests passed successfully!")
    else:
        print("\n❌ Some tests failed. Check the logs above.")


if __name__ == "__main__":
    print("==== Cloudilic Webhook Tester ====")
    run_tests()

    def check_config(self):
        """Check system configuration"""
        config_url = f"{self.base_url}/config"

        try:
            response = requests.get(config_url, headers=self.headers)

            if response.status_code == 200:
                config = response.json()
                print("System configuration checked successfully.")
                return config
            else:
                print(
                    f"Failed to check configuration with status code {response.status_code}"
                )
                print(f"Response: {response.text}")
                return None

        except requests.exceptions.ConnectionError:
            print("Connection error. Make sure the backend server is running.")
            return None
        except Exception as e:
            print(f"Error checking configuration: {str(e)}")
            return None


def main():
    print("=" * 50)
    print("Cloudilic Webhook Tester")
    print("=" * 50)
    print("\nThis script will help you test the webhook functionality.")
    print("Make sure the backend server is running before proceeding.\n")

    tester = WebhookTester()

    # Login
    print("-" * 50)
    print("Step 1: Login")
    print("-" * 50)

    username = input("Username (default: admin): ") or "admin"
    password = input("Password (default: admin): ") or "admin"

    if not tester.login(username, password):
        print("Login failed. Exiting.")
        return

    # Test server connection
    print("\n" + "-" * 50)
    print("Step 2: Testing server connection")
    print("-" * 50)

    if not tester.test_server_connection():
        print("Server connection failed. Exiting.")
        return

    # Check configuration
    print("\n" + "-" * 50)
    print("Step 3: Checking configuration")
    print("-" * 50)

    tester.check_config()

    # Send webhook message
    print("\n" + "-" * 50)
    print("Step 4: Testing webhook")
    print("-" * 50)

    default_message = (
        "Hi there, just following up on our previous conversation. "
        "I'm Ahmed Bassyouni, co-founder of Cloudilic. "
        "We're exploring AI solutions to automate our lead capture and onboarding process. "
        "You can reach me at ahmed@cloudilic.com. Looking forward to connecting further."
    )

    print(f"Default test message: \n{default_message}\n")
    use_default = input("Use default message? (y/n, default: y): ").lower() != "n"

    if use_default:
        message = default_message
    else:
        print("Enter your custom message (press Enter twice to finish):")
        lines = []
        while True:
            line = input()
            if not line and lines and not lines[-1]:
                break
            lines.append(line)
        message = "\n".join(lines[:-1])  # Remove the last empty line

    print("\nSending webhook message...")
    result = tester.send_webhook_message(message)

    if result:
        print("\n" + "-" * 50)
        print("Webhook test completed successfully!")
        print("-" * 50)
    else:
        print("\n" + "-" * 50)
        print("Webhook test failed. Please check the error messages above.")
        print("-" * 50)


if __name__ == "__main__":
    main()
