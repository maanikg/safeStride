import requests

# Replace with your phone app's IP and port
# PHONE_APP_URL = "http://192.168.1.100:5000/take_photo"
PHONE_APP_URL = "exp://100.67.199.63:8081"
# PHONE_APP_URL = "http://100.67.199.63:8081/take_photo"


def take_photo():
    response = requests.post(PHONE_APP_URL)
    if response.status_code == 200:
        with open("photo.jpg", "wb") as f:
            f.write(response.content)
        print("Photo saved as photo.jpg")
    else:
        print(f"Failed to take photo: {response.text}")


if __name__ == "__main__":
    while True:
        command = input("Enter command: ")
        if command == "take_photo":
            take_photo()
        elif command == "exit":
            break
        else:
            print("Unknown command")
