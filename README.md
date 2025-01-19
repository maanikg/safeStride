# safeStride

## Inspiration
We wanted to give the visually impaired a new perspective of the world, enhancing their ability to engage in new and safer experiences. We also wanted to provide sighted individuals with an understanding of the experiences faced by the visually impaired, fostering empathy. Additionally, we aim to create a better environment for designing tools that are more accurate and effective in addressing their needs.


## What it does
The project consists of a main camera feed that constantly relays photos of the user’s frontal environment to a common server process, as well as phones attached to the user’s body to produce physical stimuli. The server process is able to detect defining features in the photos, and point out obstacles in the near vicinity to the user. Using algorithms to predict depth, distance, and the angle towards obstacles, the server sends alert messages to the devices attached to the user.

## How we built it
We used Flask to set up a server running on a computer that could communicate with the camera feed, and return actions (ie. verbal instructions and warnings) to the devices attached to the user. Using OpenCV, we processed the images from the camera feed and detected obstacles in the user’s path. We used a python machine learning model to classify different obstacles, characterize them as hazards, and predict the depth and distance between the user and the obstacles. React Native was used to set up the front end on the phone processes. 

## Challenges we ran into
Accurately predicting the distance and angle of objects, and establishing communication between the server and the devices attached to the user.

## What we learned
Simultaneous socket communication between multiple processes, while still maintaining identity of each process, helping us to distribute tasks effectively. Additionally, we learned how to ensure short turn-around times for the server to process images and send alerts to the user.

## Accomplishments that we're proud of
Creating a fully working app that helps visually impaired people navigate the world more safely. 

## What's next for safeStride
We plan to improve the accuracy of the machine learning model, and add a more robust hardware integration to improve image quality and tactile feedback. We also plan to add more features to the app, such as voice commands and a live map.
